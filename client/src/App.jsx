import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import other pages as needed

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
    <Router>
      <Routes>
        {/* Public pages with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          {/* Add more public routes here, e.g.: */}
          {/* <Route path="/enterprise" element={<Enterprise />} /> */}
        </Route>

        {/* Auth/Private pages WITHOUT Navbar */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add more private routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;