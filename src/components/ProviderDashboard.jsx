import React, { useMemo, useState } from 'react';

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
  Monday: { isOpen: true, open: '09:00', close: '17:00' },
  Tuesday: { isOpen: true, open: '09:00', close: '17:00' },
  Wednesday: { isOpen: true, open: '09:00', close: '17:00' },
  Thursday: { isOpen: true, open: '09:00', close: '17:00' },
  Friday: { isOpen: true, open: '09:00', close: '17:00' },
  Saturday: { isOpen: true, open: '10:00', close: '14:00' },
  Sunday: { isOpen: false, open: '09:00', close: '17:00' },
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

  const updateHours = (day, field, value) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        [field]: value,
      },
    }));
  };

  const handleManualBookingChange = (event) => {
    const { name, value } = event.target;
    setManualBooking((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddManualBooking = (event) => {
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

    setBookings((previous) =>
      [...previous, booking].sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      )
    );

    setManualBooking({
      customerName: '',
      service: 'Swedish Massage',
      date: '',
      time: '',
      notes: '',
    });
    setActiveTab('overview');
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
            <p style={styles.helper}>Set each day to open or closed, then choose opening hours.</p>
            <div style={styles.hoursGrid}>
              {WEEK_DAYS.map((day) => {
                const dayHours = workHours[day];
                return (
                  <div key={day} style={styles.hoursCard}>
                    <strong>{day}</strong>
                    <label style={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={dayHours.isOpen}
                        onChange={(event) => updateHours(day, 'isOpen', event.target.checked)}
                      />
                      Open
                    </label>
                    <div style={styles.timeRow}>
                      <input
                        type="time"
                        value={dayHours.open}
                        disabled={!dayHours.isOpen}
                        onChange={(event) => updateHours(day, 'open', event.target.value)}
                        style={styles.input}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={dayHours.close}
                        disabled={!dayHours.isOpen}
                        onChange={(event) => updateHours(day, 'close', event.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                );
              })}
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

              <button type="submit" style={styles.primaryButton}>
                Save booking
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
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  timeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '0.5rem',
    alignItems: 'center',
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
