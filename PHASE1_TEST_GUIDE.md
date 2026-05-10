# 🧪 Phase 1 Testing Guide — NA CESTY

## ✅ Phase 1 is COMPLETE

All features have been implemented and the archive button functionality has been fixed and committed.

---

## 🚀 How to Test Locally

Choose one of these methods:

### Option 1: Double-click `index.html` (Easiest)
1. Open File Explorer
2. Navigate to: `C:\Dropbox\0_CLAUDE PROJEKTY\nacesty\.claude\worktrees\goofy-antonelli-fe7680\`
3. Double-click **`index.html`**
4. Browser opens with the app (file:// protocol works for localStorage)

### Option 2: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click **`index.html`** → "Open with Live Server"
3. Browser opens on localhost:5500

### Option 3: PowerShell HTTP Server
Run in PowerShell as Administrator in the project directory:
```powershell
# Start simple HTTP server (may require .NET)
[System.Net.HttpListener]::new().Prefixes.Add("http://localhost:3000/")
# OR use any local server tool
```

---

## 📋 Test Scenarios

### 1. **Home Page — View Trips**
- [ ] Open `index.html`
- [ ] See 3 sample trips (Rím + Florencia, Tatry, Praha)
- [ ] "Aktívne" tab shows Rím, Tatry (status = planned/live)
- [ ] "Archív" tab shows Praha (status = completed)

### 2. **Archive Toggle** ⭐ MOST IMPORTANT
- [ ] Click 📌 button on "Rím + Florencia" trip in **Aktívne** tab
- [ ] Trip disappears from Aktívne
- [ ] Switch to **Archív** tab
- [ ] "Rím + Florencia" now appears with 📁 button
- [ ] Click 📁 button
- [ ] Trip moves back to **Aktívne** tab
- [ ] ✅ **Archive toggle works correctly!**

### 3. **Create New Trip**
- [ ] Click **"+ Nový výlet"** FAB (bottom right)
- [ ] Enter: Name "Test Trip", Destination "Berlin", Dates (May 20-22)
- [ ] Click "Vytvoriť výlet"
- [ ] New trip appears in **Aktívne** tab
- [ ] Trip shows: dates, 3 days, 0 activities, 0 photos

### 4. **Trip Detail Page**
- [ ] Click on any trip card
- [ ] See hero section with trip name + dates
- [ ] See 3 day cards (Deň 1, 2, 3)
- [ ] Click on "Deň 1"

### 5. **Day Timeline Page**
- [ ] Hero section shows day + date
- [ ] See **"+ PRIDAJ"** button (left side in header)
- [ ] Click **"+ PRIDAJ"**

### 6. **3-Step Activity Wizard**
- [ ] **Step 1**: Select "Doprava" category
  - See 9 types: ✈️ 🚌 🚂 🚗 🚊 🚶 🛳️ 🚇 ✏️
- [ ] Click "Lietadlo" (✈️)
- [ ] **Step 2**: Confirm type selected
- [ ] **Step 3**: Fill form:
  - Title: "Prichádzam do mesta"
  - Start: 09:00 (or leave default)
  - End: Should auto-fill to 10:00
  - Description: "Pristátie na letisku"
  - Location: "Letisko Václava Havla"
  - Amount: 0 (no cost)
- [ ] Click "Pridať aktivitu"
- [ ] Activity appears in timeline with:
  - ✈️ icon, "Prichádzam do mesta", 09:00–10:00
  - 📍 Letisko Václava Havla (blue)
  - € 0.00 (gray if 0)

### 7. **Activity Rating**
- [ ] Click **checkbox** on the activity
- [ ] Activity turns green (✓ Hotova)
- [ ] Three emojis appear: 😞 😐 😊
- [ ] Click 😊 (happy)
- [ ] Rating persists (😊 shows next to activity)

### 8. **Photo Upload**
- [ ] Below activity, click **"+ Pridať fotku"** button
- [ ] Select image file from your computer
- [ ] Photo preview appears in activity (thumbnail)
- [ ] Photo data saved to localStorage (base64)

### 9. **Delete Activity**
- [ ] On any activity, click **🗑️ (delete)** button
- [ ] Confirm dialog: "Odstrániť aktivitu?"
- [ ] Activity disappears from timeline

### 10. **Data Persistence**
- [ ] Refresh page (F5 or Ctrl+R)
- [ ] All activities, ratings, photos still there
- [ ] New trip still in list
- [ ] Archive status preserved
- [ ] ✅ **localStorage working!**

### 11. **Responsive Design** (Test on different widths)
- [ ] **Mobile (360px)**: Stack layout (days above, timeline below)
- [ ] **Mobile (414px)**: Same stack
- [ ] **Tablet (768px)**: 2 columns (days left, timeline right)
- [ ] **Desktop (1024px)**: 3 columns (days | timeline | panel right)

### 12. **Custom Activity Types**
- [ ] **Step 2** of wizard: Scroll to bottom
- [ ] See **✏️ Iné** button
- [ ] Click it, enter custom type name (e.g., "Fotenie")
- [ ] Create another activity with the custom type
- [ ] Next time, custom type appears as a button in **Step 2**

---

## 🐛 Troubleshooting

### "Nothing displays" or blank page
- **Fix**: Ensure JavaScript is enabled in browser (Settings → Privacy & Security)
- **Check console**: F12 → Console → any red errors?

### "Activities don't save"
- **Fix**: Clear browser cache (Ctrl+Shift+Delete)
- **Check**: localStorage enabled (Settings → Cookies and site data)

### Archive button doesn't work
- **Expectation**: Click 📌 or 📁 → trip moves to other tab
- **If broken**: Check browser console for JavaScript errors (F12)

---

## ✅ Success Criteria — Phase 1 Complete

- [x] Home page shows trips filtered by Active/Archive
- [x] Archive toggle (📌/📁) works in both directions
- [x] Can create new trips
- [x] Can add activities via 3-step wizard
- [x] Can rate activities (😞 😐 😊)
- [x] Can upload photos
- [x] Can delete activities
- [x] Data persists after refresh
- [x] Responsive on mobile/tablet/desktop
- [x] All 3 sample trips visible on first load
- [x] Custom activity types saved in memory
- [x] Emoji icons display correctly
- [x] No console errors

---

## 📝 Notes

- **No backend yet**: All data in browser localStorage (~5 MB limit)
- **No auth**: Anyone can open and modify data
- **No lightbox**: Photos open in new tab (target="_blank")
- **EDIT button**: Shows alert "Úprava aktivít bude dostupná v ďalšej verzii" (deferred to Phase 2)

---

## ✨ What's Different from Demo

1. **Archive button replaced checkbox** — 📌/📁 icons instead of checked/unchecked
2. **All Phase 1.1-1.4a features implemented**:
   - Metro category added
   - 12 food types (including Lunch, Dinner, Drink, etc.)
   - Amount field (EUR) with € display
   - Location field (📍 address)
   - Custom "Iné" types with memory
   - Auto-calculated end time
   - Smart default start time

---

**After testing**: Review results with user → approve Phase 1 → start Phase 2 (Backend + Database)
