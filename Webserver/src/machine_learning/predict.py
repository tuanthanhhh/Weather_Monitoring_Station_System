import numpy as np
import mysql.connector
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler, RobustScaler

# Kết nối đến cơ sở dữ liệu
def connect_to_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="hoidanit",
        port=3307
    )

# Lấy dữ liệu nhiệt độ, độ ẩm, và tốc độ gió
def get_combined_data():
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT temperature, humidity, wind_speed 
    FROM daily_weather_data
    ORDER BY date DESC LIMIT 24
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return np.array(result)

# Lấy dữ liệu lượng mưa
def get_rainfall_data():
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT rainfall 
    FROM daily_weather_data
    ORDER BY date DESC LIMIT 24
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return [x[0] for x in result]

# Dự đoán với model 1 (nhiệt độ, độ ẩm, tốc độ gió)
def predict_combined(data):
    model = load_model('C:/Users/LE TUAN THANH/Desktop/Doan_totnghiep/Webserver/src/machine_learning/model_temperature_humidity_wind_weights.h5')
    scaler = MinMaxScaler(feature_range=(0, 1))
    data = scaler.fit_transform(data)
    time_step = 24
    X = []
    X.append(data)
    X = np.array(X).reshape(1, time_step, 3)
    predictions = model.predict(X)
    predictions = scaler.inverse_transform(predictions)
    return np.round(predictions.flatten(), 2)  # Làm tròn 2 chữ số

# Dự đoán với model 2 (lượng mưa)
def predict_rainfall(data):
    model = load_model('C:/Users/LE TUAN THANH/Desktop/Doan_totnghiep/Webserver/src/machine_learning/model_rainfall_weights.h5')
    scaler = RobustScaler()
    data = np.array(data).reshape(-1, 1)
    scaled_data = scaler.fit_transform(data)
    time_step = 24
    X = []
    X.append(scaled_data[:, 0])
    X = np.array(X).reshape(1, time_step, 1)
    predictions = model.predict(X)
    predictions = scaler.inverse_transform(predictions)
    return np.round(predictions.flatten(), 2)  # Làm tròn 2 chữ số

# Lưu dự đoán vào cơ sở dữ liệu
def save_predictions(combined_predictions, rainfall_prediction):
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    UPDATE predict_data 
    SET temperature = %s, humidity = %s, wind_speed = %s, rainfall = %s
    WHERE location_id = %s
    """
    location_id = 1  # Thay giá trị location_id phù hợp
    temperature, humidity, wind_speed = combined_predictions
    rainfall = rainfall_prediction[0]
    cursor.execute(query, (float(temperature), float(humidity), float(wind_speed), float(rainfall), location_id))
    db.commit()
    cursor.close()
    db.close()

# Chương trình chính
def main():
    combined_data = get_combined_data()
    rainfall_data = get_rainfall_data()
    combined_predictions = predict_combined(combined_data)
    rainfall_prediction = predict_rainfall(rainfall_data)
    save_predictions(combined_predictions, rainfall_prediction)
    print("Predictions saved to database successfully.")

if __name__ == "__main__":
    main()
