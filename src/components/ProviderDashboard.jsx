import React, { useEffect, useMemo, useState } from 'react';

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_WORK_HOURS = {
  Monday: { isOpen: true, shifts: [{ start: '09:00', end: '17:00' }] },
  Tuesday: { isOpen: true, shifts: [{ start: '09:00', end: '17:00' }] },
  Wednesday: { isOpen: true, shifts: [{ start: '09:00', end: '17:00' }] },
  Thursday: { isOpen: true, shifts: [{ start: '09:00', end: '17:00' }] },
  Friday: { isOpen: true, shifts: [{ start: '09:00', end: '17:00' }] },
  Saturday: { isOpen: true, shifts: [{ start: '10:00', end: '14:00' }] },
  Sunday: { isOpen: false, shifts: [{ start: '09:00', end: '17:00' }] },
};

const INITIAL_BOOKINGS = [
  {
    id: 1,
    customerName: 'Ava Thompson',
    service: 'Swedish Massage',
    date: '2026-04-20',
    time: '10:00',
    source: 'Online',
    status: 'Confirmed',
  },
  {
    id: 2,
    customerName: 'Mia Lopez',
    service: 'Deep Tissue',
    date: '2026-04-20',
    time: '13:30',
    source: 'Phone',
    status: 'Confirmed',
  },
  {
    id: 3,
    customerName: 'Ethan Reed',
    service: 'Prenatal Massage',
    date: '2026-04-21',
    time: '11:00',
    source: 'Online',
    status: 'Pending',
  },
];

const SHEET_ID = '11gL7tepkPa6AlM996WGsSQKCax4REETFcalEyA3gnII';
const API_KEY = 'AIzaSyDxncQSCK-IJNDVmp_mZsPgAFH_lHPacJ4';

function ProviderDashboard({ onBack }) {
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [manualBooking, setManualBooking] = useState({
    customerName: '',
    service: 'Swedish Massage',
    date: '',
    time: '',
    notes: '',
  });
  const [loadingData, setLoadingData] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);
  const [sheetConfigured, setSheetConfigured] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((booking) => booking.date === today).length;
  }, [bookings]);

  const upcomingTotal = useMemo(
    () => bookings.filter((booking) => booking.status !== 'Cancelled').length,
    [bookings]
  );

  const onlineTotal = useMemo(
    () => bookings.filter((booking) => booking.source === 'Online').length,
    [bookings]
  );

  const handleLogin = (event) => {
    event.preventDefault();

    if (pin === '2468') {
      setIsLoggedIn(true);
      setLoginError('');
      setPin('');
      return;
    }

    setLoginError('Invalid PIN. Please try again.');
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    if (SHEET_ID && API_KEY) {
      setSheetConfigured(true);
      fetchProviderData();
    }
  }, [isLoggedIn]);

  const fetchProviderData = async () => {
    setLoadingData(true);
    try {
      const [bookingsResponse, settingsResponse] = await Promise.all([
        fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A:J?key=${API_KEY}`
        ),
        fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Provider%20Settings!A:B?key=${API_KEY}`
        ),
      ]);

      const bookingsData = await bookingsResponse.json();
      const settingsData = await settingsResponse.json();

      if (bookingsData.values?.length > 1) {
        const mappedBookings = bookingsData.values.slice(1).map((row, index) => ({
          id: `${row[0] || 'sheet'}-${index}`,
          customerName: row[4] || 'Unknown',
          service: row[1] || 'Service',
          date: row[2] || '',
          time: row[3] || '',
          source: row[9] || 'Online',
          status: row[6] || 'Confirmed',
          notes: row[7] || '',
        }));
        setBookings(mappedBookings);
      }

      if (settingsData.values?.length) {
        const parsedHours = parseWorkHoursFromSheet(settingsData.values);
        setWorkHours(parsedHours);
      }
    } catch (error) {
      setStatusMessage('Unable to sync provider data right now. Working in local mode.');
    } finally {
      setLoadingData(false);
    }
  };

  const updateDayOpenState = (day, isOpen) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isOpen,
      },
    }));
  };

  const updateShift = (day, shiftIndex, field, value) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        shifts: previous[day].shifts.map((shift, index) =>
          index === shiftIndex ? { ...shift, [field]: value } : shift
        ),
      },
    }));
  };

  const addShift = (day) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isOpen: true,
        shifts: [...previous[day].shifts, { start: '13:00', end: '17:00' }],
      },
    }));
  };

  const removeShift = (day, shiftIndex) => {
    setWorkHours((previous) => {
      const nextShifts = previous[day].shifts.filter((_, index) => index !== shiftIndex);
      return {
        ...previous,
        [day]: {
          ...previous[day],
          shifts: nextShifts.length > 0 ? nextShifts : [{ start: '09:00', end: '17:00' }],
        },
      };
    });
  };

  const handleManualBookingChange = (event) => {
    const { name, value } = event.target;
    setManualBooking((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddManualBooking = async (event) => {
    event.preventDefault();

    if (!manualBooking.customerName || !manualBooking.date || !manualBooking.time) {
      return;
    }

    const booking = {
      id: Date.now(),
      customerName: manualBooking.customerName,
      service: manualBooking.service,
      date: manualBooking.date,
      time: manualBooking.time,
      source: 'Phone',
      status: 'Confirmed',
      notes: manualBooking.notes,
    };

    setSavingBooking(true);
    let saveSucceeded = true;

    if (sheetConfigured) {
      saveSucceeded = await addManualBookingToGoogleSheets(booking);
    }

    if (saveSucceeded) {
      setBookings((previous) =>
      [...previous, booking].sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      )
    );
      setStatusMessage('Manual booking saved.');
    } else {
      setStatusMessage('Unable to save manual booking to Google Sheets.');
    }

    setManualBooking({
      customerName: '',
      service: 'Swedish Massage',
      date: '',
      time: '',
      notes: '',
    });
    setActiveTab('overview');
    setSavingBooking(false);
  };

  const addManualBookingToGoogleSheets = async (booking) => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
      const timestamp = new Date().toISOString();
      const bookingId = `MANUAL-${Date.now()}`;
      const values = [[
        bookingId,
        booking.service,
        booking.date,
        formatTimeForSheet(booking.time),
        booking.customerName,
        'N/A',
        booking.status,
        booking.notes || '',
        timestamp,
        'Manual',
      ]];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleSaveWorkHours = async () => {
    if (!sheetConfigured) {
      setStatusMessage('Google Sheets is not configured.');
      return;
    }

    setSavingHours(true);
    const success = await saveWorkHoursToGoogleSheets(workHours);
    setStatusMessage(success ? 'Work hours synced to Google Sheets.' : 'Failed to sync work hours.');
    setSavingHours(false);
  };

  const saveWorkHoursToGoogleSheets = async (hours) => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Provider%20Settings!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`;
      const timestamp = new Date().toISOString();
      const values = WEEK_DAYS.map((day) => [
        `Work Hours ${day}`,
        hours[day].isOpen ? JSON.stringify(hours[day].shifts) : 'Closed',
        timestamp,
      ]);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Provider Dashboard</h1>
          <p style={styles.subtitle}>Use your provider PIN to manage bookings and work hours.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <label htmlFor="provider-pin" style={styles.label}>
              4-digit PIN
            </label>
            <input
              id="provider-pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              maxLength={4}
              inputMode="numeric"
              placeholder="Enter PIN"
              style={styles.input}
            />
            {loginError ? <p style={styles.error}>{loginError}</p> : null}
            <button type="submit" style={styles.primaryButton}>
              Sign in
            </button>
            <p style={styles.helper}>Demo PIN: 2468</p>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              ← Back to role selection
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Serenity Provider Hub</h1>
            <p style={styles.subtitle}>Track bookings, hours, and manual requests in one place.</p>
          </div>
          <button type="button" onClick={onBack} style={styles.secondaryButton}>
            Sign out
          </button>
        </div>
        {statusMessage ? <p style={styles.syncBanner}>{statusMessage}</p> : null}
        {loadingData ? <p style={styles.helper}>Loading provider data from Google Sheets…</p> : null}

        <div style={styles.tabs}>
          <TabButton
            id="overview"
            activeTab={activeTab}
            onClick={setActiveTab}
            label="Overview"
          />
          <TabButton id="hours" activeTab={activeTab} onClick={setActiveTab} label="Work Hours" />
          <TabButton
            id="manual"
            activeTab={activeTab}
            onClick={setActiveTab}
            label="Manual Booking"
          />
        </div>

        {activeTab === 'overview' ? (
          <>
            <div style={styles.statGrid}>
              <StatCard label="Today’s Bookings" value={todayTotal} />
              <StatCard label="Upcoming Appointments" value={upcomingTotal} />
              <StatCard label="Booked Online" value={onlineTotal} />
            </div>

            <section style={styles.panel}>
              <h2 style={styles.panelTitle}>Upcoming bookings</h2>
              <div style={styles.tableHeader}>
                <span>Customer</span>
                <span>Service</span>
                <span>Date</span>
                <span>Time</span>
                <span>Source</span>
                <span>Status</span>
              </div>
              {bookings.map((booking) => (
                <div key={booking.id} style={styles.tableRow}>
                  <span>{booking.customerName}</span>
                  <span>{booking.service}</span>
                  <span>{booking.date}</span>
                  <span>{booking.time}</span>
                  <span>{booking.source}</span>
                  <span>{booking.status}</span>
                </div>
              ))}
            </section>
          </>
        ) : null}

        {activeTab === 'hours' ? (
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>Work hours</h2>
            <p style={styles.helper}>
              Set each day to open or closed, then add one or more time ranges for split shifts.
            </p>
            <button
              type="button"
              onClick={handleSaveWorkHours}
              style={styles.primaryButton}
              disabled={savingHours}
            >
              {savingHours ? 'Saving…' : 'Save work hours to Google Sheets'}
            </button>
            <div style={styles.hoursGrid}>
              {WEEK_DAYS.map((day) => (
                <WorkHoursDayCard
                  key={day}
                  day={day}
                  dayHours={workHours[day]}
                  onToggleOpen={updateDayOpenState}
                  onShiftChange={updateShift}
                  onAddShift={addShift}
                  onRemoveShift={removeShift}
                />
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'manual' ? (
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>Add booking from phone/text</h2>
            <form onSubmit={handleAddManualBooking} style={styles.form}>
              <label style={styles.label} htmlFor="customerName">
                Customer name
              </label>
              <input
                id="customerName"
                name="customerName"
                value={manualBooking.customerName}
                onChange={handleManualBookingChange}
                style={styles.input}
                required
              />

              <label style={styles.label} htmlFor="service">
                Service
              </label>
              <select
                id="service"
                name="service"
                value={manualBooking.service}
                onChange={handleManualBookingChange}
                style={styles.input}
              >
                <option>Swedish Massage</option>
                <option>Deep Tissue</option>
                <option>Prenatal Massage</option>
                <option>Aromatherapy</option>
              </select>

              <div style={styles.inlineFields}>
                <div style={styles.inlineField}>
                  <label style={styles.label} htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={manualBooking.date}
                    onChange={handleManualBookingChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inlineField}>
                  <label style={styles.label} htmlFor="time">
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={manualBooking.time}
                    onChange={handleManualBookingChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <label style={styles.label} htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={manualBooking.notes}
                onChange={handleManualBookingChange}
                style={styles.input}
                placeholder="Optional customer preferences or reminders"
              />

              <button type="submit" style={styles.primaryButton} disabled={savingBooking}>
                {savingBooking ? 'Saving…' : 'Save booking'}
              </button>
            </form>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function TabButton({ id, activeTab, onClick, label }) {
  const isActive = id === activeTab;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      style={{
        ...styles.tabButton,
        ...(isActive ? styles.tabButtonActive : null),
      }}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function WorkHoursDayCard({
  day,
  dayHours,
  onToggleOpen,
  onShiftChange,
  onAddShift,
  onRemoveShift,
}) {
  return (
    <div style={styles.hoursCard}>
      <div style={styles.dayHeader}>
        <strong>{day}</strong>
        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={dayHours.isOpen}
            onChange={(event) => onToggleOpen(day, event.target.checked)}
          />
          Open
        </label>
      </div>

      {dayHours.isOpen ? (
        <>
          {dayHours.shifts.map((shift, shiftIndex) => (
            <div key={`${day}-${shiftIndex}`} style={styles.shiftRow}>
              <input
                type="time"
                value={shift.start}
                onChange={(event) => onShiftChange(day, shiftIndex, 'start', event.target.value)}
                style={styles.input}
              />
              <span>to</span>
              <input
                type="time"
                value={shift.end}
                onChange={(event) => onShiftChange(day, shiftIndex, 'end', event.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.removeShiftButton}
                onClick={() => onRemoveShift(day, shiftIndex)}
                disabled={dayHours.shifts.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" style={styles.addShiftButton} onClick={() => onAddShift(day)}>
            + Add time range
          </button>
        </>
      ) : (
        <p style={styles.closedLabel}>Closed all day</p>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
    padding: '1.5rem',
    fontFamily: 'Lora, serif',
  },
  shell: {
    maxWidth: '980px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
  },
  card: {
    maxWidth: '420px',
    margin: '6rem auto',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
  },
  title: {
    margin: 0,
    color: '#065f46',
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
  panel: {
    marginTop: '1rem',
    border: '1px solid #d1fae5',
    borderRadius: '12px',
    padding: '1rem',
  },
  panelTitle: {
    marginTop: 0,
    color: '#065f46',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    color: '#065f46',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    fontSize: '0.95rem',
  },
  primaryButton: {
    marginTop: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    background: '#10b981',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #10b981',
    background: '#ffffff',
    color: '#047857',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    margin: 0,
    color: '#b91c1c',
    fontSize: '0.9rem',
  },
  helper: {
    margin: 0,
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  syncBanner: {
    margin: '0.75rem 0 0',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    color: '#065f46',
    fontSize: '0.9rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  tabButton: {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    background: '#ffffff',
    color: '#047857',
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabButtonActive: {
    background: '#10b981',
    color: '#ffffff',
    border: '1px solid #10b981',
  },
  statGrid: {
    marginTop: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
  },
  statCard: {
    border: '1px solid #d1fae5',
    borderRadius: '12px',
    padding: '1rem',
    background: '#f0fdf4',
  },
  statLabel: {
    margin: 0,
    color: '#065f46',
    fontSize: '0.9rem',
  },
  statValue: {
    margin: '0.5rem 0 0',
    color: '#064e3b',
    fontWeight: 700,
    fontSize: '1.5rem',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.25fr 1.2fr 1fr 0.8fr 0.8fr 0.9fr',
    gap: '0.5rem',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#065f46',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #d1fae5',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.25fr 1.2fr 1fr 0.8fr 0.8fr 0.9fr',
    gap: '0.5rem',
    padding: '0.55rem 0',
    borderBottom: '1px solid #ecfdf5',
    fontSize: '0.9rem',
    color: '#1f2937',
  },
  hoursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  hoursCard: {
    border: '1px solid #d1fae5',
    borderRadius: '10px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  shiftRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr auto',
    gap: '0.5rem',
    alignItems: 'center',
  },
  addShiftButton: {
    border: '1px dashed #6ee7b7',
    background: '#ecfdf5',
    color: '#047857',
    borderRadius: '8px',
    fontWeight: 600,
    padding: '0.45rem 0.75rem',
    cursor: 'pointer',
  },
  removeShiftButton: {
    border: '1px solid #fca5a5',
    background: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '8px',
    fontWeight: 600,
    padding: '0.45rem 0.6rem',
    cursor: 'pointer',
  },
  closedLabel: {
    margin: 0,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inlineFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  inlineField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
};

export default ProviderDashboard;

function parseWorkHoursFromSheet(rows) {
  const defaultHours = JSON.parse(JSON.stringify(DEFAULT_WORK_HOURS));

  rows.forEach((row) => {
    const setting = row[0] || '';
    const value = row[1] || '';
    if (!setting.startsWith('Work Hours ')) {
      return;
    }

    const day = setting.replace('Work Hours ', '');
    if (!defaultHours[day]) {
      return;
    }

    if (value === 'Closed') {
      defaultHours[day] = { ...defaultHours[day], isOpen: false };
      return;
    }

    try {
      const shifts = JSON.parse(value);
      if (Array.isArray(shifts) && shifts.length > 0) {
        defaultHours[day] = { isOpen: true, shifts };
        return;
      }
    } catch (error) {
      // fall through to legacy parser
    }

    const legacyMatch = value.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i);
    if (legacyMatch) {
      defaultHours[day] = {
        isOpen: true,
        shifts: [{ start: convertTo24Hour(legacyMatch[1]), end: convertTo24Hour(legacyMatch[2]) }],
      };
    }
  });

  return defaultHours;
}

function convertTo24Hour(timeString) {
  const date = new Date(`1970-01-01 ${timeString.toUpperCase().replace(/\s/g, '')}`);
  if (Number.isNaN(date.getTime())) {
    return '09:00';
  }
  return date.toTimeString().slice(0, 5);
}

function formatTimeForSheet(timeValue) {
  if (!timeValue.includes(':')) {
    return timeValue;
  }
  const [hourValue, minute] = timeValue.split(':');
  const hour = Number(hourValue);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelveHour = hour % 12 || 12;
  return `${String(twelveHour).padStart(2, '0')}:${minute} ${suffix}`;
}
