const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const passport = require('passport');
require('./passport');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const session = require('cookie-session');
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// Sambung MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

// API: Signup
app.post('/signup', async (req, res) => {
  const { firstName, lastName, dob, phone, email, password } = req.body;

  console.log('Received signup data:', req.body); // Tambah ni

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ firstName, lastName, dob, phone, email, password });
    await newUser.save();
    console.log('User saved to DB');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// API: Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    // Redirect after successful login
    res.redirect('http://localhost:3000/dashboard'); // or your frontend route
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // 🔥 Add this
  methods: ['GET', 'POST'],
}));
