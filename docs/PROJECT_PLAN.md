# RedSmart Booking - Project Plan

## Overview
A RedSmart Booking platform where:
- **Customers** book services via responsive web app (mobile-optimized & desktop)
- **Providers** manage bookings, add manual entries, and set work hours
- **Backend** uses Google Sheets for data storage (simple, no server costs)

---

## Phase 1: Core Booking App (CURRENT)

### 1.1 Customer-Facing Web App
**Status:** ✅ Built (needs mobile/desktop responsive refinement)

**Features:**
- Browse 6 appointment services (massage, yoga, facial, etc.)
- Interactive calendar with real availability
- Select date & time slots
- Enter Nickname + Phone
- Real-time sync with Google Sheet

**Responsive Design:**
- Mobile: Stack vertically, touch-friendly buttons, larger text
- Desktop: Multi-column layout, calendar on left, details on right
- Auto-detect device type and adjust UI accordingly

**Tech Stack:**
- React component
- Google Sheets API for data
- CSS responsive grid

**Deliverable:**
- `/wellness-booking-google-sheets.jsx` (enhanced for responsive design)
- Setup guide for customers to access

---

## Phase 2: Provider Dashboard (NEW - Priority 1)

### 2.1 Provider Authentication
**Features:**
- Simple PIN/password login (optional: Google account)
- "Remember this device" checkbox
- Session timeout after 30 minutes of inactivity

**Considerations:**
- Keep it simple for non-tech-savvy providers
- No user management system (single provider for now)

---

### 2.2 Work Hours Management
**Features:**
- Set daily work hours (e.g., 9 AM - 6 PM)
- Mark days as closed (holidays, days off)
- Different hours per day (optional)
- Override hours for special dates

**UI:**
```
Monday:    9:00 AM - 6:00 PM    [Edit]
Tuesday:   9:00 AM - 6:00 PM    [Edit]
Wednesday: 9:00 AM - 6:00 PM    [Edit]
Thursday:  OFF                    [Edit]
Friday:    9:00 AM - 6:00 PM    [Edit]
Saturday:  10:00 AM - 4:00 PM   [Edit]
Sunday:    OFF                    [Edit]

+ Add Holiday/Closed Date
```

**Storage:**
- New Google Sheet tab: `Provider Settings`
- Columns: Day, Start Time, End Time, Status (Open/Closed)
- App logic filters available time slots based on hours

---

### 2.3 Manual Booking Entry (Text-to-Booking)
**Problem Solved:**
- Provider receives text: "Hi, I want Swedish Massage this Friday at 2 PM"
- Provider can quickly add booking without requiring customer to use app

**Features:**
- Quick add form: Service + Date + Time + Nickname + Phone
- Validation: Check availability before adding
- Auto-populate with recent nicknames (if repeat customer)
- Confirmation: Show what will be added to sheet

**UI:**
```
QUICK ADD BOOKING
Service:  [Dropdown: Swedish Massage, Yoga, etc.]
Date:     [Calendar picker]
Time:     [Time picker showing available slots]
Nickname: [Text input with autocomplete]
Phone:    [Text input]
Notes:    [Optional text field]

[Cancel] [Add Booking]
```

---

### 2.4 Dashboard Overview
**Features:**
- Today's bookings (list view)
- Upcoming bookings (this week/month)
- Search/filter by service or customer
- Mark booking as "completed" or "cancelled"
- Booking details popup (show notes if added)

**Display:**
```
TODAY (Friday, April 18)
─────────────────────
9:00 AM  - Swedish Massage - Alex - 555-1234
11:00 AM - Yoga Class - Jamie - 555-5678
2:00 PM  - Facial Treatment - Casey - 555-9012

THIS WEEK
─────────────────────
Saturday: 1 booking
Sunday: 0 bookings
```

---

### 2.5 Booking Management
**Features:**
- View all bookings (calendar or list view)
- Edit booking details (date, time, service)
- Cancel booking with confirmation
- Add notes to booking (e.g., "Customer requested calming music")
- Mark as "no-show" or "completed"

**Storage:**
- Add columns to Bookings sheet: Status, Notes, Last Updated

---

## Phase 3: Advanced Features (Future)

### 3.1 Customer Management
- Repeat customer tracking
- Contact history (when they last booked)
- Customer preferences/notes
- Save favorite services

### 3.2 Services Management
- Add/edit/delete services
- Set capacity per time slot
- Pricing per service
- Service duration customization

### 3.3 Notifications
- SMS/Email reminders (24h before booking)
- Provider notification for new bookings
- Cancellation notifications

### 3.4 Payments
- Stripe integration for online payments
- Cash/Venmo option tracking
- Invoice/receipt generation

### 3.5 Analytics & Reporting
- Revenue tracking
- Popular services
- Customer booking trends
- Monthly reports

---

## Technical Architecture

### Database Schema (Google Sheets)

**Sheet 1: Bookings**
```
A: Booking ID        (AUTO-001, AUTO-002, ...)
B: Service Name      (Swedish Massage, Yoga, ...)
C: Date              (YYYY-MM-DD)
D: Time              (HH:MM AM/PM)
E: Nickname          (Alex, Jamie, ...)
F: Phone             (555-1234)
G: Status            (Confirmed, Completed, Cancelled, No-Show)
H: Notes             (Optional notes from provider)
I: Created Date      (Timestamp of booking)
J: Source            (App/Manual)
```

**Sheet 2: Services**
```
A: Service ID        (1, 2, 3, ...)
B: Name              (Swedish Massage, Yoga, ...)
C: Duration          (60 min, 45 min, ...)
D: Price             ($120, $60, ...)
E: Description       (Relaxing massage, ...)
F: Icon              (💆, 🧘, ...)
G: Max Per Slot      (1, 10, 2, ...)
```

**Sheet 3: Provider Settings**
```
A: Setting           (Provider Name, Phone, Email, ...)
B: Value             (John's Wellness Studio, 555-0000, ...)

Day       | Start Time | End Time  | Status
Monday    | 09:00 AM   | 06:00 PM  | Open
Tuesday   | 09:00 AM   | 06:00 PM  | Open
...
Holiday   | 2026-07-04 | -         | Closed
```

**Sheet 4: Audit Log** (Optional, for tracking changes)
```
A: Timestamp         (When change happened)
B: Action            (Booking Added, Booking Edited, Hours Changed)
C: Details           (What changed)
D: User              (Admin/System)
```

---

## Implementation Roadmap

### Week 1: Mobile/Desktop Responsive Design
- [ ] Test booking app on mobile (iPhone, Android)
- [ ] Adjust CSS for touch targets, readable fonts
- [ ] Test on desktop browsers
- [ ] Create responsive test checklist

### Week 2: Provider Dashboard Structure
- [ ] Build provider login screen
- [ ] Create dashboard layout
- [ ] Setup Google Sheets integration for settings
- [ ] Build work hours management UI

### Week 3: Work Hours Logic
- [ ] Implement work hours filtering
- [ ] Calculate available time slots based on hours
- [ ] Handle holidays/special days
- [ ] Test edge cases (business spans midnight, etc.)

### Week 4: Manual Booking Entry
- [ ] Build quick add booking form
- [ ] Add autocomplete for nicknames
- [ ] Implement availability validation
- [ ] Build confirmation dialog

### Week 5: Dashboard & Booking Management
- [ ] Build bookings list view
- [ ] Implement search/filter
- [ ] Add edit/cancel functionality
- [ ] Create booking detail view

### Week 6: Testing & Polish
- [ ] End-to-end testing (mobile + desktop)
- [ ] Provider workflow testing
- [ ] Bug fixes and UI refinements
- [ ] Create user documentation

---

## File Structure (Post-Implementation)

```
wellness-booking-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CustomerBooking.jsx        (Phase 1 - Booking flow)
│   │   ├── ProviderDashboard.jsx      (Phase 2 - Provider portal)
│   │   ├── WorkHoursManager.jsx       (Phase 2.2)
│   │   ├── ManualBookingForm.jsx      (Phase 2.3)
│   │   ├── BookingsList.jsx           (Phase 2.4)
│   │   └── BookingManager.jsx         (Phase 2.5)
│   ├── utils/
│   │   ├── googleSheetsAPI.js         (API calls)
│   │   ├── availabilityCalculator.js  (Slot availability logic)
│   │   └── validators.js              (Data validation)
│   ├── styles/
│   │   └── responsive.css             (Mobile/desktop responsive)
│   └── App.jsx                        (Main app router)
├── SETUP_GUIDE.md
├── PROJECT_PLAN.md
└── README.md
```

---

## Key Decisions & Rationale

### Why Google Sheets (not a database)?
✅ **Pros:**
- Zero server costs
- No backend development needed
- Easy for provider to view/edit directly
- Built-in security (Google account)
- Can scale to 10,000+ bookings

❌ **Cons:**
- API rate limits (but fine for small business)
- Not real-time (slight delay on updates)
- Less suitable for >100,000 bookings

**Decision:** Perfect for MVP and small/medium wellness studios

---

### Why PIN auth (not OAuth)?
✅ **Pros:**
- Simple for non-technical users
- No social media account needed
- Quick to implement

❌ **Cons:**
- Less secure than OAuth
- No user management

**Decision:** Good for single-provider dashboard. Upgrade to OAuth later if needed.

---

### Why manual booking entry?
✅ **Solves:**
- Customers who call/text instead of using app
- Provider can quickly add them during consultation
- Keeps all bookings in one place

**Alternative:** Skip for now, revisit based on actual use

---

## Testing Checklist

### Mobile Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 12/13/14 (standard)
- [ ] iPad (tablet)
- [ ] Android phone (Samsung, Pixel)
- [ ] Touch interactions (scroll, tap, long-press)
- [ ] Form inputs (keyboard appearance, autocomplete)

### Desktop Testing
- [ ] Chrome on Mac/Windows
- [ ] Safari on Mac
- [ ] Firefox
- [ ] Edge
- [ ] Landscape orientation
- [ ] Zoom in/out (100%, 150%, 200%)

### Functionality Testing
- [ ] Availability updates in real-time
- [ ] Work hours correctly filter time slots
- [ ] Manual booking validation works
- [ ] Dashboard search filters
- [ ] Edit/cancel bookings
- [ ] Google Sheets sync (new bookings appear)

### Edge Cases
- [ ] What if provider sets 0 hours (fully closed)?
- [ ] What if a time slot fills up during booking?
- [ ] What if provider edits hours mid-day?
- [ ] What if customer name is very long?
- [ ] What if phone number has special characters?

---

## Success Metrics

**Phase 1 Complete When:**
- ✅ App works on mobile and desktop
- ✅ Calendar shows correct availability
- ✅ Bookings appear in Google Sheet
- ✅ 10+ test bookings successful

**Phase 2 Complete When:**
- ✅ Provider can log in
- ✅ Work hours set availability correctly
- ✅ Manual bookings sync to sheet
- ✅ Provider can view/manage bookings

**Overall Success When:**
- ✅ Provider books first real customer through app
- ✅ Provider adds first manual booking from phone call
- ✅ No critical bugs in first 50 bookings

---

## Next Steps (Immediate)

1. **Review & Approve Plan**
   - Which phases are highest priority?
   - Any features to add/remove?
   - Timeline preferences?

2. **Finalize Design Specs**
   - Mobile layout mockups?
   - Provider dashboard color scheme?
   - Button placement preferences?

3. **Start Phase 1 Enhancements**
   - Make booking app fully responsive
   - Test on actual devices
   - Refine mobile UX

4. **Begin Phase 2 Design**
   - Mock up provider login screen
   - Sketch work hours UI
   - Plan manual booking form layout

---

## Questions to Answer

- [ ] What's the primary device customers will use? (Mobile?)
- [ ] How many customers per week? (Affects scale planning)
- [ ] Does provider need multiple staff members? (Multi-user?)
- [ ] Timeline for launch? (Weeks? Months?)
- [ ] Budget for paid tools? (SMS, email, payments?)
- [ ] Backup plan if Google Sheets API fails?

---

**Document Version:** 1.0  
**Last Updated:** April 18, 2026  
**Status:** Draft - Awaiting Review & Approval
