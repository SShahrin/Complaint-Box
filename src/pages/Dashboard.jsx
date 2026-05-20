import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
  // 🔐 আপনার আগের লোকাল স্টোরেজ লজিক (অক্ষত)
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || "Student"; 
  const studentId = user?.studentId || "N/A";
  const email = user?.email || "N/A";
  const role = user?.role || "Student";

  const [complaints, setComplaints] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    facilityType: "Classroom",
    description: "",
    priority: "Normal" 
  });

  const [activeTab, setActiveTab] = useState("Dashboard"); 
  const [searchTerm, setSearchTerm] = useState("");        
  const [statusFilter, setStatusFilter] = useState("All");   
  const [sortBy, setSortBy] = useState("latest");           

  // 📡 ডাটাবেস থেকে ডাটা লোড করার আপনার আগের ফাংশন
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      if (response.data && Array.isArray(response.data)) {
        const myData = response.data.filter(item => item && item.student_name === userName);
        setComplaints(myData);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setComplaints([]); 
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComplaint = {
      student_name: userName, 
      topic: formData.facilityType,    
      description: formData.description, 
      priority: formData.priority, 
      status: 'Pending'               
    };

    try {
      await axios.post('http://localhost:5000/api/complaints', newComplaint);
      alert("Submitted Successfully!");
      setFormData({ facilityType: "Classroom", description: "", priority: "Normal" });
      setIsModalOpen(false);
      fetchComplaints(); 
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server error! Please try again later.");
    }
  };

  // ----------------- আপনার সার্চ ও ফিল্টার লজিক -----------------
  const filteredComplaints = Array.isArray(complaints) ? complaints.filter(item => {
    if (!item) return false;
    const itemTopic = item.topic ? String(item.topic).toLowerCase() : "";
    const itemId = item.id ? String(item.id).toLowerCase() : "";
    const itemStatus = item.status ? String(item.status) : "Pending";
    const cleanSearch = (searchTerm || "").toLowerCase();

    const matchesSearch = itemTopic.includes(cleanSearch) || itemId.includes(cleanSearch);
    const matchesStatus = statusFilter === "All" || itemStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const idA = a && a.id ? Number(a.id) : 0;
    const idB = b && b.id ? Number(b.id) : 0;
    if (sortBy === "latest") return idB - idA; 
    if (sortBy === "oldest") return idA - idB; 
    return 0;
  });

  const total = complaints.length;
  const pending = complaints.filter(c => c && c.status === "Pending").length;
  const resolved = complaints.filter(c => c && (c.status === "Resolved" || c.status === "Solved")).length;

  // 📊 এনালাইটিক্স এর জন্য টপিক কাউন্ট লজিক
  const topicCounts = complaints.reduce((acc, item) => {
    if(item && item.topic) {
      acc[item.topic] = (acc[item.topic] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="layout">
      
      {/* 🛠️ সাইডবার (আপনার আগের অরিজিনাল কালার ও সিএসএস ক্লাস ঠিক রাখা হয়েছে) */}
      <aside className="sidebar">
        <div className="admin-brand">
          <div className="admin-logo-box">CB</div>
          <span>Student Dashboard</span>
        </div>
        <nav>
          <ul>
            <li className={activeTab === "Dashboard" ? "active" : ""} onClick={() => setActiveTab("Dashboard")} style={{ cursor: 'pointer' }}>
              📊 Dashboard
            </li>
            <li className={activeTab === "Reports" ? "active" : ""} onClick={() => setActiveTab("Reports")} style={{ cursor: 'pointer' }}>
              📁 All Reports
            </li>
            <li className={activeTab === "Analytics" ? "active" : ""} onClick={() => setActiveTab("Analytics")} style={{ cursor: 'pointer' }}>
              📈 Analytics
            </li>
            <li className={activeTab === "MyProfile" ? "active" : ""} onClick={() => setActiveTab("MyProfile")} style={{ cursor: 'pointer' }}>
              👤 My Profile
            </li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => (window.location.href = "/")}>Logout</button>
      </aside>

      <main className="main">
        
        {/* 🌟 ১. আপনার অরিজিনাল Welcome Banner (আগের ইমেজ সহ অক্ষত) 🌟 */}
        <motion.div initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }} className="welcome">
          <div>
            <p className="date">May 20, 2026</p>
            <h2>Welcome back, {userName} 👋</h2>
            <p>Track your campus reports in real-time</p>
          </div>
          {/* আপনার আগের সেই অরিজিনাল ছবি */}
          <img src="/images/Gemini.png" alt="Gemini" />
        </motion.div>

        {/* ----------------- ২. ড্যাশবোর্ড ট্যাব ভিউ ----------------- */}
        {activeTab === "Dashboard" && (
          <>
            {/* Stats Cards */}
            <motion.div  initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} className="stats">
              <div className="card"><p>Total Reports📥</p><h2>{total}</h2></div>
              <div className="card"><p>Pending⚠️</p><h2>{pending}</h2></div>
              <div className="card"><p>Resolved✅</p><h2>{resolved}</h2></div>
            </motion.div>

            {/* 🔥 ৩. স্ট্যাটাস কার্ডের ঠিক নিচে হাইলাইটেড Report Issue সেকশন (আপনার থিম কালার অনুযায়ী) 🔥 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px 0 25px 0' }}>
              <motion.button 
                className="report-btn" 
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ["0 0 0 0 rgba(108,92,231,0.3)", "0 0 0 12px rgba(108,92,231,0)", "0 0 0 0 rgba(108,92,231,0)"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ 
                  padding: '12px 28px', 
                  borderRadius: '25px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                  // আপনার অরিজিনাল .report-btn এর সিএসএস কালার ক্লাস এটি ব্যাকআপ হিসেবে হ্যান্ডেল করবে
                }}
              >
                <span>➕</span> Report New Issue
              </motion.button>
            </div>

            {/* গাইডলাইন এবং নোটিশ বোর্ড */}
            <motion.div
            initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                 style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '25px 0' }}>
              <motion.div whileHover={{ y: -4 }} style={{ background: 'linear-gradient(135deg, #6c5ce7, #8e74f4)', color: '#fff', padding: '22px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(108,92,231,0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>🚀 Quick Guide</h4>
                <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>Follow these simple steps to get your campus issues resolved quickly:</p>
                <ul style={{ paddingLeft: '18px', fontSize: '13px', opacity: 0.9, lineHeight: '1.8', margin: '5px 0 0 0' }}>
                  <li>Click on the <b>Report New Issue</b> button above.</li>
                  <li>Select the appropriate facility and urgency level.</li>
                  <li>Provide a clear description of the problem.</li>
                </ul>
                
                {/* 🌟 কুইক গাইড থেকে সরাসরি ফর্ম ওপেন করার লিংক */}
                <span 
                  onClick={() => setIsModalOpen(true)}
                  style={{ display: 'inline-block', marginTop: '12px', fontSize: '13px', color: '#fff', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ➕ Get Started: Open Report Form
                </span>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} style={{ background: '#fff', padding: '22px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', border: '1px solid #eef2f5' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>📢 Campus Notice</h4>
                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  <div style={{ padding: '6px 0', borderBottom: '1px dashed #edeef0' }}>
                    <small style={{ color: '#6c5ce7', fontWeight: 'bold' }}>Today</small>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#555' }}>Canteen authority is reviewing the hygiene complaints.</p>
                  </div>
                  <div style={{ padding: '6px 0' }}>
                    <small style={{ color: '#888' }}>Yesterday</small>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#555' }}>Wi-Fi maintenance in the Central Library completed successfully.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="reports-header">
              <h3>Recent Reports</h3>
            </div>

            <div className="reports-grid">
              {complaints.length > 0 ? (
                [...complaints].reverse().slice(0, 3).map((item) => (
                  <motion.div whileHover={{ scale: 1.01 }} key={item.id || Math.random()} className="report-card">
                    <h4>{item.topic || "No Topic"}</h4>
                    <p className="desc">{item.description || "No description provided."}</p>
                    <div className="report-footer">
                      <span className={`status ${item.status ? String(item.status).toLowerCase() : "pending"}`}>
                        {item.status || "Pending"}
                      </span>
                      <span className="priority">{item.priority || "Normal"}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p style={{ color: '#bbb' }}>No reports found.</p>
              )}
            </div>
          </>
        )}

        {/* ----------------- ৪. রিপোর্টস ট্যাব ভিউ ----------------- */}
        {activeTab === "Reports" && (
          <div className="reports-tab-content" style={{ marginTop: '10px' }}>
            <div className="reports-header">
              <h3>All Submitted Reports</h3>
            </div>

            <div className="filter-bar" style={{ display: 'flex', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Search by ID or Title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '11px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', minWidth: '240px', outline: 'none' }} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '11px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '11px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="reports-grid">
              {sortedComplaints && sortedComplaints.length > 0 ? (
                sortedComplaints.map((item) => (
                  <motion.div whileHover={{ scale: 1.01 }} key={item.id || Math.random()} className="report-card">
                    <small style={{ color: '#6c5ce7', fontWeight: 'bold' }}>ID: #{item.id || "N/A"}</small>
                    <h4>{item.topic || "No Topic"}</h4>
                    <p className="desc">{item.description || "No description provided."}</p>
                    <div className="report-footer">
                      <span className={`status ${item.status ? String(item.status).toLowerCase() : "pending"}`}>
                        {item.status || "Pending"}
                      </span>
                      <span className="priority">{item.priority || "Normal"}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p style={{ color: '#bbb' }}>No matching reports found.</p>
              )}
            </div>
          </div>
        )}

        {/* ----------------- ৫. এনালাইটিক্স ট্যাব ভিউ ----------------- */}
        {activeTab === "Analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px' }}>
            <div className="reports-header">
              <h3>Report Analytics Breakdown</h3>
            </div>
            <div className="report-card" style={{ background: '#fff', padding: '25px', borderRadius: '15px', marginTop: '15px' }}>
              <p style={{ color: '#555', marginBottom: '20px' }}>Facility wise report distribution summary:</p>
              
              {Object.keys(topicCounts).length > 0 ? (
                Object.keys(topicCounts).map((topic) => {
                  const count = topicCounts[topic];
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={topic} style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                        <span>🏢 {topic}</span>
                        <span style={{ color: '#6c5ce7' }}>{count} Reports ({percentage}%)</span>
                      </div>
                      <div style={{ background: '#f0f2f5', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ background: '#6c5ce7', height: '100%', width: `${percentage}%`, borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#999', textAlign: 'center' }}>No analytics data available. Submit reports to view distribution.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- ৬. মাই প্রোফাইল ট্যাব ভিউ ----------------- */}
        {activeTab === "MyProfile" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px' }}>
            <div className="reports-header">
              <h3>Student Profile Identification</h3>
            </div>
            <div className="report-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', maxWidth: '550px', marginTop: '15px', border: '1px solid #eef2f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                <div style={{ width: '60px', height: '60px', background: '#6c5ce7', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 'bold' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#2d3436' }}>{userName}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#6c5ce7', fontWeight: '600', fontSize: '13px' }}>Official verified Account</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '15px', fontSize: '14px', color: '#555' }}>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <b>Full Name:</b> <span>{userName}</span>
                </div>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <b>Student ID:</b> <span>{studentId}</span>
                </div>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <b>Email Address:</b> <span>{email}</span>
                </div>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', SystemColor: 'windowtext', justifyContent: 'space-between' }}>
                  <b>Account Role:</b> <span style={{ background: '#e3faf2', color: '#2dce89', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>{role.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit Report</h3>
            <form onSubmit={handleSubmit}>
              <select name="facilityType" value={formData.facilityType} onChange={handleChange}>
                <option value="Classroom">Classroom</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Restroom">Restroom</option>
                <option value="Library">Library</option>
                <option value="Bus">Bus</option>
                <option value="Canteen">Canteen</option>
                <option value="Others">Others</option>
              </select>
              <div style={{ marginTop: '15px', marginBottom: '5px', textAlign: 'left' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Urgency Level:</label>
              </div>
              <select name="priority" value={formData.priority} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                <option value="Low">Low (No rush)</option>
                <option value="Normal">Normal</option>
                <option value="High">High (Urgent)</option>
              </select>
              <textarea name="description" rows="4" placeholder="Explain the issue..." value={formData.description} onChange={handleChange} required></textarea>
              <div className="modal-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;