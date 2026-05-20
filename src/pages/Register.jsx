import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [strength, setStrength] = useState({ width: '0%', color: '', text: '' });

  // 💡 ব্যাকআপ ইউআরএল সেট করা হলো যেন ভুল ঠিকানা বা পোর্টে রিকোয়েস্ট না যায়
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Input Change Handle করা
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  // পাসওয়ার্ডের শক্তি পরীক্ষা করা
  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setStrength({ width: '0%', color: '', text: '' });
      return;
    }
    
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 0:
      case 1:
        setStrength({ width: '25%', color: '#ff4d4d', text: 'Weak' });
        break;
      case 2:
        setStrength({ width: '50%', color: '#ffa500', text: 'Fair' });
        break;
      case 3:
        setStrength({ width: '75%', color: '#2ecc71', text: 'Good' });
        break;
      case 4:
        setStrength({ width: '100%', color: '#27ae60', text: 'Strong' });
        break;
      default:
        break;
    }
  };

  // ফর্ম সাবমিট করা এবং ব্যাকএন্ডে ডাটা পাঠানো
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // ১. পাসওয়ার্ড কনফার্মেশন চেক
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'পাসওয়ার্ড মিলছে না!' });
      return;
    }

    // ২. ইমেইল ভ্যালিডেশন
    if (!formData.email.toLowerCase().endsWith('@school.edu')) {
      setMessage({ type: 'error', text: 'দয়া করে আপনার @school.edu ইমেইল ব্যবহার করুন।' });
      return;
    }

    try {
      // ব্যাকএন্ড API-তে নিখুঁত ফরম্যাটে ডাটা পাঠানো
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        name: formData.name.trim(),       
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        studentId: formData.studentId.trim() // 👈 ডাটাবেজ কলামের সাথে ম্যাচ করে পাঠানো হচ্ছে
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✓ রেজিস্ট্রেশন সফল! লগইন পেজে নিয়ে যাওয়া হচ্ছে...' });
        
        // ২ সেকেন্ড পর লগইন পেজে পাঠানো
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      // সার্ভার থেকে আসা সঠিক এরর মেসেজ দেখানো
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' 
      });
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
            <h2>👤Create Account</h2>
            <p>Join our school community and start reporting facility issues</p>
          </div>

          <div className="auth-body">
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            <form id="registerForm" className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">✉️</span> School Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.name@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <small className="input-hint">Use your official school email address</small>
              </div>

              <div className="form-group">
                <label htmlFor="studentId">
                  <span className="label-icon">🎓</span> Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="e.g., 2024001234"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span> Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <small className="input-hint">Minimum 6 characters</small>

                {/* Password Strength Indicator */}
                <div className="password-strength" style={{ display: formData.password ? 'block' : 'none', marginTop: '8px' }}>
                  <div className="strength-bar" style={{ height: '4px', background: '#eee', borderRadius: '2px' }}>
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: strength.width, 
                        backgroundColor: strength.color,
                        height: '100%',
                        transition: 'all 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ fontSize: '12px', color: strength.color }}>{strength.text}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">🔒</span> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>By registering, you agree to use this system responsibly.</p>
              </div>

              <button type="submit" className="btn-submit">Create Account</button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            </div>
          </div>
        </div>    

        <div className="feature-mini">
          <h4>✓Quick Registration</h4>
          <p>Get started in less than a minute</p>
        </div>
      </div>    
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
};

export default Register;