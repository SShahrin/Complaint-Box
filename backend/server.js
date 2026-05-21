const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();

// 💡 ফিক্সড CORS: অ্যাপ তৈরি করার ঠিক পরেই পারফেক্ট CORS পলিসি সেট করা হলো
app.use(cors({
   
    origin: "*",
    // origin: ["https://complaint-box-main.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

let db;

(async () => {
    try {
        const dbPath = path.resolve(__dirname, 'database.db');
        console.log("📂 আপনার আসল ডাটাবেজ ফাইলটি এখানে আছে:", dbPath);

        db = await open({
            filename: dbPath, 
            driver: sqlite3.Database
        });

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
        
        try {
            await db.exec(`ALTER TABLE complaints ADD COLUMN priority TEXT DEFAULT 'Normal'`);
            console.log("📊 Priority column successfully added to database!");
        } catch (alterErr) {
            console.log("ℹ️ Priority column already exists, moving on...");
        }
    } catch (err) {
        console.error("❌ Database Error:", err);
    }
})();

// ১. অভিযোগ জমা দেওয়ার রুট
app.post('/api/complaints', async (req, res) => {
    const { student_name, topic, description, priority, status } = req.body;
    console.log("Receiving Complaint:", req.body);

    try {
        const query = 'INSERT INTO complaints (student_name, topic, description, priority, status) VALUES (?, ?, ?, ?, ?)';
        await db.run(query, [student_name, topic, description, priority || 'Normal', status || 'Pending']);
        res.status(201).json({ success: true, message: "Complaint saved successfully" });
    } catch (err) {
        console.error("❌ Complaint Insert Error:", err);
        res.status(500).json({ success: false, error: "Failed to save data" });
    }
});

// ২. রেজিস্ট্রেশন রুট
app.post('/api/register', async (req, res) => {
    const { name, email, password, studentId } = req.body;
    
    try {
        let role = 'user'; 
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

// ৪.১ নির্দিষ্ট স্টুডেন্টের সব অভিযোগ দেখার রুট
app.get('/api/complaints/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const rows = await db.all('SELECT * FROM complaints WHERE student_name = ?', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error("❌ Fetch Student Complaints Error:", err);
        res.status(500).json({ error: "Failed to fetch student data" });
    }
});

// ৫. অভিযোগের স্ট্যাটাস আপডেট করার রুট
app.put('/api/complaints/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10); 
    const { status } = req.body;

    console.log(`📡 Request received to update ID ${id} to status: ${status}`);

    try {
        const query = 'UPDATE complaints SET status = ? WHERE id = ?';
        const result = await db.run(query, [status, id]);

        if (result.changes === 0) {
            console.log(`⚠️ Warning: ID ${id} database-এ খুঁজে পাওয়া যায়নি!`);
            return res.status(404).json({ success: false, message: "ID not found in DB" });
        }

        console.log(`✅ Success: ID ${id} updated to ${status} in database.`);
        return res.json({ success: true, message: "Status updated successfully" });

    } catch (err) {
        console.error("❌ SQLite Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// USER EDIT: ইউজার তার নিজের কমপ্লেইন এডিট করবে
app.put('/api/complaints/user-edit/:id', async (req, res) => {
    const complaintId = parseInt(req.params.id, 10);
    const { topic, description, priority } = req.body;

    try {
        const sql = `UPDATE complaints SET topic = ?, description = ?, priority = ? WHERE id = ?`;
        const result = await db.run(sql, [topic, description, priority || 'Normal', complaintId]);
       
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: "Complaint not found with this ID" });
        }

        console.log(`✅ Complaint ID ${complaintId} updated successfully.`);
        return res.json({ success: true, message: "Updated successfully" });
    } catch (err) {
        console.error("❌ Edit Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// USER DELETE: ইউজার তার নিজের কমপ্লেইন ডিলিট/বাতিল করতে পারবে
app.delete('/api/complaints/:id', async (req, res) => {
    const complaintId = parseInt(req.params.id, 10);

    try {
        const sql = `DELETE FROM complaints WHERE id = ?`;
        const result = await db.run(sql, [complaintId]);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: "No complaint found to delete" });
        }

        console.log(`🗑️ Complaint ID ${complaintId} deleted successfully.`);
        return res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ৬. স্টুডেন্টের প্রোফাইল আপডেট করার রুট
app.put('/api/users/update/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, studentId, oldName } = req.body; 

    console.log(`📡 Profile update request for User ID: ${id}`);

    try {
        const query = 'UPDATE users SET name = ?, studentId = ? WHERE id = ?';
        const result = await db.run(query, [name, studentId, id]);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await db.run('UPDATE complaints SET student_name = ? WHERE student_name = ?', [name, oldName]);

        const updatedUser = await db.get('SELECT id, name, email, studentId, role FROM users WHERE id = ?', [id]);

        console.log(`✅ Profile and Complaints updated successfully for ID: ${id}`);
        return res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (err) {
        console.error("❌ Profile Update Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Render অটোমেটিক পোর্ট অ্যাসাইন করে, তাই process.env.PORT দেওয়া বুদ্ধিমানের কাজ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});