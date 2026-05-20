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

// ১. অভিযোগ জমা দেওয়ার রুট (হুবহু এক রাখা হয়েছে)
app.post('/api/complaints', async (req, res) => {
    const { student_name, topic, description, status } = req.body;
    
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


// ২. রেজিস্ট্রেশন রুট (আপনার অ্যাডমিন চেক করার লজিকসহ হুবহু এক)
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

// ৩. লগইন রুট (হুবহু এক রাখা হয়েছে)
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

// ৪. সব অভিযোগ দেখার রুট (হুবহু এক রাখা হয়েছে)
app.get('/api/complaints', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM complaints');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ৪.১ নির্দিষ্ট স্টুডেন্টের সব অভিযোগ দেখার রুট (নতুন)
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

 // ৫. অভিযোগের স্ট্যাটাস আপডেট করার রুট (শুধু এটিকে async/await এ ফিক্স করা হয়েছে)
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

// ৬. স্টুডেন্টের প্রোফাইল আপডেট করার রুট (নতুন)
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

        // আপডেট হওয়া নতুন ডাটাবেস রো-টি নিয়ে আসা
        const updatedUser = await db.get('SELECT id, name, email, studentId, role FROM users WHERE id = ?', [id]);

        console.log(`✅ Profile and Complaints updated successfully for ID: ${id}`);
        return res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (err) {
        console.error("❌ Profile Update Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});
app.listen(5000, () => console.log("🚀 Server running on port 5000"));