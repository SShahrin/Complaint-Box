import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const About = () => {
  return (
    <div className="about-page-wrapper">
      {/* Header */}
      <header className="header">
              <div className="container">
                <div className="logo">
                  <img className="logo-icon" src="/images/logo-img.png" alt="" />
                  <div className="logo-text">
                    <h1>Complaint Box</h1>
                    <p>Campus Management System</p>
                  </div>
                </div>
                <nav className="nav">
                  <Link to="/" className="btn-ghost">Home</Link>
                  <Link to="/register" className="btn-outline">Sign Up</Link>
                  <Link to="/login" className="btn-primary">Login</Link>
                </nav>
              </div>
            </header>

      {/* About Content */}
      <section className="about-section">
        <div className="container">

          <h1 className="section-title">About Complaint Box</h1>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
             className="about-block mission-block">
  <h2>Our Mission</h2>
  <p>
    Our mission is to bridge the gap between students and administration by providing 
    a fast, reliable, and transparent digital platform. We believe that every voice 
    matters, and every issue deserves a timely resolution to create a better campus life.
  </p>
</motion.div>

          {/* How It Works */}
          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                   className="about-block">
            <h2>How It Works</h2>

            <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                     className="features-grid about-features">

              <div className="feature-card">
                <div className="feature-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
  <path d="M10 10l2-2v8"></path>
</svg></div>
                <h3>Create Account</h3>
                <p>Register using your student email and ID.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="4"></rect>
  <path d="M8 8h8v3l-8 5h8"></path>
</svg></div>
                <h3>Submit Complaint</h3>
                <p>Describe the issue and set priority level.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="4"></rect>
  <path d="M8 8h8v3h-6v2h6v5h-8"></path>
</svg></div>
                <h3>Track Status</h3>
                <p>Monitor progress from pending to resolved.</p>
              </div>
              <div className="feature-card">
              <div className="feature-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="4"></rect>
  <path d="M15 17V7l-7 7h8"></path>
</svg></div>
              <h3>Ensure Security </h3>
              <p>Your information is protected and confidential</p>
            </div>

            
          </motion.div>
          </motion.div>

          {/* Features */}
           <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                     className="about-block">
            <h2>Key Features</h2>

            <ul className="about-list">
              <li>Easy complaint submission with categories</li>
              <li>Priority levels (Low, Medium, High, Urgent)</li>
              <li>Status tracking (Pending, In Progress, Resolved)</li>
              <li>Edit or delete pending complaints</li>
              <li>Secure authentication system</li>
              <li>Admin dashboard for management</li>
              <li>Fully responsive design</li>
            </ul>
          </motion.div>

          {/* CTA */}
        <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="about-cta">
            <h2>Ready to Get Started?</h2>
            <p>Join our community and help improve campus facilities.</p>

            <div className="about-cta-buttons">
              <Link to="/register" className="btn-white">
                Create Account
              </Link>
              <Link to="/login" className="btn-outline about-outline-light">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="about-contact">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> support@school.edu</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Office:</strong> Building A, Room 101</p>
            <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>Complaint Box</h3>
              <p>Making campus facilities better, one report at a time.</p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>Email: support@school.edu</li>
                <li>Phone: (555) 123-4567</li>
                <li>Office: Building A, Room 101</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Complaint Box . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;