# Serenity Wellness - Booking App

A mobile-responsive wellness services booking platform built with React and Google Sheets.

**Live Demo:** [Coming Soon]

---

## 🎯 Overview

Serenity Wellness is a complete booking solution for wellness service providers:

### For Customers
- 📱 Browse available wellness services
- 📅 Interactive calendar showing real availability
- ⏰ Select appointment date & time in seconds
- ✅ Enter nickname & phone to book instantly
- 📊 See live availability based on provider's work hours

### For Providers
- 🔑 Simple login dashboard
- ⏰ Set work hours (open/close, holidays)
- 📞 Add manual bookings from phone calls/texts
- 📋 View all upcoming appointments
- ✏️ Edit, cancel, or mark bookings complete
- 📊 Dashboard with today's & weekly view

---

## ✨ Features

### Phase 1: Booking App ✅
- [x] Service selection (6 pre-configured services)
- [x] Calendar with real-time availability
- [x] Date & time selection
- [x] Customer entry (nickname + phone)
- [x] Google Sheets integration (data syncing)
- [x] Mobile-responsive design
- [x] Real booking confirmation

### Phase 2: Provider Dashboard 🔄 (In Progress)
- [ ] Provider login/authentication
- [ ] Work hours management
- [ ] Manual booking entry (from phone calls)
- [ ] Booking management (view/edit/cancel)
- [ ] Dashboard overview
- [ ] Customer lookup

### Phase 3: Advanced Features 📋 (Planned)
- [ ] Customer profiles & history
- [ ] Service management & customization
- [ ] SMS/Email reminders
- [ ] Payment processing (Stripe)
- [ ] Analytics & reporting
- [ ] Multi-staff support

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

#### Setup Google Sheets Integration

Follow the detailed setup in [SETUP_GUIDE.md](docs/SETUP_GUIDE.md):

1. Create a Google Sheet with booking data
2. Generate a Google API Key
3. Add your Sheet ID and API Key to the app
4. Start receiving real bookings!

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
| **Database** | Google Sheets | Booking storage (no backend needed) |
| **API** | Google Sheets API v4 | Real-time data sync |
| **Styling** | CSS + Tailwind utilities | Responsive design |
| **Icons** | Lucide React | Beautiful UI icons |
| **Deployment** | Vercel / Netlify | Zero-downtime hosting |

### Why Google Sheets?
✅ Zero server costs  
✅ No backend development needed  
✅ Easy for providers to view/edit directly  
✅ Built-in security (Google accounts)  
✅ Scales to 10,000+ bookings  

---

## 📊 Database Schema

### Google Sheets: `Bookings` tab
```
A: Booking ID      (AUTO-001, AUTO-002, ...)
B: Service Name    (Swedish Massage, Yoga, ...)
C: Date            (YYYY-MM-DD)
D: Time            (HH:MM AM/PM)
E: Nickname        (Alex, Jamie, ...)
F: Phone           (555-1234)
G: Status          (Confirmed, Completed, Cancelled)
H: Notes           (Optional provider notes)
I: Created Date    (Timestamp)
J: Source          (App/Manual)
```

### Google Sheets: `Provider Settings` tab
```
Setting            | Value
Provider Name      | Serenity Wellness Studio
Phone              | 555-0000
Work Hours Monday  | 09:00 AM - 06:00 PM
Work Hours Tuesday | 09:00 AM - 06:00 PM
... (one row per day/setting)
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

- **Authentication:** Provider PIN-based login (upgradeable to OAuth)
- **Data:** Google Sheets (encrypted in transit/at rest)
- **API:** Read/write only to your sheet (not shareable data)
- **HTTPS:** All connections encrypted
- **No tracking:** No analytics or user tracking
- **GDPR:** Easy data export (Google Sheets native)

---

## 📱 APIs Used

### Google Sheets API v4
```javascript
// Fetch bookings
GET https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/Bookings

// Add new booking
POST https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/Bookings:append
```

**Rate Limits:**
- 300 requests per minute (per user)
- 60,000,000 requests per day (per project)
- Fine for most wellness studios

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

### Bookings not syncing with Google Sheet
1. Check your API key is valid
2. Verify sheet name is exactly "Bookings"
3. Check column headers match (A-J)
4. Ensure Google Sheets API is enabled

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md#troubleshooting) for more.

---

## 📈 Roadmap

**Current:** Q2 2026
- ✅ Phase 1: Customer booking app
- 🔄 Phase 2: Provider dashboard (in progress)

**Upcoming:** Q3 2026
- 📋 Phase 3: Advanced features
  - Multi-staff support
  - Payment processing
  - SMS reminders
  - Analytics dashboard

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

**Version:** 1.0.0  
**Last Updated:** April 18, 2026  
**Status:** Active Development
