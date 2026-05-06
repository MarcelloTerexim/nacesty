/* Storage — wrapper nad localStorage pre Na cesty (fáza 1) */

const Storage = (() => {
    const KEYS = {
        trips: 'nacesty.trips',
        days: 'nacesty.days',
        activities: 'nacesty.activities',
        photos: 'nacesty.photos',
        seeded: 'nacesty.seeded',
    };

    const read = (k) => {
        try { return JSON.parse(localStorage.getItem(k)) ?? []; }
        catch { return []; }
    };
    const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    const collection = (key, prefix) => ({
        all: () => read(key),
        find: (matcher) => read(key).find(matcher),
        filter: (matcher) => read(key).filter(matcher),
        create: (data) => {
            const item = { id: id(prefix), createdAt: new Date().toISOString(), ...data };
            const all = read(key);
            all.push(item);
            write(key, all);
            return item;
        },
        update: (itemId, patch) => {
            const all = read(key);
            const i = all.findIndex(x => x.id === itemId);
            if (i === -1) return null;
            all[i] = { ...all[i], ...patch };
            write(key, all);
            return all[i];
        },
        remove: (itemId) => {
            const all = read(key).filter(x => x.id !== itemId);
            write(key, all);
        },
        replaceAll: (items) => write(key, items),
    });

    return {
        KEYS,
        trips: collection(KEYS.trips, 'trip'),
        days: collection(KEYS.days, 'day'),
        activities: collection(KEYS.activities, 'act'),
        photos: collection(KEYS.photos, 'photo'),

        isSeeded: () => localStorage.getItem(KEYS.seeded) === '1',
        markSeeded: () => localStorage.setItem(KEYS.seeded, '1'),

        reset: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
    };
})();
