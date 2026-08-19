import { searchAvailability, type AvailabilityQuery } from "@/lib/blastness";

export const dynamic = "force-dynamic";

function number(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AvailabilityQuery>;
    const checkin = String(body.checkin || "");
    const checkout = String(body.checkout || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout)) {
      return Response.json({ error: "Date non valide" }, { status: 400 });
    }
    if (checkout <= checkin) {
      return Response.json({ error: "La partenza deve essere dopo l’arrivo" }, { status: 400 });
    }
    const data = await searchAvailability({
      checkin,
      checkout,
      adults: number(body.adults, 2),
      children: number(body.children, 0),
      rooms: number(body.rooms, 1),
      lang: String(body.lang || "it"),
      code: body.code ? String(body.code) : "",
    });
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ricerca non disponibile";
    return Response.json({ error: message }, { status: 502 });
  }
}
