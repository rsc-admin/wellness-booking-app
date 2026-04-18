import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function WellnessBookingGoogleSheets() {
  const [step, setStep] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [sheetConfigured, setSheetConfigured] = useState(false);

  const SHEET_ID = '11gL7tepkPa6AlM996WGsSQKCax4REETFcalEyA3gnII';
  const API_KEY = 'AIzaSyDxncQSCK-IJNDVmp_mZsPgAFH_lHPacJ4';

  const services = [
    {
      id: 1,
      name: 'Swedish Massage',
      duration: '60 min',
      price: '$120',
      description: 'Relaxing full-body massage',
      icon: '💆',
      maxPerSlot: 1,
    },
    {
      id: 2,
      name: 'Deep Tissue',
      duration: '60 min',
      price: '$140',
      description: 'Therapeutic muscle tension relief',
      icon: '💪',
      maxPerSlot: 1,
    },
    {
      id: 3,
      name: 'Facial Treatment',
      duration: '45 min',
      price: '$95',
      description: 'Rejuvenating skincare session',
      icon: '✨',
      maxPerSlot: 2,
    },
    {
      id: 4,
      name: 'Yoga Class',
      duration: '75 min',
      price: '$60',
      description: 'Guided yoga & meditation',
      icon: '🧘',
      maxPerSlot: 10,
    },
    {
      id: 5,
      name: 'Aromatherapy',
      duration: '50 min',
      price: '$85',
      description: 'Essential oil therapy session',
      icon: '🌿',
      maxPerSlot: 2,
    },
    {
      id: 6,
      name: 'Hot Stone Therapy',
      duration: '60 min',
      price: '$130',
      description: 'Heated stone massage treatment',
      icon: '🪨',
      maxPerSlot: 1,
    },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  // Fetch bookings from Google Sheets on load
  useEffect(() => {
    if (SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE' && API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE') {
      fetchBookingsFromGoogleSheets();
      setSheetConfigured(true);
    }
  }, []);

  // Fetch bookings from Google Sheets
  const fetchBookingsFromGoogleSheets = async () => {
    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A:G?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.values && data.values.length > 1) {
        // Skip header row
        const fetchedBookings = data.values.slice(1).map((row) => ({
          date: row[2], // Date column
          time: row[3], // Time column
          serviceName: row[1], // Service name
          nickname: row[4],
          phone: row[5],
        }));
        setBookings(fetchedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add booking to Google Sheets
  const addBookingToGoogleSheets = async (bookingData) => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Bookings!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
      
      const bookingId = `AUTO-${String(bookings.length + 1).padStart(3, '0')}`;
      const date = selectedDate.toISOString().split('T')[0];
      const values = [[
        bookingId,
        selectedService.name,
        date,
        selectedTime,
        formData.nickname,
        formData.phone,
        'Confirmed',
      ]];

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  };

  // Check if a time slot is available
  const isSlotAvailable = (date, time, serviceName) => {
    if (!date || !serviceName) return false;

    const dateStr = date.toISOString().split('T')[0];
    const bookedCount = bookings.filter(
      (b) => b.date === dateStr && b.time === time && b.serviceName === serviceName
    ).length;

    const service = services.find((s) => s.name === serviceName);
    return bookedCount < (service?.maxPerSlot || 1);
  };

  // Get booking count for a slot
  const getBookingCount = (date, time, serviceName) => {
    if (!date || !serviceName) return 0;

    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(
      (b) => b.date === dateStr && b.time === time && b.serviceName === serviceName
    ).length;
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmBooking = async () => {
    if (formData.nickname && formData.phone && selectedDate && selectedTime) {
      setLoading(true);

      if (sheetConfigured) {
        const success = await addBookingToGoogleSheets({
          nickname: formData.nickname,
          phone: formData.phone,
        });

        if (success) {
          // Add to local state for immediate UI update
          const dateStr = selectedDate.toISOString().split('T')[0];
          setBookings([
            ...bookings,
            {
              date: dateStr,
              time: selectedTime,
              serviceName: selectedService.name,
              nickname: formData.nickname,
              phone: formData.phone,
            },
          ]);
        }
      } else {
        // Demo mode - just add locally
        const dateStr = selectedDate.toISOString().split('T')[0];
        setBookings([
          ...bookings,
          {
            date: dateStr,
            time: selectedTime,
            serviceName: selectedService.name,
            nickname: formData.nickname,
            phone: formData.phone,
          },
        ]);
      }

      setBookingConfirmed(true);
      setLoading(false);

      setTimeout(() => {
        setStep('services');
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime('');
        setFormData({ nickname: '', phone: '' });
        setBookingConfirmed(false);
      }, 3000);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:wght@400;500&display=swap');
        `}</style>
        <div className="text-center max-w-md">
          <div className="mb-6 animate-bounce">
            <Check className="w-20 h-20 mx-auto text-emerald-600" strokeWidth={1.5} />
          </div>
          <h2
            className="text-4xl font-bold text-emerald-900 mb-3"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Booking Confirmed!
          </h2>
          <p className="text-emerald-700 text-lg mb-2">
            {selectedService?.name} on {selectedDate && formatDate(selectedDate)} at{' '}
            {selectedTime}
          </p>
          <p className="text-emerald-600 text-sm">
            See you soon, {formData.nickname}!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Lora', serif;
        }
        
        .wellness-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
          animation: fadeInDown 0.8s ease-out;
        }
        
        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          color: #065f46;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }
        
        .header p {
          color: #047857;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .config-banner {
          background: #fef3c7;
          border: 2px solid #fcd34d;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .config-banner.success {
          background: #dcfce7;
          border-color: #86efac;
        }
        
        .progress-bar {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          font-size: 0.9rem;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #cbd5e1;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .progress-step.active {
          color: #047857;
        }
        
        .progress-step.active .step-dot {
          background: #047857;
          color: white;
        }
        
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }
        
        .service-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(16, 185, 129, 0.15);
        }
        
        .service-card.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(240, 253, 244, 0.8), rgba(236, 253, 245, 0.8));
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .service-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #065f46;
          margin-bottom: 0.5rem;
        }
        
        .service-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .service-description {
          color: #6b7280;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .service-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #10b981;
          font-weight: 600;
        }
        
        .calendar-wrapper {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .calendar-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #065f46;
        }
        
        .calendar-nav-btn {
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          color: #047857;
          transition: all 0.3s ease;
        }
        
        .calendar-nav-btn:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .weekday {
          text-align: center;
          font-weight: 600;
          color: #047857;
          padding: 0.75rem 0;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: default;
          color: #9ca3af;
        }
        
        .calendar-day.other-month {
          color: #e5e7eb;
        }
        
        .calendar-day.available {
          background: #f0fdf4;
          color: #047857;
          cursor: pointer;
          border: 2px solid #d1fae5;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .calendar-day.available:hover {
          background: #d1fae5;
          border-color: #10b981;
          transform: scale(1.05);
        }
        
        .calendar-day.selected {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        
        .calendar-day.unavailable {
          color: #d1d5db;
          opacity: 0.6;
        }
        
        .availability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        
        .time-btn {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-family: 'Lora', serif;
          font-weight: 500;
          text-align: center;
        }
        
        .time-btn:hover:not(:disabled) {
          border-color: #10b981;
          background: #f0fdf4;
        }
        
        .time-btn.available {
          border-color: #10b981;
          color: #047857;
        }
        
        .time-btn.selected {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        
        .time-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f4f6;
          color: #9ca3af;
        }
        
        .slot-info {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          opacity: 0.8;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #065f46;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'Lora', serif;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-family: 'Lora', serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }
        
        .btn-primary {
          background: #10b981;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }
        
        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: white;
          color: #10b981;
          border: 2px solid #10b981;
        }
        
        .btn-secondary:hover {
          background: #f0fdf4;
          transform: translateY(-2px);
        }
        
        .summary-box {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 95, 70, 0.05));
          border: 2px solid #d1fae5;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .summary-title {
          color: #065f46;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #ccfbf1;
          color: #047857;
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .summary-label {
          font-weight: 500;
        }
        
        .summary-value {
          color: #065f46;
          font-weight: 600;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #10b981;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>

      <div className="wellness-container">
        <div className="header">
          <h1>Serenity Wellness</h1>
          <p>Book Your Perfect Wellness Experience</p>
        </div>

        {!sheetConfigured && (
          <div className="config-banner">
            <AlertCircle className="flex-shrink-0 text-amber-700" size={20} />
            <div>
              <strong>Demo Mode:</strong> Replace SHEET_ID and API_KEY at the top of the code with your
              actual Google Sheets values to enable real data syncing. See setup instructions below.
            </div>
          </div>
        )}

        {sheetConfigured && (
          <div className="config-banner success">
            <Check className="flex-shrink-0 text-green-700" size={20} />
            <div>
              <strong>Connected!</strong> Bookings are syncing with your Google Sheet.
            </div>
          </div>
        )}

        <div className="progress-bar">
          <div className={`progress-step ${step === 'services' ? 'active' : ''}`}>
            <div className="step-dot">1</div>
            <span>Service</span>
          </div>
          <div className={`progress-step ${step === 'date' ? 'active' : ''}`}>
            <div className="step-dot">2</div>
            <span>Date & Time</span>
          </div>
          <div className={`progress-step ${step === 'details' ? 'active' : ''}`}>
            <div className="step-dot">3</div>
            <span>Details</span>
          </div>
        </div>

        {step === 'services' && (
          <div>
            <div className="service-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <div className="service-name">{service.name}</div>
                  <div className="service-meta">
                    <span>⏱ {service.duration}</span>
                  </div>
                  <div className="service-description">{service.description}</div>
                  <div className="service-price">{service.price}</div>
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                className="btn btn-primary"
                disabled={!selectedService}
                onClick={() => setStep('date')}
              >
                Continue to Date & Time
              </button>
            </div>
          </div>
        )}

        {step === 'date' && (
          <div>
            <div className="summary-box">
              <div className="summary-title">Selected Service</div>
              <div className="summary-item">
                <span className="summary-label">
                  {selectedService?.icon} {selectedService?.name}
                </span>
                <span className="summary-value">{selectedService?.price}</span>
              </div>
            </div>

            <div className="calendar-wrapper">
              <div className="calendar-header">
                <h3 className="calendar-title">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="calendar-nav-btn"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                      )
                    }
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="calendar-nav-btn"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                      )
                    }
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-days">
                {getCalendarDays().map((date, idx) => {
                  if (!date) {
                    return (
                      <div key={`empty-${idx}`} className="calendar-day other-month"></div>
                    );
                  }

                  const hasAvailability = timeSlots.some((time) =>
                    isSlotAvailable(date, time, selectedService?.name)
                  );
                  const isSelected =
                    selectedDate && date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={date.toISOString()}
                      className={`calendar-day ${!hasAvailability ? 'unavailable' : 'available'} ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => hasAvailability && setSelectedDate(date)}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3
                  style={{
                    color: '#065f46',
                    marginBottom: '1.5rem',
                    fontFamily: 'Playfair Display',
                    fontSize: '1.5rem',
                  }}
                >
                  Available Times for {formatDate(selectedDate)}
                </h3>
                <div className="availability-grid">
                  {timeSlots.map((time) => {
                    const available = isSlotAvailable(
                      selectedDate,
                      time,
                      selectedService?.name
                    );
                    const bookingCount = getBookingCount(
                      selectedDate,
                      time,
                      selectedService?.name
                    );
                    const maxSlots = selectedService?.maxPerSlot || 1;

                    return (
                      <button
                        key={time}
                        className={`time-btn ${available ? 'available' : ''} ${
                          selectedTime === time ? 'selected' : ''
                        } ${!available ? 'disabled' : ''}`}
                        onClick={() => available && setSelectedTime(time)}
                        disabled={!available}
                      >
                        {time}
                        <div className="slot-info">
                          {bookingCount}/{maxSlots} booked
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setStep('services')}>
                Back
              </button>
              <button
                className="btn btn-primary"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('details')}
              >
                Continue to Details
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div>
            <div className="summary-box">
              <div className="summary-title">Booking Summary</div>
              <div className="summary-item">
                <span className="summary-label">Service</span>
                <span className="summary-value">{selectedService?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date</span>
                <span className="summary-value">{selectedDate && formatDate(selectedDate)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time</span>
                <span className="summary-value">{selectedTime}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Price</span>
                <span className="summary-value">{selectedService?.price}</span>
              </div>
            </div>

            <h3
              style={{
                color: '#065f46',
                marginBottom: '1.5rem',
                fontFamily: 'Playfair Display',
                fontSize: '1.5rem',
              }}
            >
              Your Information
            </h3>

            <div className="form-group">
              <label className="form-label">Nickname</label>
              <input
                type="text"
                name="nickname"
                className="form-input"
                value={formData.nickname}
                onChange={handleFormChange}
                placeholder="Alex"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setStep('date')}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmBooking}
                disabled={!formData.nickname || !formData.phone || loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span> Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
