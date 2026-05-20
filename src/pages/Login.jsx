import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 💡 ব্যাকআপ ইউআরএল সেট করা হলো যেন লোকালহোস্টে পোর্ট মিস না হয়
// এটাকে এমন করে দাও যাতে সে সরাসরি তোমার Render লিঙ্কটিই পায়:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://complaint-box-gx87.onrender.com';
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        // ডাটা পাঠানোর সময় ইমেইলটি ছোট হাতের (toLowerCase) করে ট্রিম করে পাঠানো হচ্ছে
        const response = await axios.post(`${API_BASE_URL}/api/login`, { 
            email: email.trim().toLowerCase(), 
            password: password 
        });

        if (response.data.success) {
            const userData = response.data.user;

            // ১. ইউজারের তথ্য ব্রাউজারে সেভ করা
            localStorage.setItem('user', JSON.stringify(userData));

            // ২. রোল চেক করে সঠিক ড্যাশবোর্ডে পাঠানো
            const userRole = userData.role.toLowerCase();

            if (userRole === 'admin') {
                console.log("Redirecting to Admin Panel...");
                navigate('/admin');
            } else {
                console.log("Redirecting to User Dashboard...");
                navigate('/dashboard');
            }
        }
    } catch (err) {
        // সার্ভার থেকে আসা সঠিক এরর মেসেজ দেখানো
        setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"></div>
            <h2>🔐Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>

          <div className="auth-body">
            {error && <div className="alert alert-error">{error}</div>}

            <form id="loginForm" className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">✉️</span>
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="student@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit">Sign In</button>
            </form>

            <div className="demo-credentials">
              <h4>Demo Credentials:</h4>
              <p><strong>Student:</strong> Any @school.edu email (pass: 6+ chars)</p>
              <p><strong>Admin:</strong> admin@school.edu / admin123</p>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
};

export default Login;