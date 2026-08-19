# SEO e multilingua

Il sito ha 8 pagine in 4 lingue (it, en, fr, de). Le 32 pagine servite non si
scrivono a mano: vengono **generate** da 8 master italiani.

## Da dove arrivano le pagine

```
pages-src/<pagina>/index.html     master, unica fonte di verità (italiano)
        │
        │  npm run seo:build
        ▼
public/<lingua>/<pagina>/index.html   generato, non modificare a mano
```

I master in `pages-src/` sono gli HTML originali del tema. Il generatore li
legge, li traduce e ci monta sopra tutto il SEO. **Ogni modifica ai contenuti va
fatta nel master**, poi si rilancia la build: quello che sta in `public/it`,
`public/en`, `public/fr`, `public/de` viene riscritto ogni volta.

Le pagine sono servite su URL puliti (`/it/camere`, `/en/aosta`, la home su
`/it`) tramite i `rewrites` in `next.config.ts`. Gli stessi `redirects` mandano
a destinazione i vecchi percorsi (`/en/camere/index.html`, `/camere`, `/`).

## Cosa fa il generatore

`scripts/build-seo.mjs`, per ognuna delle 32 pagine:

- imposta `<html lang>` e traduce tutto il testo con il dizionario del sito;
- riscrive `<head>` da zero: title e description per pagina e lingua, canonical,
  `hreflang` verso le altre 3 lingue più `x-default`, Open Graph, Twitter card,
  favicon, manifest, `preconnect` verso il booking engine e `preload` dell'immagine
  hero;
- inserisce il JSON-LD: `Hotel` con indirizzo, coordinate, servizi e camere,
  `WebSite`, `BreadcrumbList`, più `HotelRoom`, `FAQPage`, `ItemList` di
  attrazioni o `Person` dove hanno senso;
- promuove i titoli di sezione da `span` a `h1`/`h2`/`h3` in ordine corretto, un
  solo `h1` per pagina (su home e mappa è visivamente nascosto perché il titolo
  visibile è il wordmark animato);
- scrive gli `alt` di tutte le immagini nella lingua giusta e aggiunge
  `loading="lazy"` fuori dallo schermo iniziale;
- trasforma il selettore di lingua da bottoni in link `<a hreflang>` reali, così
  i crawler seguono le versioni tradotte;
- genera `robots.txt`, `sitemap.xml` con gli alternates, le 8 social card
  1200x630 in `public/images/og/`, le icone in `public/icons/` e
  `site.webmanifest`.

## File da modificare

| File | Contiene |
| --- | --- |
| `scripts/seo/site.mjs` | dominio, flag di indicizzazione, lingue, dati dell'hotel, camere, servizi |
| `scripts/seo/pages.mjs` | title, description, breadcrumb e social card di ogni pagina x 4 lingue |
| `scripts/seo/media.mjs` | testi `alt` delle immagini |
| `scripts/seo/instagram.mjs` | post Instagram in vetrina in homepage (link, copertina, didascalie x 4 lingue) |
| `public/omama-i18n.js` | dizionario delle traduzioni, condiviso con il runtime |

## Vetrina Instagram (homepage)

Sotto `section.locations` in homepage c'è una sezione con i post Instagram
selezionati, impaginati come un blog: copertina a sinistra, didascalia a destra.

**Non è un feed live** e non usa token: Instagram non ha nessuna API senza token
per "gli ultimi post", e i termini di Meta vietano di estrarre didascalia e media
dall'URL di un post. Ogni post è quindi curato a mano in
`scripts/seo/instagram.mjs`, il che lo rende anche indicizzabile e senza tracker
di terze parti. La sezione viene iniettata dal generatore dopo la traduzione, con
le didascalie già nelle quattro lingue; il click su una card apre il reel su
Instagram in una nuova scheda.

Per mettere in vetrina un nuovo post: aggiungi il file `.mp4` in
`public/videos/instagram/`, aggiungi una voce a `POSTS` in
`scripts/seo/instagram.mjs` (permalink, percorso video, didascalia, alt, tag) e
rilancia `npm run seo:build`. L'avatar del profilo è
`public/images/omama-instagram-avatar.png`.

Il dizionario è lo stesso che usa il browser: `scripts/seo/i18n.mjs` lo carica in
una sandbox e applica le stesse regole di `omama-chrome.js`. Una frase tradotta
correttamente a build time lo è anche a runtime, e viceversa.

## Comandi

```bash
npm run seo:build     # rigenera le 32 pagine e gli asset
npm run seo:check     # controlli statici: head, hreflang, heading, link, alt,
                      # integrità rispetto ai master, copertura traduzioni
npm run seo:http      # smoke test su un server avviato (default :3000)
```

`seo:http` accetta la base URL come argomento, utile se la porta 3000 è occupata:

```bash
npx next start -p 3100
npm run seo:http -- http://127.0.0.1:3100
```

Verifica sul serio quello che arriva al browser: status delle 32 pagine, `lang`,
canonical, `hreflang`, robots, unicità dei title, un solo `h1`, JSON-LD
parsabile, i 26 redirect dai vecchi percorsi, sitemap e og:image che rispondono
200.

## Andare in produzione

Oggi il sito è **volutamente non indicizzabile**: `indexable: false` in
`scripts/seo/site.mjs` mette `noindex, nofollow` su tutte le pagine e
`Disallow: /` in `robots.txt`, così la demo non compete con il sito ufficiale su
omamahotel.com.

Per pubblicare:

1. in `scripts/seo/site.mjs` metti `indexable: true`;
2. controlla che `origin` sia il dominio reale da cui il sito viene servito
   (finisce in canonical, hreflang, sitemap e Open Graph, che vogliono URL
   assoluti);
3. `npm run seo:build && npm run seo:check`;
4. dopo il deploy, invia la sitemap in Search Console.

La pagina `/demo` resta `noindex` e fuori dalla sitemap in ogni caso: è il
segnaposto per i link che non hanno contenuto nella demo.

## Aggiungere una pagina o una lingua

Una pagina: metti il master in `pages-src/<nome>/index.html`, aggiungi la voce in
`PAGE_PATHS` (`site.mjs`) e il blocco con i meta nelle 4 lingue in `pages.mjs`.

Una lingua: aggiungila a `langs` e `locales` in `site.mjs`, aggiungi la colonna
in ogni voce di `pages.mjs`, `media.mjs` e `omama-i18n.js`, e aggiungi il codice
alla lista `LANGS` in `public/omama-chrome.js` e in `next.config.ts`.
