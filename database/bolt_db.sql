-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bolt_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `created_at`) VALUES
(1, 'Admin One', 'admin1@example.com', '2025-11-25 02:50:50'),
(2, 'Admin Two', 'admin2@example.com', '2025-11-25 02:50:50');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `license_number` varchar(255) NOT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `name`, `phone`, `email`, `license_number`, `availability`, `created_at`) VALUES
(1, 'John Doe', '08012345601', 'johndoe1@example.com', 'DL1234561', 'Available', '2025-11-25 02:50:48'),
(2, 'Jane Smith', '08012345602', 'janesmith2@example.com', 'DL1234562', 'Unavailable', '2025-11-25 02:50:48'),
(3, 'Mike Johnson', '08012345603', 'mikejohnson3@example.com', 'DL1234563', 'Available', '2025-11-25 02:50:48'),
(4, 'Emily Davis', '08012345604', 'emilydavis4@example.com', 'DL1234564', 'Available', '2025-11-25 02:50:48'),
(5, 'David Wilson', '08012345605', 'davidwilson5@example.com', 'DL1234565', 'Unavailable', '2025-11-25 02:50:48'),
(6, 'Sarah Brown', '08012345606', 'sarahbrown6@example.com', 'DL1234566', 'Available', '2025-11-25 02:50:48'),
(7, 'Chris Lee', '08012345607', 'chrislee7@example.com', 'DL1234567', 'Unavailable', '2025-11-25 02:50:48'),
(8, 'Laura Taylor', '08012345608', 'laurataylor8@example.com', 'DL1234568', 'Available', '2025-11-25 02:50:48'),
(9, 'James Martin', '08012345609', 'jamesmartin9@example.com', 'DL1234569', 'Available', '2025-11-25 02:50:48'),
(10, 'Olivia Clark', '08012345610', 'oliviaclark10@example.com', 'DL1234570', 'Unavailable', '2025-11-25 02:50:48'),
(11, 'Ethan Lewis', '08012345611', 'ethanlewis11@example.com', 'DL1234571', 'Available', '2025-11-25 02:50:48'),
(12, 'Sophia Hall', '08012345612', 'sophiahall12@example.com', 'DL1234572', 'Available', '2025-11-25 02:50:48'),
(13, 'Liam Allen', '08012345613', 'liamallen13@example.com', 'DL1234573', 'Unavailable', '2025-11-25 02:50:48'),
(14, 'Isabella Young', '08012345614', 'isabellayoung14@example.com', 'DL1234574', 'Available', '2025-11-25 02:50:48'),
(15, 'Noah King', '08012345615', 'noahking15@example.com', 'DL1234575', 'Available', '2025-11-25 02:50:48'),
(16, 'Mia Wright', '08012345616', 'miawright16@example.com', 'DL1234576', 'Unavailable', '2025-11-25 02:50:48'),
(17, 'Alexander Scott', '08012345617', 'alexanderscott17@example.com', 'DL1234577', 'Available', '2025-11-25 02:50:48'),
(18, 'Ava Green', '08012345618', 'avagreen18@example.com', 'DL1234578', 'Available', '2025-11-25 02:50:48'),
(19, 'Daniel Adams', '08012345619', 'danieladams19@example.com', 'DL1234579', 'Unavailable', '2025-11-25 02:50:48'),
(20, 'Charlotte Baker', '08012345620', 'charlottebaker20@example.com', 'DL1234580', 'Available', '2025-11-25 02:50:48'),
(21, 'Matthew Nelson', '08012345621', 'matthewnelson21@example.com', 'DL1234581', 'Available', '2025-11-25 02:50:48'),
(22, 'Amelia Carter', '08012345622', 'ameliacarter22@example.com', 'DL1234582', 'Unavailable', '2025-11-25 02:50:48'),
(23, 'Joseph Mitchell', '08012345623', 'josephmitchell23@example.com', 'DL1234583', 'Available', '2025-11-25 02:50:48'),
(24, 'Ella Perez', '08012345624', 'ellaperez24@example.com', 'DL1234584', 'Available', '2025-11-25 02:50:48'),
(25, 'William Roberts', '08012345625', 'williamroberts25@example.com', 'DL1234585', 'Unavailable', '2025-11-25 02:50:48');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `ride_id` int(11) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `ride_id`, `amount`, `payment_method`, `paid_at`) VALUES
(1, 1, 3100.00, 'Card', '2025-10-03 10:55:00'),
(2, 2, 2600.00, 'Cash', '2025-11-05 09:42:00'),
(3, 3, 2800.00, 'Card', '2025-11-12 15:00:00'),
(4, 4, 3500.00, 'Cash', '2025-10-22 16:55:00'),
(5, 5, 2650.00, 'Card', '2025-11-01 08:55:00'),
(6, 6, 2950.00, 'Cash', '2025-10-10 12:00:00'),
(7, 7, 2450.00, 'Card', '2025-11-07 13:20:00'),
(8, 8, 3450.00, 'Cash', '2025-10-15 15:50:00'),
(9, 9, 3300.00, 'Card', '2025-11-03 18:10:00'),
(10, 10, 2850.00, 'Cash', '2025-10-28 09:50:00');

-- --------------------------------------------------------

--
-- Table structure for table `riders`
--

CREATE TABLE `riders` (
  `rider_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riders`
--

INSERT INTO `riders` (`rider_id`, `name`, `phone`, `email`, `created_at`) VALUES
(1, 'Rider One', '0812345001', 'rider1@example.com', '2025-11-25 02:50:49'),
(2, 'Rider Two', '0812345002', 'rider2@example.com', '2025-11-25 02:50:49'),
(3, 'Rider Three', '0812345003', 'rider3@example.com', '2025-11-25 02:50:49'),
(4, 'Rider Four', '0812345004', 'rider4@example.com', '2025-11-25 02:50:49'),
(5, 'Rider Five', '0812345005', 'rider5@example.com', '2025-11-25 02:50:49'),
(6, 'Rider Six', '0812345006', 'rider6@example.com', '2025-11-25 02:50:49'),
(7, 'Rider Seven', '0812345007', 'rider7@example.com', '2025-11-25 02:50:49'),
(8, 'Rider Eight', '0812345008', 'rider8@example.com', '2025-11-25 02:50:49'),
(9, 'Rider Nine', '0812345009', 'rider9@example.com', '2025-11-25 02:50:49'),
(10, 'Rider Ten', '0812345010', 'rider10@example.com', '2025-11-25 02:50:49'),
(11, 'Rider Eleven', '0812345011', 'rider11@example.com', '2025-11-25 02:50:49'),
(12, 'Rider Twelve', '0812345012', 'rider12@example.com', '2025-11-25 02:50:49'),
(13, 'Rider Thirteen', '0812345013', 'rider13@example.com', '2025-11-25 02:50:49'),
(14, 'Rider Fourteen', '0812345014', 'rider14@example.com', '2025-11-25 02:50:49'),
(15, 'Rider Fifteen', '0812345015', 'rider15@example.com', '2025-11-25 02:50:49'),
(16, 'Rider Sixteen', '0812345016', 'rider16@example.com', '2025-11-25 02:50:49'),
(17, 'Rider Seventeen', '0812345017', 'rider17@example.com', '2025-11-25 02:50:49'),
(18, 'Rider Eighteen', '0812345018', 'rider18@example.com', '2025-11-25 02:50:49'),
(19, 'Rider Nineteen', '0812345019', 'rider19@example.com', '2025-11-25 02:50:49'),
(20, 'Rider Twenty', '0812345020', 'rider20@example.com', '2025-11-25 02:50:49'),
(21, 'Rider Twenty-One', '0812345021', 'rider21@example.com', '2025-11-25 02:50:49'),
(22, 'Rider Twenty-Two', '0812345022', 'rider22@example.com', '2025-11-25 02:50:49'),
(23, 'Rider Twenty-Three', '0812345023', 'rider23@example.com', '2025-11-25 02:50:49'),
(24, 'Rider Twenty-Four', '0812345024', 'rider24@example.com', '2025-11-25 02:50:49'),
(25, 'Rider Twenty-Five', '0812345025', 'rider25@example.com', '2025-11-25 02:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE `rides` (
  `ride_id` int(11) NOT NULL,
  `rider_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `dropoff_location` varchar(255) DEFAULT NULL,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `fare_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `accepted_at` datetime DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`ride_id`, `rider_id`, `driver_id`, `pickup_location`, `dropoff_location`, `distance_km`, `fare_amount`, `status`, `requested_at`, `accepted_at`, `started_at`, `completed_at`) VALUES
(1, 1, 3, 'Ikeja', 'Lekki', 12.50, 3100.00, 'Completed', '2025-10-03 10:12:00', '2025-10-03 10:15:00', '2025-10-03 10:20:00', '2025-10-03 10:50:00'),
(2, 2, 7, 'Yaba', 'Victoria Island', 8.30, 2600.00, 'Completed', '2025-11-05 09:10:00', '2025-11-05 09:12:00', '2025-11-05 09:18:00', '2025-11-05 09:40:00'),
(3, 3, 2, 'Surulere', 'Ikoyi', 10.00, 2800.00, 'Completed', '2025-11-12 14:20:00', '2025-11-12 14:23:00', '2025-11-12 14:30:00', '2025-11-12 14:55:00'),
(4, 4, 5, 'Festac', 'Ajah', 15.20, 3500.00, 'Completed', '2025-10-22 16:05:00', '2025-10-22 16:10:00', '2025-10-22 16:15:00', '2025-10-22 16:50:00'),
(5, 5, 1, 'Ojota', 'Maryland', 9.70, 2650.00, 'Completed', '2025-11-01 08:15:00', '2025-11-01 08:17:00', '2025-11-01 08:25:00', '2025-11-01 08:50:00'),
(6, 6, 6, 'Ikeja', 'Yaba', 11.40, 2950.00, 'Completed', '2025-10-10 11:10:00', '2025-10-10 11:13:00', '2025-10-10 11:20:00', '2025-10-10 11:55:00'),
(7, 7, 8, 'Lekki', 'Ikoyi', 7.80, 2450.00, 'Completed', '2025-11-07 12:45:00', '2025-11-07 12:48:00', '2025-11-07 12:52:00', '2025-11-07 13:15:00'),
(8, 8, 9, 'Victoria Island', 'Festac', 14.10, 3450.00, 'Completed', '2025-10-15 15:00:00', '2025-10-15 15:03:00', '2025-10-15 15:10:00', '2025-10-15 15:45:00'),
(9, 9, 4, 'Ajah', 'Surulere', 13.00, 3300.00, 'Completed', '2025-11-03 17:20:00', '2025-11-03 17:25:00', '2025-11-03 17:30:00', '2025-11-03 18:05:00'),
(10, 10, 10, 'Maryland', 'Ojota', 10.50, 2850.00, 'Completed', '2025-10-28 09:05:00', '2025-10-28 09:08:00', '2025-10-28 09:15:00', '2025-10-28 09:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `plate_number` varchar(255) NOT NULL,
  `car_model` varchar(255) DEFAULT NULL,
  `car_color` varchar(255) DEFAULT NULL,
  `manufacture_year` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `driver_id`, `plate_number`, `car_model`, `car_color`, `manufacture_year`, `created_at`) VALUES
(1, 1, 'ABC123AA', 'Toyota Camry', 'Black', 2018, '2025-11-25 02:50:49'),
(2, 2, 'BCD234BB', 'Honda Civic', 'White', 2019, '2025-11-25 02:50:49'),
(3, 3, 'CDE345CC', 'Ford Focus', 'Blue', 2017, '2025-11-25 02:50:49'),
(4, 4, 'DEF456DD', 'Hyundai Elantra', 'Red', 2020, '2025-11-25 02:50:49'),
(5, 5, 'EFG567EE', 'Nissan Altima', 'Silver', 2016, '2025-11-25 02:50:49'),
(6, 6, 'FGH678FF', 'Kia Optima', 'Gray', 2018, '2025-11-25 02:50:49'),
(7, 7, 'GHI789GG', 'Chevrolet Malibu', 'Black', 2017, '2025-11-25 02:50:49'),
(8, 8, 'HIJ890HH', 'BMW 3 Series', 'White', 2019, '2025-11-25 02:50:49'),
(9, 9, 'IJK901II', 'Mercedes C-Class', 'Blue', 2018, '2025-11-25 02:50:49'),
(10, 10, 'JKL012JJ', 'Audi A4', 'Red', 2020, '2025-11-25 02:50:49'),
(11, 11, 'KLM123KK', 'Volkswagen Passat', 'Silver', 2016, '2025-11-25 02:50:49'),
(12, 12, 'LMN234LL', 'Mazda 6', 'Gray', 2017, '2025-11-25 02:50:49'),
(13, 13, 'MNO345MM', 'Subaru Legacy', 'Black', 2018, '2025-11-25 02:50:49'),
(14, 14, 'NOP456NN', 'Lexus IS', 'White', 2019, '2025-11-25 02:50:49'),
(15, 15, 'OPQ567OO', 'Toyota Corolla', 'Blue', 2020, '2025-11-25 02:50:49'),
(16, 16, 'PQR678PP', 'Honda Accord', 'Red', 2016, '2025-11-25 02:50:49'),
(17, 17, 'QRS789QQ', 'Ford Fusion', 'Silver', 2017, '2025-11-25 02:50:49'),
(18, 18, 'RST890RR', 'Hyundai Sonata', 'Gray', 2018, '2025-11-25 02:50:49'),
(19, 19, 'STU901SS', 'Nissan Sentra', 'Black', 2019, '2025-11-25 02:50:49'),
(20, 20, 'TUV012TT', 'Kia Forte', 'White', 2020, '2025-11-25 02:50:49'),
(21, 21, 'UVW123UU', 'Chevrolet Cruze', 'Blue', 2016, '2025-11-25 02:50:49'),
(22, 22, 'VWX234VV', 'BMW 5 Series', 'Red', 2017, '2025-11-25 02:50:49'),
(23, 23, 'WXY345WW', 'Mercedes E-Class', 'Silver', 2018, '2025-11-25 02:50:49'),
(24, 24, 'XYZ456XX', 'Audi A6', 'Gray', 2019, '2025-11-25 02:50:49'),
(25, 25, 'YZA567YY', 'Volkswagen Jetta', 'Black', 2020, '2025-11-25 02:50:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `license_number` (`license_number`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `ride_id` (`ride_id`);

--
-- Indexes for table `riders`
--
ALTER TABLE `riders`
  ADD PRIMARY KEY (`rider_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `rides`
--
ALTER TABLE `rides`
  ADD PRIMARY KEY (`ride_id`),
  ADD KEY `rider_id` (`rider_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `driver_id` (`driver_id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `riders`
--
ALTER TABLE `riders`
  MODIFY `rider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `rides`
--
ALTER TABLE `rides`
  MODIFY `ride_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`) ON DELETE CASCADE;

--
-- Constraints for table `rides`
--
ALTER TABLE `rides`
  ADD CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`rider_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rides_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE SET NULL;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
