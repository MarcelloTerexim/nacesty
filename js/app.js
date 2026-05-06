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
    ] },
    jedlo: { emoji: '🍽️', label: 'Jedlo', types: [
        { id: 'restauracia', emoji: '🍽️', label: 'Reštaurácia' },
        { id: 'kaviaren', emoji: '☕', label: 'Kaviareň' },
        { id: 'fastfood', emoji: '🍕', label: 'Fast food' },
        { id: 'bar', emoji: '🍷', label: 'Bar' },
        { id: 'ranajky', emoji: '🥐', label: 'Raňajky' },
    ] },
    kultura: { emoji: '🏛️', label: 'Kultúra', types: [
        { id: 'pamiatka', emoji: '🏛️', label: 'Pamiatka' },
        { id: 'muzeum', emoji: '🖼️', label: 'Múzeum' },
        { id: 'divadlo', emoji: '🎭', label: 'Divadlo' },
        { id: 'koncert', emoji: '🎵', label: 'Koncert' },
        { id: 'kostol', emoji: '⛪', label: 'Kostol' },
    ] },
    oddych: { emoji: '🏖️', label: 'Oddych', types: [
        { id: 'plaz', emoji: '🏖️', label: 'Pláž' },
        { id: 'park', emoji: '🌳', label: 'Park' },
        { id: 'spa', emoji: '🧖', label: 'Spa' },
        { id: 'vyhlad', emoji: '🌅', label: 'Výhľad' },
    ] },
    sport: { emoji: '🏃', label: 'Šport', types: [
        { id: 'turistika', emoji: '🥾', label: 'Turistika' },
        { id: 'bicykel', emoji: '🚴', label: 'Bicykel' },
        { id: 'plavanie', emoji: '🏊', label: 'Plávanie' },
        { id: 'lyzovanie', emoji: '🎿', label: 'Lyžovanie' },
    ] },
    nakupy: { emoji: '🛍️', label: 'Nákupy', types: [
        { id: 'obchody', emoji: '🛍️', label: 'Obchody' },
        { id: 'trhy', emoji: '🏪', label: 'Trhy' },
        { id: 'suveniry', emoji: '🎁', label: 'Suveníry' },
    ] },
    ubytovanie: { emoji: '🛏️', label: 'Ubytovanie', types: [
        { id: 'hotel', emoji: '🏨', label: 'Hotel' },
        { id: 'airbnb', emoji: '🏠', label: 'Airbnb' },
        { id: 'hostel', emoji: '🛏️', label: 'Hostel' },
        { id: 'kemp', emoji: '🏕️', label: 'Kemp' },
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
            <a href="trip.html?id=${encodeURIComponent(t.id)}" class="trip-card">
                <div class="trip-card__head">
                    <div>
                        <div class="trip-card__name">${escapeHtml(t.name)}</div>
                        ${t.destination ? `<div class="trip-card__destination">${escapeHtml(t.destination)}</div>` : ''}
                    </div>
                    <span class="badge badge--${t.status}">${STATUS_LABEL[t.status]}</span>
                </div>
                <div class="trip-card__dates">📅 ${fmtDateRange(t.startDate, t.endDate)} · ${t.daysCount} ${t.daysCount === 1 ? 'deň' : (t.daysCount < 5 ? 'dni' : 'dní')}</div>
                <div class="trip-card__stats">
                    <span class="trip-card__stat">📍 ${s.activities} ${s.activities === 1 ? 'aktivita' : (s.activities < 5 ? 'aktivity' : 'aktivít')}</span>
                    <span class="trip-card__stat">📷 ${s.photos}</span>
                    ${t.status === 'live' ? `<span class="trip-card__stat">✓ ${s.doneActivities}/${s.activities}</span>` : ''}
                </div>
            </a>
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

    const s = tripStats(trip.id);
    const progress = s.activities ? Math.round((s.doneActivities / s.activities) * 100) : 0;

    $('#trip-detail').innerHTML = `
        <section class="trip-hero">
            <h1 class="trip-hero__name">${escapeHtml(trip.name)}</h1>
            <div class="trip-hero__meta">
                <span>📍 ${escapeHtml(trip.destination)}</span>
                <span>📅 ${fmtDateRange(trip.startDate, trip.endDate)}</span>
                <span class="badge badge--${trip.status}">${STATUS_LABEL[trip.status]}</span>
            </div>
            <div class="trip-hero__progress" aria-label="Postup výletu">
                <div class="trip-hero__progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="trip-hero__progress-label">${s.doneActivities}/${s.activities} hotových aktivít · ${progress}%</div>
        </section>

        <div class="list" id="days-list"></div>
    `;

    const days = Storage.days
        .filter(d => d.tripId === trip.id)
        .sort((a, b) => a.dayIndex - b.dayIndex);

    $('#days-list').innerHTML = days.map(d => {
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

    const acts = Storage.activities
        .filter(a => a.dayId === day.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const container = $('#day-detail');
    if (acts.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <div class="empty__emoji">✨</div>
                <h2 class="empty__title">Zatiaľ žiadne aktivity</h2>
                <p class="empty__text">Pridaj prvú aktivitu pre tento deň.</p>
                <button class="empty__cta" data-modal-open="modal-add-activity">+ Pridať aktivitu</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `<div class="timeline" id="timeline"></div>`;
    const tl = $('#timeline');
    tl.innerHTML = acts.map(a => renderActivity(a)).join('');
}

function renderActivity(a) {
    const photos = Storage.photos.filter(p => p.activityId === a.id);
    return `
        <div class="activity ${a.isCompleted ? 'activity--done' : ''}" data-activity-id="${a.id}">
            <button class="activity__check" data-act="toggle" aria-label="${a.isCompleted ? 'Odznačiť ako hotové' : 'Označiť ako hotové'}">${a.isCompleted ? '✓' : ''}</button>
            <div class="activity__time">${a.startTime}</div>
            <div class="activity__body">
                <div class="activity__head">
                    <span class="activity__icon">${a.typeEmoji}</span>
                    <span class="activity__title">${escapeHtml(a.title)}</span>
                </div>
                ${a.description ? `<div class="activity__desc">${escapeHtml(a.description)}</div>` : ''}
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
    }
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
    const tabs = tab.parentElement.querySelectorAll('.tabs__item');
    tabs.forEach(t => t.classList.toggle('tabs__item--active', t === tab));
    if (document.body.dataset.page === 'home') renderHome();
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
    state: { step: 1, category: null, type: null },

    reset() {
        this.state = { step: 1, category: null, type: null };
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
            $('#wizard-title', m).textContent = `${cat.emoji} ${cat.label} — typ`;
            body.innerHTML = `
                <div class="tile-grid">
                    ${cat.types.map(t => `
                        <button type="button" class="tile" data-wizard-type="${t.id}">
                            <span class="tile__emoji">${t.emoji}</span>
                            <span class="tile__label">${t.label}</span>
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
                    <div class="btn-row">
                        <button type="button" class="btn btn--ghost" data-wizard-back>← Späť</button>
                        <button type="submit" class="btn btn--primary">Uložiť</button>
                    </div>
                </form>
            `;
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
    const type = cat.types.find(t => t.id === Wizard.state.type);

    Storage.activities.create({
        dayId,
        category: Wizard.state.category,
        type: Wizard.state.type,
        typeEmoji: type.emoji,
        startTime: fd.get('startTime'),
        endTime: fd.get('endTime') || null,
        title: fd.get('title').trim(),
        description: (fd.get('description') || '').trim(),
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
