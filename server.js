var mysql = require("mysql2");
var express = require("express");
var app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');


// Secret key for JWT token
const secretKey = 'your_secret_key_here';

const PORT = process.env.PORT || 3007;

// MySQL Connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "timetrek",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + connection.threadId);
});

app.use(express.json());
app.use(cors());
// Define routes

// Create necessary tables
connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`);

connection.query(`CREATE TABLE IF NOT EXISTS personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    full_name VARCHAR(255),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS employment_contract (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  start_date DATE,
  end_date DATE,
  position VARCHAR(255),
  salary DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS payslip (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  month VARCHAR(20),
  year INT,
  amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS claims (
  claim_id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  status ENUM('approved', 'pending', 'rejected'),
  amount DECIMAL(10, 2),
  created_by INT,
  approved_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  clocked_in TIME,
  clocked_out TIME
)`);

connection.query(`CREATE TABLE IF NOT EXISTS overtime (
  ot_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  ot_duration DECIMAL(10, 2),
  status ENUM('approved', 'pending', 'rejected')
)`);

connection.query(`CREATE TABLE IF NOT EXISTS leaves (
  leave_id INT AUTO_INCREMENT PRIMARY KEY,
  leave_type VARCHAR(255),
  date DATE,
  duration DECIMAL(10, 2),
  remark TEXT
)`);


// Register a user
app.post("/register", (req, res) => {
  const {
    username,
    password,
    fullName,
    dob,
    address,
    city,
    state,
    postalCode,
    startDate,
    endDate,
    position,
    salary,
  } = req.body;

  connection.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err, result) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const userId = result.insertId;

      if (fullName && dob) {
        // Insert personal information
        connection.query(
          "INSERT INTO personal_info (user_id, full_name, date_of_birth) VALUES (?, ?, ?)",
          [userId, fullName, dob],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
      }

      if (address || city || state || postalCode) {
        // Insert address
        connection.query(
          "INSERT INTO address (user_id, address, city, state, postal_code) VALUES (?, ?, ?, ?, ?)",
          [userId, address, city, state, postalCode],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
      }

      if (startDate || endDate || position || salary) {
        // Insert employment contract
        connection.query(
          "INSERT INTO employment_contract (user_id, start_date, end_date, position, salary) VALUES (?, ?, ?, ?, ?)",
          [userId, startDate, endDate, position, salary],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
      }

      res.json({ message: "User registered successfully" });
    }
  );
});


// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: results[0].id }, secretKey, { expiresIn: '1h' }); 

      res.json({ message: "Login successful", token: token });
    }
  );
});

// User logout
app.post("/logout", (req, res) => {
  // Here you might clear any session/token information on the client-side
  res.json({ message: "Logout successful" });
});

// View payslip
app.get("/payslip/:userId", (req, res) => {
  const userId = req.params.userId;

  connection.query(
    "SELECT * FROM payslip WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ payslips: results });
    }
  );
});

// Edit payslip
app.put("/payslip/:payslipId", (req, res) => {
  const payslipId = req.params.payslipId;
  const { amount } = req.body;

  connection.query(
    "UPDATE payslip SET amount = ? WHERE id = ?",
    [amount, payslipId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Payslip updated successfully" });
    }
  );
});

// View personal information
app.get("/personal_info/:userId", (req, res) => {
  const userId = req.params.userId;

  connection.query(
    "SELECT * FROM personal_info WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Personal information not found" });
      }

      res.json({ personalInfo: results[0] });
    }
  );
});

// Edit personal information
app.put("/personal_info/:userId", (req, res) => {
  const userId = req.params.userId;
  const { fullName, dob } = req.body;

  connection.query(
    "UPDATE personal_info SET full_name = ?, date_of_birth = ? WHERE user_id = ?",
    [fullName, dob, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Personal information updated successfully" });
    }
  );
});

// Create a claim
app.post("/claims", (req, res) => {
  const { description, status, amount, created_by, approved_by } = req.body;

  connection.query(
    `INSERT INTO claims (description, status, amount, created_by, approved_by) VALUES (?, ?, ?, ?, ?)`,
    [description, status, amount, created_by, approved_by],
    function (err, result) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Claim created successfully",
        claimId: result.insertId,
      });
    }
  );
});

// Read all claims
app.get("/claims", (req, res) => {
  connection.query(`SELECT * FROM claims`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ claims: results });
  });
});

// Read a specific claim by ID
app.get("/claims/:claimId", (req, res) => {
  const claimId = req.params.claimId;

  connection.query(
    `SELECT * FROM claims WHERE claim_id = ?`,
    [claimId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Claim not found" });
      }
      res.json({ claim: results[0] });
    }
  );
});

// Update a claim
app.put("/claims/:claimId", (req, res) => {
  const claimId = req.params.claimId;
  const { description, status, amount, created_by, approved_by } = req.body;

  connection.query(
    `UPDATE claims SET description = ?, status = ?, amount = ?, created_by = ?, approved_by = ? WHERE claim_id = ?`,
    [description, status, amount, created_by, approved_by, claimId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Claim updated successfully" });
    }
  );
});

// Delete a claim
app.delete("/claims/:claimId", (req, res) => {
  const claimId = req.params.claimId;

  connection.query(
    `DELETE FROM claims WHERE claim_id = ?`,
    [claimId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Claim deleted successfully" });
    }
  );
});

// Read all attendance records
app.get("/attendance", (req, res) => {
  connection.query(`SELECT * FROM attendance`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ attendanceRecords: results });
  });
});


// Create an overtime record
app.post("/overtime", (req, res) => {
  const { date, ot_duration, status } = req.body;

  connection.query(
    `INSERT INTO overtime (date, ot_duration, status) VALUES (?, ?, ?)`,
    [date, ot_duration, status],
    function (err, result) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Overtime record created successfully",
        otId: result.insertId,
      });
    }
  );
});

// Read all overtime records
app.get("/overtime", (req, res) => {
  connection.query(`SELECT * FROM overtime`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ overtimeRecords: results });
  });
});

// Read a specific overtime record by ID
app.get("/overtime/:otId", (req, res) => {
  const otId = req.params.otId;

  connection.query(
    `SELECT * FROM overtime WHERE ot_id = ?`,
    [otId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Overtime record not found" });
      }
      res.json({ overtimeRecord: results[0] });
    }
  );
});

// Update an overtime record
app.put("/overtime/:otId", (req, res) => {
  const otId = req.params.otId;
  const { date, ot_duration, status } = req.body;

  connection.query(
    `UPDATE overtime SET date = ?, ot_duration = ?, status = ? WHERE ot_id = ?`,
    [date, ot_duration, status, otId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Overtime record updated successfully" });
    }
  );
});

// Delete an overtime record
app.delete("/overtime/:otId", (req, res) => {
  const otId = req.params.otId;

  connection.query(
    `DELETE FROM overtime WHERE ot_id = ?`,
    [otId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Overtime record deleted successfully" });
    }
  );
});

app.post("/leaves", (req, res) => {
  const { leave_type, date, duration, remark } = req.body;

  connection.query(
    `INSERT INTO leaves (leave_type, date, duration, remark) VALUES (?, ?, ?, ?)`,
    [leave_type, date, duration, remark],
    function (err, result) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Leave record created successfully",
        leaveId: result.insertId,
      });
    }
  );
});

// Read all leave records
app.get("/leaves", (req, res) => {
  connection.query(`SELECT * FROM leaves`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ leaveRecords: results });
  });
});

// Read a specific leave record by ID
app.get("/leaves/:leaveId", (req, res) => {
  const leaveId = req.params.leaveId;

  connection.query(
    `SELECT * FROM leaves WHERE leave_id = ?`,
    [leaveId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Leave record not found" });
      }
      res.json({ leaveRecord: results[0] });
    }
  );
});

app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { username, password } = req.body;

  connection.query(
    `UPDATE users SET username = ?, password = ? WHERE id = ?`,
    [username, password, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User info updated successfully" });
    }
  );
});

// Update employment contract
app.put("/employment/:userId", (req, res) => {
  const userId = req.params.userId;
  const { start_date, end_date, position, salary } = req.body;

  connection.query(
    `UPDATE employment_contract SET start_date = ?, end_date = ?, position = ?, salary = ? WHERE user_id = ?`,
    [start_date, end_date, position, salary, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Employment contract updated successfully" });
    }
  );
});

// Update payslip
app.put("/payslip/:payslipId", (req, res) => {
  const payslipId = req.params.payslipId;
  const { month, year, amount } = req.body;

  connection.query(
    `UPDATE payslip SET month = ?, year = ?, amount = ? WHERE id = ?`,
    [month, year, amount, payslipId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Payslip updated successfully" });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
