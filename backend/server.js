const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.db'), 
            driver: sqlite3.Database
        });

        // টেবিলগুলো সঠিকভাবে তৈরি করা
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                studentId TEXT,
                password TEXT,
                role TEXT DEFAULT 'user'
            );

            CREATE TABLE IF NOT EXISTS complaints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_name TEXT,
                topic TEXT,
                description TEXT,
                status TEXT DEFAULT 'Pending'
            );
        `);
        console.log("✅ Database Connected & Tables Ready!");
    } catch (err) {
        console.error("❌ Database Error:", err);
    }
})();

// ১. অভিযোগ জমা দেওয়ার রুট
app.post('/api/complaints', async (req, res) => {
    const { student_name, topic, description, status } = req.body;
    
    // কনসোলে চেক করা ডাটা আসছে কি না
    console.log("Receiving Complaint:", req.body);

    try {
        const query = 'INSERT INTO complaints (student_name, topic, description, status) VALUES (?, ?, ?, ?)';
        await db.run(query, [student_name, topic, description, status || 'Pending']);
        res.status(201).json({ success: true, message: "Complaint saved successfully" });
    } catch (err) {
        console.error("❌ Complaint Insert Error:", err);
        res.status(500).json({ success: false, error: "Failed to save data" });
    }
});
// ৫. অভিযোগের স্ট্যাটাস আপডেট করার রুট
app.put('/api/complaints/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // ফ্রন্টএন্ড থেকে 'Resolved' পাঠানো হবে

    try {
        await db.run('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        console.error("❌ Update Error:", err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
});
// ২. রেজিস্ট্রেশন রুট
app.post('/api/register', async (req, res) => {
    const { name, email, password, studentId } = req.body;
    
    try {
        // এই লজিকটি ইউজার এবং অ্যাডমিন দুজনকে আলাদা করবে
        let role = 'user'; // ডিফল্টভাবে সবাই ইউজার

        // শুধুমাত্র যাদের ইমেইলে 'admin' শব্দটা থাকবে তারা অ্যাডমিন হবে
        if (email.toLowerCase().includes('admin')) {
            role = 'admin';
        }

        const query = 'INSERT INTO users (name, email, password, studentId, role) VALUES (?, ?, ?, ?, ?)';
        await db.run(query, [name, email, password, studentId, role]);
        
        console.log(`✅ Registered: ${name} as ${role}`);
        res.status(201).json({ success: true, message: `Registration Successful as ${role}!` });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(400).json({ success: false, message: "Email already exists or DB Error" });
    }
});

// ৩. লগইন রুট
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (user) {
            res.json({ success: true, user: { id: user.id, name: user.name, role: user.role, studentId: user.studentId } });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ৪. সব অভিযোগ দেখার রুট
app.get('/api/complaints', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM complaints');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

