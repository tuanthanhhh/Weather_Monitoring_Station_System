import numpy as np
import mysql.connector
from tensorflow.keras.models import load_model

from sklearn.preprocessing import MinMaxScaler

def connect_to_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="hoidanit",
        port=3307
    )

def get_temperature_data():
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT temperature 
    FROM daily_weather_data
    ORDER BY date DESC LIMIT 24
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return [x[0] for x in result]

def predict_temperature(data):
    model = load_model('temperature_model.h5')
    data = np.array(data).reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)
    time_step = 24
    X = []
    X.append(scaled_data[:, 0])
    X = np.array(X).reshape(1, time_step, 1)
    predictions = model.predict(X)
    predictions = scaler.inverse_transform(predictions)
    return predictions.flatten()

def save_predictions(predictions):
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    UPDATE predict_data 
    SET temperature = %s, humidity = %s, wind_speed = %s, rainfall = %s
    WHERE location_id = %s
    """
    for i, prediction in enumerate(predictions):
        location_id = 1  # Sửa giá trị location_id cho phù hợp với bản ghi cần cập nhật
        humidity = 75.0
        wind_speed = 1.5
        rainfall = 0.05
        cursor.execute(query, (float(prediction), humidity, wind_speed, rainfall, location_id))
    db.commit()
    cursor.close()
    db.close()


def main():
    temperature_data = get_temperature_data()
    predictions = predict_temperature(temperature_data)
    save_predictions(predictions)
    print("Predictions saved to database successfully.")

if __name__ == "__main__":
    main()
