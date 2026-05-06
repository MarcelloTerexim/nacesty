/* Mock data — 3 ukážkové výlety (live, planned, completed) */

const MockData = (() => {

    const photoSvg = (emoji, hue) => {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
            <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0' stop-color='hsl(${hue},70%,75%)'/>
                <stop offset='1' stop-color='hsl(${(hue + 40) % 360},65%,55%)'/>
            </linearGradient></defs>
            <rect width='120' height='120' fill='url(%23g)'/>
            <text x='60' y='80' font-size='56' text-anchor='middle'>${emoji}</text>
        </svg>`;
        return 'data:image/svg+xml;utf8,' + svg.replace(/\n\s*/g, '').replace(/#/g, '%23');
    };

    const seed = () => {
        const trips = [];
        const days = [];
        const activities = [];
        const photos = [];

        // ============ Trip 1: Rím + Florencia (live) ============
        const t1 = { id: 'trip-rim', name: 'Rím + Florencia', destination: '🇮🇹 Taliansko',
            startDate: '2026-05-04', endDate: '2026-05-10', daysCount: 7, status: 'live',
            createdAt: '2026-04-15T10:00:00Z' };
        trips.push(t1);

        const rimDays = [
            { idx: 1, date: '2026-05-04', emoji: '☀️', temp: 24, summary: 'slnečno' },
            { idx: 2, date: '2026-05-05', emoji: '🌤️', temp: 22, summary: 'polooblačno' },
            { idx: 3, date: '2026-05-06', emoji: '☀️', temp: 25, summary: 'slnečno' },
            { idx: 4, date: '2026-05-07', emoji: '🌦️', temp: 19, summary: 'prehánky' },
            { idx: 5, date: '2026-05-08', emoji: '☀️', temp: 23, summary: 'slnečno' },
            { idx: 6, date: '2026-05-09', emoji: '🌤️', temp: 21, summary: 'polooblačno' },
            { idx: 7, date: '2026-05-10', emoji: '☀️', temp: 24, summary: 'slnečno' },
        ];
        rimDays.forEach(d => {
            days.push({ id: `day-rim-${d.idx}`, tripId: t1.id, dayIndex: d.idx,
                date: d.date, weatherTemp: d.temp, weatherSummary: d.summary, weatherEmoji: d.emoji });
        });

        // Day 1 — všetko hotové
        const rim1 = [
            { type: 'lietadlo', emoji: '✈️', cat: 'doprava', t: '06:00', t2: '08:30', title: 'Let do Ríma', desc: 'Ryanair FR4321, terminál B', done: true, rating: 'good' },
            { type: 'mhd', emoji: '🚊', cat: 'doprava', t: '09:15', t2: '10:00', title: 'Leonardo Express', desc: 'Z letiska Fiumicino na Termini', done: true, rating: 'ok' },
            { type: 'hotel', emoji: '🏨', cat: 'ubytovanie', t: '10:30', t2: '11:00', title: 'Check-in Hotel Artemide', desc: 'Via Nazionale 22', done: true, rating: 'good' },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '13:00', t2: '14:30', title: 'Obed pri Trevi', desc: 'Trattoria da Mario', done: true, rating: 'good' },
            { type: 'pamiatka', emoji: '⛲', cat: 'kultura', t: '15:00', t2: '16:00', title: 'Fontana di Trevi', desc: 'Hodíme mincu', done: true, rating: 'good' },
            { type: 'pamiatka', emoji: '🏛️', cat: 'kultura', t: '16:30', t2: '18:00', title: 'Pantheón', desc: '', done: true, rating: 'good' },
        ];

        // Day 2 — väčšinou hotové
        const rim2 = [
            { type: 'ranajky', emoji: '🥐', cat: 'jedlo', t: '08:00', t2: '09:00', title: 'Raňajky v hoteli', desc: '', done: true, rating: 'ok' },
            { type: 'pamiatka', emoji: '🏛️', cat: 'kultura', t: '10:00', t2: '13:00', title: 'Koloseum', desc: 'Vstupenka 18€, sprievodca', done: true, rating: 'good' },
            { type: 'pamiatka', emoji: '🏛️', cat: 'kultura', t: '13:30', t2: '15:00', title: 'Forum Romanum', desc: '', done: true, rating: 'good' },
            { type: 'restauracia', emoji: '🍕', cat: 'jedlo', t: '15:30', t2: '16:30', title: 'Pizza al taglio', desc: 'Bonci', done: true, rating: 'good' },
            { type: 'kostol', emoji: '⛪', cat: 'kultura', t: '17:00', t2: '19:00', title: 'Vatikán — Bazilika sv. Petra', desc: '', done: true, rating: 'good' },
        ];

        // Day 3 — dnes (čiastočne hotové)
        const rim3 = [
            { type: 'ranajky', emoji: '🥐', cat: 'jedlo', t: '08:30', t2: '09:30', title: 'Raňajky v kaviarni', desc: 'Sant\'Eustachio', done: true, rating: 'good' },
            { type: 'muzeum', emoji: '🖼️', cat: 'kultura', t: '10:30', t2: '13:30', title: 'Vatikánske múzeá', desc: 'Sixtínska kaplnka', done: true, rating: 'good' },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '14:00', t2: '15:30', title: 'Obed', desc: '', done: false, rating: null },
            { type: 'park', emoji: '🌳', cat: 'oddych', t: '16:00', t2: '18:00', title: 'Villa Borghese', desc: 'Park + galéria', done: false, rating: null },
            { type: 'restauracia', emoji: '🍷', cat: 'jedlo', t: '20:00', t2: '22:00', title: 'Večera Trastevere', desc: '', done: false, rating: null },
        ];

        // Day 4 — naplánované
        const rim4 = [
            { type: 'vlak', emoji: '🚂', cat: 'doprava', t: '07:30', t2: '09:00', title: 'Vlak do Florencie', desc: 'Frecciarossa', done: false, rating: null },
            { type: 'pamiatka', emoji: '🏛️', cat: 'kultura', t: '10:00', t2: '12:00', title: 'Duomo Firenze', desc: '', done: false, rating: null },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '13:00', t2: '14:30', title: 'Obed — bistecca', desc: '', done: false, rating: null },
            { type: 'muzeum', emoji: '🖼️', cat: 'kultura', t: '15:00', t2: '17:30', title: 'Galéria Uffizi', desc: '', done: false, rating: null },
        ];

        // Day 5
        const rim5 = [
            { type: 'pamiatka', emoji: '🌉', cat: 'kultura', t: '09:00', t2: '10:00', title: 'Ponte Vecchio', desc: '', done: false, rating: null },
            { type: 'vyhlad', emoji: '🌅', cat: 'oddych', t: '17:00', t2: '18:30', title: 'Piazzale Michelangelo', desc: 'Západ slnka', done: false, rating: null },
        ];

        // Day 6
        const rim6 = [
            { type: 'turistika', emoji: '🥾', cat: 'sport', t: '09:00', t2: '15:00', title: 'Cinque Terre — výlet', desc: 'Vlak + pešia turistika', done: false, rating: null },
        ];

        // Day 7 — návrat
        const rim7 = [
            { type: 'vlak', emoji: '🚂', cat: 'doprava', t: '10:00', t2: '11:30', title: 'Vlak do Ríma', desc: '', done: false, rating: null },
            { type: 'lietadlo', emoji: '✈️', cat: 'doprava', t: '15:00', t2: '17:30', title: 'Let domov', desc: '', done: false, rating: null },
        ];

        const rimDayActs = [rim1, rim2, rim3, rim4, rim5, rim6, rim7];
        rimDayActs.forEach((acts, i) => {
            const dayId = `day-rim-${i + 1}`;
            acts.forEach((a, j) => {
                activities.push({
                    id: `act-rim-${i + 1}-${j}`, dayId, category: a.cat, type: a.type, typeEmoji: a.emoji,
                    startTime: a.t, endTime: a.t2, title: a.title, description: a.desc,
                    isCompleted: a.done, rating: a.rating, orderIndex: j,
                });
            });
        });

        // Pár fotiek pre Rím
        photos.push(
            { id: 'photo-rim-1', tripId: t1.id, activityId: 'act-rim-1-0', dataUrl: photoSvg('✈️', 200), takenAt: '2026-05-04T07:30:00' },
            { id: 'photo-rim-2', tripId: t1.id, activityId: 'act-rim-1-4', dataUrl: photoSvg('⛲', 30), takenAt: '2026-05-04T15:30:00' },
            { id: 'photo-rim-3', tripId: t1.id, activityId: 'act-rim-1-5', dataUrl: photoSvg('🏛️', 50), takenAt: '2026-05-04T17:00:00' },
            { id: 'photo-rim-4', tripId: t1.id, activityId: 'act-rim-2-1', dataUrl: photoSvg('🏛️', 20), takenAt: '2026-05-05T11:00:00' },
            { id: 'photo-rim-5', tripId: t1.id, activityId: 'act-rim-2-1', dataUrl: photoSvg('🏟️', 25), takenAt: '2026-05-05T12:00:00' },
            { id: 'photo-rim-6', tripId: t1.id, activityId: 'act-rim-2-3', dataUrl: photoSvg('🍕', 15), takenAt: '2026-05-05T16:00:00' },
            { id: 'photo-rim-7', tripId: t1.id, activityId: 'act-rim-2-4', dataUrl: photoSvg('⛪', 220), takenAt: '2026-05-05T18:00:00' },
            { id: 'photo-rim-8', tripId: t1.id, activityId: 'act-rim-3-1', dataUrl: photoSvg('🖼️', 280), takenAt: '2026-05-06T11:30:00' },
        );

        // ============ Trip 2: Vysoké Tatry (planned) ============
        const t2 = { id: 'trip-tatry', name: 'Vysoké Tatry', destination: '🇸🇰 Slovensko',
            startDate: '2026-06-12', endDate: '2026-06-14', daysCount: 3, status: 'planned',
            createdAt: '2026-04-20T12:00:00Z' };
        trips.push(t2);

        const tatryDays = [
            { idx: 1, date: '2026-06-12', emoji: '⛅', temp: 18, summary: 'oblačno' },
            { idx: 2, date: '2026-06-13', emoji: '☀️', temp: 22, summary: 'slnečno' },
            { idx: 3, date: '2026-06-14', emoji: '🌦️', temp: 16, summary: 'prehánky' },
        ];
        tatryDays.forEach(d => {
            days.push({ id: `day-tatry-${d.idx}`, tripId: t2.id, dayIndex: d.idx,
                date: d.date, weatherTemp: d.temp, weatherSummary: d.summary, weatherEmoji: d.emoji });
        });

        const tatry1 = [
            { type: 'auto', emoji: '🚗', cat: 'doprava', t: '08:00', t2: '11:30', title: 'Cesta autom do Starého Smokovca', desc: '', done: false, rating: null },
            { type: 'hotel', emoji: '🏨', cat: 'ubytovanie', t: '12:00', t2: '12:30', title: 'Check-in Grandhotel', desc: '', done: false, rating: null },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '13:00', t2: '14:00', title: 'Obed — Koliba', desc: 'Halušky', done: false, rating: null },
            { type: 'turistika', emoji: '🥾', cat: 'sport', t: '15:00', t2: '18:00', title: 'Hrebienok — Slavkovský štít vyhliadka', desc: '', done: false, rating: null },
        ];
        const tatry2 = [
            { type: 'turistika', emoji: '🥾', cat: 'sport', t: '07:00', t2: '17:00', title: 'Rysy — celodenná túra', desc: 'Náročné, vziať vodu a snack', done: false, rating: null },
            { type: 'restauracia', emoji: '🍷', cat: 'jedlo', t: '19:00', t2: '21:00', title: 'Večera v hoteli', desc: '', done: false, rating: null },
        ];
        const tatry3 = [
            { type: 'spa', emoji: '🧖', cat: 'oddych', t: '09:00', t2: '11:00', title: 'AquaCity Poprad', desc: 'Sauna + bazény', done: false, rating: null },
            { type: 'auto', emoji: '🚗', cat: 'doprava', t: '14:00', t2: '17:30', title: 'Cesta domov', desc: '', done: false, rating: null },
        ];

        [tatry1, tatry2, tatry3].forEach((acts, i) => {
            const dayId = `day-tatry-${i + 1}`;
            acts.forEach((a, j) => {
                activities.push({
                    id: `act-tatry-${i + 1}-${j}`, dayId, category: a.cat, type: a.type, typeEmoji: a.emoji,
                    startTime: a.t, endTime: a.t2, title: a.title, description: a.desc,
                    isCompleted: a.done, rating: a.rating, orderIndex: j,
                });
            });
        });

        // ============ Trip 3: Praha víkend (completed) ============
        const t3 = { id: 'trip-praha', name: 'Praha víkend', destination: '🇨🇿 Česko',
            startDate: '2026-04-10', endDate: '2026-04-12', daysCount: 3, status: 'completed',
            createdAt: '2026-03-01T08:00:00Z' };
        trips.push(t3);

        const prahaDays = [
            { idx: 1, date: '2026-04-10', emoji: '🌤️', temp: 14, summary: 'polooblačno' },
            { idx: 2, date: '2026-04-11', emoji: '☀️', temp: 17, summary: 'slnečno' },
            { idx: 3, date: '2026-04-12', emoji: '🌧️', temp: 11, summary: 'dážď' },
        ];
        prahaDays.forEach(d => {
            days.push({ id: `day-praha-${d.idx}`, tripId: t3.id, dayIndex: d.idx,
                date: d.date, weatherTemp: d.temp, weatherSummary: d.summary, weatherEmoji: d.emoji });
        });

        const praha1 = [
            { type: 'vlak', emoji: '🚂', cat: 'doprava', t: '08:00', t2: '12:30', title: 'Vlak Bratislava → Praha', desc: 'EuroCity', done: true, rating: 'good' },
            { type: 'airbnb', emoji: '🏠', cat: 'ubytovanie', t: '13:00', t2: '13:30', title: 'Check-in Airbnb', desc: 'Vinohrady', done: true, rating: 'good' },
            { type: 'pamiatka', emoji: '🕰️', cat: 'kultura', t: '15:00', t2: '17:00', title: 'Staromestské námestie + Orloj', desc: '', done: true, rating: 'good' },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '18:30', t2: '20:30', title: 'Večera U Fleků', desc: 'Pivovar', done: true, rating: 'ok' },
        ];
        const praha2 = [
            { type: 'pamiatka', emoji: '🏰', cat: 'kultura', t: '10:00', t2: '13:00', title: 'Pražský hrad', desc: '', done: true, rating: 'good' },
            { type: 'restauracia', emoji: '🍽️', cat: 'jedlo', t: '13:30', t2: '14:30', title: 'Obed v Malej Strane', desc: '', done: true, rating: 'good' },
            { type: 'pamiatka', emoji: '🌉', cat: 'kultura', t: '15:00', t2: '16:00', title: 'Karlov most', desc: '', done: true, rating: 'good' },
            { type: 'kaviaren', emoji: '☕', cat: 'jedlo', t: '17:00', t2: '18:00', title: 'Káva v Café Louvre', desc: '', done: true, rating: 'good' },
        ];
        const praha3 = [
            { type: 'muzeum', emoji: '🖼️', cat: 'kultura', t: '10:00', t2: '12:00', title: 'Národné múzeum', desc: '', done: true, rating: 'ok' },
            { type: 'vlak', emoji: '🚂', cat: 'doprava', t: '14:00', t2: '18:30', title: 'Vlak späť', desc: '', done: true, rating: 'ok' },
        ];

        [praha1, praha2, praha3].forEach((acts, i) => {
            const dayId = `day-praha-${i + 1}`;
            acts.forEach((a, j) => {
                activities.push({
                    id: `act-praha-${i + 1}-${j}`, dayId, category: a.cat, type: a.type, typeEmoji: a.emoji,
                    startTime: a.t, endTime: a.t2, title: a.title, description: a.desc,
                    isCompleted: a.done, rating: a.rating, orderIndex: j,
                });
            });
        });

        photos.push(
            { id: 'photo-praha-1', tripId: t3.id, activityId: 'act-praha-1-2', dataUrl: photoSvg('🕰️', 35), takenAt: '2026-04-10T15:30:00' },
            { id: 'photo-praha-2', tripId: t3.id, activityId: 'act-praha-2-0', dataUrl: photoSvg('🏰', 260), takenAt: '2026-04-11T11:00:00' },
            { id: 'photo-praha-3', tripId: t3.id, activityId: 'act-praha-2-2', dataUrl: photoSvg('🌉', 200), takenAt: '2026-04-11T15:30:00' },
            { id: 'photo-praha-4', tripId: t3.id, activityId: 'act-praha-2-3', dataUrl: photoSvg('☕', 30), takenAt: '2026-04-11T17:30:00' },
        );

        Storage.trips.replaceAll(trips);
        Storage.days.replaceAll(days);
        Storage.activities.replaceAll(activities);
        Storage.photos.replaceAll(photos);
        Storage.markSeeded();
    };

    return { seed, photoSvg };
})();

if (!Storage.isSeeded()) {
    MockData.seed();
}
