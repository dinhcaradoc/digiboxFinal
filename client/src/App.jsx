import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import PhoneVerification from './pages/PhoneVerification'; // Add this component

// Layout for public pages (with Navbar)
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <HelmetProvider> {/* Wrap the entire app with HelmetProvider */}
    <Router>
      <Routes>
        {/* Public pages with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          {/* Add more public routes here */}
        </Route>

        {/* Auth pages WITHOUT Navbar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone" element={<PhoneVerification />} />

        {/* Private/protected pages (add later) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
    </HelmetProvider>
  );
}

export default App;