const express = require('express');
const {saveData,getWeatherData,getHomepage} = require('../controllers/homeController');
const router = express.Router();
const multer = require('multer');

router.get('/',getHomepage);
router.get('/weather',getWeatherData);
router.post('/save-data',saveData);


module.exports = router;
