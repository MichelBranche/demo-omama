const HOTEL_CODE = "21301";
const CHECK_CODE = "6913";
const ENGINE = "https://book.blastness.com";
const API = "https://api.foxtechnologies.it/api/be-frontdoor";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type TokenCache = { value: string; exp: number };
let tokenCache: TokenCache | null = null;

export type AvailabilityQuery = {
  checkin: string;
  checkout: string;
  adults: number;
  children: number;
  rooms: number;
  lang: string;
  code?: string;
};

export type AvailabilityRate = {
  code: string;
  name: string;
  meal: string;
  price: number;
  url: string;
};

export type AvailabilityRoom = {
  code: string;
  name: string;
  short: string;
  size: string;
  guests: number;
  image: string;
  from: number;
  rates: AvailabilityRate[];
};

export type AvailabilityResult = {
  checkin: string;
  checkout: string;
  nights: number;
  currency: string;
  rooms: AvailabilityRoom[];
};

function stripHtml(value: unknown) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickLang<T extends { LanguageCode?: string }>(items: T[] | undefined, lang: string) {
  if (!items?.length) return undefined;
  const want = lang.toUpperCase();
  return (
    items.find((item) => (item.LanguageCode || "").toUpperCase() === want) ||
    items.find((item) => (item.LanguageCode || "").toUpperCase() === "IT") ||
    items.find((item) => (item.LanguageCode || "").toUpperCase() === "EN") ||
    items[0]
  );
}

function jwtExp(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return 0;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return Number(json.exp || 0);
  } catch {
    return 0;
  }
}

async function engineToken() {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.value;

  const res = await fetch(
    `${ENGINE}/?id_albergo=${HOTEL_CODE}&dc=${CHECK_CODE}&language=it&currency=EUR`,
    { headers: { "User-Agent": UA }, cache: "no-store" },
  );
  const cookie = res.headers.get("set-cookie") || "";
  const token = cookie.match(/access_token=([^;]+)/)?.[1];
  if (!token) throw new Error("Sessione motori non disponibile");
  tokenCache = { value: token, exp: jwtExp(token) || now + 1200 };
  return token;
}

function apiHeaders(token: string) {
  const sub = process.env.BLASTNESS_SUB_KEY;
  if (!sub) throw new Error("Chiave motori mancante");
  return {
    Authorization: `Bearer ${token}`,
    "Ocp-Apim-Subscription-Key": sub,
    "X-Hotel-Code": HOTEL_CODE,
    Accept: "application/json",
    "Content-type": "application/json",
    "User-Agent": UA,
  };
}

export async function searchAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
  const adults = Math.min(8, Math.max(1, query.adults));
  const roomsCount = Math.min(4, Math.max(1, query.rooms));
  const children = Math.min(6, Math.max(0, query.children));
  const lang = (query.lang || "it").slice(0, 2).toLowerCase();
  const childAges = Array.from({ length: children }, () => 8);
  const perRoom = Math.max(1, Math.ceil(adults / roomsCount));

  const token = await engineToken();
  const payload = {
    CheckIn: query.checkin,
    CheckOut: query.checkout,
    LanguageCode: lang === "de" ? "en" : lang,
    CurrencyCode: "EUR",
    Rooms: Array.from({ length: roomsCount }, () => ({
      Adults: perRoom,
      ChildrenAges: childAges,
    })),
    DiscountCode: query.code || null,
    NumberOfUnits: roomsCount,
  };

  const res = await fetch(`${API}/bookingengine/search`, {
    method: "POST",
    headers: apiHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const json = (await res.json()) as {
    IsSucceded?: boolean;
    Errors?: string[];
    Data?: Record<string, unknown>;
  };
  if (!res.ok || json.IsSucceded === false || !json.Data) {
    throw new Error((json.Errors && json.Errors[0]) || "Nessuna disponibilità");
  }

  const mapped = mapResults(json.Data, lang);
  for (const room of mapped.rooms) {
    for (const rate of room.rates) {
      rate.url = checkoutUrl(query, room.code, rate.code);
    }
  }
  return mapped;
}

function mapResults(data: Record<string, unknown>, lang: string): AvailabilityResult {
  const content = (data.Content || {}) as Record<string, unknown>;
  const roomContent = (content.RoomTypes || []) as Record<string, unknown>[];
  const ratePlans = (content.RatePlans || []) as Record<string, unknown>[];
  const meals = (content.MealPlans || []) as Record<string, unknown>[];
  const clusters = (data.RoomsTypeClusters || []) as Record<string, unknown>[];

  const rooms: AvailabilityRoom[] = [];
  for (const cluster of clusters) {
    for (const roomType of (cluster.RoomTypes || []) as Record<string, unknown>[]) {
      const code = String(roomType.Code || "");
      const info = roomContent.find((item) => item.Code === code);
      if (!info) continue;
      const desc = pickLang(info.Descriptions as { LanguageCode?: string; Name?: string; ShortText?: string }[], lang);
      const images = (info.Images || []) as { Url?: string; Primary?: boolean }[];
      const image = images.find((img) => img.Primary && img.Url)?.Url || images.find((img) => img.Url)?.Url || "";
      const rates: AvailabilityRate[] = [];

      for (const rateCluster of (roomType.RatePlanClusters || []) as Record<string, unknown>[]) {
        for (const plan of (rateCluster.RatePlans || []) as Record<string, unknown>[]) {
          const occupancies = (plan.Occupancies || []) as Record<string, unknown>[];
          const occ = occupancies[0];
          if (!occ) continue;
          const price = Number(occ.TotalAmountAfterTax || 0);
          if (!price) continue;
          const meta = ratePlans.find((item) => item.Code === plan.Code);
          const rateDesc = pickLang(
            (meta?.Descriptions || []) as { LanguageCode?: string; Name?: string; ShortText?: string }[],
            lang,
          );
          const meal = meals.find((item) => item.Id === plan.MealPlanId);
          const mealDesc = pickLang(
            (meal?.Descriptions || []) as { LanguageCode?: string; Name?: string }[],
            lang,
          );
          rates.push({
            code: String(plan.Code || ""),
            name: stripHtml(rateDesc?.ShortText || rateDesc?.Name || plan.Code),
            meal: stripHtml(mealDesc?.Name || ""),
            price,
            url: "",
          });
        }
      }

      rates.sort((a, b) => a.price - b.price);
      if (!rates.length) continue;
      rooms.push({
        code,
        name: stripHtml(desc?.Name || code),
        short: stripHtml(desc?.ShortText || ""),
        size: info.SquareMeters ? `${info.SquareMeters} m²` : "",
        guests: Number(info.MaxPeople || 0),
        image,
        from: Number(roomType.RatesFrom || rates[0].price),
        rates: rates.slice(0, 3),
      });
    }
  }

  rooms.sort((a, b) => a.from - b.from);
  return {
    checkin: String(data.CheckIn || ""),
    checkout: String(data.CheckOut || ""),
    nights: Number(data.Nights || 1),
    currency: String(data.Currency || "EUR"),
    rooms,
  };
}

export function checkoutUrl(query: AvailabilityQuery, roomCode: string, rateCode: string) {
  const lang = { it: "ita", en: "eng", fr: "fra", de: "deu" }[query.lang] || "ita";
  const [ay, am, ad] = query.checkin.split("-");
  const [by, bm, bd] = query.checkout.split("-");
  const params = new URLSearchParams({
    lingua_int: lang,
    id_albergo: HOTEL_CODE,
    dc: CHECK_CODE,
    id_stile: "",
    gg: ad,
    mm: am,
    aa: ay,
    ggf: bd,
    mmf: bm,
    aaf: by,
    tot_adulti: String(query.adults),
    tot_camere: String(query.rooms),
    tot_bambini: String(query.children),
    roomtype_code: roomCode,
    rateplan_code: rateCode,
  });
  if (query.code) params.set("generic_codice", query.code);
  return `${ENGINE}/results?${params.toString()}`;
}
