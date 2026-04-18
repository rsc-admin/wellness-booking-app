# Wellness Booking App - Google Sheets Integration Setup Guide

This guide walks you through connecting your wellness booking app to Google Sheets for real availability management.

---

## Step 1: Create a Google Sheet

### 1.1 Create the Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Blank spreadsheet"**
3. Name it: **"Wellness Bookings"**

### 1.2 Set Up Column Headers
In the first row, create these columns:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Booking ID | Service Name | Date | Time | Nickname | Phone |

**Example:** 
- A1: `Booking ID`
- B1: `Service Name`
- C1: `Date`
- D1: `Time`
- E1: `Nickname`
- F1: `Phone`

### 1.3 Rename the Sheet Tab
Right-click the sheet tab at the bottom and rename it to: **"Bookings"**

### 1.4 Add Sample Data (Optional)
Add a few sample bookings to test:
```
AUTO-001 | Swedish Massage | 2026-04-20 | 09:00 AM | Alex  | 555-1111
AUTO-002 | Yoga Class     | 2026-04-21 | 10:00 AM | Jamie | 555-2222
```

---

## Step 2: Get Your Google Sheet ID

1. Open your Wellness Bookings sheet
2. Look at the URL in your browser's address bar:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```
3. Copy the long alphanumeric string between `/d/` and `/edit`
   - Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

**Save this ID** - you'll need it in the next step.

---

## Step 3: Create a Google API Key

### 3.1 Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click **"Select a Project"** (top left)
   - Click **"NEW PROJECT"**
   - Name: "Wellness Booking"
   - Click **"CREATE"**

### 3.2 Enable the Sheets API
1. In the Cloud Console, search for **"Sheets API"**
2. Click **"Google Sheets API"**
3. Click the blue **"ENABLE"** button

### 3.3 Create an API Key
1. Go to **"Credentials"** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** (top)
3. Choose **"API Key"**
4. Copy the generated API key

**Important:** This API key will have restrictions. For testing, you can use it as-is. For production, [restrict it to specific websites](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions).

**Save this API Key** - you'll need it next.

---

## Step 4: Update Your App Code

In the wellness booking app code, find these two lines near the top:

```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';
```

Replace with your actual values:

```javascript
const SHEET_ID = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
const API_KEY = 'AIzaSyD_abcdef123456-xyz';
```

### Test It
Refresh the app. You should see a green "Connected!" banner at the top instead of the yellow "Demo Mode" banner.

---

## Step 5: How the Integration Works

### Reading Availability
- The app calls Google Sheets API to fetch all bookings
- It calculates available slots by comparing bookings with max capacity
- Dates/times with no spots left are disabled

### Adding a Booking
- When a customer submits a booking:
  1. A new row is added to your Google Sheet
  2. The app updates immediately to show the new booking
  3. Confirmation message is shown to the customer

### Booking Data Flow
```
Customer Books → App → Google Sheets API → Google Sheet
↓
Customer confirms with Nickname + Phone → App adds row → Google Sheet updates
↓
Other customers see updated availability
```

---

## Step 6: Optional - Set Up AppSheet

AppSheet can automate email confirmations and add more features.

### 6.1 Create an AppSheet App
1. Go to [AppSheet](https://www.appsheet.com/)
2. Sign up for free
3. Click **"Create App"** → **"Start with Data"**
4. Choose **"Google Sheets"**
5. Select your Wellness Bookings sheet

### 6.2 Create an Automation (Email Confirmation)
1. In your AppSheet app, go to **"Automations"**
2. Create a new automation:
   - **Trigger:** "When a row is added"
   - **Action:** "Send Email"
   - **To:** `[Email]`
   - **Subject:** "Booking Confirmed - Serenity Wellness"
   - **Body:** Create a template with booking details

### 6.3 Optional - Embed AppSheet in Your App
You can embed AppSheet tables in your React app for an admin panel to manage bookings.

---

## Step 7: Testing Checklist

- [ ] Green "Connected!" banner appears on app load
- [ ] Calendar shows available dates (green) and unavailable dates (gray)
- [ ] Time slots show correct "X/Y booked" counts
- [ ] When you book a slot, it disappears from availability
- [ ] New booking appears in your Google Sheet
- [ ] Confirmation email is sent (if AppSheet automation is set up)

---

## Troubleshooting

### "The CORS request did not succeed"
- This means your API key doesn't have Sheets API enabled
- **Fix:** Go to Google Cloud Console → APIs & Services → Sheets API → Enable

### "Cannot find rows in 'Bookings' sheet"
- Your sheet tab isn't named "Bookings"
- **Fix:** Right-click the sheet tab and rename it to exactly "Bookings"

### "Invalid SHEET_ID"
- You copied the wrong ID from the URL
- **Fix:** Double-check the ID between `/d/` and `/edit` in the URL

### API Key shows 0 results
- Your API key works but has restrictions
- **For production:** Use OAuth 2.0 instead of API keys (more secure)

---

## Next Steps

1. **Add Payment Processing** → Stripe integration for charges
2. **Send Reminders** → Google Cloud Tasks + SendGrid for SMS/email reminders
3. **Admin Dashboard** → Create a panel to manage services and pricing
4. **Mobile App** → Wrap with React Native or Flutter
5. **Analytics** → Track bookings, revenue, popular services

---

## Questions?

- **Google Sheets API Docs:** https://developers.google.com/sheets/api
- **AppSheet Docs:** https://help.appsheet.com
- **Google Cloud Console:** https://console.cloud.google.com
