const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Configuration
const app = express();
const port = 3000;
const SECRET_KEY = '9820256@9820256@women_safety_ai'; // Replace with a secure secret

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '9820256@MajorK',
    database: 'women_safety',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));

// Helper Functions
const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});


// Routes

// 1. User Signup
app.post('/signup', async (req, res) => {
    console.log('Incoming signup data:', req.body);
    try {
        const { username, email, phone_number, password } = req.body;

        // Validate input: check for missing or empty values
        if (!username || !email || !phone_number || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Additional optional validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Only runs if password exists

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, phone_number, password_hash) VALUES (?, ?, ?, ?)',
            [username, email, phone_number, hashedPassword]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


// 2. User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'No account found. Please sign up!' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({ message: 'Login successful', token, userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// 3. Add Emergency Contact (Protected Route)
app.post('/contacts', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, SECRET_KEY);
        const { name, phone } = req.body; // Extract name and phone from request body

        // Verify the token and extract the user ID
        const userId = decoded.userId;

        // Insert the new contact into the database
        await pool.execute(
            'INSERT INTO emergency_contacts (user_id, name, phone_number) VALUES (?, ?, ?)',
            [userId, name, phone]
        );

        res.json({ message: 'Contact added successfully' });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Error adding contact' });
    }
});

  

// 4. Get User's Emergency Contacts (Protected Route)
app.get('/contacts', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, SECRET_KEY);
        const [contacts] = await pool.execute(
            'SELECT * FROM emergency_contacts WHERE user_id = ?',
            [decoded.userId]
        );

        res.json(contacts); // Return contacts as JSON
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});


app.delete('/contacts/:contactId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, SECRET_KEY);
        const contactId = req.params.contactId;

        // Verify if the contact belongs to the user
        const [contact] = await pool.execute(
            'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
            [contactId, decoded.userId]
        );

        if (!contact.length) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Delete the contact
        await pool.execute(
            'DELETE FROM emergency_contacts WHERE id = ?',
            [contactId]
        );

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact' });
    }
});










// TWILIO API FETCH TO SEND MESSAGES
const twilio = require('twilio');



 // Environment variables and secrets

 const accountSid = 'AC4dee3f9b5c8780aed9b915ac54360f8a';
 const authToken = 'ba83f683dff4f61ad6139d2482ee9ecb';
 const twilioPhoneNumber = '+12517661464';


 const twilioClient = twilio(accountSid, authToken);
 


 app.post('/send-alert', async (req, res) => {
  try {
  const { userLocation } = req.body;
  const [contacts] = await pool.execute(
  'SELECT phone_number, name FROM emergency_contacts'
  );
  console.log(contacts);
  if(contacts.length ===0){
    return res.status(500).send("Failed to send SMS");
  }
  const sendPromises = contacts.map(contact => {
  const message = `🚨 Distress Alert!  May be in danger.\nLocation: ${userLocation}`;
  console.log("ContactNumber="+contact.phone_number)
  return twilioClient.messages.create({
  body: message,
  from: twilioPhoneNumber,
  to: contact.phone_number,
  });
  })
  await Promise.all(sendPromises);
  res.status(200).json({ message: 'SMS alert sent successfully' });
  } catch (err) {
  console.error("❌ Error sending SMS:", err);
  res.status(500).json({ error: 'Failed to send SMS alert',message : err.message });
  }
 });

    // Send Email
    // await sgMail.send({
    //   to: contactEmail,
    //   from: process.env.FROM_EMAIL,
    //   subject: 'Emergency Alert',
    //   text: message,
    // });

   











// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
