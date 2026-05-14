import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/root.css'; 
import './assets/styles.css'; 
import './assets/admin-styles.css';
import './assets/dashboard-styles.css';
import './assets/auth.css';
import './assets/media.css';
import './assets/about.css';

// 1. Import all your page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* 2. Define the paths */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}

export default App;