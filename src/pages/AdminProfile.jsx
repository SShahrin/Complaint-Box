import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const AdminProfile = () => {
  const [complaints, setComplaints] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // ডাটাবেস থেকে তথ্য আনার ফাংশন
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/complaints`);
      if (response.data && Array.isArray(response.data)) {
        setComplaints(response.data);
      } else {
        setComplaints([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Database থেকে ডাটা আসছে না:", error);
      setComplaints([]); // ক্র্যাশ এড়াতে ডিফল্ট ফাঁকা অ্যারে
      setLoading(false); 
    }
  };

  // কম্পোনেন্ট মাউন্ট হলে ডাটা ফেচ হবে
  useEffect(() => {
    fetchComplaints();
  }, []);

  // ১. LocalStorage থেকে ডাটা লোড করা
  const [adminData, setAdminData] = useState(() => {
    const saved = localStorage.getItem('adminData');
    return saved ? JSON.parse(saved) : {
      name: "Mahfuzur Rahman",
      role: "System Administrator",
      email: "admin.campus@university.edu",
      phone: "+880 1712-345678",
      department: "IT Services",
      joinedDate: "12 Jan 2024",
      resolvedCount: 0,
      pendingCount: 0,
      inProgressCount: 0, 
      totalComplaints: 0
    };
  });

  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('staffList');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Sabbir Ahmed", role: "Staff", dept: "Electrical" },
      { id: 2, name: "Mitu Akter", role: "Moderator", dept: "Registrar" },
    ];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...adminData });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', dept: '', role: 'Staff' });

  // ২. ডাটা পরিবর্তন হলে LocalStorage-এ সেভ করা
  useEffect(() => {
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('staffList', JSON.stringify(staffList));
  }, [adminData, staffList]);

  // কমপ্লেইন্টস লিস্ট চেঞ্জ হলে অটোমেটিক ড্যাশবোর্ডের কাউন্টার আপডেট হবে
  useEffect(() => {
    if (Array.isArray(complaints)) {
      const total = complaints.length;
      // সেফটি চেক (c?.status) যোগ করা হয়েছে যাতে ক্র্যাশ না করে
      const pending = complaints.filter(c => c && c.status === 'Pending').length;
      const inProgress = complaints.filter(c => c && c.status === 'In Progress').length;
      const resolved = complaints.filter(c => c && c.status === 'Resolved').length;

      setAdminData(prev => ({
        ...prev,
        totalComplaints: total,
        pendingCount: pending,
        inProgressCount: inProgress, 
        resolvedCount: resolved
      }));
    }
  }, [complaints]);

  const handleSaveProfile = () => {
    setAdminData(editForm);
    setIsEditing(false);
    alert("Profile Updated!");
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if(!newStaff.name || !newStaff.dept) return alert("Please fill all fields");
    const staffObj = { id: Date.now(), ...newStaff };
    setStaffList([...staffList, staffObj]);
    setShowAddModal(false);
    setNewStaff({ name: '', dept: '', role: 'Staff' });
  };

  const updateRole = (id, newRole) => {
    const updatedStaff = staffList.map(staff => 
      staff.id === id ? { ...staff, role: newRole } : staff
    );
    setStaffList(updatedStaff);
    alert(`Role updated to ${newRole}`);
  };

  // স্ট্যাটাস পরিবর্তন করার নিরাপদ ফাংশন
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`, {
        status: newStatus
      });

      if (response.data.success || response.status === 200) {
        // সরাসরি ফ্রন্টএন্ড স্টেট আপডেট (id এবং _id দুটোর জন্যই সেফটি চেক রাখা হলো)
        setComplaints(prevComplaints =>
          prevComplaints.map(item =>
            (item.id === id || item._id === id) ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status in database");
    }
  };

  // Pie Chart এর ডাইনামিক ডাটা
  const pieData = [
    { name: 'Solved', value: adminData.resolvedCount },
    { name: 'In Progress', value: adminData.inProgressCount }, 
    { name: 'Pending', value: adminData.pendingCount },
  ];

  const COLORS = ['#2dce89', '#feb019', '#f5365c']; // Green, Orange, Red

  // Bar Graph ডাটা ম্যাপ
  const monthlyData = [
    { month: 'Current', solved: adminData.resolvedCount, inProgress: adminData.inProgressCount, pending: adminData.pendingCount },
  ];

  const renderMainContent = () => {
    if (loading) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Data...</div>;
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            {/* ১. Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="admin-stats-grid">
              
              <motion.div whileHover={{ scale: 1.05 }} className="admin-stat-card">
                <div>
                  <p>Total Complaints</p>
                  <h3>{adminData.totalComplaints.toLocaleString()}</h3>
                </div>
                <div className="admin-stat-icon admin-purple">📥</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="admin-stat-card">
                <div>
                  <p>Pending Issues</p>
                  <h3 className="admin-negative">{adminData.pendingCount}</h3>
                </div>
                <div className="admin-stat-icon admin-red">⚠️</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="admin-stat-card">
                <div>
                  <p>Total Resolved</p>
                  <h3 className="admin-positive">{adminData.resolvedCount}</h3>
                </div>
                <div className="admin-stat-icon admin-green">✅</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="admin-stat-card">
                <div>
                  <p>Success Rate</p>
                  <h3>
                    {adminData.totalComplaints > 0 
                      ? ((adminData.resolvedCount / adminData.totalComplaints) * 100).toFixed(1) 
                      : 0}%
                  </h3>
                </div>
                <div className="admin-stat-icon admin-blue">📈</div>
              </motion.div>
            </motion.div>

        {/* ২. Welcome & Rocket Cards */}
<div className="admin-middle-grid" style={{ marginBottom: '25px' }}>
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="admin-welcome-card admin-card-gradient">
    <div className="admin-welcome-text">
      <p>Welcome back,</p>
      <h2>{adminData.name}</h2>
      
      {/* ফিক্সড লজিক: এখানে শুধু High Priority এবং যেগুলো সমাধান হয়নি (Not Resolved) সেই কাউন্ট দেখাবে */}
      <p className="admin-desc">
        You have <b>{complaints.filter(c => c && (c.priority === 'High' || c.priority === 'high') && c.status !== 'Resolved').length}</b> urgent complaints.
      </p>
      
      <button className="admin-btn-action" onClick={() => setActiveTab('Priority Tasks')}>View Urgent List →</button>
    </div>
    <div className="admin-profile-overlay-img">👨‍💻</div>
  </motion.div>
  
  <motion.div 
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="admin-rocket-card">
    <div className="admin-rocket-overlay">
      <h3>Campus Safety First</h3>
      <p>Monitor student grievances and track resolution progress effectively.</p>
      <Link to="/about" className="admin-link-white">Read More →</Link>
    </div>
  </motion.div>
</div>

            {/* ৩. Graphs Section */}
            <div className="admin-middle-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* Bar Graph */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                className="admin-info-card-neumorphic" 
                style={{ height: '350px', minWidth: '0px', position: 'relative' }}
              >
                <h4 style={{ marginBottom: '20px' }}>Overview Graph</h4>
                <div style={{ width: '100%', height: '280px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8f9fa'}}/>
                      <Bar dataKey="solved" fill="#2dce89" radius={[4, 4, 0, 0]} barSize={25} />
                      <Bar dataKey="inProgress" fill="#feb019" radius={[4, 4, 0, 0]} barSize={25} />
                      <Bar dataKey="pending" fill="#7928ca" radius={[4, 4, 0, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Pie Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                className="admin-info-card-neumorphic" 
                style={{ height: '350px', minWidth: '0px', position: 'relative' }}
              >
                <h4 style={{ marginBottom: '20px' }}>Resolution Status</h4>
                <div style={{ width: '100%', height: '280px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </>
        );

      case 'All Complaints':
        return (
          <div className="admin-info-card-neumorphic">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4>📩 Master Complaint List</h4>
              <div className="filter-group" style={{display: 'flex', gap: '10px'}}>
                 <span className="badge-pending">Pending: {complaints.filter(c=>c?.status==='Pending').length}</span>
                 <span className="badge-in-progress">In Progress: {complaints.filter(c=>c?.status==='In Progress').length}</span>
                 <span className="badge-resolved">Resolved: {complaints.filter(c=>c?.status==='Resolved').length}</span>
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID & Name</th>
                  <th>Topic</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(item => {
                  const itemId = item.id || item._id;
                  return (
                    <tr key={itemId}>
                      <td><b>#{itemId}</b><br/><small>{item.student_name || 'Unknown'}</small></td>
                      <td>{item.topic}</td>
                      <td 
                        style={{ 
                          maxWidth: '200px', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          color: '#666',
                          fontSize: '14px'
                        }} 
                        title={item.description || 'No description provided'}
                      >
                        {item.description || 'No description provided'}
                      </td>
                      <td>
                        <span 
                          className={`priority-tag ${item.priority ? item.priority.toLowerCase() : 'normal'}`}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            background: item.priority === 'High' ? '#f5365c20' : item.priority === 'Medium' ? '#feb01920' : '#2dce8920',
                            color: item.priority === 'High' ? '#f5365c' : item.priority === 'Medium' ? '#feb019' : '#2dce89'
                          }}
                        >
                          {item.priority || 'Normal'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${(item.status || 'pending').replace(/\s+/g, '-').toLowerCase()}`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <select 
                          className="status-update-select"
                          value={item.status || 'Pending'}
                          onChange={(e) => updateStatus(itemId, e.target.value)}
                          style={{ padding: '5px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

       case 'Pending Tasks':
          return (
            <div className="admin-pending-container">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{fontSize: '20px'}}>⏳ Task Management</h4>
                <p style={{color: '#8898aa'}}>Manage urgent issues and track progress</p>
              </div>

              <div className="admin-pending-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {complaints.filter(c => c?.status !== 'Resolved').map(task => {
                  const taskGridId = task.id || task._id;
                  const currentPriority = task.priority ? task.priority.toLowerCase() : 'normal';
                  return (
                    <motion.div key={taskGridId} whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} className={`admin-info-card-neumorphic priority-border-${currentPriority}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className={`status-pill ${task.status ? task.status.replace(/\s+/g, '-').toLowerCase() : 'pending'}`}>
                          {task.status || 'Pending'}
                        </span>
                        <span className={`priority-tag ${currentPriority}`}>
                          {task.priority || 'Normal'}
                        </span>
                      </div>

                      <div style={{ margin: '20px 0' }}>
                        <small style={{ color: '#adb5bd' }}>#{taskGridId}</small>
                        <h3 style={{ margin: '5px 0', fontSize: '18px' }}>{task.topic}</h3>
                        <p style={{ fontSize: '13px', color: '#525f7f', marginBottom: '8px' }}>Reported by: <b>{task.student_name || 'Student'}</b></p>
                        
                        <div 
                          style={{ 
                            fontSize: '13px', 
                            color: '#6b7280', 
                            background: '#f8f9fa', 
                            padding: '10px', 
                            borderRadius: '6px', 
                            marginTop: '8px',
                            maxHeight: '80px',
                            overflowY: 'auto',
                            borderLeft: '3px solid #cbd5e1'
                          }}
                        >
                          <strong>Description:</strong> {task.description || 'No description provided'}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f3f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select className="status-update-select" value={task.status || 'Pending'} onChange={(e) => updateStatus(taskGridId, e.target.value)}>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <small style={{ color: '#8898aa' }}>{task.time || 'Just now'}</small>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );

      case 'Priority Tasks':
        const priorityOrder = { 'high': 1, 'medium': 2, 'normal': 3, 'low': 4 };
        
        const sortedPriorityTasks = complaints
          .filter(c => c?.status !== 'Resolved') 
          .sort((a, b) => {
            const pA = (a.priority || 'Normal').toLowerCase();
            const pB = (b.priority || 'Normal').toLowerCase();
            return (priorityOrder[pA] || 3) - (priorityOrder[pB] || 3);
          });

        return (
          <div className="admin-pending-container">
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '20px' }}>🔥 High Priority Grievances</h4>
              <p style={{ color: '#8898aa' }}>Tasks sorted from High to Low priority for urgent attention</p>
            </div>

            <div className="admin-pending-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {sortedPriorityTasks.map(task => {
                const taskPriorityId = task.id || task._id;
                const currentPriority = task.priority ? task.priority.toLowerCase() : 'normal';
                
                let cardBg = 'rgba(255, 255, 255, 1)'; 
                let accentColor = '#2dce89'; 
                
                if (currentPriority === 'high') {
                  cardBg = '#fff5f5'; 
                  accentColor = '#f5365c'; 
                } else if (currentPriority === 'medium') {
                  cardBg = '#fffbeb'; 
                  accentColor = '#feb019'; 
                }

                return (
                  <motion.div 
                    key={taskPriorityId} 
                    whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} 
                    className="admin-info-card-neumorphic"
                    style={{
                      background: cardBg,
                      borderLeft: `5px solid ${accentColor}`, 
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`status-pill ${task.status ? task.status.replace(/\s+/g, '-').toLowerCase() : 'pending'}`}>
                        {task.status || 'Pending'}
                      </span>
                      
                      <span 
                        style={{
                          background: accentColor,
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {task.priority || 'Normal'} {currentPriority === 'high' ? '🚨' : ''}
                      </span>
                    </div>

                    <div style={{ margin: '20px 0' }}>
                      <small style={{ color: '#adb5bd' }}>#{taskPriorityId}</small>
                      <h3 style={{ margin: '5px 0', fontSize: '18px', color: currentPriority === 'high' ? '#2d3748' : 'inherit' }}>
                        {task.topic}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#525f7f', marginBottom: '8px' }}>
                        Reported by: <b>{task.student_name || 'Student'}</b>
                      </p>

                      <div style={{ fontSize: '13px', color: '#6b7280', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '6px', marginTop: '8px' }}>
                        <strong>Description:</strong> {task.description || 'No description provided'}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select className="status-update-select" value={task.status || 'Pending'} onChange={(e) => updateStatus(taskPriorityId, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <small style={{ color: '#8898aa' }}>{task.time || 'Urgent'}</small>
                    </div>
                  </motion.div>
                );
              })}

              {sortedPriorityTasks.length === 0 && (
                <div style={{ padding: '20px', color: '#8898aa' }}>No pending tasks available.</div>
              )}
            </div>
          </div>
        );

      case 'Resolved':
        return (
          <div className="admin-info-card-neumorphic" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#2dce89', color: '#fff', padding: '10px', borderRadius: '12px' }}>✅</div>
              <div>
                <h4 style={{ margin: 0 }}>Resolved Complaints</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#8898aa' }}>History of successfully fixed issues</p>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>COMPLAINT INFO</th>
                  <th>CATEGORY</th>
                  <th>SOLVED TIME</th>
                  <th>OUTCOME</th>
                </tr>
              </thead>
              <tbody>
                {complaints.filter(c => c?.status === 'Resolved').map(solved => {
                  const solvedId = solved.id || solved._id;
                  return (
                    <tr key={solvedId}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600' }}>{solved.topic}</span>
                          <small style={{ color: '#adb5bd' }}>ID: {solvedId} | By: {solved.student_name}</small>
                        </div>
                      </td>
                      <td><span className="tag-dept">Facility Admin</span></td>
                      <td><small>{solved.time || 'Completed'}</small></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2dce89', fontWeight: 'bold' }}>
                          <div style={{ width: '8px', height: '8px', background: '#2dce89', borderRadius: '50%' }}></div>
                          Success
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'Profile Settings':
        return (
          <div className="admin-info-card-neumorphic">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>👤 Profile Settings</h4>
              {!isEditing ? (
                <button className="admin-btn-action" onClick={() => setIsEditing(true)}>Edit Profile</button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="admin-btn-action" style={{ background: '#2dce89' }} onClick={handleSaveProfile}>Save</button>
                  <button className="admin-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
            <div className="admin-info-row"><span>Name:</span> {isEditing ? <input className="admin-search-input" style={{width:'60%'}} value={editForm.name} onChange={(e)=>setEditForm({...editForm, name: e.target.value})}/> : <strong>{adminData.name}</strong>}</div>
            <div className="admin-info-row"><span>Email:</span> {isEditing ? <input className="admin-search-input" style={{width:'60%'}} value={editForm.email} onChange={(e)=>setEditForm({...editForm, email: e.target.value})}/> : <strong>{adminData.email}</strong>}</div>
            <div className="admin-info-row"><span>Dept:</span> {isEditing ? <input className="admin-search-input" style={{width:'60%'}} value={editForm.department} onChange={(e)=>setEditForm({...editForm, department: e.target.value})}/> : <strong>{adminData.department}</strong>}</div>
          </div>
        );

      case 'Roles & Permissions':
        return (
          <div className="admin-info-card-neumorphic">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>🛡️ Staff Roles</h4>
              <button className="admin-btn-action" onClick={() => setShowAddModal(true)}>+ Add Staff</button>
            </div>

            {showAddModal && (
              <form onSubmit={handleAddStaff} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <input type="text" placeholder="Staff Name" className="admin-search-input" style={{ marginBottom: '10px', width: '100%' }} value={newStaff.name} onChange={(e)=>setNewStaff({...newStaff, name: e.target.value})} />
                <input type="text" placeholder="Department" className="admin-search-input" style={{ marginBottom: '10px', width: '100%' }} value={newStaff.dept} onChange={(e)=>setNewStaff({...newStaff, dept: e.target.value})} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="admin-btn-action" style={{ background: '#7928ca', color: '#fff' }}>Add Now</button>
                  <button type="button" className="admin-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9', color: '#a0aec0' }}>
                  <th style={{ padding: '12px' }}>NAME</th>
                  <th style={{ padding: '12px' }}>ROLE</th>
                  <th style={{ padding: '12px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(staff => (
                  <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px' }}><b>{staff.name}</b><br/><small>{staff.dept}</small></td>
                    <td style={{ padding: '12px' }}>
                      <select value={staff.role} onChange={(e) => updateRole(staff.id, e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
                        <option value="Staff">Staff</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setStaffList(staffList.filter(s => s.id !== staff.id))}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="admin-info-card-neumorphic"><h3>{activeTab} Content</h3><p>Working on integration...</p></div>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-box">CB</div>
          <span>Complaint Admin</span>
        </div>
        <nav className="admin-nav-menu">
          <div className={`admin-nav-item ${activeTab === 'Dashboard' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Dashboard')}>📊 Dashboard</div>
          <div className={`admin-nav-item ${activeTab === 'All Complaints' ? 'admin-active' : ''}`} onClick={() => setActiveTab('All Complaints')}>📩 All Complaints</div>
          <div className={`admin-nav-item ${activeTab === 'Pending Tasks' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Pending Tasks')}>⏳ Pending Tasks</div>
          <div className={`admin-nav-item ${activeTab === 'Priority Tasks' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Priority Tasks')}>🔥 Priority Tasks</div>
          <div className={`admin-nav-item ${activeTab === 'Resolved' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Resolved')}>✅ Resolved</div>
          <p className="admin-nav-group">ADMIN CONTROL</p>
          <div className={`admin-nav-item ${activeTab === 'Profile Settings' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Profile Settings')}>👤 Profile Settings</div>
          <div className={`admin-nav-item ${activeTab === 'Roles & Permissions' ? 'admin-active' : ''}`} onClick={() => setActiveTab('Roles & Permissions')}>🛡️ Roles & Permissions</div>
          <button className="admin-nav-item logout-btn" onClick={() => (window.location.href = "/")}>🚪 Logout</button>
        </nav>
      </aside>

      <main className="admin-main-content">
        <header className="admin-top-nav">
          <div className="admin-breadcrumb">Admin / {activeTab}</div>
          <div className="admin-top-actions">
            <input type="text" placeholder="Search..." className="admin-search-input" />
            <div className="admin-avatar-small">{adminData.name.charAt(0)}</div>
          </div>
        </header>
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AdminProfile;