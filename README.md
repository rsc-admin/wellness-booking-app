# RedSmart Wellness - Booking App

A privacy-first wellness booking marketplace prototype with client booking, provider dashboards, admin tools, and Google Workbook sync through Google Apps Script.

**Current Preview:** `redsmart_all_features_preview.html`

---

## 🎯 Overview

RedSmart Wellness is being modernized from a single wellness booking app into a multi-provider platform. The current all-features HTML preview demonstrates the combined product direction: privacy-first client booking, provider scheduling, provider business tools, admin governance, and workbook-backed data.

### For Customers
- 📱 Browse active, admin-approved wellness providers
- 📅 Book without creating an account
- 🔐 Optionally create a lightweight account with username and phone only
- ⏰ See appointment times calculated from real provider availability, time off, existing appointments, and buffer rules
- 📊 View account-specific bookings after SMS-style login

### For Providers
- 🔑 Provider-scoped login/dashboard
- ⏰ Set weekly availability with multiple ranges per weekday
- 📆 Add effective start/end dates for availability rows
- 🧭 Preview a real monthly schedule with Previous / Month / Next controls
- 📞 Add offline bookings from phone, text, walk-in, or manual entries
- 📋 View filtered appointments by source, status, payment, service, month, or custom date range
- 💵 Enter service payment, tip, method, and paid/unpaid status from appointment details
- 📊 Dashboard totals update from filtered appointments and payment/tip logs

### For Admins
- Approve, activate, deactivate, and review provider records
- Separate admin area from client and provider access
- Platform-level visibility and governance model

---

## ✨ Features

### Current All-Features Preview ✅
- [x] Role-based client, provider, and admin views
- [x] Guest booking plus optional privacy-first client account creation
- [x] Workbook sync through deployed Google Apps Script
- [x] Multi-provider data model using `ProviderID`
- [x] Provider-scoped schedules, payments, reviews, offline clients, and services
- [x] Client-scoped "My Bookings" using `BOOKINGS.UserID`
- [x] Real availability slots from `PROVIDER_AVAILABILITY`
- [x] Multiple availability ranges per weekday
- [x] Provider-entered effective start/end dates for availability rows
- [x] 12-hour time display with 24-hour entry conversion
- [x] Time off blocks included in availability checks
- [x] Provider dashboard filters for source, status, payment, service, month, and date range
- [x] Monthly schedule preview based on appointments and availability
- [x] Appointment detail actions: payment, tip, method, notes, paid, complete, cancel
- [x] Offline booking entry and dashboard inclusion
- [x] Payment and tip logging through Apps Script `createPayment`
- [x] Graceful local/demo fallback when workbook sync fails

### Backend / Production Hardening 🔄
- [ ] Replace demo PINs with production authentication
- [ ] Persist provider notes to workbook or a proper backend table
- [ ] Add duplicate-safe payment updates instead of append-only payment logs
- [ ] Add SMS provider integration for real PINs, reminders, and confirmations
- [ ] Add stronger validation and permission checks in Apps Script
- [ ] Migrate the all-features preview into the React app structure or another production frontend

### Planned Platform Features 📋
- [ ] Provider subscription billing
- [ ] Provider onboarding workflow
- [ ] Client booking history and favorites
- [ ] Ratings/review reply persistence
- [ ] Calendar integration
- [ ] Analytics and reporting
- [ ] Native mobile app exploration

---

## 🚀 Quick Start

### For Customers
Simply open the booking link and:
1. Select a wellness service
2. Pick a date & time
3. Enter your nickname & phone
4. Done! Your appointment is booked

### For Developers

#### Prerequisites
- Node.js 14+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))
- Google account (for API key setup)

#### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wellness-booking-app.git
cd wellness-booking-app

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at http://localhost:3000

#### Setup Google Workbook Integration

The current preview uses Google Apps Script as the backend facade for the workbook. The active deployment URL is configured in `redsmart_all_features_preview.html`.

The Apps Script actions currently used by the preview include:
- `getUsers`, `getProviders`, `getBookings`, `getPayments`, `getRatings`, `getTimeOff`, `getOfflineBookings`, `getAvailability`
- `createUser`, `createBooking`, `createOfflineBooking`, `createPayment`
- `updateBooking`, `updateProvider`, `updateProviderStatus`
- `createAvailability`, `updateAvailability`, `deleteAvailability`

#### Deploy to Production

See [GITHUB_DEPLOYMENT_GUIDE.md](docs/GITHUB_DEPLOYMENT_GUIDE.md) for deployment options:
- **Vercel** (Recommended - easiest, ~5 min)
- **Netlify** (Great alternative)
- **GitHub Pages** (Free tier)

---

## 📁 Project Structure

```
wellness-booking-app/
├── src/
│   ├── components/
│   │   ├── WellnessBookingGoogleSheets.jsx  # Main customer booking component
│   │   └── ProviderDashboard.jsx            # Provider portal (coming soon)
│   ├── App.jsx                              # Main app router
│   ├── index.js                             # React entry point
│   ├── index.css                            # Global styles
│   └── App.css                              # App styles
├── public/
│   └── index.html                           # HTML template
├── docs/
│   ├── SETUP_GUIDE.md                       # Google Sheets setup
│   ├── PROJECT_PLAN.md                      # Full roadmap
│   └── GITHUB_DEPLOYMENT_GUIDE.md           # Deployment instructions
├── redsmart_all_features_preview.html        # Current RedSmart all-features prototype
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

---

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI components & state management |
| **Database** | Google Sheets / Google Workbook | Users, providers, bookings, payments, availability |
| **API** | Google Apps Script Web App | Workbook reads/writes and action routing |
| **Styling** | CSS + Tailwind utilities | Responsive design |
| **Icons** | Lucide React | Beautiful UI icons |
| **Deployment** | Vercel / Netlify | Zero-downtime hosting |

### Why Google Workbook?
✅ Zero server costs  
✅ Easy for providers to view/edit directly  
✅ Built-in security (Google accounts)  
✅ Good for fast prototype iteration  
✅ Apps Script gives one endpoint for controlled reads/writes  

---

## 📊 Database Schema

The current workbook is multi-table. Column names are expected by the Apps Script and the preview normalizers.

### Google Workbook: `USERS`
```
UserID | Username | Phone | PasswordHash | UserType | SMSVerified | CreatedDate | UpdatedDate
```

### Google Workbook: `PROVIDERS`
```
ProviderID | BusinessName | OwnerName | Email | Phone | Status | AverageRating | TotalReviews | Services | BufferTime | CreatedDate | ActivatedDate
```

### Google Workbook: `BOOKINGS`
```
BookingID | UserID | ProviderID | ServiceType | AppointmentDate | AppointmentTime | Duration | BookingSource | HealthNotes | Status | CreatedDate
```

### Google Workbook: `PROVIDER_AVAILABILITY`
```
AvailabilityID | ProviderID | DayOfWeek | StartTime | EndTime | SlotIntervalMinutes | BufferMinutes | IsActive | EffectiveStartDate | EffectiveEndDate | Notes
```

Notes:
- Multiple rows can exist for the same provider and weekday.
- Start and end times display in 12-hour format in the app.
- Providers may type 24-hour times such as `14:30`; the UI converts them to `2:30 PM`.
- Effective dates are entered by the provider in the weekly availability editor.

### Google Workbook: `PAYMENTS`
```
PaymentID | ProviderID | BookingID | Amount | PaymentMethod | PaymentType | CreatedDate
```

### Google Workbook: `TIME_OFF`
```
BlockID | ProviderID | BlockType | StartDate | EndDate | RecurringPattern | RecurringEndDate | Description | CreatedDate
```

### Google Workbook: `OFFLINE_BOOKINGS`
```
OfflineBookingID | ProviderID | ClientName | ClientPhone | ServiceProvided | ServiceDuration | PaymentAmount | PaymentMethod | TipAmount | EntryType | DateOccurred | CreatedDate
```

---

## 🎨 Responsive Design

### Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Stacked vertical layout
- Large, readable fonts
- Optimized images
- Fast load times

### Desktop Enhancements
- Multi-column layouts
- Hover effects
- Keyboard navigation
- Larger calendar view

**Tested on:**
- ✅ iPhone SE, 12, 13, 14, 15
- ✅ iPad (9.7", 12.9")
- ✅ Android (Samsung, Pixel)
- ✅ Chrome, Safari, Firefox, Edge
- ✅ Responsive from 320px to 2560px

---

## 🔐 Security & Privacy

- **Client privacy model:** Guest booking is allowed; accounts are optional and can use username + phone only
- **Authentication:** Demo PIN/SMS-style flows in the preview; production should use real auth
- **Data:** Google Workbook / Sheets, encrypted in transit/at rest by Google
- **API:** Apps Script action endpoint wrapping workbook operations
- **HTTPS:** All connections encrypted
- **No tracking:** No analytics or user tracking
- **Payment privacy:** Payment card processing is not stored in the prototype; only service/tip logs are recorded

---

## 📱 APIs Used

### Google Apps Script Web App
```javascript
// Fetch provider availability
GET {APPS_SCRIPT_URL}?action=getAvailability

// Create/update/delete availability rows
POST {APPS_SCRIPT_URL}?action=createAvailability
POST {APPS_SCRIPT_URL}?action=updateAvailability
POST {APPS_SCRIPT_URL}?action=deleteAvailability

// Log service payments and tips
POST {APPS_SCRIPT_URL}?action=createPayment
```

The preview still contains older Google Sheets API-era React code. The newest all-features prototype uses Apps Script because it needs multi-table reads/writes, provider-specific actions, and append/update/delete actions beyond simple booking reads.

---

## 🚨 Troubleshooting

### App won't load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Start again
npm start
```

### Workbook not syncing through Apps Script
1. Confirm the Apps Script web app is deployed and accessible to the app
2. Check that the deployment URL in `redsmart_all_features_preview.html` is current
3. Verify the workbook contains the expected tabs, especially `USERS`, `PROVIDERS`, `BOOKINGS`, `PAYMENTS`, `TIME_OFF`, `OFFLINE_BOOKINGS`, and `PROVIDER_AVAILABILITY`
4. Confirm Apps Script actions such as `getAvailability`, `createAvailability`, `updateAvailability`, and `deleteAvailability` are deployed in the latest version
5. Check that workbook column headers match the schema above

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md#troubleshooting) for more.

---

## 📈 Roadmap

**Current:** Q2 2026
- ✅ Phase 1: Customer booking app
- ✅ Phase 2: Provider dashboard prototype
- ✅ Phase 2.5: Multi-provider workbook prototype
- 🔄 Phase 3: Production hardening and React integration

**Upcoming:** Q3 2026
- Production authentication
- Real SMS reminders and PIN verification
- Persistent provider notes and review replies
- Duplicate-safe payment editing
- Admin audit trail

**Future:** Q4 2026+
- Mobile native apps (iOS/Android)
- AI scheduling optimization
- Integration with calendar apps

See [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) for details.

---

## 🤝 Contributing

We welcome contributions! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 💬 Support & Questions

- **Setup help:** See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- **Deployment:** See [GITHUB_DEPLOYMENT_GUIDE.md](docs/GITHUB_DEPLOYMENT_GUIDE.md)
- **Project details:** See [PROJECT_PLAN.md](docs/PROJECT_PLAN.md)

---

## 👥 Credits

Built with ❤️ for wellness providers

---

**Version:** 1.1.0-preview  
**Last Updated:** April 19, 2026  
**Status:** Active Development - RedSmart all-features prototype
