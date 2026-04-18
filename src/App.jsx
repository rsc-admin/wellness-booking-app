import React, { useState } from 'react';
import './App.css';
import WellnessBookingGoogleSheets from './components/WellnessBookingGoogleSheets';
import ProviderDashboard from './components/ProviderDashboard';

function App() {
  const [userType, setUserType] = useState(null); // 'customer' or 'provider'

  if (!userType) {
    return (
      <div className="app-selector">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:wght@400;500&display=swap');
          
          .app-selector {
            min-height: 100vh;
            background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            font-family: 'Lora', serif;
          }
          
          .selector-card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .selector-card h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            color: #065f46;
            margin-bottom: 1rem;
          }
          
          .selector-card p {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 1.1rem;
          }
          
          .button-group {
            display: flex;
            gap: 1rem;
            flex-direction: column;
          }
          
          .btn {
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-family: 'Lora', serif;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .btn-customer {
            background: #10b981;
            color: white;
          }
          
          .btn-customer:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
          }
          
          .btn-provider {
            background: white;
            color: #10b981;
            border: 2px solid #10b981;
          }
          
          .btn-provider:hover {
            background: #f0fdf4;
            transform: translateY(-2px);
          }
        `}</style>
        <div className="selector-card">
          <h1>Serenity Wellness</h1>
          <p>Are you a customer or provider?</p>
          <div className="button-group">
            <button
              className="btn btn-customer"
              onClick={() => setUserType('customer')}
            >
              📱 I'm a Customer - Book an Appointment
            </button>
            <button
              className="btn btn-provider"
              onClick={() => setUserType('provider')}
            >
              🔑 I'm a Provider - Manage Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'customer') {
    return <WellnessBookingGoogleSheets />;
  }

  if (userType === 'provider') {
    return <ProviderDashboard onBack={() => setUserType(null)} />;
  }
}

export default App;
