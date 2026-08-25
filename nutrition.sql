-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2026 at 11:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nutrition`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`) VALUES
(1, 'Optimum Nutrition', ''),
(6, 'Labrada', ''),
(11, 'Muscletech', ''),
(21, 'Muscleblaze', ''),
(51, 'Healthfarm', ''),
(59, 'Fast&Up', ''),
(66, 'Raw Nutrition', ''),
(68, 'QNT', ''),
(73, 'BPI', ''),
(77, 'Ronnie Coleman', ''),
(79, 'GNC', ''),
(94, 'One Science', ''),
(96, 'Avvatar', ''),
(98, 'Ultimate Nutrition', ''),
(99, 'Dymatize', ''),
(101, 'Mutant', ''),
(102, 'Myfitness', ''),
(106, 'Genetic Nutrition', ''),
(108, 'Rule1', ''),
(109, 'Asitis', ''),
(110, 'PHD', ''),
(112, 'Wellbeing Nutrition', ''),
(119, 'Big Muscle Nutrition', ''),
(126, '1UP', ''),
(127, 'Isopure', ''),
(135, 'Redcon', ''),
(136, 'Prosupps', ''),
(139, 'Myogenetix', ''),
(142, 'Nutrex', ''),
(147, 'Bodyfirst Nutrition', ''),
(148, 'Ritebite', ''),
(149, 'Exalt', ''),
(150, 'William Bonac', ''),
(151, 'PVL', ''),
(152, 'Kapiva', ''),
(153, 'Xtend', ''),
(154, 'Scitron', ''),
(155, 'Wellversed', ''),
(156, 'BlackBeast', ''),
(157, 'Cutler Nutrition', ''),
(158, 'Enhanced Labs', ''),
(160, 'Concret', ''),
(161, 'Best Nutrition', ''),
(162, 'Illumanti Labz', ''),
(164, 'Applied Nutrition', ''),
(165, 'HealthNinja', ''),
(166, 'Ripped Up Nutrition', ''),
(167, 'Elev', ''),
(168, 'True Elements', ''),
(169, 'Kevin Levrone', '');

-- --------------------------------------------------------

--
-- Table structure for table `cart_activity`
--

CREATE TABLE `cart_activity` (
  `id` int(11) NOT NULL,
  `user_id` tinyint(4) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `cart_item_id` tinyint(4) DEFAULT NULL,
  `product_id` tinyint(4) DEFAULT NULL,
  `source` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `quantity` tinyint(4) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cart_activity`
--

INSERT INTO `cart_activity` (`id`, `user_id`, `action`, `cart_item_id`, `product_id`, `source`, `product_name`, `price`, `quantity`, `created_at`) VALUES
(1, 6, 'added', 6, 2, 'home', 'Muscleblaze Biozyme Whey Protein 1kg', 2700.00, 1, '2026-06-11 10:44:57'),
(2, 6, 'added', 7, 3, 'shop', 'Creatine Monohydrate', 24.99, 1, '2026-06-11 10:45:05'),
(3, 6, 'added', 8, 9, 'shop', 'Energy Booster', 32.99, 1, '2026-06-11 10:45:13'),
(4, 6, 'removed', 6, 2, 'home', 'Muscleblaze Biozyme Whey Protein 1kg', 2700.00, 1, '2026-06-11 10:46:58'),
(5, 6, 'checked_out', 7, 3, 'shop', 'Creatine Monohydrate', 24.99, 1, '2026-06-11 10:47:16'),
(6, 6, 'checked_out', 8, 9, 'shop', 'Energy Booster', 32.99, 1, '2026-06-11 10:47:16'),
(7, 4, 'added', 1, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 11:36:15'),
(8, 4, 'added', 2, 93, 'shop', 'GNC AMP Gold Series BCAA Advanced, 30 Servings, 400 g (0.88 lb), Kiwi Strawberry', 520.00, 1, '2026-06-17 11:36:15'),
(9, 4, 'added', 3, 31, 'shop', 'MuscleBlaze Biozyme 5-in-1 Multivitamin', 520.00, 1, '2026-06-17 11:36:15'),
(10, 4, 'added', 4, 29, 'shop', 'MuscleBlaze Biozyme Performance Whey', 520.00, 1, '2026-06-17 11:36:15'),
(11, 4, 'removed', 4, 29, 'shop', 'MuscleBlaze Biozyme Performance Whey', 520.00, 1, '2026-06-17 11:36:15'),
(12, 4, 'removed', 3, 31, 'shop', 'MuscleBlaze Biozyme 5-in-1 Multivitamin', 520.00, 1, '2026-06-17 11:36:15'),
(13, 4, 'removed', 2, 93, 'shop', 'GNC AMP Gold Series BCAA Advanced, 30 Servings, 400 g (0.88 lb), Kiwi Strawberry', 520.00, 1, '2026-06-17 11:36:15'),
(14, 4, 'removed', 1, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 11:36:15'),
(15, 14, 'added', 5, 109, 'shop', 'AS-IT-IS Whey Protein Concentrate 80%', 520.00, 1, '2026-06-17 11:35:52'),
(16, 14, 'checked_out', 5, 109, 'shop', 'AS-IT-IS Whey Protein Concentrate 80%', 520.00, 1, '2026-06-17 11:35:52'),
(17, 5, 'added', 6, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 11:41:34'),
(18, 5, 'removed', 6, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 11:41:58'),
(19, 5, 'added', 7, 63, 'shop', 'Fast&Up EAA Intra - Training Workout Drink', 520.00, 1, '2026-06-17 11:42:19'),
(20, 5, 'removed', 7, 63, 'shop', 'Fast&Up EAA Intra - Training Workout Drink', 520.00, 1, '2026-06-17 11:48:13'),
(21, 4, 'added', 8, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 12:25:48'),
(22, 4, 'removed', 8, 96, 'home', 'Avvatar Muscle Gainer', 520.00, 1, '2026-06-17 12:25:53');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `cart_key` varchar(255) NOT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `source` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image`) VALUES
(1, 'Mass Gainer', '', ''),
(2, 'Creatine', '', ''),
(3, 'Glutamine', '', ''),
(4, 'BCAA/EAA', '', ''),
(8, 'Whey Protein', '', ''),
(9, 'Whey Protein Isolate', '', ''),
(13, 'Multivitamin', '', ''),
(18, 'Fat Burner', '', ''),
(23, 'Fish Oil', '', ''),
(27, 'Preworkout', '', ''),
(32, 'L-Carnitine', '', ''),
(35, 'Protein Foods & Bars', '', ''),
(42, 'Raw Protein', '', ''),
(43, 'CLA', '', ''),
(45, 'Protein Bar', '', ''),
(62, 'L-Citrulline', '', ''),
(64, 'Plant Protein', '', ''),
(65, 'Grass Fed Protein', '', ''),
(72, 'Whey Isolate Protein', '', ''),
(79, 'Weight Gainer', '', ''),
(86, 'L-Arginine', '', ''),
(87, 'Strength', '', ''),
(91, 'Immunity', '', ''),
(97, 'Whey Isolate', '', ''),
(100, 'Whey Protein Hydrolised', '', ''),
(102, 'Peanut Butter', '', ''),
(112, 'Apple Cider Vinegar', '', ''),
(113, 'Speciality Supplements', '', ''),
(115, 'Testo Booster', '', ''),
(120, 'Whey Protein Concentrate', '', ''),
(125, 'Multivitamins', '', ''),
(126, 'PreWorkouts', '', ''),
(128, 'Testoterene', '', ''),
(129, 'EAA/BCAA', '', ''),
(131, 'Mass Gainers', '', ''),
(132, 'Carbs Blend', '', ''),
(133, 'Arginine', '', ''),
(134, 'ZMA', '', ''),
(135, 'Muscle Gain Tablets', '', ''),
(136, 'Ashwangandha', '', ''),
(137, 'Collagen', '', ''),
(138, 'Protein Bars', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` tinyint(4) DEFAULT NULL,
  `order_number` varchar(100) NOT NULL,
  `total` decimal(4,2) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total`, `status`, `created_at`) VALUES
(1, 6, 'ORD1781174836595', 57.98, 'Pending', '2026-06-11 10:47:16'),
(2, 14, 'ORD1781676352196', 99.99, 'Pending', '2026-06-17 11:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` tinyint(4) DEFAULT NULL,
  `product_id` tinyint(4) DEFAULT NULL,
  `source` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(4,2) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `quantity` tinyint(4) DEFAULT NULL,
  `user_id` tinyint(4) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `source`, `name`, `price`, `image`, `category`, `quantity`, `user_id`, `created_at`) VALUES
(1, 1, 3, 'shop', 'Creatine Monohydrate', 24.99, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop', 'Creatine', 1, 6, '2026-06-17 11:35:36'),
(2, 1, 9, 'shop', 'Energy Booster', 32.99, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop', 'Pre-Workout', 1, 6, '2026-06-17 11:35:36'),
(3, 2, 109, 'shop', 'AS-IT-IS Whey Protein Concentrate 80%', 99.99, 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 'Whey Protein', 1, 14, '2026-06-17 11:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `product_link` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `original_price` decimal(4,1) DEFAULT NULL,
  `price` decimal(4,1) DEFAULT NULL,
  `discount` decimal(3,1) DEFAULT NULL,
  `quantity` tinyint(4) DEFAULT NULL,
  `stock_status` varchar(100) DEFAULT 'In Stock',
  `variation` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` varchar(19) DEFAULT NULL,
  `updated_at` varchar(19) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `brand`, `name`, `product_link`, `image`, `original_price`, `price`, `discount`, `quantity`, `stock_status`, `variation`, `category`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Optimum Nutrition', 'Optimum Nutrition (ON) Serious Mass Weight Gainer Powder (Vegetarian)', 'https://nutrabay.com/product/optimum-nutrition-on-serious-mass-2/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-OPT-1020-13-01.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG, 5KG', 'Mass Gainer', 'Optimum Nutrition – 3KG, 5KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(2, 'Optimum Nutrition', 'Optimum Nutrition (ON) Micronized Creatine Monohydrate Powder', 'https://nutrabay.com/product/optimum-nutrition-on-micro-creatine-powder-2/', 'https://cdn2.nutrabay.com/uploads/product/images/featured_image-NB-OPT-1012-PA-1772085018-1200x1200.webp', 900.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Creatine', 'Optimum Nutrition – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(3, 'Optimum Nutrition', 'Optimum Nutrition (ON) Glutamine Powder', 'https://nutrabay.com/product/optimum-nutrition-on-glutamine-powder-2/', 'https://cdn2.nutrabay.com/uploads/product/images/featured_image-NB-OPT-1009-PA-1765363217-1200x1200.webp', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Glutamine', 'Optimum Nutrition – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(4, 'Optimum Nutrition', 'ON (Optimum Nutrition) Essential Amino Energy, 270 g (0.6 lb), 30 Servings, Orange', 'https://www.healthkart.com/sv/on-optimum-nutrition-essential-amino-energy/SP-9574?navKey=VRNT-14739&itracker=w:menuLanding||;p:5|;e:14739|;', 'https://img4.hkrtcdn.com/27757/prd_2775673-ON-Optimum-Nutrition-Essential-Amino-Energy-0.6-lb-30-Servings-Orange_o.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'BCAA/EAA', 'Optimum Nutrition – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(5, 'Optimum Nutrition', 'ON (Optimum Nutrition) Glutamine Powder, 250 g (0.55 lb)', 'https://www.healthkart.com/sv/on-optimum-nutrition-glutamine-powder/SP-9576?navKey=VRNT-173081&itracker=w:menuLanding|undefined||;p:4|;e:173081|;', 'https://img6.hkrtcdn.com/15624/prd_1562315-ON-Optimum-Nutrition-Glutamine-Powder-0.55-lb-Unflavoured_o.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Glutamine', 'Optimum Nutrition – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(6, 'Labrada', 'Labrada Muscle Mass Gainer', 'https://nutrabay.com/product/labrada-mass-gainer/', 'https://cdn2.nutrabay.com/uploads/product/images/featured_image-NB-LAB-1001-PA-1500x1500.webp', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG, 5KG', 'Mass Gainer', 'Labrada – 3KG, 5KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(7, 'Labrada', 'Labrada Crealean', 'https://nutrabay.com/product/labrada-crealean/', 'https://cdn.nutrabay.com/wp-content/uploads/2023/05/NB-LAB-1006-01-01.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '0.55LB', 'Creatine', 'Labrada – 0.55LB', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(8, 'Labrada', 'Labrada Whey Protein', 'https://nutrabay.com/product/labrada-100-whey/', 'https://cdn2.nutrabay.com/uploads/product/images/featured_image-NB-LAB-1000-PA-1500x1500.webp', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Labrada – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(9, 'Labrada', 'Labrada Turbo Whey Isolate, Concentrate, and Creatine', 'https://nutrabay.com/product/labrada-turbo-whey/', 'https://cdn.nutrabay.com/wp-content/uploads/2021/12/NB-LAB-1017-01-01.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'Labrada – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(10, 'Labrada', 'Labrada Gluta Lean, 250 g (0.55 lb)', 'https://www.healthkart.com/sv/labrada-gluta-lean/SP-94314?navKey=VRNT-176200&itracker=w:menuLanding|undefined||;p:8|;e:176200|;', 'https://img3.hkrtcdn.com/16660/prd_1665942-Labrada-Gluta-Lean-0.55-lb-Unflavoured_o.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250 GMS', 'Glutamine', 'Labrada – 250 GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(11, 'Muscletech', 'MuscleTech NitroTech Whey Protein', 'https://nutrabay.com/product/muscletech-nitrotech-performance-series/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2LBS, 4LBS, 2KG', 'Whey Protein', 'Muscletech – 2LBS, 4LBS, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(12, 'Muscletech', 'MuscleTech Platinum Creatine Monohydrate', 'https://nutrabay.com/product/muscletech-platinum-100-creatine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '250GMS, 400GMS', 'Creatine', 'Muscletech – 250GMS, 400GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(13, 'Muscletech', 'MuscleTech Platinum MultiVitamin', 'https://nutrabay.com/product/muscletech-multivitamin/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60N, 90N', 'Multivitamin', 'Muscletech – 60N, 90N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(14, 'Muscletech', 'MuscleTech NitroTech Whey Gold', 'https://nutrabay.com/product/muscletech-nitrotech-wheygold-performance-series/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG, 1.81KG', 'Whey Protein Isolate', 'Muscletech – 2KG, 1.81KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(15, 'Muscletech', 'MuscleTech MassTech Extreme 2000', 'https://nutrabay.com/product/muscletech-masstech-extreme-2000/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG', 'Mass Gainer', 'Muscletech – 3KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(16, 'Muscletech', 'MuscleTech Performance Series NitroTech Ripped', 'https://nutrabay.com/product/muscletech-performance-series-nitrotech-ripped/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG, 4LBS', 'Whey Protein Isolate', 'Muscletech – 2KG, 4LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(17, 'Muscletech', 'MuscleTech Platinum Glutamine', 'https://nutrabay.com/product/muscletech-glutamine-0-67-lb-unflavoured/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Glutamine', 'Muscletech – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(18, 'Muscletech', 'MuscleTech Hydroxycut Hardcore Super Elite', 'https://nutrabay.com/product/muscletech-hydroxycut-hardcore-super-elite/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '100 Tabs', 'Fat Burner', 'Muscletech – 100 Tabs', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(19, 'Muscletech', 'MuscleTech Platinum Whey Isolate', 'https://nutrabay.com/product/muscletech-platinum-100-whey-isolate/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '4LBS', 'Whey Protein Isolate', 'Muscletech – 4LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(20, 'Muscletech', 'MuscleTech Hydroxycut Hardcore Elite', 'https://nutrabay.com/product/muscletech-hydroxycut-hardcore-elite-100-capsules/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '180 Cap', 'Fat Burner', 'Muscletech – 180 Cap', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(21, 'Muscleblaze', 'MuscleBlaze Whey Protein', 'https://nutrabay.com/product/muscleblaze-whey-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG', 'Whey Protein', 'Muscleblaze – 1KG, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(22, 'Muscleblaze', 'MuscleBlaze MB-Vite MultiVitamins', 'https://nutrabay.com/product/muscleblaze-mb-vite-multi-vitamins/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60Tab, 120Tab', 'Multivitamin', 'Muscleblaze – 60Tab, 120Tab', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(23, 'Muscleblaze', 'MuscleBlaze Fish Oil 1000mg', 'https://nutrabay.com/product/muscleblaze-fish-oil/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60Tab, 90 Tab', 'Fish Oil', 'Muscleblaze – 60Tab, 90 Tab', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(24, 'Muscleblaze', 'MuscleBlaze Whey Gold', 'https://nutrabay.com/product/muscleblaze-whey-gold/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG, 4KG', 'Whey Protein Isolate', 'Muscleblaze – 1KG, 2KG, 4KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(25, 'Muscleblaze', 'MuscleBlaze BCAA Pro', 'https://nutrabay.com/product/muscleblaze-bcaa-pro-450g/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'BCAA/EAA', 'Muscleblaze – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(26, 'Muscleblaze', 'MuscleBlaze 70% Whey Performance Protein', 'https://nutrabay.com/product/muscleblaze-70-whey-performance-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG', 'Whey Protein', 'Muscleblaze – 1KG, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(27, 'Muscleblaze', 'MuscleBlaze Pre Workout 300', 'https://nutrabay.com/product/muscleblaze-pre-workout-300/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'Preworkout', 'Muscleblaze – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(28, 'Muscleblaze', 'MuscleBlaze Omega 3 Fish Oil Gold 1250mg - Triple Strength Formula (560mg EPA & 400mg DHA)', 'https://nutrabay.com/product/muscleblaze-fish-oil-gold-460-epa-380-dha/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60N, 90N', 'Fish Oil', 'Muscleblaze – 60N, 90N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(29, 'Muscleblaze', 'MuscleBlaze Biozyme Performance Whey', 'https://nutrabay.com/product/muscleblaze-biozyme-performance-whey/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG', 'Whey Protein', 'Muscleblaze – 1KG, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(30, 'Muscleblaze', 'MuscleBlaze Biozyme Iso Zero Low Carb', 'https://nutrabay.com/product/muscleblaze-iso-zero-low-carb/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'Muscleblaze – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(31, 'Muscleblaze', 'MuscleBlaze Biozyme 5-in-1 Multivitamin', 'https://nutrabay.com/product/muscleblaze-biozyme-daily-multivitamin/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '90N', 'Multivitamin', 'Muscleblaze – 90N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(32, 'Muscleblaze', 'MuscleBlaze Liquid L-Carnitine', 'https://nutrabay.com/product/muscleblaze-liquid-l-carnitine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'L-Carnitine', 'Muscleblaze – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(33, 'Muscleblaze', 'MuscleBlaze Biozyme Performance Whey, 2 kg (4.4 lb), Rich Chocolate', 'https://www.healthkart.com/sv/muscleblaze-biozyme-performance-whey/SP-84971?navKey=VRNT-159123&itracker=w:related-products|;p:1|;c:muscleblaze-biozyme-performance-whey%2C-4.4-lb-rich-chocolate-|;e:10|;&ac_sel=muscleblaze-biozyme-performance-whey%2C-4.4-lb-rich-chocolate-&search=bioenzyme', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Muscleblaze – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(34, 'Muscleblaze', 'MuscleBlaze Pre Workout WrathX, 510 g (1.12 lb), Cola Frost', 'https://www.healthkart.com/sv/muscleblaze-pre-workout-wrathx/SP-95398?navKey=VRNT-210726&itracker=w:search|undefined||searchedTerm-wrathx|;p:3|;e:210726|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '500GM', 'Preworkout', 'Muscleblaze – 500GM', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(35, 'Muscleblaze', 'MuscleBlaze High Protein Muesli, 1 kg, Dark Chocolate & Cranberry', 'https://www.healthkart.com/sv/muscleblaze-high-protein-muesli/SP-92373?navKey=VRNT-172085&itracker=w:home|fit-food-range|9|;p:4|;c:muscleblaze-high-protein-muesli%2C-1-kg-dark-chocolate-n-cranberry-|;e:172085|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '400GM, 1KG', 'Protein Foods & Bars', 'Muscleblaze – 400GM, 1KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(36, 'Muscleblaze', 'MuscleBlaze High Protein Oats, 1 kg, Dark Chocolate', 'https://www.healthkart.com/sv/muscleblaze-high-protein-oats/SP-96620?navKey=VRNT-189232&itracker=w:home|fit-food-range|9|;p:5|;c:muscleblaze-high-protein-oats%2C-1-kg-dark-chocolate-|;e:189232|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG', 'Protein Foods & Bars', 'Muscleblaze – 1KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(37, 'Muscleblaze', 'MuscleBlaze Protein Granola, Chocolate & Almonds 350 g', 'https://www.healthkart.com/sv/muscleblaze-protein-granola/SP-97476?navKey=VRNT-181526&itracker=w:home|fit-food-range|9|;p:8|;c:muscleblaze-protein-granola%2C-chocolate-n-almonds-350-g-|;e:181526|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '350GM', 'Protein Foods & Bars', 'Muscleblaze – 350GM', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(38, 'Muscleblaze', 'MuscleBlaze Protein Bar (20 gm Protein), 6 bar(s), Cookies & Cream', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-20-gm-protein/SP-102220?navKey=VRNT-208738&itracker=w:menuLanding|undefined||;p:1|;e:208738|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Foods & Bars', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(39, 'Muscleblaze', 'MuscleBlaze Protein Bar (20 gm Protein), 6 bar(s), Choco Cranberry', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-20-gm-protein/SP-102220?navKey=VRNT-190816&itracker=w:menuLanding|undefined||;p:2|;e:190816|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Foods & Bars', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(40, 'Muscleblaze', 'MuscleBlaze Protein Bar (20 gm Protein), 6 bar(s), Choco Almond', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-20-gm-protein/SP-102220?navKey=VRNT-190818&itracker=w:menuLanding|undefined||;p:3|;e:190818|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Foods & Bars', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(41, 'Muscleblaze', 'MuscleBlaze Protein Bar (10 gm Protein), 6 bar(s), Choco Cranberry', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-10-gm-protein/SP-102222?navKey=VRNT-190820&itracker=w:menuLanding|undefined||;p:13|;e:190820|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Foods & Bars', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(42, 'Muscleblaze', 'MuscleBlaze Raw Whey Isolate, 1 kg (2.2 lb), 100% Clean Whey Unflavoured', 'https://www.healthkart.com/sv/muscleblaze-raw-whey-isolate/SP-41013?navKey=VRNT-74827&itracker=w:search|undefined||searchedTerm-raw%20protein|;p:1|;e:74827|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG', 'Raw Protein', 'Muscleblaze – 1KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(43, 'Muscleblaze', 'MuscleBlaze CLA 1000 Fat Burner Softgels', 'https://nutrabay.com/product/muscleblaze-cla-1000-fat-burner-softgels/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '100 Softgels', 'CLA', 'Muscleblaze – 100 Softgels', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(44, 'Muscleblaze', 'MuscleBlaze High Protein Gold Gainer', 'https://nutrabay.com/product/muscleblaze-gold-gainer-xxl/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG', 'Mass Gainer', 'Muscleblaze – 3KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(45, 'Muscleblaze', 'MuscleBlaze Protein Bar (20 gm Protein), 6 bar(s), Choco Cranberry', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-20-gm-protein/SP-102220?navKey=VRNT-190816&itracker=w:search|undefined||searchedTerm-muscleblaze%20protein%20bar|;p:2|;e:190816|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Bar', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(46, 'Muscleblaze', 'MuscleBlaze Protein Bar (20 gm Protein), 6 bar(s), Choco Almond', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-20-gm-protein/SP-102220?navKey=VRNT-190818&itracker=w:search|undefined||searchedTerm-muscleblaze%20protein%20bar|;p:3|;e:190818|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Bar', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(47, 'Muscleblaze', 'MuscleBlaze Protein Bar (10 gm Protein), 6 bar(s), Cookies & Cream', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-10-gm-protein/SP-102222?navKey=VRNT-208740&itracker=w:search|undefined||searchedTerm-muscleblaze%20protein%20bar|;p:5|;e:208740|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Bar', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(48, 'Muscleblaze', 'MuscleBlaze Protein Bar (10 gm Protein), 6 bar(s), Choco Almond', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-10-gm-protein/SP-102222?navKey=VRNT-190822&itracker=w:search|undefined||searchedTerm-muscleblaze%20protein%20bar|;p:6|;e:190822|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Bar', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(49, 'Muscleblaze', 'MuscleBlaze Protein Bar (10 gm Protein), 6 bar(s), Choco Cranberry', 'https://www.healthkart.com/sv/muscleblaze-protein-bar-10-gm-protein/SP-102222?navKey=VRNT-190820&itracker=w:search|undefined||searchedTerm-muscleblaze%20protein%20bar|;p:8|;e:190820|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '6 Bar', 'Protein Bar', 'Muscleblaze – 6 Bar', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(50, 'Muscleblaze', 'MuscleBlaze L-Glutamine', 'https://nutrabay.com/product/muscleblaze-micronized-glutamine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Glutamine', 'Muscleblaze – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(51, 'Healthfarm', 'Healthfarm Signature Whey Protein w/ BCAA & Glutamine', 'https://nutrabay.com/product/healthfarm-signature-whey-protein-w-bcaa-glutamine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG, 4KG', 'Whey Protein', 'Healthfarm – 2KG, 4KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(52, 'Healthfarm', 'Healthfarm Energy BCAA - Pre & Intra Workout Supplements', 'https://nutrabay.com/product/healthfarm-energy-bcaa-pre-intra-workout-supplements/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '31 Servings', 'BCAA/EAA', 'Healthfarm – 31 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(53, 'Healthfarm', 'Healthfarm Whey Protein Plus w/ Added Vitamins | 24g Protein', 'https://nutrabay.com/product/healthfarm-whey-protein-plus-w-added-vitamins-24g-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Healthfarm – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(54, 'Healthfarm', 'HF Series L- Carnitine Preworkout Supplement', 'https://healthfarmnutrition.com/products/hf-series-l-carnitine-3000mg-preworkout-supplement?variant=44208328769768&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AR57-fB5NTvOIe2rdkMf4R9X5oqcHxFvOsmB-3aqSPj00s1qAM6FsXx3zjs', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '450ML', 'L-Carnitine', 'Healthfarm – 450ML', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(55, 'Healthfarm', 'HealthFarm Whey Protein Plus with Added Vitamins', 'https://healthfarmnutrition.com/products/healthfarm-whey-protein-plus-with-added-vitamins', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Healthfarm – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(56, 'Healthfarm', 'HealthFarm ISO Pro ZERO, 100% Whey', 'https://healthfarmnutrition.com/products/healthfarm-iso-pro-zero-100-whey', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG', 'Whey Protein Isolate', 'Healthfarm – 1KG, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(57, 'Healthfarm', 'HF Series Nitro Fusion Whey Isolate Protein', 'https://healthfarmnutrition.com/products/hf-series-nitro-fusion-whey-isolate-protein', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Healthfarm – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(58, 'Healthfarm', 'HealthFarm Creatine Micronized, 100% Pure Monohydrate (250g)', 'https://healthfarmnutrition.com/products/healthfarm-creatine-micronized-100-pure-monohydrate-250g', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '250 GMS', 'Creatine', 'Healthfarm – 250 GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(59, 'Fast&Up', 'Fast&Up Creatine Monohydrate', 'https://nutrabay.com/product/fastup-creatine-monohydrate/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Creatine', 'Fast&Up – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(60, 'Fast&Up', 'Fast&Up PreWorkout Advanced', 'https://nutrabay.com/product/fastup-preworkout/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'Preworkout', 'Fast&Up – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(61, 'Fast&Up', 'Fast&Up BCAA Intra Training', 'https://nutrabay.com/product/fastup-bcaa-ultra-granulation-technology-with-5000-mg-211-bcaa-blend/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'BCAA/EAA', 'Fast&Up – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(62, 'Fast&Up', 'Fast&Up Citrulline Malate – Citrulline Essentials', 'https://nutrabay.com/product/fastup-citrulline-malate-citrulline-essentials/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '100 Servings', 'L-Citrulline', 'Fast&Up – 100 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(63, 'Fast&Up', 'Fast&Up EAA Intra - Training Workout Drink', 'https://nutrabay.com/product/fastup-eaa-intra-training-workout-drink-with-bcaa-electrolyte-blend-vitamin-booster/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'BCAA/EAA', 'Fast&Up – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(64, 'Fast&Up', 'Fast&Up Plant Protein - Plant Based Vegan', 'https://nutrabay.com/product/fastup-plant-protein-plant-based-vegan/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3LB', 'Plant Protein', 'Fast&Up – 3LB', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(65, 'Fast&Up', 'Fast&Up Whey Concentrate - Grass Fed Whey with Added Digestive Enzyme', 'https://nutrabay.com/product/fastup-whey-concentrate-grass-fed-whey-with-added-digestive-enzyme/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1.9KG', 'Grass Fed Protein', 'Fast&Up – 1.9KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(66, 'Raw Nutrition', 'RAW Nutrition Protein', 'https://nutrabay.com/product/raw-nutrition-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'Raw Nutrition – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(67, 'Raw Nutrition', 'RAW Nutrition CBUM Itholate Protein', 'https://nutrabay.com/product/raw-nutrition-cbum-itholate-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'Raw Nutrition – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(68, 'QNT', 'QNT Prime Whey', 'https://nutrabay.com/product/qnt-prime-whey/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG, 4KG', 'Whey Protein', 'QNT – 1KG, 2KG, 4KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(69, 'QNT', 'QNT Metapure Zero Carb - Whey Protein Isolate', 'https://nutrabay.com/product/qnt-metapure-zero-carb-whey-protein-isolate/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'QNT – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(70, 'QNT', 'QNT Nitrapure Whey Protein Concentrate', 'https://nutrabay.com/product/qnt-nitrapure/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein', 'QNT – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(71, 'QNT', 'QNT Pump Extra Concentrated Liquid Pre Workout', 'https://nutrabay.com/product/qnt-pump-extra-concentrated-liquid-pre-workout/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings, 60 Servings', 'Preworkout', 'QNT – 30 Servings, 60 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(72, 'QNT', 'QNT ISO Ripped Isolate Protein', 'https://nutrabay.com/product/qnt-iso-ripped-isolate-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Isolate Protein', 'QNT – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(73, 'BPI', 'BPI Sports Liquid L-Carnitine', 'https://nutrabay.com/product/bpi-sports-liquid-l-carnitine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'L-Carnitine', 'BPI – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(74, 'BPI', 'BPI Sports Best Glutamine, 300 g (0.66 lb)', 'https://www.healthkart.com/sv/bpi-sports-best-glutamine/SP-95338?navKey=VRNT-178124&itracker=w:menuLanding|undefined||;p:12|;e:178124|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '300GMS', 'Glutamine', 'BPI – 300GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(75, 'BPI', 'BPI Sports CLA+Carnitine', 'https://nutrabay.com/product/bpi-sports-cla-carnitine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '50 Servings', 'CLA', 'BPI – 50 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(76, 'BPI', 'BPI Sports Micronized Creatine', 'https://nutrabay.com/product/bpi-micronized-creatine/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '83 Servings', 'Creatine', 'BPI – 83 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(77, 'Ronnie Coleman', 'Ronnie Coleman L-Carnitine Liquid Xs 3000mg', 'https://nutrabay.com/product/ronnie-coleman-signature-series-l-carnitine-liquid-3000mg/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '31 Servings', 'L-Carnitine', 'Ronnie Coleman – 31 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(78, 'Ronnie Coleman', 'Ronnie Coleman Pro Antium Protein', 'https://nutrabay.com/product/ronnie-coleman-pro-antium-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein', 'Ronnie Coleman – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(79, 'GNC', 'GNC Weight Gainer Powder', 'https://nutrabay.com/product/gnc-weight-gainer-powder/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG, 5KG', 'Weight Gainer', 'GNC – 3KG, 5KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(80, 'GNC', 'GNC Pro Performance Creatine Monohydrate', 'https://nutrabay.com/product/gnc-creatine-monohydrate-250g/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 900.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Creatine', 'GNC – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(81, 'GNC', 'GNC Pro Performance Whey Protein Powder', 'https://nutrabay.com/product/gnc-pp-100-whey-protein-powder/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2LBS, 5LBS, 4LBS', 'Whey Protein', 'GNC – 2LBS, 5LBS, 4LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(82, 'GNC', 'GNC AMP Pure Isolate - 25g Protein, 5g BCAA, Low Carb', 'https://nutrabay.com/product/gnc-amp-pure-isolate-powder/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'GNC – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(83, 'GNC', 'GNC Triple Strength Fish Oil Softgels', 'https://nutrabay.com/product/gnc-triple-strength-fish-oil-softgels/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60 Softgels, 120 Softgels', 'Fish Oil', 'GNC – 60 Softgels, 120 Softgels', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(84, 'GNC', 'GNC Whey Protein Amp Gold Advanced', 'https://nutrabay.com/product/gnc-100-whey-protein-amp-gold-adv/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG, 4LBS', 'Whey Protein Isolate', 'GNC – 2KG, 4LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(85, 'GNC', 'GNC Amp Mass XXX Powder', 'https://nutrabay.com/product/gnc-amp-mass-xxx-powder/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '3KG', 'Mass Gainer', 'GNC – 3KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(86, 'GNC', 'GNC L-Arginine 1000mg', 'https://nutrabay.com/product/gnc-l-arginine-1000mg-90-caps/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '90N', 'L-Arginine', 'GNC – 90N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(87, 'GNC', 'GNC Herbal Plus Triple Ginseng Root', 'https://nutrabay.com/product/gnc-triple-ginseng-cap/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '90N', 'Strength', 'GNC – 90N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(88, 'GNC', 'GNC Pro L-Glutamine Powder', 'https://nutrabay.com/product/gnc-l-glutamine-powder/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Glutamine', 'GNC – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(89, 'GNC', 'GNC Mega Men One Daily', 'https://nutrabay.com/product/gnc-mega-men-one-daily-caplets/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60N', 'Multivitamin', 'GNC – 60N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(90, 'GNC', 'GNC Pro Performance L-Carnitine 500mg', 'https://nutrabay.com/product/gnc-l-carnitine-500mg-60-tablets/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60 tabs', 'L-Carnitine', 'GNC – 60 tabs', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(91, 'GNC', 'GNC Calcium Plus 1000mg with Magnesium and Vitamin D3 Cap', 'https://nutrabay.com/product/gnc-calcium-plus-1000-with-magnesium-and-vitamin-d3-cap/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60N', 'Immunity', 'GNC – 60N', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(92, 'GNC', 'GNC Pro Performance Pre Workout', 'https://nutrabay.com/product/gnc-pro-performance-pre-workout/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'Preworkout', 'GNC – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(93, 'GNC', 'GNC AMP Gold Series BCAA Advanced, 30 Servings, 400 g (0.88 lb), Kiwi Strawberry', 'https://www.healthkart.com/sv/gnc-amp-gold-series-bcaa-advanced/SP-58571?navKey=VRNT-134319&itracker=w:menuLanding|undefined||;p:8|;e:134319|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Servings', 'BCAA/EAA', 'GNC – 30 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(94, 'One Science', 'One Science Nutrition ISO Gold Whey Protein', 'https://nutrabay.com/product/one-science-nutrition-100-iso-gold-whey-protein-isolate/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein Isolate', 'One Science – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(95, 'One Science', 'One Science Nutrition Nitra Whey + Free Daily Multivitamins 60 Caps', 'https://nutrabay.com/product/one-science-nitra-whey/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein Isolate', 'One Science – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(96, 'Avvatar', 'Avvatar Muscle Gainer', 'https://nutrabay.com/product/avvatar-advanced-muscle-gainer/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Mass Gainer', 'Avvatar – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(97, 'Avvatar', 'Avvatar Isorich', 'https://nutrabay.com/product/avvatar-absolute-isorich/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG, 4KG', 'Whey Isolate', 'Avvatar – 1KG, 2KG, 4KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(98, 'Ultimate Nutrition', 'Ultimate Nutrition ISO Sensation 93', 'https://nutrabay.com/product/ultimate-nutrition-iso-sensation-93/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein Isolate', 'Ultimate Nutrition – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(99, 'Dymatize', 'Dymatize Elite Whey Protein', 'https://nutrabay.com/product/dymatize-elite-100-whey-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein', 'Dymatize – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(100, 'Dymatize', 'Dymatize ISO 100 Hydrolyzed - Whey Protein Isolate', 'https://nutrabay.com/product/dymatize-iso-100-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein Hydrolised', 'Dymatize – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(101, 'Mutant', 'Mutant Muscle Mass Gainer', 'https://nutrabay.com/product/mutant-muscle-mass-gainer/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Mass Gainer', 'Mutant – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(102, 'Myfitness', 'Myfitness by brnd.me Chocolate Peanut Butter, 1.2 kg, Smooth', 'https://www.healthkart.com/sv/myfitness-chocolate-peanut-butter/SP-88031?navKey=VRNT-164677&itracker=w:brandCatalog|undefined||;p:1|;e:164677|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1.25KG', 'Peanut Butter', 'Myfitness – 1.25KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(103, 'Myfitness', 'Myfitness by brnd.me Chocolate Peanut Butter, 510 g, Smooth', 'https://www.healthkart.com/sv/myfitness-chocolate-peanut-butter/SP-88031?navKey=VRNT-165493&itracker=w:brandCatalog|undefined||;p:4|;e:165493|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '510GM', 'Peanut Butter', 'Myfitness – 510GM', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(104, 'Myfitness', 'Myfitness by brnd.me Dark Chocolate Peanut Butter, 1 kg, Smooth', 'https://www.healthkart.com/sv/myfitness-dark-chocolate-peanut-butter/SP-107102?navKey=VRNT-200226&itracker=w:brandCatalog|undefined||;p:7|;e:200226|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG', 'Peanut Butter', 'Myfitness – 1KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(105, 'Myfitness', 'Myfitness by brnd.me Chocolate Peanut Butter, 1.2 kg, Crispy', 'https://www.healthkart.com/sv/myfitness-chocolate-peanut-butter/SP-88031?navKey=VRNT-165503&itracker=w:brandCatalog|undefined||;p:3|;e:165503|;', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1.25KG', 'Peanut Butter', 'Myfitness – 1.25KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(106, 'Genetic Nutrition', 'Genetic Nutrition Bio Whey', 'https://nutrabay.com/product/genetic-nutrition-bio-whey/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG, 2KG', 'Whey Protein', 'Genetic Nutrition – 1KG, 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(107, 'Genetic Nutrition', 'Genetic Nutrition Pro-Isolate', 'https://nutrabay.com/product/genetic-nutrition-pro-isolate/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Isolate Protein', 'Genetic Nutrition – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(108, 'Rule1', 'Rule1 Whey Blend', 'https://nutrabay.com/product/rule-1-whey-blend/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '5LBS', 'Whey Protein', 'Rule1 – 5LBS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(109, 'Asitis', 'AS-IT-IS Whey Protein Concentrate 80%', 'https://nutrabay.com/product/asitis-whey-protein-concentrate-80/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '1KG', 'Whey Protein', 'Asitis – 1KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(110, 'PHD', 'PhD Nutrition 100% Whey Protein Grass Fed', 'https://nutrabay.com/product/phd-nutrition-100-whey-protein-grass-fed/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Grass Fed Protein', 'PHD – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(111, 'PHD', 'PhD Nutrition Whey Isolate Protein', 'https://nutrabay.com/product/phd-nutrition-whey-isolate-protein/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '2KG', 'Whey Protein Isolate', 'PHD – 2KG', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(112, 'Wellbeing Nutrition', 'Wellbeing Nutrition Organic Apple Cider Vinegar with 2X the \'Mother\'', 'https://nutrabay.com/product/wellbeing-nutrition-organic-apple-cider-vinegar/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '500ML', 'Apple Cider Vinegar', 'Wellbeing Nutrition – 500ML', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(113, 'Wellbeing Nutrition', 'Wellbeing Nutrition Pure Korean Marine Collagen Peptides', 'https://nutrabay.com/product/wellbeing-nutrition-pure-korean-marine-collagen-peptides-hydrolyzed-type-1-3-collagen-protein-and-amino-acids/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '25 Servings', 'Speciality Supplements', 'Wellbeing Nutrition – 25 Servings', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(114, 'Wellbeing Nutrition', 'Wellbeing Nutrition Melts Restful Sleep, Melatonin 10mg', 'https://nutrabay.com/product/wellbeing-nutrition-melts-restful-sleep-plant-based-melatonin-5mg/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Strips', 'Speciality Supplements', 'Wellbeing Nutrition – 30 Strips', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(115, 'Wellbeing Nutrition', 'Wellbeing Nutrition Melts Testo Power Testofen+Himalayan Shilajit', 'https://nutrabay.com/product/wellbeing-nutrition-melts-testo-power-testofen-korean-ginseng-zinc-ginkgo-biloba/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Strips', 'Testo Booster', 'Wellbeing Nutrition – 30 Strips', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(116, 'Wellbeing Nutrition', 'Wellbeing Nutrition Pure Marine Beauty Collagen Peptides', 'https://nutrabay.com/product/wellbeing-nutrition-beauty-korean-marine-collagen-peptides-with-hyaluronic-acid-rosehip-astaxanthin-biotin-vitamins-c-e/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '250GMS', 'Speciality Supplements', 'Wellbeing Nutrition – 250GMS', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(117, 'Wellbeing Nutrition', 'Wellbeing Nutrition Slow Bone & Joint Support', 'https://nutrabay.com/product/wellbeing-nutrition-slow-bone-joint-support/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '60 Caps', 'Speciality Supplements', 'Wellbeing Nutrition – 60 Caps', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(118, 'Wellbeing Nutrition', 'Wellbeing Nutrition Melts Instant Throat Relief with 100% Natural Tulsi, Manuka Honey, Clove, Licorice,Curcumin, Ginger, Mint', 'https://nutrabay.com/product/wellbeing-nutrition-melts-instant-throat-relief-with-100-natural-tulsi-manuka-honey-clove-licoricecurcumin-ginger-mint/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '30 Strips', 'Speciality Supplements', 'Wellbeing Nutrition – 30 Strips', '2026-06-16 04:28:40', '2026-06-16 04:28:40'),
(119, 'Big Muscle Nutrition', 'Bigmuscles Nutrition Freak Pre-workout', 'https://nutrabay.com/product/bigmuscles-nutrition-freak/', 'https://cdn.nutrabay.com/wp-content/uploads/2022/01/NB-MUT-1015-32-01x.jpg', 533.0, 520.0, 20.0, 3, 'In Stock', '180GM', 'Preworkout', 'Big Muscle Nutrition – 180GM', '2026-06-16 04:28:40', '2026-06-16 04:28:40');

-- --------------------------------------------------------

--
-- Table structure for table `sqlite_sequence`
--

CREATE TABLE `sqlite_sequence` (
  `name` varchar(13) DEFAULT NULL,
  `seq` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `sqlite_sequence`
--

INSERT INTO `sqlite_sequence` (`name`, `seq`) VALUES
('users', 6),
('cart_items', 8),
('cart_activity', 6),
('orders', 1),
('order_items', 2),
('products', 119),
('categories', 138),
('brands', 169);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`, `phone`, `address`, `city`, `country`, `password`) VALUES
(1, 'John Doe', 'john@example.com', '$2a$10$JjuTURZeAZqax5kBb8qn2Olp.zhV0lG3qByEeVZaEABti3RseoN5y', '2026-06-11 10:34:01', '9876543210', 'SCF 13 Sector 64', 'Mohali', 'India', ''),
(2, 'aaa', 'aaa@gmail.com', '$2a$10$Tjs0fegOLKZnUwAyvYf.ZOzWaM4FjvI2WBvoQn0Z8d9ulnm2fqshK', '2026-06-11 10:44:12', '123456789', 'aaa', 'mohali', 'india', ''),
(3, 'gg', 'gg@gmail.com', '$2a$10$964qVAid08JrdC6C5lT/jOHMY/6a77ZEwa9MY6sPF6v9WFJQOju/O', '0000-00-00 00:00:00', '12', 'gg', 'gg', 'gg', '12gg12'),
(4, 'ss', 'ss@gmail.com', '$2a$10$hP7GIiyFpKDc/QycrRbJXuDKO87nVEhn9NCJdRDiYGvi9JCDxVOCe', '0000-00-00 00:00:00', '121', 'ss', 'ss', 'ss', '12ss12'),
(5, 'kk', 'kk@gmail.com', '$2a$10$YqTmmoSiJvvJK95TGxImW.l/iM.ODevjLrsF3iCLAGGBfRhb6vcia', '2026-06-17 09:21:45', '1212', 'kk', 'ds', 'sdf', '12kk12'),
(15, 'tt', 'tt@gmail.com', '$2a$10$3Vhz0x.VIquFa4rMtFq29edKXRfBM9GfFU92NoBy4HG/BBIdALuB2', '0000-00-00 00:00:00', '34', 'sdf', 'sd', 'ds', '12tt12'),
(16, 'er', 'agar@gmail.com', '$2a$10$ikB.GqTUvPa0r45ktk67/uPzvLwr0J0lhNxgXYgmxDqS1qHiWZ55G', '2026-06-17 11:46:56', 'erger', 'grg', 'srgr', 'rgae', '121212');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_activity`
--
ALTER TABLE `cart_activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `cart_activity`
--
ALTER TABLE `cart_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
