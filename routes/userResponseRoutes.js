const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/submitUserResponse', userController.submitUserResponse);

module.exports = router;
