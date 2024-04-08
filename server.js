var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/demodb02');

db.serialize(function() {
   // Creating necessary tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS personal_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    full_name TEXT,
    date_of_birth TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS address (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS employment_contract (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    position TEXT,
    salary REAL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payslip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    month TEXT,
    year INTEGER,
    amount REAL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create Claims table
db.run(`CREATE TABLE IF NOT EXISTS claims (
    claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    status TEXT CHECK (status IN ('approved', 'pending', 'rejected')),
    amount REAL,
    created_by INTEGER,
    approved_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
)`);

// Create Attendance table
db.run(`CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    clocked_in TEXT,
    clocked_out TEXT
)`);

// Create Overtime table
db.run(`CREATE TABLE IF NOT EXISTS overtime (
    ot_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    ot_duration REAL,
    status TEXT CHECK (status IN ('approved', 'pending', 'rejected'))
)`);

// Create Leaves table
db.run(`CREATE TABLE IF NOT EXISTS leaves (
    leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
    leave_type TEXT,
    date TEXT,
    duration REAL,
    remark TEXT
)`);
});

});



var express = require('express');
var app = express();

const PORT = process.env.PORT || 3007;

app.post('/register', (req, res) => {
  const { username, password, fullName, dob, address, city, state, postalCode, startDate, endDate, position, salary } = req.body;

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const userId = this.lastID;
    
    if (fullName && dob) {
      // Insert personal information
      db.run('INSERT INTO personal_info (user_id, full_name, date_of_birth) VALUES (?, ?, ?)', [userId, fullName, dob], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    }

    if (address || city || state || postalCode) {
      // Insert address
      db.run('INSERT INTO address (user_id, address, city, state, postal_code) VALUES (?, ?, ?, ?, ?)', [userId, address, city, state, postalCode], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    }

    if (startDate || endDate || position || salary) {
      // Insert employment contract
      db.run('INSERT INTO employment_contract (user_id, start_date, end_date, position, salary) VALUES (?, ?, ?, ?, ?)', [userId, startDate, endDate, position, salary], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    }

    res.json({ message: 'User registered successfully' });
  });
});


// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Here you can generate a session token or JWT token and send it back to the client for subsequent requests
    res.json({ message: 'Login successful', user: row });
  });
});

// User logout
app.post('/logout', (req, res) => {
  // Here you might clear any session/token information on the client-side
  res.json({ message: 'Logout successful' });
});

// View payslip
app.get('/payslip/:userId', (req, res) => {
  const userId = req.params.userId;

  db.all('SELECT * FROM payslip WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ payslips: rows });
  });
});

// Edit payslip
app.put('/payslip/:payslipId', (req, res) => {
  const payslipId = req.params.payslipId;
  const { amount } = req.body;

  db.run('UPDATE payslip SET amount = ? WHERE id = ?', [amount, payslipId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Payslip updated successfully' });
  });
});

// View personal information
app.get('/personal_info/:userId', (req, res) => {
  const userId = req.params.userId;

  db.get('SELECT * FROM personal_info WHERE user_id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: 'Personal information not found' });
    }

    res.json({ personalInfo: row });
  });
});

// Edit personal information
app.put('/personal_info/:userId', (req, res) => {
  const userId = req.params.userId;
  const { fullName, dob } = req.body;

  db.run('UPDATE personal_info SET full_name = ?, date_of_birth = ? WHERE user_id = ?', [fullName, dob, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Personal information updated successfully' });
  });
});


// Create a claim
app.post('/claims', (req, res) => {
    const { description, status, amount, created_by, approved_by } = req.body;

    db.run(`INSERT INTO claims (description, status, amount, created_by, approved_by) VALUES (?, ?, ?, ?, ?)`, [description, status, amount, created_by, approved_by], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Claim created successfully', claimId: this.lastID });
    });
});

// Read all claims
app.get('/claims', (req, res) => {
    db.all(`SELECT * FROM claims`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ claims: rows });
    });
});

// Read a specific claim by ID
app.get('/claims/:claimId', (req, res) => {
    const claimId = req.params.claimId;

    db.get(`SELECT * FROM claims WHERE claim_id = ?`, [claimId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Claim not found' });
        }
        res.json({ claim: row });
    });
});

// Update a claim
app.put('/claims/:claimId', (req, res) => {
    const claimId = req.params.claimId;
    const { description, status, amount, created_by, approved_by } = req.body;

    db.run(`UPDATE claims SET description = ?, status = ?, amount = ?, created_by = ?, approved_by = ? WHERE claim_id = ?`, [description, status, amount, created_by, approved_by, claimId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Claim updated successfully' });
    });
});

// Delete a claim
app.delete('/claims/:claimId', (req, res) => {
    const claimId = req.params.claimId;

    db.run(`DELETE FROM claims WHERE claim_id = ?`, [claimId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Claim deleted successfully' });
    });
});


app.post('/overtime', (req, res) => {
    const { date, ot_duration, status } = req.body;

    db.run(`INSERT INTO overtime (date, ot_duration, status) VALUES (?, ?, ?)`, [date, ot_duration, status], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Overtime record created successfully', otId: this.lastID });
    });
});

// Read all overtime records
app.get('/overtime', (req, res) => {
    db.all(`SELECT * FROM overtime`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ overtimeRecords: rows });
    });
});

// Read a specific overtime record by ID
app.get('/overtime/:otId', (req, res) => {
    const otId = req.params.otId;

    db.get(`SELECT * FROM overtime WHERE ot_id = ?`, [otId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Overtime record not found' });
        }
        res.json({ overtimeRecord: row });
    });
});

// Update an overtime record
app.put('/overtime/:otId', (req, res) => {
    const otId = req.params.otId;
    const { date, ot_duration, status } = req.body;

    db.run(`UPDATE overtime SET date = ?, ot_duration = ?, status = ? WHERE ot_id = ?`, [date, ot_duration, status, otId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Overtime record updated successfully' });
    });
});

// Delete an overtime record
app.delete('/overtime/:otId', (req, res) => {
    const otId = req.params.otId;

    db.run(`DELETE FROM overtime WHERE ot_id = ?`, [otId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Overtime record deleted successfully' });
    });
});

// Create leave
app.post('/leaves', (req, res) => {
    const { leave_type, date, duration, remark } = req.body;

    db.run(`INSERT INTO leaves (leave_type, date, duration, remark) VALUES (?, ?, ?, ?)`, [leave_type, date, duration, remark], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Leave record created successfully', leaveId: this.lastID });
    });
});

// Read all leave records
app.get('/leaves', (req, res) => {
    db.all(`SELECT * FROM leaves`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ leaveRecords: rows });
    });
});

// Read a specific leave record by ID
app.get('/leaves/:leaveId', (req, res) => {
    const leaveId = req.params.leaveId;

    db.get(`SELECT * FROM leaves WHERE leave_id = ?`, [leaveId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Leave record not found' });
        }
        res.json({ leaveRecord: row });
    });
});

// Update a leave record
app.put('/leaves/:leaveId', (req, res) => {
    const leaveId = req.params.leaveId;
    const { leave_type, date, duration, remark } = req.body;

    db.run(`UPDATE leaves SET leave_type = ?, date = ?, duration = ?, remark = ? WHERE leave_id = ?`, [leave_type, date, duration, remark, leaveId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Leave record updated successfully' });
    });
});

// Delete a leave record
app.delete('/leaves/:leaveId', (req, res) => {
    const leaveId = req.params.leaveId;

    db.run(`DELETE FROM leaves WHERE leave_id = ?`, [leaveId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Leave record deleted successfully' });
    });
});


// Update user info
app.put('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const { username, password } = req.body;

    db.run(`UPDATE users SET username = ?, password = ? WHERE id = ?`, [username, password, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User info updated successfully' });
    });
});

// Update employment contract
app.put('/employment/:userId', (req, res) => {
    const userId = req.params.userId;
    const { start_date, end_date, position, salary } = req.body;

    db.run(`UPDATE employment_contract SET start_date = ?, end_date = ?, position = ?, salary = ? WHERE user_id = ?`, [start_date, end_date, position, salary, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Employment contract updated successfully' });
    });
});

// Update payslip
app.put('/payslip/:payslipId', (req, res) => {
    const payslipId = req.params.payslipId;
    const { month, year, amount } = req.body;

    db.run(`UPDATE payslip SET month = ?, year = ?, amount = ? WHERE id = ?`, [month, year, amount, payslipId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Payslip updated successfully' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
