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

const saveData = async (req,res)=>{
  const {location_id,temperature, humidity,wind_speed,rainfall} = req.body;
  const query =  `
  UPDATE weather_data
  SET temperature = ?, humidity = ?, wind_speed = ?, rainfall = ?
  WHERE location_id = ?
`;
console.log(query);

const [results, fields] = await connection.query(query,[temperature,humidity,wind_speed,rainfall,location_id]);
console.log(results);

res.status(200).send({ message: "Dữ liệu đã được cập nhật!" });
}


module.exports = {
  getWeatherData,getHomepage,saveData
}

