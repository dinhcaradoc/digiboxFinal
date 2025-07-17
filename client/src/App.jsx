// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import PrivateLayout from './components/layout/PrivateLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhoneVerification from './pages/PhoneVerification';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import QuickBox from './pages/QuickBox';
import Uploads from './pages/Uploads';

// Optional: Enterprise page if it exists
// import Enterprise from './pages/Enterprise';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Area (Landing, optional Enterprise) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              {/* <Route path="/enterprise" element={<Enterprise />} /> */}
            </Route>

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/phone" element={<PhoneVerification />} />

            {/* Protected Pages */}
            <Route
              element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/uploads" element={<Uploads />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/quickbox" element={<QuickBox />} />
              {/* If you also want to support /priority as an alias, add: */}
              {/* <Route path="/priority" element={<QuickBox />} /> */}
            </Route>

            {/* Catch-all: optionally redirect to home or show a 404 page */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;