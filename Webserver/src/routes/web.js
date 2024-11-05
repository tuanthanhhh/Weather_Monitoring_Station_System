const express = require('express');
const {getWeatherData,getHomepage} = require('../controllers/homeController');
const router = express.Router();
const multer = require('multer')

router.get('/',getHomepage);
router.get('/weather',getWeatherData);



module.exports = router;
