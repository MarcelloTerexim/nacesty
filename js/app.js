/* App — UI logika, rendering, event handling (fáza 1, vanilla JS) */

const CATEGORIES = {
    doprava: { emoji: '🚗', label: 'Doprava', types: [
        { id: 'lietadlo', emoji: '✈️', label: 'Lietadlo' },
        { id: 'bus', emoji: '🚌', label: 'Bus' },
        { id: 'vlak', emoji: '🚂', label: 'Vlak' },
        { id: 'auto', emoji: '🚗', label: 'Auto' },
        { id: 'mhd', emoji: '🚊', label: 'MHD' },
        { id: 'pesi', emoji: '🚶', label: 'Pešo' },
        { id: 'lod', emoji: '🛳️', label: 'Loď' },
        { id: 'metro', emoji: '🚇', label: 'Metro/Subway' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    jedlo: { emoji: '🍽️', label: 'Jedlo', types: [
        { id: 'restauracia', emoji: '🍽️', label: 'Reštaurácia' },
        { id: 'obed', emoji: '🍲', label: 'Obed' },
        { id: 'vecera', emoji: '🍷', label: 'Večera' },
        { id: 'snack', emoji: '🍿', label: 'Snack' },
        { id: 'drink', emoji: '☕', label: 'Drink' },
        { id: 'potraviny', emoji: '🛒', label: 'Potraviny' },
        { id: 'home-made', emoji: '🍳', label: 'Domáce' },
        { id: 'kaviaren', emoji: '☕', label: 'Kaviareň' },
        { id: 'fastfood', emoji: '🍕', label: 'Fast food' },
        { id: 'bar', emoji: '🍷', label: 'Bar' },
        { id: 'ranajky', emoji: '🥐', label: 'Raňajky' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    kultura: { emoji: '🏛️', label: 'Kultúra', types: [
        { id: 'pamiatka', emoji: '🏛️', label: 'Pamiatka' },
        { id: 'muzeum', emoji: '🖼️', label: 'Múzeum' },
        { id: 'divadlo', emoji: '🎭', label: 'Divadlo' },
        { id: 'koncert', emoji: '🎵', label: 'Koncert' },
        { id: 'kostol', emoji: '⛪', label: 'Kostol' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    oddych: { emoji: '🏖️', label: 'Oddych', types: [
        { id: 'plaz', emoji: '🏖️', label: 'Pláž' },
        { id: 'park', emoji: '🌳', label: 'Park' },
        { id: 'spa', emoji: '🧖', label: 'Spa' },
        { id: 'vyhlad', emoji: '🌅', label: 'Výhľad' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    sport: { emoji: '🏃', label: 'Šport', types: [
        { id: 'turistika', emoji: '🥾', label: 'Turistika' },
        { id: 'bicykel', emoji: '🚴', label: 'Bicykel' },
        { id: 'plavanie', emoji: '🏊', label: 'Plávanie' },
        { id: 'lyzovanie', emoji: '🎿', label: 'Lyžovanie' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    nakupy: { emoji: '🛍️', label: 'Nákupy', types: [
        { id: 'obchody', emoji: '🛍️', label: 'Obchody' },
        { id: 'trhy', emoji: '🏪', label: 'Trhy' },
        { id: 'suveniry', emoji: '🎁', label: 'Suveníry' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
    ubytovanie: { emoji: '🛏️', label: 'Ubytovanie', types: [
        { id: 'hotel', emoji: '🏨', label: 'Hotel' },
        { id: 'airbnb', emoji: '🏠', label: 'Airbnb' },
        { id: 'hostel', emoji: '🛏️', label: 'Hostel' },
        { id: 'kemp', emoji: '🏕️', label: 'Kemp' },
        { id: 'ine', emoji: '✏️', label: 'Iné' },
    ] },
};

const STATUS_LABEL = { planned: 'Naplánované', live: 'Prebieha', completed: 'Dokončené' };
const RATING_EMOJI = { bad: '😞', ok: '😐', good: '😊' };
const WEEKDAYS = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmtDate = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return `${WEEKDAYS[d.getDay()]} ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
};
const fmtDateRange = (from, to) => {
    const a = new Date(from + 'T00:00:00');
    const b = new Date(to + 'T00:00:00');
    const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    if (sameMonth) return `${a.getDate()}.–${b.getDate()}. ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
    return `${a.getDate()}. ${MONTHS[a.getMonth()]} – ${b.getDate()}. ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
};

const getQuery = (key) => new URLSearchParams(window.location.search).get(key);

const computeStatus = (trip) => {
    const today = new Date().toISOString().slice(0, 10);
    if (today < trip.startDate) return 'planned';
    if (today > trip.endDate) return 'completed';
    return 'live';
};

const computeDefaultStartTime = (dayId) => {
    const activities = Storage.activities
        .filter(a => a.dayId === dayId)
        .sort((a, b) => (a.endTime || a.startTime).localeCompare(b.endTime || b.startTime));

    if (activities.length === 0) return '09:00';

    const lastActivity = activities[activities.length - 1];
    const endTime = lastActivity.endTime || lastActivity.startTime;
    const [h, m] = endTime.split(':').map(Number);

    let newMin = m + 30;
    let newHour = h;
    if (newMin >= 60) {
        newHour = (newHour + 1) % 24;
        newMin -= 60;
    }

    return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
};

const loadCustomTypes = () => {
    const stored = localStorage.getItem('nacesty.customTypes');
    return stored ? JSON.parse(stored) : {};
};

const saveCustomType = (category, name) => {
    const custom = loadCustomTypes();
    if (!custom[category]) custom[category] = [];
    if (!custom[category].includes(name)) {
        custom[category].push(name);
        localStorage.setItem('nacesty.customTypes', JSON.stringify(custom));
    }
};

const tripStats = (tripId) => {
    const days = Storage.days.filter(d => d.tripId === tripId);
    const dayIds = new Set(days.map(d => d.id));
    const acts = Storage.activities.filter(a => dayIds.has(a.dayId));
    const photos = Storage.photos.filter(p => p.tripId === tripId);
    const done = acts.filter(a => a.isCompleted).length;
    return { days: days.length, activities: acts.length, photos: photos.length, doneActivities: done };
};

/* ---------- Modal ---------- */
const Modal = {
    open(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const focusTarget = m.querySelector('[autofocus], input, button');
        if (focusTarget) setTimeout(() => focusTarget.focus(), 50);
    },
    close(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },
};

document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) { Modal.open(opener.dataset.modalOpen); return; }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) {
        const m = closer.closest('.modal');
        if (m) Modal.close(m.id);
        return;
    }
    if (e.target.classList.contains('modal')) Modal.close(e.target.id);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const open = document.querySelector('.modal[aria-hidden="false"]');
        if (open) Modal.close(open.id);
    }
});

/* ---------- Rozpočet a Album renderery ---------- */

function renderBudgetView(tripId, dayId) {
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!trip) return '<div class="empty">Chyba: Výlet sa nenašiel</div>';

    // Ak dayId je null, zobraziť rozpočet všetkých dní (trip view)
    // Ak dayId je špecifický, zobraziť rozpočet len pre daný deň (day view)
    const day = dayId ? Storage.days.find(d => d.id === dayId) : null;

    const days = Storage.days.filter(d => d.tripId === tripId).sort((a, b) => a.dayIndex - b.dayIndex);
    const allActs = Storage.activities.filter(a => {
        const d = Storage.days.find(dd => dd.id === a.dayId);
        return d && d.tripId === tripId;
    });

    let html = '<div class="budget-view">';

    // Rozpočet po dňoch
    days.forEach(d => {
        const acts = Storage.activities.filter(a => a.dayId === d.id);
        const budgetByCategory = {};
        let dayTotal = 0;

        acts.forEach(a => {
            if (a.amount) {
                const cat = CATEGORIES[a.category]?.label || 'Iné';
                budgetByCategory[cat] = (budgetByCategory[cat] || 0) + a.amount;
                dayTotal += a.amount;
            }
        });

        if (Object.keys(budgetByCategory).length > 0) {
            html += `<div class="budget-daily">
                <div class="budget-day-header">Deň ${d.dayIndex} · ${fmtDate(d.date)}</div>
                <table class="budget-table">
                    <thead><tr><th>Kategória</th><th class="budget-amount">Suma</th></tr></thead>
                    <tbody>
                        ${Object.entries(budgetByCategory).map(([cat, sum]) => `
                            <tr><td>${escapeHtml(cat)}</td><td class="budget-amount">€ ${sum.toFixed(2)}</td></tr>
                        `).join('')}
                        <tr class="budget-total"><td><strong>Spolu Deň ${d.dayIndex}</strong></td><td class="budget-amount">€ ${dayTotal.toFixed(2)}</td></tr>
                    </tbody>
                </table>
            </div>`;
        }
    });

    // Celkový rozpočet podľa kategórií
    const budgetByCategory = {};
    let tripTotal = 0;
    allActs.forEach(a => {
        if (a.amount) {
            const cat = CATEGORIES[a.category]?.label || 'Iné';
            budgetByCategory[cat] = (budgetByCategory[cat] || 0) + a.amount;
            tripTotal += a.amount;
        }
    });

    if (Object.keys(budgetByCategory).length > 0) {
        html += `<div class="budget-summary">
            <div class="budget-summary-title">Rozpočet celkovo</div>
            <table class="budget-table">
                <thead><tr><th>Kategória</th><th class="budget-amount">Suma</th></tr></thead>
                <tbody>
                    ${Object.entries(budgetByCategory).map(([cat, sum]) => `
                        <tr><td>${escapeHtml(cat)}</td><td class="budget-amount">€ ${sum.toFixed(2)}</td></tr>
                    `).join('')}
                    <tr class="budget-total"><td><strong>CELKOM</strong></td><td class="budget-amount"><strong>€ ${tripTotal.toFixed(2)}</strong></td></tr>
                </tbody>
            </table>
        </div>`;
    }

    html += '</div>';
    return html;
}

function renderAlbumView(tripId) {
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!trip) return '<div class="empty">Chyba: Výlet sa nenašiel</div>';

    const days = Storage.days.filter(d => d.tripId === tripId).sort((a, b) => a.dayIndex - b.dayIndex);
    let html = '<div class="album-view">';

    days.forEach(d => {
        const photos = Storage.photos.filter(p => {
            const act = Storage.activities.find(a => a.id === p.activityId);
            return act && act.dayId === d.id;
        });

        if (photos.length > 0) {
            html += `<div class="album-day">
                <div class="album-day-title">Deň ${d.dayIndex} · ${fmtDate(d.date)}</div>
                <div class="album-grid">
                    ${photos.map(p => `
                        <div class="album-photo-item">
                            <img src="${p.dataUrl}" alt="Fotka" class="album-photo-img">
                            <button class="album-photo-delete" data-act="delete-photo" data-photo-id="${p.id}" aria-label="Odstrániť fotku">×</button>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }
    });

    const allPhotos = Storage.photos.filter(p => {
        const act = Storage.activities.find(a => a.id === p.activityId);
        return act && days.some(d => d.id === act.dayId);
    });

    if (allPhotos.length === 0) {
        html += '<div class="album-empty"><div class="empty__emoji">📷</div><p>Zatiaľ žiadne fotky</p></div>';
    }

    html += '</div>';
    return html;
}

/* ---------- Renderers ---------- */

function renderHome() {
    const list = $('#trips-list');
    const empty = $('#trips-empty');
    if (!list) return;

    const filter = $('.tabs__item--active')?.dataset.filter || 'active';
    const all = Storage.trips.all().map(t => ({ ...t, status: computeStatus(t) }));
    const trips = all.filter(t =>
        filter === 'active' ? t.status !== 'completed' : t.status === 'completed'
    );

    if (trips.length === 0) {
        list.innerHTML = '';
        empty.hidden = false;
        empty.querySelector('.empty__title').textContent =
            filter === 'active' ? 'Žiadne aktívne výlety' : 'Archív je prázdny';
        empty.querySelector('.empty__text').textContent =
            filter === 'active' ? 'Vytvor si prvý výlet a začni plánovať.' : 'Tu sa zobrazia ukončené výlety.';
        return;
    }
    empty.hidden = true;

    list.innerHTML = trips.map(t => {
        const s = tripStats(t.id);
        return `
            <div class="trip-card-wrapper">
                <a href="trip.html?id=${encodeURIComponent(t.id)}" class="trip-card">
                    <div class="trip-card__head">
                        <div>
                            <div class="trip-card__name">${escapeHtml(t.name)}</div>
                            ${t.destination ? `<div class="trip-card__destination">${escapeHtml(t.destination)}</div>` : ''}
                        </div>
                        <div class="trip-card__head-actions">
                            <span class="badge badge--${t.status}">${STATUS_LABEL[t.status]}</span>
                        </div>
                    </div>
                    <div class="trip-card__dates">📅 ${fmtDateRange(t.startDate, t.endDate)} · ${t.daysCount} ${t.daysCount === 1 ? 'deň' : (t.daysCount < 5 ? 'dni' : 'dní')}</div>
                    <div class="trip-card__stats">
                        <span class="trip-card__stat">📍 ${s.activities} ${s.activities === 1 ? 'aktivita' : (s.activities < 5 ? 'aktivity' : 'aktivít')}</span>
                        <span class="trip-card__stat">📷 ${s.photos}</span>
                        ${t.status === 'live' ? `<span class="trip-card__stat">✓ ${s.doneActivities}/${s.activities}</span>` : ''}
                    </div>
                </a>
                <button class="trip-card__archive-btn" data-trip-id="${t.id}" aria-label="Archivovať" title="${t.status === 'completed' ? 'Vrátiť z archívu' : 'Presunúť do archívu'}">
                    ${t.status === 'completed' ? '📁' : '📌'}
                </button>
            </div>
        `;
    }).join('');
}

function renderTrip() {
    const tripId = getQuery('id');
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!trip) {
        $('#trip-detail').innerHTML = `<div class="empty"><div class="empty__emoji">🗺️</div><h2 class="empty__title">Výlet sa nenašiel</h2><a href="index.html" class="empty__cta">Späť na zoznam</a></div>`;
        return;
    }
    trip.status = computeStatus(trip);
    document.title = `${trip.name} · Na cesty`;

    $('#nav-title').textContent = trip.name;
    $('#nav-subtitle').textContent = trip.destination;

    // Aktualizovať hero sekciu s trip infom
    $('#hero-title').textContent = trip.name;
    $('#hero-destination').textContent = trip.destination;

    const s = tripStats(trip.id);
    const progress = s.activities ? Math.round((s.doneActivities / s.activities) * 100) : 0;

    $('#hero-info').innerHTML = `
        <span>📅 ${fmtDateRange(trip.startDate, trip.endDate)}</span>
        <span class="hero__badge badge badge--${trip.status}">${STATUS_LABEL[trip.status]}</span>
        <span>✓ ${s.doneActivities}/${s.activities} (${progress}%)</span>
    `;

    // Generovať tri pohľady (timeline, rozpočet, album)
    const days = Storage.days.filter(d => d.tripId === trip.id).sort((a, b) => a.dayIndex - b.dayIndex);

    const daysHtml = days.map(d => {
        const acts = Storage.activities
            .filter(a => a.dayId === d.id)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const done = acts.filter(a => a.isCompleted).length;
        return `
            <a href="day.html?trip=${encodeURIComponent(trip.id)}&day=${encodeURIComponent(d.id)}" class="day-card">
                <div class="day-card__head">
                    <div class="day-card__title-row">
                        <span class="day-card__title">Deň ${d.dayIndex}</span>
                        <span class="day-card__date">${fmtDate(d.date)}</span>
                    </div>
                    <div class="day-card__weather">
                        <span class="day-card__weather-emoji">${d.weatherEmoji}</span>
                        <span>${d.weatherTemp}°C</span>
                    </div>
                </div>
                ${acts.length ? `
                    <ul class="mini-acts">
                        ${acts.map(a => `
                            <li class="mini-act ${a.isCompleted ? 'mini-act--done' : ''}" data-activity-id="${a.id}">
                                <button type="button" class="activity__check" data-act="toggle" aria-label="${a.isCompleted ? 'Odznačiť ako hotové' : 'Označiť ako hotové'}">${a.isCompleted ? '✓' : ''}</button>
                                <span class="mini-act__title">${escapeHtml(a.title)}</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
                <div class="day-card__stats">
                    <span>${acts.length} ${acts.length === 1 ? 'aktivita' : (acts.length < 5 ? 'aktivity' : 'aktivít')}</span>
                    <span>✓ ${done}/${acts.length}</span>
                </div>
            </a>
        `;
    }).join('');

    const timelineHtml = `<div class="timeline-view active"><div class="list" id="days-list">${daysHtml}</div></div>`;
    $('#trip-detail').innerHTML = timelineHtml + renderBudgetView(trip.id, null) + renderAlbumView(trip.id);
}

function renderDay() {
    const tripId = getQuery('trip');
    const dayId = getQuery('day');
    const day = Storage.days.find(d => d.id === dayId);
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!day || !trip) {
        $('#day-detail').innerHTML = `<div class="empty"><div class="empty__emoji">📅</div><h2 class="empty__title">Deň sa nenašiel</h2><a href="index.html" class="empty__cta">Domov</a></div>`;
        return;
    }
    document.title = `Deň ${day.dayIndex} · ${trip.name} · Na cesty`;

    $('#nav-title').textContent = `Deň ${day.dayIndex}`;
    $('#nav-subtitle').textContent = `${fmtDate(day.date)} · ${day.weatherEmoji} ${day.weatherTemp}°C ${day.weatherSummary}`;
    $('#nav-back-link').href = `trip.html?id=${encodeURIComponent(tripId)}`;

    // Aktualizovať hero sekciu s trip infom
    $('#hero-title').textContent = trip.name;
    $('#hero-destination').textContent = trip.destination;

    const s = tripStats(trip.id);
    const progress = s.activities ? Math.round((s.doneActivities / s.activities) * 100) : 0;
    const tripStatus = computeStatus(trip);

    $('#hero-info').innerHTML = `
        <span>📅 ${fmtDateRange(trip.startDate, trip.endDate)}</span>
        <span class="hero__badge badge badge--${tripStatus}">${STATUS_LABEL[tripStatus]}</span>
        <span>✓ ${s.doneActivities}/${s.activities} (${progress}%)</span>
    `;

    const acts = Storage.activities
        .filter(a => a.dayId === day.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const container = $('#day-detail');

    // Generovať zoznam dní v horizontálnom páse
    const days = Storage.days
        .filter(d => d.tripId === trip.id)
        .sort((a, b) => a.dayIndex - b.dayIndex);

    const daysList = days.map(d => {
        const isActive = d.id === day.id;
        const daysActs = Storage.activities
            .filter(a => a.dayId === d.id)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const done = daysActs.filter(a => a.isCompleted).length;
        return `
            <a href="day.html?trip=${encodeURIComponent(trip.id)}&day=${encodeURIComponent(d.id)}" class="day-card ${isActive ? 'day-card--active' : ''}">
                <div class="day-card__title-row">
                    <span class="day-card__title">Deň ${d.dayIndex}</span>
                </div>
                <div class="day-card__date">${fmtDate(d.date)}</div>
                ${daysActs.length ? `<div class="day-card__stats">✓ ${done}/${daysActs.length}</div>` : ''}
            </a>
        `;
    }).join('');

    const timelineHtml = acts.length === 0
        ? `<div class="empty">
            <div class="empty__emoji">✨</div>
            <h2 class="empty__title">Zatiaľ žiadne aktivity</h2>
            <p class="empty__text">Pridaj prvú aktivitu pre tento deň.</p>
            <button class="empty__cta" data-modal-open="modal-add-activity">+ Pridať aktivitu</button>
        </div>`
        : `<div id="timeline-container">
            <div class="timeline-visual">
                ${acts.map((a, i) => `
                    <div class="timeline-icon" style="top: ${(i * 100) / acts.length}%;">
                        ${a.typeEmoji}
                    </div>
                `).join('')}
            </div>
            <div class="timeline-items">
                ${acts.map(a => renderActivity(a)).join('')}
            </div>
        </div>`;

    container.innerHTML = `
        <div class="days-list">${daysList}</div>
        <div class="timeline-wrapper">
            <div class="timeline-view active">${timelineHtml}</div>
            ${renderBudgetView(tripId, dayId)}
            ${renderAlbumView(tripId)}
        </div>
    `;
}

function renderActivity(a) {
    const photos = Storage.photos.filter(p => p.activityId === a.id);
    const endTime = a.endTime || a.startTime;
    const timeRange = `${a.startTime} - ${endTime}`;
    return `
        <div class="activity ${a.isCompleted ? 'activity--done' : ''}" data-activity-id="${a.id}">
            <button class="activity__check" data-act="toggle" aria-label="${a.isCompleted ? 'Odznačiť ako hotové' : 'Označiť ako hotové'}">${a.isCompleted ? '✓' : ''}</button>
            <div class="activity__time-row">
                <div class="activity__time">${timeRange}</div>
                <div class="activity__actions">
                    <button class="activity__action-btn" data-act="edit" aria-label="Upraviť aktivitu" title="Upraviť">✏️</button>
                    <button class="activity__action-btn activity__action-btn--delete" data-act="delete" aria-label="Zmazať aktivitu" title="Zmazať">🗑️</button>
                </div>
            </div>
            <div class="activity__body">
                <div class="activity__head">
                    <span class="activity__icon">${a.typeEmoji}</span>
                    <span class="activity__title">${escapeHtml(a.title)}</span>
                </div>
                ${a.description ? `<div class="activity__desc">${escapeHtml(a.description)}</div>` : ''}
                ${a.amount ? `<div class="activity__amount">€ ${a.amount.toFixed(2)}</div>` : ''}
                ${a.location ? `<div class="activity__location">📍 ${escapeHtml(a.location)}</div>` : ''}
                ${a.isCompleted ? `
                    <div class="activity__rating">
                        ${['bad', 'ok', 'good'].map(r => `
                            <button class="rating-btn ${a.rating === r ? 'rating-btn--active' : ''}" data-act="rate" data-rating="${r}" aria-label="${r}">${RATING_EMOJI[r]}</button>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="activity__photos">
                    ${photos.map(p => `
                        <a href="${p.dataUrl}" target="_blank" class="photo-thumb">
                            <img src="${p.dataUrl}" alt="">
                        </a>
                    `).join('')}
                    <button class="photo-thumb photo-thumb--add" data-act="add-photo" aria-label="Pridať fotku">+</button>
                </div>
            </div>
        </div>
    `;
}

/* ---------- Event delegation: aktivity (timeline aj mini list) ---------- */
function rerenderCurrent() {
    const page = document.body.dataset.page;
    if (page === 'home') renderHome();
    else if (page === 'trip') renderTrip();
    else if (page === 'day') renderDay();
}

document.addEventListener('click', (e) => {
    const actBtn = e.target.closest('[data-act]');
    if (!actBtn) return;
    const wrap = actBtn.closest('[data-activity-id]');
    if (!wrap) return;

    e.preventDefault();
    e.stopPropagation();

    const actId = wrap.dataset.activityId;
    const action = actBtn.dataset.act;

    if (action === 'toggle') {
        const a = Storage.activities.find(x => x.id === actId);
        Storage.activities.update(actId, { isCompleted: !a.isCompleted, rating: !a.isCompleted ? a.rating : null });
        rerenderCurrent();
    } else if (action === 'rate') {
        const rating = actBtn.dataset.rating;
        const a = Storage.activities.find(x => x.id === actId);
        Storage.activities.update(actId, { rating: a.rating === rating ? null : rating });
        rerenderCurrent();
    } else if (action === 'add-photo') {
        triggerPhotoUpload(actId);
    } else if (action === 'delete') {
        if (confirm('Odstrániť aktivitu?')) {
            Storage.activities.remove(actId);
            rerenderCurrent();
        }
    } else if (action === 'edit') {
        // TODO: Implementovať úpravu aktivity v budúcnosti
        alert('Úprava aktivít bude dostupná v ďalšej verzii');
    }
});

/* ---------- Delete photo (Album) ---------- */
document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-act="delete-photo"]');
    if (!deleteBtn) return;

    const photoId = deleteBtn.dataset.photoId;
    if (confirm('Odstrániť fotku?')) {
        Storage.photos.remove(photoId);
        rerenderCurrent();
    }
});

/* ---------- Archive trip (home page button + trip detail checkbox) ---------- */
// Home page: archive button
document.addEventListener('click', (e) => {
    const archiveBtn = e.target.closest('.trip-card__archive-btn');
    if (!archiveBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const tripId = archiveBtn.dataset.tripId;
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!trip) return;

    const newStatus = trip.status === 'completed' ? 'planned' : 'completed';
    Storage.trips.update(tripId, { status: newStatus });
    renderHome();
});

// Trip detail: archive checkbox (if exists)
document.addEventListener('change', (e) => {
    if (e.target.id !== 'archive-trip') return;

    e.preventDefault();
    e.stopPropagation();

    const archiveCheckbox = e.target;
    const tripId = archiveCheckbox.dataset.tripId;
    const trip = Storage.trips.find(t => t.id === tripId);
    if (!trip) return;

    const newStatus = archiveCheckbox.checked ? 'completed' : 'planned';
    Storage.trips.update(tripId, { status: newStatus });
    window.location.href = 'index.html';
});

/* ---------- Photo upload ---------- */
function triggerPhotoUpload(activityId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
        const f = input.files[0];
        if (!f) return;
        if (f.size > 4 * 1024 * 1024) {
            alert('Fotka je príliš veľká (max 4 MB pre demo). Skús menšiu.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const act = Storage.activities.find(a => a.id === activityId);
                const day = Storage.days.find(d => d.id === act.dayId);
                Storage.photos.create({
                    tripId: day.tripId,
                    activityId,
                    dataUrl: reader.result,
                    takenAt: new Date().toISOString(),
                });
                rerenderCurrent();
            } catch (err) {
                alert('Nepodarilo sa uložiť fotku — pravdepodobne plný localStorage.');
            }
        };
        reader.readAsDataURL(f);
    };
    input.click();
}

/* ---------- Filter tabs (home) ---------- */
document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tabs__item');
    if (!tab) return;
    if (tab.disabled) return;

    const tabsContainer = tab.parentElement;
    const tabs = tabsContainer.querySelectorAll('.tabs__item');
    tabs.forEach(t => t.classList.toggle('tabs__item--active', t === tab));

    if (document.body.dataset.page === 'home') {
        renderHome();
    } else if (tabsContainer.classList.contains('tabs--view')) {
        const view = tab.dataset.view;
        const allViews = document.querySelectorAll('.timeline-view, .budget-view, .album-view');
        allViews.forEach(v => v.classList.remove('active'));
        const activeView = document.querySelector(`.${view}-view`);
        if (activeView) activeView.classList.add('active');
    }
});

/* ---------- Vytvorenie výletu ---------- */
function bindCreateTripForm() {
    const form = $('#form-new-trip');
    if (!form) return;

    const today = new Date().toISOString().slice(0, 10);
    form.querySelector('[name="startDate"]').value = today;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = fd.get('name').trim();
        const destination = fd.get('destination').trim();
        const startDate = fd.get('startDate');
        const daysCount = parseInt(fd.get('daysCount'), 10);

        if (!name || !startDate || !daysCount) return;

        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + daysCount - 1);
        const endDate = end.toISOString().slice(0, 10);

        const trip = Storage.trips.create({
            name, destination, startDate, endDate, daysCount,
            status: 'planned',
        });

        for (let i = 0; i < daysCount; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            Storage.days.create({
                tripId: trip.id,
                dayIndex: i + 1,
                date: d.toISOString().slice(0, 10),
                weatherTemp: null,
                weatherSummary: '',
                weatherEmoji: '⛅',
            });
        }

        Modal.close('modal-new-trip');
        form.reset();
        window.location.href = `trip.html?id=${encodeURIComponent(trip.id)}`;
    });
}

/* ---------- Wizard pridania aktivity ---------- */
const Wizard = {
    state: { step: 1, category: null, type: null, dayId: null },

    reset() {
        this.state = { step: 1, category: null, type: null, dayId: getQuery('day') };
        this.render();
    },

    render() {
        const m = $('#modal-add-activity');
        if (!m) return;
        const body = $('#wizard-body', m);
        const stepEls = $$('.wizard__step', m);
        stepEls.forEach((el, i) => el.classList.toggle('wizard__step--active', i < this.state.step));

        if (this.state.step === 1) {
            $('#wizard-title', m).textContent = 'Vyber kategóriu';
            body.innerHTML = `
                <div class="tile-grid">
                    ${Object.entries(CATEGORIES).map(([key, c]) => `
                        <button type="button" class="tile" data-wizard-cat="${key}">
                            <span class="tile__emoji">${c.emoji}</span>
                            <span class="tile__label">${c.label}</span>
                        </button>
                    `).join('')}
                </div>
            `;
        } else if (this.state.step === 2) {
            const cat = CATEGORIES[this.state.category];
            const customTypes = loadCustomTypes()[this.state.category] || [];
            $('#wizard-title', m).textContent = `${cat.emoji} ${cat.label} — typ`;
            body.innerHTML = `
                <div class="tile-grid">
                    ${cat.types.map(t => `
                        <button type="button" class="tile" data-wizard-type="${t.id}">
                            <span class="tile__emoji">${t.emoji}</span>
                            <span class="tile__label">${t.label}</span>
                        </button>
                    `).join('')}
                    ${customTypes.map(name => `
                        <button type="button" class="tile tile--custom" data-wizard-type="custom:${name}">
                            <span class="tile__emoji">✏️</span>
                            <span class="tile__label">${escapeHtml(name)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="btn-row">
                    <button type="button" class="btn btn--ghost" data-wizard-back>← Späť</button>
                </div>
            `;
        } else if (this.state.step === 3) {
            const cat = CATEGORIES[this.state.category];
            const type = cat.types.find(t => t.id === this.state.type);
            $('#wizard-title', m).textContent = `${type.emoji} ${type.label}`;
            body.innerHTML = `
                <form id="form-new-activity">
                    <div class="field">
                        <label class="field__label" for="act-title">Názov</label>
                        <input class="field__input" id="act-title" name="title" required autofocus placeholder="napr. Návšteva múzea">
                    </div>
                    <div class="field">
                        <div class="field__row">
                            <div>
                                <label class="field__label" for="act-start">Od</label>
                                <input class="field__input" id="act-start" type="time" name="startTime" required value="09:00">
                            </div>
                            <div>
                                <label class="field__label" for="act-end">Do</label>
                                <input class="field__input" id="act-end" type="time" name="endTime" value="10:00">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field__label" for="act-desc">Poznámka</label>
                        <textarea class="field__textarea" id="act-desc" name="description" placeholder="napr. vstupenka 15€, treba rezervovať"></textarea>
                    </div>
                    <div class="field">
                        <label class="field__label" for="act-amount">Suma (EUR)</label>
                        <input class="field__input" id="act-amount" type="number" name="amount" placeholder="0.00" min="0" max="9999.99" step="0.01">
                    </div>
                    <div class="field">
                        <label class="field__label" for="act-location">Umiestnenie</label>
                        <input class="field__input" id="act-location" name="location" placeholder="napr. Koloseum, Rím" maxlength="160">
                    </div>
                    <div class="btn-row">
                        <button type="button" class="btn btn--ghost" data-wizard-back>← Späť</button>
                        <button type="submit" class="btn btn--primary">Uložiť</button>
                    </div>
                </form>
            `;

            // Set default startTime + auto-set endTime when startTime changes
            const startInput = $('#act-start', body);
            const endInput = $('#act-end', body);
            if (startInput && endInput && this.state.dayId) {
                const defaultStart = computeDefaultStartTime(this.state.dayId);
                startInput.value = defaultStart;
                const [h, m] = defaultStart.split(':').map(Number);
                const endHour = (h + 1) % 24;
                endInput.value = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            }
            if (startInput && endInput) {
                startInput.addEventListener('change', () => {
                    if (startInput.value) {
                        const [h, m] = startInput.value.split(':').map(Number);
                        const endHour = (h + 1) % 24;
                        endInput.value = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                    }
                });
            }
        }
    },

    handle(e) {
        const cat = e.target.closest('[data-wizard-cat]');
        if (cat) { this.state.category = cat.dataset.wizardCat; this.state.step = 2; this.render(); return; }
        const type = e.target.closest('[data-wizard-type]');
        if (type) { this.state.type = type.dataset.wizardType; this.state.step = 3; this.render(); return; }
        const back = e.target.closest('[data-wizard-back]');
        if (back) { this.state.step = Math.max(1, this.state.step - 1); this.render(); return; }
    },
};

document.addEventListener('click', (e) => {
    if (e.target.closest('#modal-add-activity')) Wizard.handle(e);
    if (e.target.closest('[data-modal-open="modal-add-activity"]')) {
        setTimeout(() => Wizard.reset(), 60);
    }
});

document.addEventListener('submit', (e) => {
    if (e.target.id !== 'form-new-activity') return;
    e.preventDefault();
    const fd = new FormData(e.target);
    const dayId = getQuery('day');
    const cat = CATEGORIES[Wizard.state.category];
    const title = fd.get('title').trim();

    // Validate title for "ine" type
    if ((Wizard.state.type === 'ine' || Wizard.state.type.startsWith('custom:')) && !title) {
        alert('Prosím, napíš názov aktivity');
        return;
    }

    let type = cat.types.find(t => t.id === Wizard.state.type);
    let typeId = Wizard.state.type;

    // Handle "ine" type - save as custom
    if (Wizard.state.type === 'ine') {
        saveCustomType(Wizard.state.category, title);
        typeId = `custom:${title}`;
        type = { emoji: '✏️', label: title };
    } else if (Wizard.state.type.startsWith('custom:')) {
        // Handle saved custom type
        const customName = Wizard.state.type.substring(7);
        typeId = `custom:${customName}`;
        type = { emoji: '✏️', label: customName };
    }

    const amount = fd.get('amount') ? parseFloat(fd.get('amount')) : null;
    const location = (fd.get('location') || '').trim() || null;
    Storage.activities.create({
        dayId,
        category: Wizard.state.category,
        type: typeId,
        typeEmoji: type.emoji,
        startTime: fd.get('startTime'),
        endTime: fd.get('endTime') || null,
        title: title,
        description: (fd.get('description') || '').trim(),
        amount: amount,
        location: location,
        isCompleted: false,
        rating: null,
        orderIndex: Storage.activities.filter(a => a.dayId === dayId).length,
    });

    Modal.close('modal-add-activity');
    rerenderCurrent();
});

/* ---------- Init router ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'home') {
        renderHome();
        bindCreateTripForm();
    } else if (page === 'trip') {
        renderTrip();
    } else if (page === 'day') {
        renderDay();
    }
});
