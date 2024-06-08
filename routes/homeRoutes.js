const express = require('express');
const homeCtrl = require('../controllers/homeCtrl');

const router = express.Router();

router.get('/', homeCtrl.home);
router.get('/home', homeCtrl.home);
router.get('/health', homeCtrl.health);

module.exports = router;