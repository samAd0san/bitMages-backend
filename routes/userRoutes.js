const express = require('express');
const userCtrl = require('../controllers/userCtrl');

const router = express.Router();

router.post('/users/signup',userCtrl.add);

module.exports = router;