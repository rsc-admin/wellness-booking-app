import './App.css';
import WellnessBookingGoogleSheets from './components/WellnessBookingGoogleSheets';
import ProviderDashboard from './components/ProviderDashboard';

function App() {
  const query = new URLSearchParams(window.location.search);
  const portal = String(query.get('portal') || '').toLowerCase();
  const pathRoute = `${window.location.pathname}${window.location.hash}`.toLowerCase();
  const isProviderPortal =
    portal === 'provider' ||
    pathRoute.includes('provider-dashboard') ||
    pathRoute.includes('dashboard');

  if (isProviderPortal) {
    return <ProviderDashboard onBack={() => window.location.assign('/')} />;
  }

  return <WellnessBookingGoogleSheets />;
}

export default App;
