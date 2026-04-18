import React, { useEffect, useMemo, useState } from 'react';

const SHEET_ID = '11gL7tepkPa6AlM996WGsSQKCax4REETFcalEyA3gnII';
const API_KEY = 'AIzaSyDxncQSCK-IJNDVmp_mZsPgAFH_lHPacJ4';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_WORK_HOURS = WEEK_DAYS.reduce((accumulator, day) => {
  accumulator[day] = {
    isOpen: day !== 'Sunday',
    shifts: [
      day === 'Saturday'
        ? { start: '10:00', end: '14:00' }
        : { start: '09:00', end: '17:00' },
    ],
  };
  return accumulator;
}, {});

const FALLBACK_BOOKINGS = [
  {
    id: 1,
    customerName: 'Ava Thompson',
    service: 'Swedish Massage',
    date: '2026-04-20',
    time: '10:00 AM',
    source: 'Online',
    status: 'Confirmed',
    notes: '',
  },
  {
    id: 2,
    customerName: 'Mia Lopez',
    service: 'Deep Tissue',
    date: '2026-04-20',
    time: '01:30 PM',
    source: 'Manual',
    status: 'Confirmed',
    notes: '',
  },
];

export default function ProviderDashboard({ onBack }) {
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState(FALLBACK_BOOKINGS);
  const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS);

  const [loadingData, setLoadingData] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  useEffect(() => {
    if (isLoggedIn) {
      void fetchProviderData();
      const localHours = loadWorkHoursFromLocalBackup();
      if (localHours) {
        setWorkHours(localHours);
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (pin === '2468') {
      setIsLoggedIn(true);
      setError('');
      setPin('');
      return;
    }
    setError('Invalid PIN. Please try again.');
  };

  const fetchProviderData = async () => {
    setLoadingData(true);
    setStatusMessage('');
    try {
      const [bookingsResponse, settingsResponse] = await Promise.all([
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A:J?key=${API_KEY}`),
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Provider%20Settings!A:B?key=${API_KEY}`),
      ]);

      const bookingsData = await bookingsResponse.json();
      const settingsData = await settingsResponse.json();

      if (Array.isArray(bookingsData.values) && bookingsData.values.length > 1) {
        const mappedBookings = bookingsData.values.slice(1).map((row, index) => ({
          id: `${row[0] || 'sheet'}-${index}`,
          customerName: row[4] || 'Unknown',
          service: row[1] || 'Service',
          date: row[2] || '',
          time: row[3] || '',
          status: row[6] || 'Confirmed',
          notes: row[7] || '',
          source: row[9] || 'Online',
        }));
        setBookings(mappedBookings);
      }

      if (Array.isArray(settingsData.values) && settingsData.values.length > 0) {
        setWorkHours(parseWorkHoursRows(settingsData.values));
      }
    } catch (fetchError) {
      setStatusMessage('Could not sync from Google Sheets. Using local dashboard data.');
    } finally {
      setLoadingData(false);
    }
  };

  const updateShift = (day, index, field, value) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        shifts: previous[day].shifts.map((shift, shiftIndex) =>
          shiftIndex === index ? { ...shift, [field]: value } : shift
        ),
      },
    }));
  };

  const toggleDayOpen = (day, isOpen) => {
    setWorkHours((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isOpen,
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

  const removeShift = (day, index) => {
    setWorkHours((previous) => {
      const nextShifts = previous[day].shifts.filter((_, shiftIndex) => shiftIndex !== index);
      return {
        ...previous,
        [day]: {
          ...previous[day],
          shifts: nextShifts.length ? nextShifts : [{ start: '09:00', end: '17:00' }],
        },
      };
    });
  };

  const handleManualBookingSave = async (event) => {
    event.preventDefault();
    if (!manualBooking.customerName || !manualBooking.date || !manualBooking.time) {
      setStatusMessage('Please fill in name, date, and time.');
      return;
    }

    const booking = {
      id: Date.now(),
      customerName: manualBooking.customerName,
      service: manualBooking.service,
      date: manualBooking.date,
      time: formatTimeForSheet(manualBooking.time),
      status: 'Confirmed',
      notes: manualBooking.notes,
      source: 'Manual',
    };

    setSavingBooking(true);
    const saved = await appendManualBookingToSheet(booking);
    setSavingBooking(false);

    if (!saved) {
      setStatusMessage('Failed to save manual booking to Google Sheets.');
      return;
    }

    setBookings((previous) => [...previous, booking]);
    setManualBooking({ customerName: '', service: 'Swedish Massage', date: '', time: '', notes: '' });
    setStatusMessage('Manual booking saved to Google Sheets.');
    setActiveTab('overview');
  };

  const appendManualBookingToSheet = async (booking) => {
    try {
      const payload = {
        values: [[
          `MANUAL-${Date.now()}`,
          booking.service,
          booking.date,
          booking.time,
          booking.customerName,
          'N/A',
          booking.status,
          booking.notes || '',
          new Date().toISOString(),
          'Manual',
        ]],
      };

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      return response.ok;
    } catch (appendError) {
      return false;
    }
  };

  const handleWorkHoursSave = async () => {
    setSavingHours(true);
    const result = await appendWorkHoursToSheet(workHours);
    setSavingHours(false);

    if (result.ok) {
      setStatusMessage('Work hours saved to Google Sheets.');
      return;
    }

    saveWorkHoursToLocalBackup(workHours);
    setStatusMessage(
      `Could not save to Google Sheets (${result.error}). Saved locally on this device instead.`
    );
  };

  const appendWorkHoursToSheet = async (hours) => {
    try {
      const values = WEEK_DAYS.map((day) => [
        `Work Hours ${day}`,
        serializeWorkHoursValue(hours[day]),
      ]);

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Provider%20Settings!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        return { ok: false, error: `${response.status} ${response.statusText} ${body}` };
      }

      return { ok: true, error: '' };
    } catch (saveError) {
      return { ok: false, error: saveError?.message || 'unknown network error' };
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Provider Dashboard</h1>
          <p style={styles.subtitle}>Use your provider PIN to manage bookings and work hours.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label} htmlFor="provider-pin">4-digit PIN</label>
            <input
              id="provider-pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              style={styles.input}
              maxLength={4}
              inputMode="numeric"
            />
            {error ? <p style={styles.error}>{error}</p> : null}
            <button type="submit" style={styles.primaryButton}>Sign in</button>
            <p style={styles.helper}>Demo PIN: 2468</p>
            <button type="button" style={styles.secondaryButton} onClick={onBack}>← Back</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Serenity Provider Hub</h1>
            <p style={styles.subtitle}>Bookings, work hours, and manual entries in one place.</p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={onBack}>Sign out</button>
        </div>

        {statusMessage ? <p style={styles.banner}>{statusMessage}</p> : null}
        {loadingData ? <p style={styles.helper}>Loading Google Sheets data…</p> : null}

        <div style={styles.tabs}>
          {['overview', 'hours', 'manual'].map((tab) => (
            <button
              key={tab}
              type="button"
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : null) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? 'Overview' : tab === 'hours' ? 'Work Hours' : 'Manual Booking'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' ? (
          <>
            <div style={styles.stats}>
              <StatCard label="Today" value={todayTotal} />
              <StatCard label="Upcoming" value={bookings.length} />
              <StatCard label="Manual" value={bookings.filter((booking) => booking.source === 'Manual').length} />
            </div>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Upcoming bookings</h2>
              {bookings.map((booking) => (
                <div key={booking.id} style={styles.row}>
                  <span>{booking.customerName}</span>
                  <span>{booking.service}</span>
                  <span>{booking.date}</span>
                  <span>{booking.time}</span>
                  <span>{booking.source}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === 'hours' ? (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Work hours</h2>
            <button type="button" style={styles.primaryButton} onClick={handleWorkHoursSave} disabled={savingHours}>
              {savingHours ? 'Saving…' : 'Save work hours'}
            </button>
            <div style={styles.hoursGrid}>
              {WEEK_DAYS.map((day) => (
                <div key={day} style={styles.dayCard}>
                  <div style={styles.dayHeader}>
                    <strong>{day}</strong>
                    <label>
                      <input
                        type="checkbox"
                        checked={workHours[day].isOpen}
                        onChange={(event) => toggleDayOpen(day, event.target.checked)}
                      />{' '}
                      Open
                    </label>
                  </div>

                  {workHours[day].isOpen ? (
                    <>
                      {workHours[day].shifts.map((shift, index) => (
                        <div key={`${day}-${index}`} style={styles.shiftBlock}>
                          <div style={styles.shiftRow}>
                            <input
                              type="time"
                              value={shift.start}
                              onChange={(event) => updateShift(day, index, 'start', event.target.value)}
                              style={styles.input}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={shift.end}
                              onChange={(event) => updateShift(day, index, 'end', event.target.value)}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.shiftActions}>
                            <button
                              type="button"
                              style={styles.removeButton}
                              onClick={() => removeShift(day, index)}
                              disabled={workHours[day].shifts.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" style={styles.ghostButton} onClick={() => addShift(day)}>
                        + Add range
                      </button>
                    </>
                  ) : (
                    <p style={styles.helper}>Closed all day</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'manual' ? (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Manual booking</h2>
            <form style={styles.form} onSubmit={handleManualBookingSave}>
              <input
                name="customerName"
                value={manualBooking.customerName}
                onChange={(event) => setManualBooking((previous) => ({ ...previous, customerName: event.target.value }))}
                style={styles.input}
                placeholder="Customer name"
                required
              />
              <select
                name="service"
                value={manualBooking.service}
                onChange={(event) => setManualBooking((previous) => ({ ...previous, service: event.target.value }))}
                style={styles.input}
              >
                <option>Swedish Massage</option>
                <option>Deep Tissue</option>
                <option>Prenatal Massage</option>
                <option>Aromatherapy</option>
              </select>
              <div style={styles.inline}>
                <input
                  type="date"
                  value={manualBooking.date}
                  onChange={(event) => setManualBooking((previous) => ({ ...previous, date: event.target.value }))}
                  style={styles.input}
                  required
                />
                <input
                  type="time"
                  value={manualBooking.time}
                  onChange={(event) => setManualBooking((previous) => ({ ...previous, time: event.target.value }))}
                  style={styles.input}
                  required
                />
              </div>
              <textarea
                rows={3}
                value={manualBooking.notes}
                onChange={(event) => setManualBooking((previous) => ({ ...previous, notes: event.target.value }))}
                style={styles.input}
                placeholder="Notes"
              />
              <button type="submit" style={styles.primaryButton} disabled={savingBooking}>
                {savingBooking ? 'Saving…' : 'Save booking'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
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

function parseWorkHoursRows(rows) {
  const parsed = JSON.parse(JSON.stringify(DEFAULT_WORK_HOURS));

  rows.forEach((row) => {
    const setting = row[0] || '';
    const value = row[1] || '';
    if (!setting.startsWith('Work Hours ')) return;

    const day = setting.replace('Work Hours ', '');
    if (!parsed[day]) return;

    if (value === 'Closed') {
      parsed[day] = { ...parsed[day], isOpen: false };
      return;
    }

    const parsedDayValue = parseWorkHoursValue(value);
    if (parsedDayValue) {
      parsed[day] = parsedDayValue;
    }
  });

  return parsed;
}

function serializeWorkHoursValue(dayHours) {
  if (!dayHours.isOpen) {
    return 'Closed';
  }

  // Human-readable + easy to parse back:
  // Open|09:00-12:00,13:00-17:00
  const ranges = dayHours.shifts.map((shift) => `${shift.start}-${shift.end}`).join(',');
  return `Open|${ranges}`;
}

function parseWorkHoursValue(value) {
  if (!value) {
    return null;
  }

  // Current format: Open|09:00-12:00,13:00-17:00
  if (value.startsWith('Open|')) {
    const rangePart = value.split('|')[1] || '';
    const shifts = rangePart
      .split(',')
      .map((range) => {
        const [start, end] = range.split('-');
        if (!start || !end) {
          return null;
        }
        return { start: start.trim(), end: end.trim() };
      })
      .filter(Boolean);

    if (shifts.length > 0) {
      return { isOpen: true, shifts };
    }
  }

  // Backward compatibility: JSON array
  try {
    const shifts = JSON.parse(value);
    if (Array.isArray(shifts) && shifts.length > 0) {
      return { isOpen: true, shifts };
    }
  } catch (parseError) {
    // continue to legacy fallback
  }

  // Backward compatibility: 09:00 AM - 05:00 PM
  const legacyMatch = value.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i);
  if (legacyMatch) {
    return {
      isOpen: true,
      shifts: [
        {
          start: convertTo24Hour(legacyMatch[1]),
          end: convertTo24Hour(legacyMatch[2]),
        },
      ],
    };
  }

  return null;
}

function formatTimeForSheet(time24h) {
  const [hourText, minute] = time24h.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${minute} ${suffix}`;
}

function convertTo24Hour(time12h) {
  const normalized = time12h.toUpperCase().replace(/\s/g, '');
  const match = normalized.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) {
    return '09:00';
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3];

  if (period === 'PM' && hours < 12) {
    hours += 12;
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

function saveWorkHoursToLocalBackup(hours) {
  try {
    window.localStorage.setItem('provider_work_hours_backup', JSON.stringify(hours));
  } catch (error) {
    // ignore local storage failures
  }
}

function loadWorkHoursFromLocalBackup() {
  try {
    const raw = window.localStorage.getItem('provider_work_hours_backup');
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    return null;
  }
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', fontFamily: 'Lora, serif' },
  shell: { maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(15,23,42,.08)' },
  card: { maxWidth: '420px', margin: '5rem auto', background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px rgba(15,23,42,.08)' },
  title: { margin: 0, color: '#065f46', fontFamily: 'Playfair Display, serif', fontSize: '2rem' },
  subtitle: { margin: '.5rem 0 1rem', color: '#6b7280' },
  panel: { marginTop: '1rem', border: '1px solid #d1fae5', borderRadius: '12px', padding: '1rem' },
  panelTitle: { margin: '0 0 .75rem', color: '#065f46' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' },
  banner: { margin: '.75rem 0 0', padding: '.6rem .75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46' },
  tabs: { display: 'flex', gap: '.5rem', marginTop: '1rem' },
  tab: { padding: '.6rem 1rem', borderRadius: '8px', border: '1px solid #a7f3d0', background: '#fff', color: '#047857', fontWeight: 600, cursor: 'pointer' },
  activeTab: { background: '#10b981', color: '#fff', borderColor: '#10b981' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '.75rem', marginTop: '1rem' },
  statCard: { border: '1px solid #d1fae5', borderRadius: '12px', padding: '1rem', background: '#f0fdf4' },
  statLabel: { margin: 0, color: '#065f46' },
  statValue: { margin: '.5rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#064e3b' },
  row: { display: 'grid', gridTemplateColumns: '1.2fr 1.1fr 1fr .8fr .8fr', gap: '.5rem', borderBottom: '1px solid #ecfdf5', padding: '.5rem 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '.75rem' },
  label: { color: '#065f46', fontWeight: 600 },
  input: { padding: '.6rem .75rem', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '.95rem' },
  inline: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' },
  primaryButton: { padding: '.75rem 1rem', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  secondaryButton: { padding: '.75rem 1rem', borderRadius: '8px', border: '1px solid #10b981', background: '#fff', color: '#047857', fontWeight: 600, cursor: 'pointer' },
  ghostButton: { padding: '.4rem .65rem', borderRadius: '8px', border: '1px dashed #6ee7b7', background: '#ecfdf5', color: '#047857', fontWeight: 600, cursor: 'pointer' },
  removeButton: { padding: '.38rem .65rem', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#b91c1c', fontWeight: 600, cursor: 'pointer' },
  error: { margin: 0, color: '#b91c1c' },
  helper: { margin: 0, color: '#6b7280', fontSize: '.9rem' },
  hoursGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '.75rem', marginTop: '.75rem' },
  dayCard: { border: '1px solid #d1fae5', borderRadius: '10px', padding: '.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem' },
  dayHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  shiftBlock: { border: '1px solid #d1fae5', borderRadius: '8px', padding: '.5rem', background: '#ffffff' },
  shiftRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', gap: '.5rem', alignItems: 'center' },
  shiftActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '.45rem' },
};
