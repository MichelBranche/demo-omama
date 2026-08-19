"""Official OMAMA FAQs for the Camere accordion (from alpissima.com/it/omama/faq)."""
from __future__ import annotations

import json
import re

PLUS = """<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.1252 31.3333C18.5038 31.3333 18.0002 30.8297 18.0002 30.2083V22.4583C18.0002 21.837 17.4965 21.3333 16.8752 21.3333L9.12517 21.3333C8.50385 21.3333 8.00017 20.8297 8.00017 20.2083V19.125C8.00017 18.5037 8.50385 18 9.12517 18L16.8752 18C17.4965 18 18.0002 17.4963 18.0002 16.875V9.125C18.0002 8.50368 18.5038 8 19.1252 8L20.2085 8C20.8298 8 21.3335 8.50368 21.3335 9.125V16.875C21.3335 17.4963 21.8372 18 22.4585 18L30.2085 18C30.8298 18 31.3335 18.5037 31.3335 19.125V20.2083C31.3335 20.8297 30.8298 21.3333 30.2085 21.3333L22.4585 21.3333C21.8372 21.3333 21.3335 21.837 21.3335 22.4583V30.2083C21.3335 30.8297 20.8298 31.3333 20.2085 31.3333L19.1252 31.3333Z" fill="black" />
</svg>"""

OVERLAY = """<svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
<path class="shape-overlays__path _1" fill="#FFB200"></path>
<path class="shape-overlays__path _2" fill="#E6313A"></path>
<path class="shape-overlays__path _3" fill="#267E6E"></path>
</svg>"""

CATS = {
    "general": {
        "it": "Informazioni generali",
        "en": "General information",
        "fr": "Informations générales",
        "de": "Allgemeine Infos",
    },
    "checkin": {
        "it": "Check-in / Check-out",
        "en": "Check-in / Check-out",
        "fr": "Check-in / Check-out",
        "de": "Check-in / Check-out",
    },
    "services": {
        "it": "Struttura & Servizi",
        "en": "Facilities & services",
        "fr": "Structure et services",
        "de": "Haus & Services",
    },
    "rooms": {
        "it": "Camere",
        "en": "Rooms",
        "fr": "Chambres",
        "de": "Zimmer",
    },
    "breakfast": {
        "it": "Colazione",
        "en": "Breakfast",
        "fr": "Petit-déjeuner",
        "de": "Frühstück",
    },
    "dining": {
        "it": "Ristoranti & Bar",
        "en": "Restaurants & bar",
        "fr": "Restaurants et bar",
        "de": "Restaurants & Bar",
    },
    "activities": {
        "it": "Attività",
        "en": "Activities",
        "fr": "Activités",
        "de": "Aktivitäten",
    },
    "payments": {
        "it": "Pagamenti",
        "en": "Payments",
        "fr": "Paiements",
        "de": "Zahlung",
    },
}

# (id, category, {it,en,fr,de} question, {it,en,fr,de} answer)
FAQS = [
    (
        "checkin-times",
        "general",
        {
            "it": "Quali sono gli orari del check-in e check-out?",
            "en": "What are the check-in and check-out times?",
            "fr": "Quels sont les horaires de check-in et de check-out ?",
            "de": "Wann sind Check-in und Check-out?",
        },
        {
            "it": "Le camere sono disponibili approssimativamente dalle ore 15:00 nel giorno di arrivo e fino alle ore 11:00 nel giorno di partenza.",
            "en": "Rooms are available from about 3:00 pm on arrival day until 11:00 am on departure day.",
            "fr": "Les chambres sont disponibles à partir d’environ 15h le jour d’arrivée et jusqu’à 11h le jour de départ.",
            "de": "Die Zimmer stehen etwa ab 15:00 Uhr am Anreisetag zur Verfügung und bis 11:00 Uhr am Abreisetag.",
        },
    ),
    (
        "reception-hours",
        "general",
        {
            "it": "Quali sono gli orari della reception?",
            "en": "What are the reception hours?",
            "fr": "Quels sont les horaires de la réception ?",
            "de": "Wann ist die Rezeption geöffnet?",
        },
        {
            "it": "La reception è aperta 24/7. Il personale è sempre disponibile per check-in, check-out, informazioni e supporto durante tutto il soggiorno.",
            "en": "Reception is open 24/7. Staff are always available for check-in, check-out, information and support throughout your stay.",
            "fr": "La réception est ouverte 24h/24. L’équipe est toujours disponible pour le check-in, le check-out, les informations et l’assistance pendant tout le séjour.",
            "de": "Die Rezeption ist rund um die Uhr geöffnet. Das Team ist immer da für Check-in, Check-out, Auskünfte und Unterstützung während des gesamten Aufenthalts.",
        },
    ),
    (
        "languages",
        "general",
        {
            "it": "Quali sono le lingue parlate dalla reception?",
            "en": "Which languages does reception speak?",
            "fr": "Quelles langues parle la réception ?",
            "de": "Welche Sprachen spricht die Rezeption?",
        },
        {
            "it": "La reception parla italiano, inglese e francese.",
            "en": "Reception speaks Italian, English and French.",
            "fr": "La réception parle italien, anglais et français.",
            "de": "Die Rezeption spricht Italienisch, Englisch und Französisch.",
        },
    ),
    (
        "where",
        "general",
        {
            "it": "Dove si trova l’hotel? Si trova vicino al centro città?",
            "en": "Where is the hotel? Is it close to the city centre?",
            "fr": "Où se trouve l’hôtel ? Est-il proche du centre-ville ?",
            "de": "Wo liegt das Hotel? Ist es zentral?",
        },
        {
            "it": "OMAMA è in Via Torino 14, in centro ad Aosta. Stazione e terminal bus sono a pochi minuti a piedi. Centro storico, Piazza Chanoux, Teatro Romano e Arco di Augusto si raggiungono tutti a piedi. La funivia per Pila è nelle immediate vicinanze.",
            "en": "OMAMA is at Via Torino 14, in the centre of Aosta. The train station and bus terminal are a few minutes on foot. The old town, Piazza Chanoux, the Roman Theatre and the Arch of Augustus are all walkable. The Pila cable car is nearby.",
            "fr": "OMAMA se trouve Via Torino 14, au centre d’Aoste. Gare et gare routière sont à quelques minutes à pied. Centre historique, Piazza Chanoux, Théâtre romain et Arc d’Auguste se rejoignent à pied. La télécabine de Pila est tout près.",
            "de": "OMAMA liegt in der Via Torino 14, im Zentrum von Aosta. Bahnhof und Busbahnhof sind in wenigen Gehminuten erreichbar. Altstadt, Piazza Chanoux, römisches Theater und Augustusbogen liegen zu Fuß. Die Seilbahn nach Pila ist in der Nähe.",
        },
    ),
    (
        "garage",
        "general",
        {
            "it": "L’hotel dispone di un garage? Dove si trova?",
            "en": "Does the hotel have a garage? Where is it?",
            "fr": "L’hôtel a-t-il un garage ? Où se trouve-t-il ?",
            "de": "Gibt es eine Garage? Wo ist sie?",
        },
        {
            "it": "Garage privato sotterraneo e custodito, ingresso in Via Vevey 17. Supplemento <strong>€ 16,00</strong> per auto al giorno (posti limitati, prenotazione raccomandata). Ricarica elettrica a <strong>€ 0,80/kWh + IVA 22%</strong>. Non è consentito l’accesso ad auto a GPL o metano.",
            "en": "Private underground supervised garage, entrance on Via Vevey 17. Surcharge <strong>€16.00</strong> per car per day (limited spaces, booking recommended). EV charging at <strong>€0.80/kWh + 22% VAT</strong>. LPG and methane cars are not allowed.",
            "fr": "Garage privé souterrain et gardé, entrée Via Vevey 17. Supplément <strong>16,00 €</strong> par voiture et par jour (places limitées, réservation conseillée). Recharge électrique à <strong>0,80 €/kWh + TVA 22 %</strong>. Accès interdit aux voitures GPL ou méthane.",
            "de": "Private, bewachte Tiefgarage, Einfahrt Via Vevey 17. Zuschlag <strong>16,00 €</strong> pro Auto und Tag (begrenzte Plätze, Reservierung empfohlen). E-Ladung <strong>0,80 €/kWh + 22 % MwSt.</strong> Kein Zugang für LPG- oder Methanfahrzeuge.",
        },
    ),
    (
        "parking",
        "general",
        {
            "it": "È presente un parcheggio pubblico vicino all’hotel?",
            "en": "Is there public parking near the hotel?",
            "fr": "Y a-t-il un parking public près de l’hôtel ?",
            "de": "Gibt es öffentliche Parkplätze in der Nähe?",
        },
        {
            "it": "Sì: parcheggi pubblici a pagamento e gratuiti vicino all’hotel, oppure il garage coperto di via Carrel, a circa 150 metri.",
            "en": "Yes: paid and free public parking near the hotel, or the covered garage on Via Carrel, about 150 metres away.",
            "fr": "Oui : parkings publics payants et gratuits près de l’hôtel, ou le garage couvert de via Carrel, à environ 150 mètres.",
            "de": "Ja: kostenpflichtige und kostenlose öffentliche Parkplätze in der Nähe, oder die überdachte Garage in der Via Carrel, etwa 150 Meter entfernt.",
        },
    ),
    (
        "elevator",
        "general",
        {
            "it": "La struttura è dotata di ascensore?",
            "en": "Does the hotel have a lift?",
            "fr": "L’hôtel a-t-il un ascenseur ?",
            "de": "Gibt es einen Aufzug?",
        },
        {
            "it": "Sì, due ascensori per raggiungere tutti i piani.",
            "en": "Yes, two lifts serve all floors.",
            "fr": "Oui, deux ascenseurs desservent tous les étages.",
            "de": "Ja, zwei Aufzüge erschließen alle Etagen.",
        },
    ),
    (
        "wifi",
        "general",
        {
            "it": "È disponibile il Wi-Fi gratuito nelle camere e nelle aree comuni?",
            "en": "Is free Wi-Fi available in rooms and common areas?",
            "fr": "Le Wi-Fi gratuit est-il disponible dans les chambres et les espaces communs ?",
            "de": "Gibt es kostenloses WLAN in Zimmern und Gemeinschaftsbereichen?",
        },
        {
            "it": "Sì, Wi-Fi gratuito in camera e nelle aree comuni. Ogni camera ha login e password personali.",
            "en": "Yes, free Wi-Fi in rooms and common areas. Each room has its own login and password.",
            "fr": "Oui, Wi-Fi gratuit en chambre et dans les espaces communs. Chaque chambre a son propre identifiant et mot de passe.",
            "de": "Ja, kostenloses WLAN im Zimmer und in den Gemeinschaftsbereichen. Jedes Zimmer hat eigene Zugangsdaten.",
        },
    ),
    (
        "pets",
        "general",
        {
            "it": "Gli animali domestici sono ammessi?",
            "en": "Are pets allowed?",
            "fr": "Les animaux sont-ils acceptés ?",
            "de": "Sind Haustiere erlaubt?",
        },
        {
            "it": "Sì, animali adulti di media taglia (max 25 kg), esclusa la sala colazione. Supplemento pulizia <strong>€ 15,00</strong> al giorno per animale (cibo non incluso).",
            "en": "Yes, adult medium-size pets (max 25 kg), except in the breakfast room. Extra cleaning <strong>€15.00</strong> per day per pet (food not included).",
            "fr": "Oui, animaux adultes de taille moyenne (max 25 kg), sauf dans la salle du petit-déjeuner. Supplément ménage <strong>15,00 €</strong> par jour et par animal (nourriture non incluse).",
            "de": "Ja, ausgewachsene mittelgroße Tiere (max. 25 kg), außer im Frühstücksraum. Reinigungszuschlag <strong>15,00 €</strong> pro Tag und Tier (Futter nicht inklusive).",
        },
    ),
    (
        "luggage",
        "general",
        {
            "it": "È disponibile il deposito bagagli?",
            "en": "Is there luggage storage?",
            "fr": "Y a-t-il une consigne à bagages ?",
            "de": "Gibt es eine Gepäckaufbewahrung?",
        },
        {
            "it": "Sì, deposito bagagli gratuito prima del check-in o dopo il check-out.",
            "en": "Yes, free luggage storage before check-in or after check-out.",
            "fr": "Oui, consigne gratuite avant le check-in ou après le check-out.",
            "de": "Ja, kostenlose Gepäckaufbewahrung vor dem Check-in oder nach dem Check-out.",
        },
    ),
    (
        "tourist-tax",
        "general",
        {
            "it": "È prevista la tassa di soggiorno?",
            "en": "Is there a city tax?",
            "fr": "Y a-t-il une taxe de séjour ?",
            "de": "Gibt es eine Kurtaxe?",
        },
        {
            "it": "Sì. <strong>€ 1,25</strong> a persona al giorno dal 1° maggio al 15 giugno e dal 1° ottobre al 30 novembre; <strong>€ 2,50</strong> negli altri periodi. Esenti i minori di 15 anni. (L.r. 30/2011, art. 32 c. 2).",
            "en": "Yes. <strong>€1.25</strong> per person per day from 1 May to 15 June and from 1 October to 30 November; <strong>€2.50</strong> in other periods. Under 15s are exempt. (Regional law 30/2011, art. 32.2).",
            "fr": "Oui. <strong>1,25 €</strong> par personne et par jour du 1er mai au 15 juin et du 1er octobre au 30 novembre ; <strong>2,50 €</strong> le reste de l’année. Exonérés : moins de 15 ans. (L.r. 30/2011, art. 32.2).",
            "de": "Ja. <strong>1,25 €</strong> pro Person und Tag vom 1. Mai bis 15. Juni und vom 1. Oktober bis 30. November; <strong>2,50 €</strong> in den übrigen Zeiten. Unter 15 Jahren befreit. (Reg.-Gesetz 30/2011, Art. 32 Abs. 2).",
        },
    ),
    (
        "how-checkin",
        "checkin",
        {
            "it": "Come avviene il check-in?",
            "en": "How does check-in work?",
            "fr": "Comment se passe le check-in ?",
            "de": "Wie funktioniert der Check-in?",
        },
        {
            "it": "Registrazione in reception con un documento d’identità valido, come previsto dalla normativa.",
            "en": "Check-in at reception with a valid ID, as required by law.",
            "fr": "Enregistrement à la réception avec une pièce d’identité valide, conformément à la réglementation.",
            "de": "Anmeldung an der Rezeption mit einem gültigen Ausweis, wie gesetzlich vorgeschrieben.",
        },
    ),
    (
        "early-late",
        "checkin",
        {
            "it": "È possibile anticipare il check-in o posticipare il check-out?",
            "en": "Can I request early check-in or late check-out?",
            "fr": "Peut-on avancer le check-in ou retarder le check-out ?",
            "de": "Sind Early Check-in oder Late Check-out möglich?",
        },
        {
            "it": "Sì, su disponibilità e con un piccolo supplemento.",
            "en": "Yes, subject to availability and a small surcharge.",
            "fr": "Oui, selon disponibilité et avec un petit supplément.",
            "de": "Ja, je nach Verfügbarkeit und gegen einen kleinen Zuschlag.",
        },
    ),
    (
        "shuttle",
        "services",
        {
            "it": "È disponibile un servizio navetta?",
            "en": "Is there a hotel shuttle?",
            "fr": "Y a-t-il une navette d’hôtel ?",
            "de": "Gibt es einen Hotelshuttle?",
        },
        {
            "it": "No, la struttura non ha una navetta dedicata. Si raggiungono hotel e centro con mezzi pubblici, taxi o auto privata.",
            "en": "No dedicated hotel shuttle. You can reach the hotel and the centre by public transport, taxi or private car.",
            "fr": "Pas de navette dédiée. Hôtel et centre se rejoignent en transports publics, taxi ou voiture.",
            "de": "Kein eigener Hotelshuttle. Anreise mit ÖPNV, Taxi oder Privatauto.",
        },
    ),
    (
        "ev",
        "services",
        {
            "it": "È disponibile la ricarica per auto elettriche?",
            "en": "Is there EV charging?",
            "fr": "Y a-t-il une recharge pour voitures électriques ?",
            "de": "Gibt es E-Ladestationen?",
        },
        {
            "it": "Sì, nel garage: <strong>€ 0,80/kWh + IVA 22%</strong>. Serve un posto auto prenotato (<strong>€ 16,00</strong> a notte).",
            "en": "Yes, in the garage: <strong>€0.80/kWh + 22% VAT</strong>. A booked parking space is required (<strong>€16.00</strong> per night).",
            "fr": "Oui, dans le garage : <strong>0,80 €/kWh + TVA 22 %</strong>. Une place réservée est nécessaire (<strong>16,00 €</strong> par nuit).",
            "de": "Ja, in der Garage: <strong>0,80 €/kWh + 22 % MwSt.</strong> Ein reservierter Stellplatz ist nötig (<strong>16,00 €</strong> pro Nacht).",
        },
    ),
    (
        "children",
        "services",
        {
            "it": "I bambini possono soggiornare in hotel?",
            "en": "Can children stay at the hotel?",
            "fr": "Les enfants peuvent-ils séjourner à l’hôtel ?",
            "de": "Können Kinder im Hotel übernachten?",
        },
        {
            "it": "Sì, le famiglie sono benvenute. Non sono previsti servizi kids dedicati.",
            "en": "Yes, families are welcome. There are no dedicated kids’ services.",
            "fr": "Oui, les familles sont les bienvenues. Il n’y a pas de services kids dédiés.",
            "de": "Ja, Familien sind willkommen. Es gibt keine eigenen Kinderangebote.",
        },
    ),
    (
        "accessibility",
        "services",
        {
            "it": "La struttura è accessibile a ospiti con disabilità?",
            "en": "Is the hotel accessible for guests with disabilities?",
            "fr": "L’hôtel est-il accessible aux personnes en situation de handicap ?",
            "de": "Ist das Hotel barrierefrei?",
        },
        {
            "it": "Sì: ascensori, spazi comuni senza barriere e camere accessibili dedicate.",
            "en": "Yes: lifts, barrier-free common areas and dedicated accessible rooms.",
            "fr": "Oui : ascenseurs, espaces communs sans barrières et chambres accessibles dédiées.",
            "de": "Ja: Aufzüge, barrierefreie Gemeinschaftsbereiche und eigene barrierefreie Zimmer.",
        },
    ),
    (
        "meeting",
        "services",
        {
            "it": "È possibile usufruire di una sala meeting?",
            "en": "Are meeting rooms available?",
            "fr": "Y a-t-il des salles de réunion ?",
            "de": "Gibt es Tagungsräume?",
        },
        {
            "it": "Sì, sale meeting su richiesta e in base alla disponibilità, per riunioni o piccoli eventi.",
            "en": "Yes, meeting rooms on request and subject to availability, for meetings or small events.",
            "fr": "Oui, salles de réunion sur demande et selon disponibilité, pour réunions ou petits événements.",
            "de": "Ja, Tagungsräume auf Anfrage und je nach Verfügbarkeit, für Meetings oder kleine Events.",
        },
    ),
    (
        "laundry",
        "services",
        {
            "it": "È possibile usufruire di un servizio di lavanderia?",
            "en": "Is there a laundry service?",
            "fr": "Y a-t-il un service de blanchisserie ?",
            "de": "Gibt es einen Wäscheservice?",
        },
        {
            "it": "Sì: lavanderia a pagamento su richiesta, e una lavasciuga automatica sempre a disposizione degli ospiti.",
            "en": "Yes: paid laundry on request, plus a self-service washer-dryer always available to guests.",
            "fr": "Oui : blanchisserie payante sur demande, plus une machine lave-linge/sèche-linge en libre-service.",
            "de": "Ja: Wäscheservice gegen Aufpreis auf Anfrage, plus ein Waschtrockner in Selbstbedienung.",
        },
    ),
    (
        "ironing",
        "services",
        {
            "it": "È possibile stirare i propri capi?",
            "en": "Can I iron my clothes?",
            "fr": "Peut-on repasser ses vêtements ?",
            "de": "Kann man selbst bügeln?",
        },
        {
            "it": "Sì: servizio di stiratura a pagamento, oppure ferro da stiro in autonomia nella saletta relax.",
            "en": "Yes: a paid ironing service, or a self-service iron in the relax room.",
            "fr": "Oui : service de repassage payant, ou fer à repasser en libre-service dans le salon relax.",
            "de": "Ja: Bügelservice gegen Aufpreis, oder Bügeleisen zur Selbstnutzung im Relaxraum.",
        },
    ),
    (
        "gym",
        "services",
        {
            "it": "L’hotel dispone di una palestra?",
            "en": "Does the hotel have a gym?",
            "fr": "L’hôtel a-t-il une salle de sport ?",
            "de": "Gibt es ein Fitnessstudio?",
        },
        {
            "it": "C’è una saletta relax con macchinari fitness, sempre a disposizione degli ospiti.",
            "en": "There is a relax room with fitness machines, always available to guests.",
            "fr": "Il y a un salon relax avec des appareils de fitness, toujours à disposition.",
            "de": "Es gibt einen Relaxraum mit Fitnessgeräten, jederzeit nutzbar.",
        },
    ),
    (
        "comforts",
        "rooms",
        {
            "it": "Quali comfort offrono le camere?",
            "en": "What amenities do the rooms have?",
            "fr": "Quels sont les équipements des chambres ?",
            "de": "Welche Ausstattung haben die Zimmer?",
        },
        {
            "it": "TV LED 43\" con canali multilingua, vasca Kaldewei o doccia a filo pavimento con soffione rain, minibar con acqua, Wi-Fi/LAN, cassetta di sicurezza per laptop 15\", clima autonomo, bollitore con tè e caffè.",
            "en": "43\" LED TV with multilingual channels, Kaldewei bathtub or walk-in rain shower, minibar with water, Wi-Fi/LAN, laptop-size safe, independent A/C, kettle with tea and coffee.",
            "fr": "TV LED 43\" chaînes multilingues, baignoire Kaldewei ou douche à l’italienne rain, minibar avec eau, Wi-Fi/LAN, coffre pour laptop 15\", climatisation autonome, bouilloire avec thé et café.",
            "de": "43\"-LED-TV mit mehrsprachigen Sendern, Kaldewei-Wanne oder bodengleiche Rain-Dusche, Minibar mit Wasser, WLAN/LAN, Safe für 15\"-Laptop, eigene Klima, Wasserkocher mit Tee und Kaffee.",
        },
    ),
    (
        "sizes",
        "rooms",
        {
            "it": "Qual è la metratura delle camere?",
            "en": "How large are the rooms?",
            "fr": "Quelle est la surface des chambres ?",
            "de": "Wie groß sind die Zimmer?",
        },
        {
            "it": "Cozy e View: circa 19–22 m². Plus: circa 23–30 m². Family e Junior Suite: circa 30–33 m². Rooftop Suite: circa 70 m². Le dimensioni possono variare leggermente.",
            "en": "Cozy and View: about 19–22 m². Plus: about 23–30 m². Family and Junior Suite: about 30–33 m². Rooftop Suite: about 70 m². Sizes may vary slightly.",
            "fr": "Cozy et View : environ 19–22 m². Plus : environ 23–30 m². Family et Junior Suite : environ 30–33 m². Rooftop Suite : environ 70 m². Les surfaces peuvent varier légèrement.",
            "de": "Cozy und View: ca. 19–22 m². Plus: ca. 23–30 m². Family und Junior Suite: ca. 30–33 m². Rooftop Suite: ca. 70 m². Die Größen können leicht variieren.",
        },
    ),
    (
        "crib",
        "rooms",
        {
            "it": "È possibile richiedere una culla o un letto aggiuntivo?",
            "en": "Can I request a cot or extra bed?",
            "fr": "Peut-on demander un berceau ou un lit d’appoint ?",
            "de": "Kann man ein Babybett oder Zustellbett anfragen?",
        },
        {
            "it": "Culle su richiesta, con supplemento. Segnalalo in prenotazione o in struttura.",
            "en": "Cots on request, with a surcharge. Ask when booking or at the hotel.",
            "fr": "Berceaux sur demande, avec supplément. À indiquer à la réservation ou sur place.",
            "de": "Babybetten auf Anfrage gegen Aufpreis. Bitte bei der Buchung oder vor Ort angeben.",
        },
    ),
    (
        "breakfast-hours",
        "breakfast",
        {
            "it": "A che ora viene servita la colazione? Cosa include?",
            "en": "When is breakfast served? What does it include?",
            "fr": "À quelle heure est le petit-déjeuner ? Que comprend-il ?",
            "de": "Wann gibt es Frühstück? Was ist enthalten?",
        },
        {
            "it": "Dalle 7:00 alle 10:30 in Omama Lounge, buffet dolce e salato con prodotti del territorio. Allergie e intolleranze su richiesta. Se non inclusa: da 13 anni <strong>€ 15</strong>, 4–12 anni <strong>€ 10</strong>, 0–3 anni <strong>€ 5</strong> a persona al giorno.",
            "en": "From 7:00 to 10:30 in the Omama Lounge, sweet and savoury buffet with local products. Allergies on request. If not included: age 13+ <strong>€15</strong>, 4–12 <strong>€10</strong>, 0–3 <strong>€5</strong> per person per day.",
            "fr": "De 7h à 10h30 à l’Omama Lounge, buffet sucré-salé avec produits du territoire. Allergies sur demande. Si non inclus : dès 13 ans <strong>15 €</strong>, 4–12 ans <strong>10 €</strong>, 0–3 ans <strong>5 €</strong> par personne et par jour.",
            "de": "Von 7:00 bis 10:30 in der Omama Lounge, süß-salziges Buffet mit regionalen Produkten. Allergien auf Anfrage. Falls nicht inklusive: ab 13 <strong>15 €</strong>, 4–12 <strong>10 €</strong>, 0–3 <strong>5 €</strong> pro Person und Tag.",
        },
    ),
    (
        "gluten",
        "breakfast",
        {
            "it": "È disponibile la colazione per celiaci?",
            "en": "Is gluten-free breakfast available?",
            "fr": "Y a-t-il un petit-déjeuner sans gluten ?",
            "de": "Gibt es glutenfreies Frühstück?",
        },
        {
            "it": "Sì, prodotti per celiaci su richiesta. Lo staff organizza alternative durante il soggiorno.",
            "en": "Yes, gluten-free products on request. Staff will arrange alternatives during your stay.",
            "fr": "Oui, produits sans gluten sur demande. L’équipe organise des alternatives pendant le séjour.",
            "de": "Ja, glutenfreie Produkte auf Anfrage. Das Team organisiert Alternativen während des Aufenthalts.",
        },
    ),
    (
        "restaurant",
        "dining",
        {
            "it": "È presente un ristorante all’interno dell’hotel?",
            "en": "Is there a restaurant in the hotel?",
            "fr": "Y a-t-il un restaurant dans l’hôtel ?",
            "de": "Gibt es ein Restaurant im Hotel?",
        },
        {
            "it": "No. Il centro storico è a pochi minuti a piedi, con molti ristoranti. La reception aiuta con i suggerimenti e le prenotazioni.",
            "en": "No. The old town is a few minutes on foot, with plenty of restaurants. Reception can suggest and help book.",
            "fr": "Non. Le centre historique est à quelques minutes à pied, avec de nombreux restaurants. La réception conseille et aide à réserver.",
            "de": "Nein. Die Altstadt ist in wenigen Minuten zu Fuß, mit vielen Restaurants. Die Rezeption hilft bei Tipps und Reservierungen.",
        },
    ),
    (
        "bar",
        "dining",
        {
            "it": "È presente un bar all’interno dell’hotel?",
            "en": "Is there a bar in the hotel?",
            "fr": "Y a-t-il un bar dans l’hôtel ?",
            "de": "Gibt es eine Bar im Hotel?",
        },
        {
            "it": "Sì, un’area bar in struttura per una pausa durante la giornata.",
            "en": "Yes, a bar area in the hotel for a break during the day.",
            "fr": "Oui, un espace bar dans l’hôtel pour une pause dans la journée.",
            "de": "Ja, ein Barbereich im Haus für eine Pause tagsüber.",
        },
    ),
    (
        "diets",
        "dining",
        {
            "it": "Sono disponibili opzioni per diete particolari?",
            "en": "Are special diets available?",
            "fr": "Y a-t-il des options pour régimes particuliers ?",
            "de": "Gibt es Optionen für besondere Diäten?",
        },
        {
            "it": "Sì, su richiesta, compatibilmente con l’offerta della colazione e la disponibilità della struttura.",
            "en": "Yes, on request, depending on the breakfast offer and hotel availability.",
            "fr": "Oui, sur demande, selon l’offre du petit-déjeuner et les possibilités de la maison.",
            "de": "Ja, auf Anfrage, je nach Frühstücksangebot und Möglichkeiten des Hauses.",
        },
    ),
    (
        "excursions",
        "activities",
        {
            "it": "È possibile organizzare escursioni?",
            "en": "Can you help organise excursions?",
            "fr": "Peut-on organiser des excursions ?",
            "de": "Können Ausflüge organisiert werden?",
        },
        {
            "it": "Lo staff aiuta con consigli su itinerari ed esperienze ad Aosta e in Valle d’Aosta.",
            "en": "Staff can advise on itineraries and experiences in Aosta and the Aosta Valley.",
            "fr": "L’équipe conseille itineraires et expériences à Aoste et en Vallée d’Aoste.",
            "de": "Das Team hilft mit Tipps zu Touren und Erlebnissen in Aosta und im Aostatal.",
        },
    ),
    (
        "nearby",
        "activities",
        {
            "it": "Ci sono attrazioni, ristoranti o mezzi pubblici nelle vicinanze?",
            "en": "Are there sights, restaurants or public transport nearby?",
            "fr": "Y a-t-il des attractions, restaurants ou transports près de l’hôtel ?",
            "de": "Gibt es Sehenswürdigkeiten, Restaurants oder ÖPNV in der Nähe?",
        },
        {
            "it": "Sì. A piedi: centro storico, Piazza Chanoux, Teatro Romano, Arco di Augusto, Collegiata di Sant’Orso, stazione e bus. Ristoranti, bar e negozi intorno all’hotel.",
            "en": "Yes. On foot: old town, Piazza Chanoux, Roman Theatre, Arch of Augustus, Sant’Orso, train and bus. Restaurants, bars and shops around the hotel.",
            "fr": "Oui. À pied : centre historique, Piazza Chanoux, Théâtre romain, Arc d’Auguste, collégiale Saint-Ours, gare et bus. Restaurants, bars et commerces autour de l’hôtel.",
            "de": "Ja. Zu Fuß: Altstadt, Piazza Chanoux, römisches Theater, Augustusbogen, Sant’Orso, Bahnhof und Bus. Restaurants, Bars und Läden rund ums Hotel.",
        },
    ),
    (
        "cards",
        "payments",
        {
            "it": "Quali carte di credito sono accettate?",
            "en": "Which credit cards are accepted?",
            "fr": "Quelles cartes de crédit sont acceptées ?",
            "de": "Welche Kreditkarten werden akzeptiert?",
        },
        {
            "it": "Visa, Mastercard, American Express e i principali pagamenti elettronici.",
            "en": "Visa, Mastercard, American Express and the main electronic payment systems.",
            "fr": "Visa, Mastercard, American Express et les principaux paiements électroniques.",
            "de": "Visa, Mastercard, American Express und die gängigen elektronischen Zahlarten.",
        },
    ),
    (
        "cancel",
        "payments",
        {
            "it": "Quali sono i termini di cancellazione?",
            "en": "What are the cancellation terms?",
            "fr": "Quelles sont les conditions d’annulation ?",
            "de": "Wie sind die Stornobedingungen?",
        },
        {
            "it": "Dipendono dalla tariffa prenotata e sono comunicati in offerta e in conferma.",
            "en": "They depend on the booked rate and are always stated in the offer and the confirmation.",
            "fr": "Ils dépendent du tarif réservé et sont indiqués dans l’offre et la confirmation.",
            "de": "Sie hängen vom gebuchten Tarif ab und stehen im Angebot und in der Bestätigung.",
        },
    ),
]


def _item(faq_id: str, q: dict[str, str], a: dict[str, str]) -> str:
    return f"""<div class="faq faq-item js-dropdown">
<button type="button" class="button d-flex align-items-center justify-content-between text-left js-dropdown-button">
<div class="">
<span class="post_title d-block f-a-20-120 color-black" data-i18n="faq-q-{faq_id}">{q["it"]}</span>
</div>
{PLUS}
</button>
<div class="js-pane">
<span class="post_content d-block f-a-20-120" data-i18n="faq-a-{faq_id}">{a["it"]}</span>
</div>
</div>"""


def _group(cat: str, items: list) -> str:
    inner = "\n".join(_item(faq_id, q, a) for faq_id, _c, q, a in items)
    return f"""<div class="faq faq-group js-dropdown">
<button type="button" class="button d-flex align-items-center justify-content-between text-left js-dropdown-button js-color-button-fill">
<div class="">
<span class="post_title d-block f-ab-20-120 color-black" data-i18n="faq-cat-{cat}">{CATS[cat]["it"]}</span>
</div>
{PLUS}
{OVERLAY}
</button>
<div class="js-pane">
{inner}
</div>
</div>"""


def faqs_html(section_id: str | None = None) -> str:
    grouped: dict[str, list] = {key: [] for key in CATS}
    for item in FAQS:
        grouped[item[1]].append(item)
    blocks = "\n".join(_group(cat, grouped[cat]) for cat in CATS if grouped[cat])
    id_attr = f' id="{section_id}"' if section_id else ""
    return f'<section class="faqs"{id_attr}>\n{blocks}\n</section>'


FAQ_HEADER = """<section class="arrows-header d-flex align-items-center justify-content-between background-yellow">
<svg width="58" height="42" viewBox="0 0 58 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<g class="arrow-group" clip-path="url(#clip0_omama_faq)">
<path d="M13.7907 1.87317V38.8797" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
<path d="M25.7493 25.1344L13.791 39.937L1.83266 25.1344" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
</g>
<g class="arrow-group _2" clip-path="url(#clip1_omama_faq)">
<path d="M47.0029 6.50269V34.556" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
<path d="M56.0442 24.1362L47.0026 35.3576L37.9609 24.1362" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
</g>
<defs>
<clipPath id="clip0_omama_faq">
<rect width="27" height="42" fill="white" />
</clipPath>
<clipPath id="clip1_omama_faq">
<rect width="22" height="32" fill="white" transform="translate(36 5)" />
</clipPath>
</defs>
</svg>
<span class="f-al-44-100 text-center" data-i18n="FAQs">FAQ</span>
<svg width="59" height="50" viewBox="0 0 59 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<g class="arrow-group">
<path d="M45.4573 1.34106V46.9771" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
<path d="M57.4174 30.0265L45.4591 48.2809L33.5007 30.0265" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
</g>
<g class="arrow-group _2">
<path d="M15.5 13.8773V41.3337" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
<path d="M24.5404 31.1356L15.4987 42.1182L6.45703 31.1356" stroke="#111" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
</g>
</svg>
</section>"""


def homepage_faqs_html() -> str:
    return FAQ_HEADER + "\n" + faqs_html("faqs")


def inject_homepage_faqs(html: str) -> str:
    block = homepage_faqs_html()
    html = re.sub(
        r'<section class="insta-feed">[\s\S]*?</section>',
        block,
        html,
        count=1,
    )
    html = re.sub(
        r'(<a href=")[^"]+("[^>]*>\s*<span class="f-a-14-120" data-i18n="FAQs">)',
        r"\1/en/homepage/index.html#faqs\2",
        html,
        count=1,
    )
    return html


def i18n_entries() -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for key, trans in CATS.items():
        out[f"faq-cat-{key}"] = trans
    for faq_id, _cat, q, a in FAQS:
        out[f"faq-q-{faq_id}"] = q
        out[f"faq-a-{faq_id}"] = a
    out["Altre risposte sul sito ufficiale"] = {
        "it": "Altre risposte sul sito ufficiale",
        "en": "More answers on the official site",
        "fr": "Plus de réponses sur le site officiel",
        "de": "Weitere Antworten auf der offiziellen Seite",
    }
    return out


def i18n_js_block() -> str:
    rows = []
    for key, trans in i18n_entries().items():
        parts = ", ".join(f"{lang}: {json.dumps(text, ensure_ascii=False)}" for lang, text in trans.items())
        rows.append(f"  {json.dumps(key)}: {{ {parts} }},")
    return "\n".join(rows)


MARKER_START = "  /* OMAMA_FAQS_START */"
MARKER_END = "  /* OMAMA_FAQS_END */"


def inject_i18n_js(js: str) -> str:
    block = f"{MARKER_START}\n{i18n_js_block()}\n{MARKER_END}"
    if MARKER_START in js and MARKER_END in js:
        return re.sub(
            re.escape(MARKER_START) + r"[\s\S]*?" + re.escape(MARKER_END),
            block,
            js,
            count=1,
        )
    return js.replace("\n};\n\nwindow.OMAMA_TITLES", f"\n{block}\n}};\n\nwindow.OMAMA_TITLES", 1)


def inject_faqs(html: str) -> str:
    html = re.sub(
        r'<section class="faqs">[\s\S]*?</section>',
        faqs_html(),
        html,
        count=1,
    )
    html = re.sub(
        r'\s*<a [^>]*class="strip-bar[^"]*"[^>]*>[\s\S]*?</a>\s*(</article>)',
        r"\n\1",
        html,
        count=1,
    )
    html = re.sub(r"/omama-i18n\.js\?v=[^\"']+", "/omama-i18n.js?v=copy10", html)
    html = re.sub(r"/omama-overrides\.css\?v=[^\"']+", "/omama-overrides.css?v=map10", html)
    return html
