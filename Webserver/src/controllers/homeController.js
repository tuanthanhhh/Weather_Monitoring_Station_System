const connection = require('../config/database');
const {getAllFilm,getAllAccount} = require('../sevices/CRUDSevices'); 
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');


const getHomepage = async (req,res)=> {
  try
  {
    const location = 1
    const [results, fields] = await connection.query('SELECT temperature, humidity, wind_speed, rainfall FROM weather_data WHERE location_id = ?', [location]);
         
    // Gửi dữ liệu đến HTML
    console.log(results);
    return res.render('main screen.ejs',{data: results,selectedLocation: location})
  } 
  catch(error)
  {
    console.error('Error retrieving data:', error);
    return res.status(500).send('Error retrieving data');
  } 
}

const getWeatherData = async (req,res)=> {
  const location = req.query.location;
  console.log(location);
  // Thực hiện truy vấn cơ sở dữ liệu để lấy dữ liệu cho vị trí đã chọn
  const [results, fields] = await connection.query('SELECT temperature, humidity, wind_speed, rainfall FROM weather_data WHERE location_id = ?', [location]);

      // Render lại trang EJS với dữ liệu mới
      res.render('main screen.ejs',{data: results,selectedLocation: location});
}


module.exports = {
  getWeatherData,getHomepage
}

