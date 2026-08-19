// Curated Instagram highlights on the homepage: real reel files, captions in four
// languages, and links to the matching posts on Instagram.
//
// To add a post: drop media in public/videos/instagram/ or public/images/instagram/,
// add a POSTS entry (permalink, video or photos[], caption, alt, tags), then npm run seo:build.

export const INSTAGRAM = {
  profile: "https://www.instagram.com/omama_hotel/",
  name: "OMAMA Social Hotel",
  handle: "@omama_hotel",
  avatar: "/images/omama-instagram-avatar.png",
};

const UI = {
  it: {
    eyebrow: "Instagram",
    title: "Il nostro Instagram",
    intro: "Momenti da OMAMA e da Aosta, raccontati sul nostro profilo.",
    follow: "Seguici su Instagram",
    watch: "Guarda il reel",
    browse: "Sfoglia le foto",
    prev: "Foto precedente",
    next: "Foto successiva",
    play: "Play",
    pause: "Pausa",
    audio: "Audio",
    mute: "Muto",
    expand: "Vista grande",
    open: "Apri su Instagram",
  },
  en: {
    eyebrow: "Instagram",
    title: "Our Instagram",
    intro: "Moments from OMAMA and Aosta, shared on our profile.",
    follow: "Follow us on Instagram",
    watch: "Watch the reel",
    browse: "Browse photos",
    prev: "Previous photo",
    next: "Next photo",
    play: "Play",
    pause: "Pause",
    audio: "Audio",
    mute: "Mute",
    expand: "Large view",
    open: "Open on Instagram",
  },
  fr: {
    eyebrow: "Instagram",
    title: "Notre Instagram",
    intro: "Des moments d'OMAMA et d'Aoste, partagés sur notre profil.",
    follow: "Suivez-nous sur Instagram",
    watch: "Voir le reel",
    browse: "Parcourir les photos",
    prev: "Photo précédente",
    next: "Photo suivante",
    play: "Lecture",
    pause: "Pause",
    audio: "Audio",
    mute: "Muet",
    expand: "Grand format",
    open: "Ouvrir sur Instagram",
  },
  de: {
    eyebrow: "Instagram",
    title: "Unser Instagram",
    intro: "Momente aus dem OMAMA und aus Aosta, geteilt auf unserem Profil.",
    follow: "Folge uns auf Instagram",
    watch: "Reel ansehen",
    browse: "Fotos durchblättern",
    prev: "Vorheriges Foto",
    next: "Nächstes Foto",
    play: "Play",
    pause: "Pause",
    audio: "Audio",
    mute: "Stumm",
    expand: "Großansicht",
    open: "Auf Instagram öffnen",
  },
};

const POSTS = [
  {
    id: "cucina-libri",
    permalink: "https://www.instagram.com/reel/DZU9P44sd0Z/",
    video: "/videos/instagram/cucina-libri-convivialita.mp4",
    tags: ["aosta", "showcooking", "omamasocialhotel", "chefpappagallo", "valledaosta"],
    alt: {
      it: "Show cooking con lo chef Casapappagallo all'OMAMA Social Hotel ad Aosta",
      en: "Show cooking with chef Casapappagallo at OMAMA Social Hotel in Aosta",
      fr: "Show cooking avec le chef Casapappagallo à l'OMAMA Social Hotel à Aoste",
      de: "Show Cooking mit Chef Casapappagallo im OMAMA Social Hotel in Aosta",
    },
    caption: {
      it: [
        "Cucina, libri e convivialità nel cuore di Aosta 🍝📚🍷",
        "Venerdì 19 dicembre all'OMAMA Social Hotel abbiamo vissuto una serata speciale, organizzata insieme a @briviodue di Aosta ✨",
        "Protagonista lo chef @casapappagallo, con uno show cooking che profumava di Mediterraneo 🌊🔥",
        "🍝 ecco gli ingredienti della sua Pasta alla pantesca:",
        "Olio EVO · Peperoncino 🌶️ · Capperi (e ancora capperi 😉) · Acciughe · Aglio & cipolla · Pomodoro a pezzi + passata 🍅 · Cucunci · Prezzemolo 🌿 · Olive leccine · Muddica turrata (pan grattato con aglio e origano)",
        "A seguire, i taglieri di @erbavoglio_formaggi con eccellenze valdostane 🧀🥓",
        "🥔 Chips di patate di montagna · 🌿 Toma alla salvia · 🧀 Gorgonzola al cucchiaio · 🌲 Coopa al ginepro · 🥓 Lardo di Arnad · 🧀 Fleur Toma · 🐐 Morbido di capra · 🥖 Grissini alla polenta concia",
        "Il tutto accompagnato da ottimi vini valdostani 🍷",
        "🍇 Petite Arvine · 🍇 Gamay",
        "Una serata di sapori, storie e incontri da ricordare ❤️",
      ],
      en: [
        "Kitchen, books and conviviality in the heart of Aosta 🍝📚🍷",
        "On Friday 19 December at OMAMA Social Hotel we enjoyed a special evening, organised with @briviodue from Aosta ✨",
        "Star of the night was chef @casapappagallo, with a show cooking that smelled of the Mediterranean 🌊🔥",
        "🍝 Pantesca pasta: EVO oil, chilli 🌶️, capers, anchovies, garlic and onion, chopped tomatoes and passata 🍅, cucunci, parsley 🌿, Leccino olives, toasted breadcrumb with garlic and oregano.",
        "Then the boards from @erbavoglio_formaggi with Aosta Valley specialities 🧀🥓: mountain potato chips, sage toma, spoon gorgonzola, juniper coopa, Arnad lard, fleur toma, soft goat cheese, polenta concia grissini.",
        "All paired with excellent Aosta Valley wines 🍷: Petite Arvine and Gamay 🍇",
        "An evening of flavours, stories and encounters to remember ❤️",
      ],
      fr: [
        "Cuisine, livres et convivialité au cœur d'Aoste 🍝📚🍷",
        "Vendredi 19 décembre à l'OMAMA Social Hotel, nous avons vécu une soirée spéciale, organisée avec @briviodue d'Aoste ✨",
        "À l'honneur, le chef @casapappagallo, avec un show cooking aux parfums de Méditerranée 🌊🔥",
        "🍝 Pasta alla pantesca : huile EVO, piment 🌶️, câpres, anchois, ail et oignon, tomates en morceaux et passata 🍅, cucunci, persil 🌿, olives leccine, chapelure grillée à l'ail et à l'origan.",
        "Puis les planches de @erbavoglio_formaggi avec des excellences valdôtaines 🧀🥓 : chips de pommes de montagne, toma à la sauge, gorgonzola à la cuillère, coopa au genièvre, lard d'Arnad, fleur toma, fromage de chèvre, gressins à la polenta concia.",
        "Le tout accompagné d'excellents vins valdôtaines 🍷 : Petite Arvine et Gamay 🍇",
        "Une soirée de saveurs, d'histoires et de rencontres inoubliable ❤️",
      ],
      de: [
        "Küche, Bücher und Geselligkeit im Herzen von Aosta 🍝📚🍷",
        "Am Freitag, 19. Dezember, erlebten wir im OMAMA Social Hotel einen besonderen Abend, organisiert zusammen mit @briviodue aus Aosta ✨",
        "Im Mittelpunkt: Küchenchef @casapappagallo mit einem Show Cooking voller mediterraner Düfte 🌊🔥",
        "🍝 Pasta alla pantesca: Olivenöl extra vergine, Peperoncino 🌶️, Kapern, Sardellen, Knoblauch und Zwiebel, Stücktomaten und Passata 🍅, Cucunci, Petersilie 🌿, Leccino-Oliven, geröstete Semmelbrösel mit Knoblauch und Oregano.",
        "Danach die Taglieri von @erbavoglio_formaggi mit Valdostaner Spezialitäten 🧀🥓: Bergkartoffelchips, Salbei-Toma, Löffel-Gorgonzola, Wacholder-Coopa, Arnad-Lardo, Fleur Toma, weicher Ziegenkäse, Polenta-concia-Grissini.",
        "Alles begleitet von ausgezeichneten Weinen aus dem Aostatal 🍷: Petite Arvine und Gamay 🍇",
        "Ein Abend voller Aromen, Geschichten und Begegnungen zum Erinnern ❤️",
      ],
    },
  },
  {
    id: "agosto-valle-aosta",
    permalink: "https://www.instagram.com/omama_hotel/",
    photos: [
      "/images/instagram/agosto-aosta-4.png",
      "/images/instagram/agosto-aosta-1.png",
      "/images/instagram/agosto-aosta-2.png",
      "/images/instagram/agosto-aosta-3.png",
    ],
    tags: ["valledaosta", "alpissimahotels", "aosta", "estate", "utmb"],
    alt: {
      it: "Agosto in Valle d'Aosta: sport, cultura ed enogastronomia con Alpissima Hotels",
      en: "August in the Aosta Valley: sport, culture and food with Alpissima Hotels",
      fr: "Août en Vallée d'Aoste : sport, culture et gastronomie avec Alpissima Hotels",
      de: "August im Aostatal: Sport, Kultur und Genuss mit Alpissima Hotels",
    },
    caption: {
      it: [
        "☀️ Agosto in Valle d'Aosta: un mese tutto da vivere!",
        "L'estate entra nel vivo e la Valle d'Aosta si anima con un calendario ricco di appuntamenti dedicati allo sport, alla cultura, all'enogastronomia e alle tradizioni locali 🏔️✨",
        "Dalla storica Foire d'Été di Aosta, tra artigianato e cultura, all'energia internazionale dell'Ultra-Trail du Mont-Blanc® a Courmayeur 🏃‍♂️⛰️, fino ai sapori, al cinema di montagna e alle tradizioni di La Thuile 🍽️🎬",
        "Tre destinazioni, quattro strutture Alpissima Hotels e infinite esperienze da scoprire:",
        "📍 Aosta: soggiorna all'Hotel Duca d'Aosta o all'OMAMA Social Hotel e vivi il fascino del capoluogo valdostano.",
        "📍 Courmayeur: al Gran Baita Courmayeur respira l'atmosfera unica dell'UTMB® ai piedi del Monte Bianco.",
        "📍 La Thuile: all'Hotel Le Miramonti lasciati conquistare da natura, tradizioni e grandi montagne.",
        "Che la tua estate sia fatta di emozioni outdoor, cultura, relax o buon cibo, la Valle d'Aosta ti aspetta 💛",
      ],
      en: [
        "☀️ August in the Aosta Valley: a month made to be lived!",
        "Summer is in full swing and the Aosta Valley comes alive with a rich calendar of sport, culture, food and local traditions 🏔️✨",
        "From Aosta's historic Foire d'Été, with crafts and culture, to the international energy of the Ultra-Trail du Mont-Blanc® in Courmayeur 🏃‍♂️⛰️, through to the flavours, mountain cinema and traditions of La Thuile 🍽️🎬",
        "Three destinations, four Alpissima Hotels properties and endless experiences to discover:",
        "📍 Aosta: stay at Hotel Duca d'Aosta or OMAMA Social Hotel and enjoy the charm of the valley capital.",
        "📍 Courmayeur: at Gran Baita Courmayeur breathe the unique UTMB® atmosphere at the foot of Mont Blanc.",
        "📍 La Thuile: at Hotel Le Miramonti let nature, traditions and great mountains win you over.",
        "Whether your summer is about outdoor thrills, culture, relaxation or great food, the Aosta Valley awaits 💛",
      ],
      fr: [
        "☀️ Août en Vallée d'Aoste : un mois à vivre pleinement !",
        "L'été bat son plein et la Vallée d'Aoste s'anime avec un riche calendrier dédié au sport, à la culture, à l'enogastronomie et aux traditions locales 🏔️✨",
        "De la historique Foire d'Été d'Aoste, entre artisanat et culture, à l'énergie internationale de l'Ultra-Trail du Mont-Blanc® à Courmayeur 🏃‍♂️⛰️, jusqu'aux saveurs, au cinéma de montagne et aux traditions de La Thuile 🍽️🎬",
        "Trois destinations, quatre établissements Alpissima Hotels et d'infinies expériences à découvrir :",
        "📍 Aoste : séjournez à l'Hotel Duca d'Aosta ou à l'OMAMA Social Hotel et vivez le charme du chef-lieu valdôtain.",
        "📍 Courmayeur : au Gran Baita Courmayeur respirez l'atmosphère unique de l'UTMB® au pied du Mont Blanc.",
        "📍 La Thuile : à l'Hotel Le Miramonti laissez-vous conquérir par la nature, les traditions et les grandes montagnes.",
        "Que votre été soit fait d'émotions outdoor, de culture, de détente ou de bonne cuisine, la Vallée d'Aoste vous attend 💛",
      ],
      de: [
        "☀️ August im Aostatal: ein Monat voller Erlebnisse!",
        "Der Sommer ist in vollem Gange und das Aostatal erwacht mit einem reichen Kalender für Sport, Kultur, Genuss und lokale Traditionen 🏔️✨",
        "Von der historischen Foire d'Été in Aosta, zwischen Handwerk und Kultur, bis zur internationalen Energie des Ultra-Trail du Mont-Blanc® in Courmayeur 🏃‍♂️⛰️, und weiter zu Aromen, Bergkino und Traditionen in La Thuile 🍽️🎬",
        "Drei Destinationen, vier Häuser der Alpissima Hotels und unzählige Erlebnisse:",
        "📍 Aosta: übernachten Sie im Hotel Duca d'Aosta oder im OMAMA Social Hotel und erleben Sie den Charme der Hauptstadt.",
        "📍 Courmayeur: im Gran Baita Courmayeur die einzigartige UTMB®-Atmosphäre am Fuße des Mont Blanc spüren.",
        "📍 La Thuile: im Hotel Le Miramonti von Natur, Traditionen und großen Bergen verzaubern lassen.",
        "Ob Outdoor-Emotionen, Kultur, Entspannung oder gutes Essen — das Aostatal wartet auf Sie 💛",
      ],
    },
  },
  {
    id: "arte-design",
    permalink: "https://www.instagram.com/reel/DbsxRX2sjBN/",
    video: "/videos/instagram/arte-incontra-design.mp4",
    tags: ["omamahotel", "designhotel", "arte"],
    alt: {
      it: "Arte, design e colori pop negli spazi di OMAMA Social Hotel ad Aosta",
      en: "Art, design and pop colours in the spaces of OMAMA Social Hotel in Aosta",
      fr: "Art, design et couleurs pop dans les espaces de l'OMAMA Social Hotel à Aoste",
      de: "Kunst, Design und Pop-Farben in den Räumen des OMAMA Social Hotel in Aosta",
    },
    caption: {
      it: [
        "✨ Non chiamatelo semplicemente hotel.",
        "🎨 OMAMA è un luogo dove l'arte incontra il design, dove i colori pop accendono l'immaginazione e ogni soggiorno diventa un'esperienza da vivere e condividere.",
        "📍 Nel cuore di Aosta, tra atmosfera contemporanea e spirito libero, c'è uno spazio pensato per chi ama sentirsi ispirato, sorprendersi e creare nuove connessioni.",
        "🛏️ Camere dal carattere unico.",
        "🤝 Spazi social da vivere senza schemi.",
        "🏔️ Tutta l'energia della Valle d'Aosta a portata di mano.",
        "Qui ogni dettaglio racconta una storia, ogni angolo invita a scattare una foto e ogni soggiorno lascia il segno.",
        "💫 La tua prossima esperienza ad Aosta inizia da qui.",
      ],
      en: [
        "✨ Don't just call it a hotel.",
        "🎨 OMAMA is a place where art meets design, where pop colours spark the imagination and every stay becomes an experience to live and share.",
        "📍 In the heart of Aosta, between a contemporary atmosphere and a free spirit, there is a space designed for those who love to feel inspired, be surprised and create new connections.",
        "🛏️ Rooms with a unique character.",
        "🤝 Social spaces to enjoy without rules.",
        "🏔️ All the energy of the Aosta Valley within reach.",
        "Here every detail tells a story, every corner invites a photo and every stay leaves its mark.",
        "💫 Your next experience in Aosta starts here.",
      ],
      fr: [
        "✨ Ne l'appelez pas simplement un hôtel.",
        "🎨 OMAMA est un lieu où l'art rencontre le design, où les couleurs pop éveillent l'imagination et chaque séjour devient une expérience à vivre et à partager.",
        "📍 Au cœur d'Aoste, entre atmosphère contemporaine et esprit libre, un espace pensé pour ceux qui aiment s'inspirer, se surprendre et créer de nouvelles connexions.",
        "🛏️ Des chambres au caractère unique.",
        "🤝 Des espaces sociaux à vivre sans contraintes.",
        "🏔️ Toute l'énergie de la Vallée d'Aoste à portée de main.",
        "Ici, chaque détail raconte une histoire, chaque angle invite à une photo et chaque séjour laisse une trace.",
        "💫 Votre prochaine expérience à Aoste commence ici.",
      ],
      de: [
        "✨ Nennen Sie es nicht einfach ein Hotel.",
        "🎨 OMAMA ist ein Ort, an dem Kunst auf Design trifft, Pop-Farben die Fantasie entfachen und jeder Aufenthalt zu einem Erlebnis wird, das man lebt und teilt.",
        "📍 Im Herzen von Aosta, zwischen zeitgenössischer Atmosphäre und freiem Geist, gibt es einen Raum für alle, die sich inspirieren lassen, überraschen und neue Verbindungen knüpfen wollen.",
        "🛏️ Zimmer mit einzigartigem Charakter.",
        "🤝 Soziale Räume ohne Schema zu genießen.",
        "🏔️ Die ganze Energie des Aostatales griffbereit.",
        "Hier erzählt jedes Detail eine Geschichte, jede Ecke lädt zum Foto ein und jeder Aufenthalt hinterlässt Spuren.",
        "💫 Ihr nächstes Erlebnis in Aosta beginnt hier.",
      ],
    },
  },
  {
    id: "novembre-valle-aosta",
    permalink: "https://www.instagram.com/omama_hotel/",
    photos: [
      "/images/instagram/novembre-aosta-1.png",
      "/images/instagram/novembre-aosta-2.png",
      "/images/instagram/novembre-aosta-3.png",
      "/images/instagram/novembre-aosta-4.png",
      "/images/instagram/novembre-aosta-5.png",
    ],
    tags: ["alpissimahotels", "autunno", "natale", "valledaosta", "foliage", "courmayeur"],
    alt: {
      it: "Novembre in Valle d'Aosta: autunno, tradizioni e atmosfera natalizia con Alpissima Hotels",
      en: "November in the Aosta Valley: autumn, traditions and Christmas atmosphere with Alpissima Hotels",
      fr: "Novembre en Vallée d'Aoste : automne, traditions et ambiance de Noël avec Alpissima Hotels",
      de: "November im Aostatal: Herbst, Traditionen und Weihnachtsstimmung mit Alpissima Hotels",
    },
    caption: {
      it: [
        "🍂 Foglie d'oro, aria frizzante di montagna e luci che si accendono ✨",
        "Novembre in Valle d'Aosta è il mese in cui la natura si colora di magia: un tuffo nei sapori autentici, nelle tradizioni che scaldano il cuore ❤️ e nell'atmosfera del Natale che comincia a farsi sentire 🎄",
        "Dai profumi del Marché Vert Noël di Piazza Chanoux ad Aosta 🏰 agli eventi che animano le valli più intime 🏔️, è il momento perfetto per vivere la fine dell'autunno e l'inizio dell'inverno in tutto il loro fascino.",
        "🏨 E tu? Hai già pensato a dove soggiornare?",
        "Nei nostri hotel — tra Courmayeur, Aosta e La Thuile — comfort, charme alpino e calore d'ospitalità si uniscono per regalarti un'esperienza indimenticabile ✨",
        "➡️ Prenota il tuo soggiorno e trasforma un weekend d'autunno in un ricordo da custodire per sempre 💫",
      ],
      en: [
        "🍂 Golden leaves, crisp mountain air and lights coming on ✨",
        "November in the Aosta Valley is when nature turns magical: a dive into authentic flavours, heart-warming traditions ❤️ and the Christmas atmosphere beginning to be felt 🎄",
        "From the scents of the Marché Vert Noël in Piazza Chanoux in Aosta 🏰 to events animating the most intimate valleys 🏔️, it's the perfect time to live the end of autumn and the start of winter in all their charm.",
        "🏨 And you? Have you already thought about where to stay?",
        "In our hotels — between Courmayeur, Aosta and La Thuile — comfort, alpine charm and warm hospitality come together for an unforgettable experience ✨",
        "➡️ Book your stay and turn an autumn weekend into a memory to treasure forever 💫",
      ],
      fr: [
        "🍂 Feuilles d'or, air vif de montagne et lumières qui s'allument ✨",
        "Novembre en Vallée d'Aoste, c'est le mois où la nature se pare de magie : une plongée dans les saveurs authentiques, les traditions qui réchauffent le cœur ❤️ et l'atmosphère de Noël qui commence à se faire sentir 🎄",
        "Des parfums du Marché Vert Noël sur la Piazza Chanoux à Aoste 🏰 aux événements qui animent les vallées les plus intimes 🏔️, c'est le moment idéal pour vivre la fin de l'automne et le début de l'hiver dans tout leur charme.",
        "🏨 Et vous ? Avez-vous déjà pensé à où séjourner ?",
        "Dans nos hôtels — entre Courmayeur, Aoste et La Thuile — confort, charme alpin et chaleur d'hospitalité se rejoignent pour vous offrir une expérience inoubliable ✨",
        "➡️ Réservez votre séjour et transformez un week-end d'automne en un souvenir à chérir pour toujours 💫",
      ],
      de: [
        "🍂 Goldene Blätter, frische Bergluft und Lichter, die angehen ✨",
        "November im Aostatal ist der Monat, in dem die Natur sich mit Magie färbt: ein Eintauchen in authentische Aromen, Traditionen, die das Herz wärmen ❤️, und die Weihnachtsatmosphäre, die spürbar wird 🎄",
        "Von den Düften des Marché Vert Noël auf der Piazza Chanoux in Aosta 🏰 bis zu den Events in den intimsten Tälern 🏔️ — die perfekte Zeit, um das Ende des Herbstes und den Beginn des Winters in all ihrem Charme zu erleben.",
        "🏨 Und Sie? Haben Sie schon daran gedacht, wo Sie übernachten möchten?",
        "In unseren Hotels — zwischen Courmayeur, Aosta und La Thuile — verbinden sich Komfort, alpiner Charme und herzliche Gastfreundschaft zu einem unvergesslichen Erlebnis ✨",
        "➡️ Buchen Sie Ihren Aufenthalt und machen Sie ein Herbstwochenende zu einer Erinnerung fürs Leben 💫",
      ],
    },
  },
  {
    id: "junior-suite",
    permalink: "https://www.instagram.com/reel/DSmUzX3DCMd/",
    video: "/videos/instagram/junior-suite-aosta.mp4",
    tags: ["omamasocialhotel", "aosta", "alpissimahotels", "valledaosta", "aostavalley"],
    alt: {
      it: "Junior Suite di OMAMA Social Hotel con vista sulle vette valdostane e opere di Chicco Margaroli",
      en: "Junior Suite at OMAMA Social Hotel with Aosta Valley peak views and works by Chicco Margaroli",
      fr: "Junior Suite de l'OMAMA Social Hotel avec vue sur les sommets valdôtaines et œuvres de Chicco Margaroli",
      de: "Junior Suite im OMAMA Social Hotel mit Blick auf die Gipfel des Aostatales und Werke von Chicco Margaroli",
    },
    caption: {
      it: [
        "✨ C'è un modo diverso di vivere Aosta 🏔️",
        "La Junior Suite di OMAMA Social Hotel unisce design, comfort e carattere. Le grandi finestre esposte a sud regalano una vista spettacolare sulle vette della Valle d'Aosta, mentre gli interni prendono vita grazie alle opere dell'artista valdostana Chicco Margaroli 🎨.",
        "📍 OMAMA Social Hotel, ti aspettiamo!",
      ],
      en: [
        "✨ There is a different way to experience Aosta 🏔️",
        "OMAMA Social Hotel's Junior Suite combines design, comfort and character. Large south-facing windows offer a spectacular view of the Aosta Valley peaks, while the interiors come alive with works by Aosta Valley artist Chicco Margaroli 🎨.",
        "📍 OMAMA Social Hotel — we look forward to welcoming you!",
      ],
      fr: [
        "✨ Il existe une autre façon de vivre Aoste 🏔️",
        "La Junior Suite de l'OMAMA Social Hotel allie design, confort et caractère. Les grandes fenêtres exposées au sud offrent une vue spectaculaire sur les sommets de la Vallée d'Aoste, tandis que les intérieurs prennent vie grâce aux œuvres de l'artiste valdôtain Chicco Margaroli 🎨.",
        "📍 OMAMA Social Hotel, nous vous attendons !",
      ],
      de: [
        "✨ Es gibt eine andere Art, Aosta zu erleben 🏔️",
        "Die Junior Suite im OMAMA Social Hotel verbindet Design, Komfort und Charakter. Große, nach Süden ausgerichtete Fenster bieten einen spektakulären Blick auf die Gipfel des Aostatales, während die Innenräume durch Werke des Valdostaner Künstlers Chicco Margaroli lebendig werden 🎨.",
        "📍 OMAMA Social Hotel — wir freuen uns auf Sie!",
      ],
    },
  },
  {
    id: "aosta-arte",
    permalink: "https://www.instagram.com/omama_hotel/reels/",
    video: "/videos/instagram/aosta-arte-evolve.mp4",
    tags: ["adatto", "omamasocialhotel", "aosta", "alpissimahotels", "valledaosta"],
    alt: {
      it: "Mostra Ad Atto di Chicco Margaroli ad Aosta raccontata da OMAMA Social Hotel",
      en: "Ad Atto exhibition by Chicco Margaroli in Aosta shared by OMAMA Social Hotel",
      fr: "Exposition Ad Atto de Chicco Margaroli à Aoste racontée par l'OMAMA Social Hotel",
      de: "Ausstellung Ad Atto von Chicco Margaroli in Aosta erzählt vom OMAMA Social Hotel",
    },
    caption: {
      it: [
        "Aosta è anche questo: arte che evolve, sorprende e fa riflettere 🎨✨",
        "Se soggiorni al Hotel Duca d'Aosta o all'OMAMA Social Hotel, non perdere la mostra \"Ad Atto\" di Chicco Margaroli alla Chiesa di San Lorenzo ⛪️",
        "Un'esperienza immersiva tra installazioni e linguaggi contemporanei che raccontano la natura, la sua fragilità e la sua capacità di trasformarsi 🌿",
        "@chicco.margaroli è l'anima creativa dell'OMAMA Social Hotel 🖌️",
        "Il suo segno è ovunque: nei colori, negli spazi, nei dettagli. Il suo laboratorio si trova proprio all'interno del nostro hotel, dove l'arte prende forma ogni giorno 🏨✨",
        "Un invito a vivere Aosta attraverso uno sguardo diverso: prima dentro l'hotel, poi tra le opere 👀",
        "📍 Ingresso gratuito",
        "📅 Fino al 3 maggio 2026",
      ],
      en: [
        "Aosta is also this: art that evolves, surprises and makes you think 🎨✨",
        "If you are staying at Hotel Duca d'Aosta or OMAMA Social Hotel, don't miss Chicco Margaroli's \"Ad Atto\" exhibition at the Church of San Lorenzo ⛪️",
        "An immersive experience of installations and contemporary languages telling the story of nature, its fragility and its ability to transform 🌿",
        "@chicco.margaroli is the creative soul of OMAMA Social Hotel 🖌️",
        "His mark is everywhere: in the colours, the spaces and the details. His studio is right inside our hotel, where art takes shape every day 🏨✨",
        "An invitation to experience Aosta through a different lens: first inside the hotel, then among the artworks 👀",
        "📍 Free admission",
        "📅 Until 3 May 2026",
      ],
      fr: [
        "Aoste, c'est aussi cela : un art qui évolue, surprend et fait réfléchir 🎨✨",
        "Si vous séjournez à l'Hotel Duca d'Aosta ou à l'OMAMA Social Hotel, ne manquez pas l'exposition \"Ad Atto\" de Chicco Margaroli à l'église San Lorenzo ⛪️",
        "Une expérience immersive entre installations et langages contemporains qui racontent la nature, sa fragilité et sa capacité à se transformer 🌿",
        "@chicco.margaroli est l'âme créative de l'OMAMA Social Hotel 🖌️",
        "Sa signature est partout : dans les couleurs, les espaces et les détails. Son atelier se trouve au cœur même de notre hôtel, où l'art prend forme chaque jour 🏨✨",
        "Une invitation à vivre Aoste avec un regard différent : d'abord dans l'hôtel, puis parmi les œuvres 👀",
        "📍 Entrée gratuite",
        "📅 Jusqu'au 3 mai 2026",
      ],
      de: [
        "Aosta ist auch das: Kunst, die sich weiterentwickelt, überrascht und zum Nachdenken anregt 🎨✨",
        "Wenn Sie im Hotel Duca d'Aosta oder im OMAMA Social Hotel übernachten, verpassen Sie nicht die Ausstellung \"Ad Atto\" von Chicco Margaroli in der Kirche San Lorenzo ⛪️",
        "Ein immersives Erlebnis mit Installationen und zeitgenössischen Ausdrucksformen, die von der Natur, ihrer Fragilität und ihrer Wandlungsfähigkeit erzählen 🌿",
        "@chicco.margaroli ist die kreative Seele des OMAMA Social Hotel 🖌️",
        "Seine Handschrift ist überall: in den Farben, den Räumen und den Details. Sein Atelier befindet sich direkt in unserem Hotel, wo Kunst jeden Tag Gestalt annimmt 🏨✨",
        "Eine Einladung, Aosta mit einem anderen Blick zu erleben: zuerst im Hotel, dann zwischen den Werken 👀",
        "📍 Eintritt frei",
        "📅 Bis zum 3. Mai 2026",
      ],
    },
  },
];

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GLYPH_IG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
  '<rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="2"/>' +
  '<circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="2"/>' +
  '<circle cx="17.5" cy="6.5" r="1.4" fill="currentColor"/></svg>';

const GLYPH_ARROW =
  '<svg viewBox="0 0 18 17" fill="none" aria-hidden="true" focusable="false">' +
  '<path d="M10.87 6.45H4.27l.01-1.66h9.43v9.43h-1.66V7.63l-7.17 7.17-1.18-1.18z" fill="currentColor"/></svg>';

const ICON_PLAY =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-play"><path d="M9 7.5v9l7.5-4.5L9 7.5z" fill="currentColor"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-pause"><path d="M8 7h3v10H8V7zm5 0h3v10h-3V7z" fill="currentColor"/></svg>';
const ICON_SOUND_OFF =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-sound-off"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const ICON_SOUND_ON =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-sound-on"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8a5 5 0 0 1 0 8M18 6a7.5 7.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const ICON_EXPAND =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function renderVideoToolbar(t) {
  return (
    '<div class="omama-ig-toolbar">' +
    `<button type="button" class="omama-ig-tool" data-omama-ig-inline-play aria-label="${escapeHtml(t.play)}">` +
    ICON_PLAY +
    ICON_PAUSE +
    "</button>" +
    `<button type="button" class="omama-ig-tool is-muted" data-omama-ig-inline-mute aria-label="${escapeHtml(t.audio)}">` +
    ICON_SOUND_OFF +
    ICON_SOUND_ON +
    "</button>" +
    `<button type="button" class="omama-ig-tool omama-ig-tool--expand" data-omama-ig-expand aria-label="${escapeHtml(t.expand)}">` +
    ICON_EXPAND +
    "</button>" +
    "</div>"
  );
}

function renderGalleryToolbar(t) {
  return (
    '<div class="omama-ig-toolbar omama-ig-toolbar--gallery">' +
    `<button type="button" class="omama-ig-tool omama-ig-tool--expand" data-omama-ig-expand-photo aria-label="${escapeHtml(t.expand)}">` +
    ICON_EXPAND +
    "</button>" +
    "</div>"
  );
}

function renderMedia(post, lang, t) {
  const alt = escapeHtml(post.alt[lang]);

  if (post.photos && post.photos.length) {
    const total = post.photos.length;
    const slides = post.photos
      .map(
        (src, index) =>
          `<figure class="omama-ig-slide${index === 0 ? " is-active" : ""}" data-omama-ig-slide="${index}">` +
          `<img class="omama-ig-cover" src="${escapeHtml(src)}" alt="${alt} (${index + 1}/${total})" width="720" height="1280" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">` +
          "</figure>"
      )
      .join("");
    const dots = post.photos
      .map(
        (_, index) =>
          `<button type="button" class="omama-ig-dot${index === 0 ? " is-active" : ""}" data-omama-ig-dot="${index}" aria-label="${index + 1}/${total}"></button>`
      )
      .join("");

    return (
      '<div class="omama-ig-media omama-ig-media--gallery" data-omama-ig-gallery aria-label="' +
      escapeHtml(t.browse) +
      ' — ' +
      alt +
      '">' +
      '<div class="omama-ig-slides">' +
      slides +
      "</div>" +
      (total > 1
        ? `<button type="button" class="omama-ig-nav omama-ig-prev" aria-label="${escapeHtml(t.prev)}"></button>` +
          `<button type="button" class="omama-ig-nav omama-ig-next" aria-label="${escapeHtml(t.next)}"></button>` +
          `<div class="omama-ig-dots">${dots}</div>`
        : "") +
      renderGalleryToolbar(t) +
      "</div>"
    );
  }

  return (
    '<div class="omama-ig-media" data-omama-ig-media aria-label="' +
    escapeHtml(t.watch) +
    " — " +
    alt +
    '">' +
    `<video class="omama-ig-cover" data-omama-ig-video muted playsinline loop autoplay preload="metadata">` +
    `<source src="${escapeHtml(post.video)}" type="video/mp4">` +
    "</video>" +
    renderVideoToolbar(t) +
    "</div>"
  );
}

function renderAvatar() {
  return (
    '<span class="omama-ig-avatar">' +
    `<img src="${escapeHtml(INSTAGRAM.avatar)}" alt="${escapeHtml(INSTAGRAM.name)}" width="40" height="40" loading="lazy" decoding="async">` +
    "</span>"
  );
}

function renderCard(post, lang) {
  const t = UI[lang];
  const paragraphs = post.caption[lang].map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const tags = post.tags
    .map(
      (tag) =>
        `<a href="https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/" target="_blank" rel="noopener">#${escapeHtml(tag)}</a>`
    )
    .join(" ");

  return (
    '<li class="omama-ig-card">' +
    renderMedia(post, lang, t) +
    '<div class="omama-ig-body">' +
    '<div class="omama-ig-top">' +
    renderAvatar() +
    '<span class="omama-ig-author">' +
    `<span class="omama-ig-name">${escapeHtml(INSTAGRAM.name)}</span>` +
    `<span class="omama-ig-handle">${escapeHtml(INSTAGRAM.handle)}</span>` +
    "</span>" +
    "</div>" +
    `<div class="omama-ig-caption">${paragraphs}</div>` +
    `<p class="omama-ig-tags">${tags}</p>` +
    `<a class="omama-ig-cta" href="${escapeHtml(post.permalink)}" target="_blank" rel="noopener">` +
    `<span>${escapeHtml(t.open)}</span>${GLYPH_ARROW}</a>` +
    "</div>" +
    "</li>"
  );
}

export function renderInstagramSection(lang) {
  const t = UI[lang] || UI.it;
  const cards = POSTS.map((post) => renderCard(post, lang)).join("");

  return (
    '<section class="omama-ig" aria-labelledby="omama-ig-title">' +
    '<div class="omama-ig-inner">' +
    '<div class="omama-ig-head">' +
    '<div class="omama-ig-headings">' +
    `<span class="omama-ig-eyebrow f-a-16-120">${escapeHtml(t.eyebrow)}</span>` +
    `<h2 id="omama-ig-title" class="omama-ig-title f-al-44-100 omama-heading">${escapeHtml(t.title)}</h2>` +
    `<p class="omama-ig-intro f-a-20-120">${escapeHtml(t.intro)}</p>` +
    "</div>" +
    `<a class="omama-ig-follow" href="${escapeHtml(INSTAGRAM.profile)}" target="_blank" rel="noopener">` +
    `${GLYPH_IG}<span>${escapeHtml(t.follow)}</span></a>` +
    "</div>" +
    '<div class="omama-ig-scroll">' +
    `<ul class="omama-ig-list">${cards}</ul>` +
    "</div>" +
    "</div>" +
    "</section>"
  );
}