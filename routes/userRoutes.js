const express = require('express');
const userCtrl = require('../controllers/userCtrl');

const router = express.Router();

router.post('/users/signup',userCtrl.signup);
router.post('/users/signin',userCtrl.signin);

// New route for fetching user profile by email
router.get('/profile/:email', userCtrl.getUserProfile);

module.exports = router;