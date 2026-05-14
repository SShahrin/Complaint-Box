import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="landing-page-wrapper">
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
            <Link to="/about" className="btn-ghost">About</Link>
            <Link to="/register" className="btn-outline">Sign Up</Link>
            <Link to="/login" className="btn-primary">Login</Link>
          </nav>
        </div>
      </header>

      <section className="landing-page">
        {/* Hero Section */}
       <section class="hero">
           
        <div className="hero-container">

        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
   className="hero-content">
             <div className="hero-badge">
              Making Campus Better, One Report at a Time
            </div>
            <h1 className="hero-title">
              Report • Track • <span class="resolve-text">Resolve</span>
              <br />Your voice
              <span className="resolve-text"> Real action </span>
            </h1>
            <p className="hero-description">
              Your voice matters in creating a better learning environment.
              Submit facility complaints and track their resolution in
              real-time.
            </p>
        </motion.div>

        <motion.div 
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="hero-image-area">
            <img
              src="\images\home-img.jpg"
              alt="Campus App"
              className="hero-main-img"
            />
            <div className="image-glow"></div>
         </motion.div>

        </div>

        <div className="hero-buttons">
          <Link to="/register" className="btn-large btn-primary"
            >Get Started →
            </Link>
          <Link to="/about" className="btn-large btn-outline"> Learn More </Link>
        </div>
      </section>

        <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="campus-information">
          <div className="information-box">
            <h2>5,000+</h2>
            Active Students
          </div>
          <div className="information-box">
            <h2>1,200+</h2>
            Reports Resolved
          </div>
          <div className="information-box-hr">
            <h2>48hrs</h2>
            Average Resolution Time
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose this Facility?</h2>
            <div className="features-grid">
             <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#4A90E2" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                   strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      </div>
                <h3>Easy Reporting</h3>
                <p>Submit complaints in seconds with our intuitive form</p>
             </motion.div>
        <motion.div 
   initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="feature-card">
    
                <div className="feature-icon">
                  <svg width="24" height="24"
                   viewBox="0 0 24 24" fill="none"
                    stroke="#27AE60" 
                    strokeWidth="2"
                     strokeLinecap="round" 
                     strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      </div>
                <h3>Track Progress</h3>
                <p>Monitor your complaint status from pending to resolved</p>
             </motion.div>
             <motion.div 
   initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" 
                  viewBox="0 0 24 24" fill="none"
                   stroke="#F1C40F" 
                   strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      </div>
                <h3>Fast Response</h3>
                <p>Priority system ensures urgent issues get immediate attention</p>
              </motion.div>
              {/* ... You can repeat other cards here ... */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
         <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="cta">
          <div className="container">
            <h2 className="cta-title">Ready to Make a Difference?</h2>
            <p className="cta-description">
              Join thousands of students who are helping improve our campus facilities
            </p>
            <Link to="/register" className="btn-large btn-white">
              Start Reporting Now →
            </Link>
          </div>
        </motion.section>
      </section>

      {/* Footer */}
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-section">
            <h3>Complaint Box</h3>
            <p>Making campus facilities better, one report at a time.</p>
          </div>

          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="register.html">Sign Up</a></li>
              <li><a href="login.html">Login</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: support@school.edu</li>
              <li>Phone: (555) 123-4567</li>
              <li>Office: Building A, Room 101</li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 Complaint Box. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Home;