// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import PublicLayout from './components/layout/PublicLayout';
import PrivateLayout from './components/layout/PrivateLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhoneVerification from './pages/PhoneVerification';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Priority from './pages/QuickBox';

function App() {
  const name = "John Doe"; // Replace with dynamic user data (e.g., from context or API)
  const handleLogout = () => {
    console.log("User logged out");
    // Call logout API and clear session storage here
  };

  return (
    <HelmetProvider> {/* Wrap the entire app with HelmetProvider */}
      <Router>
        <Routes>
          {/* Public Pages (with Navbar) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Auth Pages (without Navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/phone" element={<PhoneVerification />} />

          {/* Private Pages (with Header and Sidebar) */}
          <Route element={<PrivateLayout name={name} onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/priority" element={<Priority />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;