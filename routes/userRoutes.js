const express = require('express');
const userCtrl = require('../controllers/userCtrl');

const router = express.Router();

router.post('/users/signup',userCtrl.signup);
router.post('/users/signin',userCtrl.signin);

module.exports = router;