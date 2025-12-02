-- ===========================================================
-- BOLT MANAGEMENT SERVICES - COMPLETE DATABASE SCHEMA
-- ===========================================================

DROP DATABASE IF EXISTS main_db;
CREATE DATABASE main_db;
USE main_db;
-- ===========================================================
-- ADMINS
-- ===========================================================

CREATE TABLE admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- RIDERS
-- ===========================================================

CREATE TABLE riders (
  rider_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
   password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- DRIVERS
-- ===========================================================

CREATE TABLE drivers (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  license_number VARCHAR(255) UNIQUE NOT NULL,
  availability ENUM('Available', 'Unavailable') DEFAULT 'Available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- VEHICLES
-- ===========================================================

CREATE TABLE vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  plate_number VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(255),
  color VARCHAR(50),
  FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);

-- ===========================================================
-- RIDES
-- ===========================================================

CREATE TABLE rides (
  ride_id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT,
  pickup_location VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  distance_km DECIMAL(10,2),
  fare_amount DECIMAL(10,2),
  status ENUM('Requested','Accepted','Started','Completed','Cancelled') DEFAULT 'Requested',
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME,
  started_at DATETIME,
  completed_at DATETIME,
  FOREIGN KEY (rider_id) REFERENCES riders(rider_id),
  FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);

-- ===========================================================
-- PAYMENTS
-- ===========================================================

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('Card','Cash','Wallet') NOT NULL,
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id)
);

-- ===========================================================
-- RATINGS
-- ===========================================================

CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  rider_id INT NOT NULL,
  driver_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
  FOREIGN KEY (rider_id) REFERENCES riders(rider_id),
  FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);

-- ===========================================================
-- TRANSACTIONS / REVENUE AUDIT
-- ===========================================================

CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  driver_earnings DECIMAL(10,2) NOT NULL,
  platform_commission DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id)
);

-- ===========================================================
-- DONE
-- ===========================================================
