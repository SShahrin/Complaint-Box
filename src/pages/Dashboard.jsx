import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
  // localStorage থেকে ইউজারের ডাটা আনা হচ্ছে
  const user = JSON.parse(localStorage.getItem('user'));
  
  // যদি লোকাল স্টোরেজে নাম না থাকে তবে 'Student' দেখাবে
  const userName = user?.name || "Student"; 

  const [complaints, setComplaints] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    facilityType: "Classroom",
    description: ""
  });

  // ডাটাবেস থেকে অভিযোগগুলো লোড করা
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      // আপনি চাইলে এখানে ফিল্টার করে শুধু নিজের কমপ্লেইন দেখাতে পারেন
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    console.log("Submit button clicked!");

    const newComplaint = {
      student_name: userName, 
      topic: formData.facilityType,    
      description: formData.description, 
      status: 'Pending'               
    };

    try {
      const response = await axios.post('http://localhost:5000/api/complaints', newComplaint);
      console.log("Server Response:", response.data);
      
      // সফল হলে ইংরেজি মেসেজ
      alert("Submitted Successfully!");
      
      // ফর্ম ক্লিন করা
      setFormData({ facilityType: "Classroom", description: "" });
      setIsModalOpen(false);
      fetchComplaints(); // লিস্ট আপডেট
    } catch (error) {
      console.error("Submission error:", error);
      
      // এরর হলে ইংরেজি ওয়ার্নিং
      alert("Server error! Please try again later.");
    }
  };

  // স্ট্যাটাস কাউন্ট করা
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="layout">
      {/* ... আপনার সাইডবার কোড একই থাকবে ... */}
      <aside className="sidebar">
        <div className="admin-brand">
          <div className="admin-logo-box">CB</div>
          <span>Student Dashboard</span>
        </div>
        {/* SVG Icon and Nav links */}
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Reports</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => (window.location.href = "/")}>Logout</button>
      </aside>

      <main className="main">
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="welcome">
          <div>
            <p className="date">May 8, 2026</p>
            <h2>Welcome back, {userName}</h2>
            <p>Track your campus reports in real-time</p>
          </div>
          <img src="/images/Gemini.png" alt="Gemini" />
        </motion.div>

        {/* Stats Cards */}
        <div className="stats">
          <div className="card"><p>Total Reports📥</p><h2>{total}</h2></div>
          <div className="card"><p>Pending⚠️</p><h2>{pending}</h2></div>
          <div className="card"><p>Resolved✅</p><h2>{resolved}</h2></div>
        </div>

        {/* Reports Header */}
        <div className="reports-header">
          <h3>Recent Reports</h3>
          <button className="report-btn" onClick={() => setIsModalOpen(true)}>+ Report Issue</button>
        </div>

        {/* Complaints Grid (Dynamic from Database) */}
        <div className="reports-grid">
          {complaints.length > 0 ? complaints.map((item) => (
            <motion.div whileHover={{ scale: 1.02 }} key={item.id} className="report-card">
              <h4>{item.topic}</h4>
              <p className="desc">{item.description}</p>
              <div className="report-footer">
                <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                <span className="priority">Normal</span>
              </div>
            </motion.div>
          )) : <p>No reports found.</p>}
        </div>
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