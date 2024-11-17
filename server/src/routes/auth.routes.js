// const express = require('express');
// const router = express.Router();
// const passport = require('../services/auth.service');

// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to the client application
//     res.redirect('http://localhost:3000/home');
//   }
// );

// router.get('/status', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ isAuthenticated: true });
//   } else {
//     res.json({ isAuthenticated: false });
//   }
// });

// module.exports = router;

// router.post('/logout', (req, res, next) => {
//   req.logout((err) => {
//     if (err) { return next(err); }
    
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Failed to destroy session' });
//       }
      
//       res.clearCookie('connect.sid', { path: '/login' });
//       res.status(200).json({ message: 'Logout successful' });
//     });
//   });
// });


// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const passport = require('../services/auth.service');
require('dotenv').config();

// Username and Password Login Route
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Check if the provided credentials match the environment variables
//   if (
//     username === process.env.APP_USERNAME &&
//     password === process.env.APP_PASSWORD
//   ) {
//     req.session.isAuthenticated = true; // Mark session as authenticated
//     res.json({ success: true, message: 'Login successful' });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid username or password' });
//   }
// });
// Username and Password Login Route

// Username and Password Login Route

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate credentials against environment variables
    if (
      username === process.env.APP_USERNAME &&
      password === process.env.APP_PASSWORD
    ) {
      // Mark session as authenticated
      req.session.isAuthenticated = true;

      // Optionally, include a userId for the session if needed (static or derived from env)
      const userId = process.env.APP_USER_ID || 'static-user-id'; // Replace with your logic
      req.session.userId = userId;

      // Respond with success and include the userId
      res.json({ success: true, message: 'Login successful', userId });
    } else {
      // Respond with invalid credentials
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
});


// Google Authentication Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to the client application
//     req.session.isAuthenticated = true; // Set the session as authenticated
//     res.redirect('http://localhost:3000/home');
//   }
// );
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.isAuthenticated = true;
    req.session.googleId = req.user.googleId; // Store googleId in session

    // Redirect to the frontend with googleId as a query parameter
    const redirectUrl = `http://localhost:3000/home?googleId=${req.user.googleId}`;
    res.redirect(redirectUrl);
  }
);

// Route to check authentication status
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: req.session.isAuthenticated || false });
});

// Logout Route
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }

      res.clearCookie('connect.sid', { path: '/' });
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

module.exports = router;
