import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const saltRound = 10;

// CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_pass,
  database: process.env.DB_name
});

// ----------------- ROUTES ------------------

// Get cutoff
app.get("/api/cutoff", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT cutoff_hour, cutoff_minute FROM app_settings WHERE id = 1"
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Cutoff fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Set cutoff
app.post("/api/cutoff", async (req, res) => {
  try {
    const { cutoffHour, cutoffMinute } = req.body;

    if (cutoffHour == null || cutoffMinute == null) {
      return res.status(400).json({ message: "Missing cutoff values" });
    }

    await pool.query(
      "UPDATE app_settings SET cutoff_hour = ?, cutoff_minute = ? WHERE id = 1",
      [cutoffHour, cutoffMinute]
    );

    res.status(200).json({ message: "success" });

  } catch (err) {
    console.error("Cutoff update error:", err);
    res.status(500).json({ message: "Database update failed" });
  }
});


// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM obedy_users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Wrong username/password combination!" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Wrong username/password combination!" });
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, name: user.username, role: user.user_role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      accessToken,
      user_role: user.user_role,
      user_id: user.user_id,
      user_name: username,
      message: "success"
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const hash = await bcrypt.hash(password, saltRound);

    const q = "INSERT INTO obedy_users (username, password, email, user_role) VALUES (?,?,?,?)";
    await pool.query(q, [username, hash, email, role]);

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.sqlMessage || "Error creating user" });
  }
});

// Add kid
app.post("/api/addkid", async (req, res) => {
  try {
    const { kidName, kidSurname, birthDate, userID } = req.body;
    const q = "INSERT INTO obedy_kids (kid_name, kid_surname, kid_birth, user_id) VALUES (?,?,?,?)";
    await pool.query(q, [kidName, kidSurname, birthDate, userID]);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Add kid error:", err);
    res.status(400).json({ message: err.sqlMessage || "Error adding kid" });
  }
});

// Add skip
app.post("/api/addskip", async (req, res) => {
  try {
    const { kidID, skipDate } = req.body;
    const q = "INSERT INTO obedy_skips (kid_id, skip_date) VALUES (?,?)";
    await pool.query(q, [kidID, skipDate]);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Add skip error:", err);
    res.status(400).json({ message: "Error adding skip" });
  }
});

// Multi skip
app.post("/api/multiskip", async (req, res) => {
  try {
    const { modalKidId, datesArr } = req.body;
    const values = datesArr.map(date => [modalKidId, date]);
    const q = "INSERT INTO obedy_skips (kid_id, skip_date) VALUES ?";
    await pool.query(q, [values]);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Multi skip error:", err);
    if (err.errno === 1062) {
      res.status(400).json({ message: "Dátum už bol zadaný" });
    } else {
      res.status(400).json({ message: "Error on server" });
    }
  }
});

// Get users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM obedy_users");
    res.json(rows);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get kids
app.get('/api/kids', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT kid_id, kid_name, kid_surname, DATE_FORMAT(kid_birth, '%Y-%m-%d') AS kid_birth FROM obedy_kids"
    );
    res.json(rows);
  } catch (err) {
    console.error("Kids fetch error:", err);
    res.status(500).json({ message: "Error fetching kids" });
  }
});

// Get user kids with skips
app.post('/api/userkids', async (req, res) => {
  try {
    const userID = req.query.user_id;
    const nowSkip = req.body.nextSkipDate;
    const sql = `
      SELECT k.kid_id, k.kid_name, k.kid_surname, DATE_FORMAT(k.kid_birth, '%Y-%m-%d') AS kid_birth,
             k.user_id, s.skip_id, DATE_FORMAT(s.skip_date, '%Y-%m-%d') AS skip_date
      FROM obedy_kids k
      LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id AND s.skip_date >= ?
      WHERE k.user_id = ?
      ORDER BY kid_id
    `;
    const [rows] = await pool.query(sql, [nowSkip, userID]);
    res.json(rows);
  } catch (err) {
    console.error("User kids fetch error:", err);
    res.status(500).json({ message: "Error fetching user kids" });
  }
});

// Delete kid
app.delete('/api/deletekid/:id', async (req, res) => {
  try {
    const kidID = req.params.id;
    const userID = req.headers['x-user-id'];

    if (!userID) return res.status(400).json({ message: "Missing user ID" });

    const connection = await pool.getConnection();
    try {
      // set session variable
      await connection.query("SET @current_user_id = ?", [userID]);
      
      // perform delete **once**
      const [result] = await connection.query(
        "DELETE FROM obedy_kids WHERE kid_id = ?",
        [kidID]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Kid not found" });
      }

      res.status(200).json({ message: "success" });

    } finally {
      connection.release();
    }

  } catch (err) {
    console.error("Delete kid error:", err);
    res.status(500).json({ message: "Error deleting kid" });
  }
});


// Delete skip
app.delete('/api/deleteskip', async (req, res) => {
  try {
    const { skip_id } = req.body;
    await pool.query("DELETE FROM obedy_skips WHERE skip_id = ?", [skip_id]);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Delete skip error:", err);
    res.status(500).json({ message: "Error deleting skip" });
  }
});

// Get kid skip list
app.post('/api/kidskiplist', async (req, res) => {
  try {
    const { kid_id } = req.body;
    const [rows] = await pool.query(
      "SELECT skip_id, DATE_FORMAT(skip_date, '%Y-%m-%d') AS skip_date FROM obedy_skips WHERE kid_id = ?",
      [kid_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Kid skip list error:", err);
    res.status(500).json({ message: "Error fetching skip list" });
  }
});

// Admin sort all
app.get('/api/sortall', async (req, res) => {
  try {
    const sql = `
      SELECT k.kid_id, k.kid_name, k.kid_surname, k.kid_birth, k.added_time,
             u.username, COUNT(s.skip_id) AS total_skips, MAX(s.skip_date) AS last_skip
      FROM obedy_kids k
      JOIN obedy_users u ON k.user_id = u.user_id
      LEFT JOIN obedy_skips s ON k.kid_id = s.kid_id
      GROUP BY k.kid_id
      ORDER BY k.kid_surname ASC
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Sort all error:", err);
    res.status(500).json({ message: "Error fetching sorted kids" });
  }
});

// Edit kid
app.put("/api/editkid/:id", async (req, res) => {
  try {
    const { kid_name, kid_surname, kid_birth } = req.body;
    const sql = "UPDATE obedy_kids SET kid_name=?, kid_surname=?, kid_birth=? WHERE kid_id=?";
    await pool.query(sql, [kid_name, kid_surname, kid_birth, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Edit kid error:", err);
    res.status(500).json({ message: "Error updating kid" });
  }
});


// Start server
app.listen(3001, () => {
  console.log('Server started on port 3001...');
});
