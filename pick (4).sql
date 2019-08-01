-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2019 at 02:50 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pick`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `email` varchar(300) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(1000) DEFAULT NULL,
  `message` longtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`ID`, `user_id`, `name`, `email`, `country_id`, `phone`, `subject`, `message`, `created_at`) VALUES
(3, 1, 'Shubham', 'shubham@mailinator.com', 1, '9782970790', 'Sub', 'Message', '2019-01-23 18:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `countrycode` varchar(6) DEFAULT NULL,
  `currency_id` int(11) DEFAULT NULL,
  `flag__doc` int(11) DEFAULT NULL,
  `phonecode` varchar(6) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`ID`, `name`, `countrycode`, `currency_id`, `flag__doc`, `phonecode`, `status`) VALUES
(1, 'India', 'IND', 1, 1, '+91', 'active'),
(2, 'United state america', 'USA', 2, 2, '+1', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `cuisines`
--

CREATE TABLE `cuisines` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `type` enum('veg','nonveg','vegan') NOT NULL,
  `image__doc` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_active` enum('yes','no') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cuisine_categories`
--

CREATE TABLE `cuisine_categories` (
  `ID` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `is_active` enum('yes','no') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cuisine_categories`
--

INSERT INTO `cuisine_categories` (`ID`, `name`, `is_active`) VALUES
(1, 'Namkeen', 'yes'),
(2, 'Snacks and Chat', 'yes'),
(3, 'Snacks and Chat', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `cuisine_prices`
--

CREATE TABLE `cuisine_prices` (
  `cuisine_priceid` int(11) NOT NULL,
  `cuisine_id` int(11) NOT NULL,
  `type` enum('quarter','half','full','numeric','250_ml','500_ml','1_ltr','100_grm','250_grm','500_grm','1_kg') NOT NULL,
  `amount` float(9,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `currency_code` varchar(6) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`ID`, `name`, `currency_code`, `status`) VALUES
(1, 'Indian rupees', 'INR', 'active'),
(2, 'US dollor', 'USD', 'active'),
(3, 'Canadian dollor', 'CAD', 'active'),
(4, 'Australian dollor', 'AUD', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `filepath` varchar(300) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `size` float(10,2) DEFAULT NULL COMMENT 'file size in kibs',
  `is_verified` enum('yes','no') DEFAULT 'no',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`ID`, `user_id`, `name`, `filepath`, `type`, `size`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 1, 'Indian flag', 'india-flag.png', 'image/png', 1200.00, 'yes', '2018-10-12 11:30:00', '0000-00-00 00:00:00'),
(2, 1, 'Us flag', 'usa-flag.png', 'image/png', 1200.00, 'yes', '2018-10-12 11:30:00', '0000-00-00 00:00:00'),
(3, 1, 'Profile pic', 'profile-pic.png', 'image/png', 2334.00, 'yes', '2018-10-12 11:30:00', '0000-00-00 00:00:00'),
(194, NULL, NULL, '15517152011013c2u21ewjsuj5zym.jpeg', 'profile_pic', NULL, 'no', '2019-03-04 21:30:01', '2019-03-04 21:30:01'),
(195, NULL, NULL, '15517153318833c2u21528jsuj8svg.jpeg', 'profile_pic', NULL, 'no', '2019-03-04 21:32:12', '2019-03-04 21:32:12'),
(196, NULL, NULL, '15517153994673c2u2122sjsuja90s.jpeg', 'profile_pic', NULL, 'no', '2019-03-04 21:33:19', '2019-03-04 21:33:19');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `image__doc` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `firebase`
--

CREATE TABLE `firebase` (
  `firebase_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `provider` enum('facebook.com','google.com','phone','password') DEFAULT NULL,
  `uid` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `firebase`
--

INSERT INTO `firebase` (`firebase_id`, `user_id`, `provider`, `uid`, `created_at`, `updated_at`) VALUES
(49, 47, 'phone', 'etN69gLB2pO4jqhYcZDXOoFjsMa2', '2019-03-17 16:21:23', '2019-03-17 16:21:23');

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `coordinates` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `name`, `coordinates`) VALUES
(1, 'Eiffel Tower', '\0\0\0\0\0\0\0x\r˙“€mH@ô”e1±Y@'),
(2, 'Pere Lachaise', '\0\0\0\0\0\0\00Ieä9nH@LäèO(@'),
(3, 'Brooklyn', '\0\0\0\0\0\0\0Œ≈ﬂˆ[D@á4*p≤|R¿');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `ID` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `meta_key` varchar(50) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`ID`, `name`, `meta_key`, `meta_value`) VALUES
(1, 'Contact Email', 'contact_email', 'info@domain.com'),
(2, 'Contact phone', 'contact_phone', '+919782000000'),
(3, 'Contact address', 'contact_address', 'A 68,69 Swej farm, sodala jaipur 302019');

-- --------------------------------------------------------

--
-- Table structure for table `sockets`
--

CREATE TABLE `sockets` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `socket_id` varchar(400) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `referrer` int(11) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `email` varchar(300) DEFAULT NULL,
  `email_verified` enum('yes','no') DEFAULT 'no',
  `password` varchar(100) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `address` text,
  `profile_pic__doc` int(11) DEFAULT NULL,
  `referral` varchar(20) DEFAULT NULL,
  `type` enum('admin','customer','driver','vendor') DEFAULT NULL,
  `rating` float(2,1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('inactive','active','discard') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `referrer`, `firstname`, `lastname`, `email`, `email_verified`, `password`, `country_id`, `phone`, `city`, `address`, `profile_pic__doc`, `referral`, `type`, `rating`, `created_at`, `updated_at`, `status`) VALUES
(1, 0, 'John', 'Doe', 'john@mailinator.com', 'yes', '8cb2237d0679ca88db6464eac60da96345513964', 2, '+919782000000', 'London', 'B-6, valey Rd, London', 1, 'RCADMIN', 'admin', 7.9, '2019-02-26 16:39:04', '2019-02-26 16:39:04', 'active'),
(47, NULL, 'soni', 'soni', NULL, 'no', 'f91e15dbec69fc40f81f0876e7009648', NULL, NULL, NULL, NULL, NULL, 'Za6Tj4OqA', 'vendor', NULL, '2019-03-17 16:42:44', '2019-03-17 16:42:44', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('android','iOS','web') DEFAULT NULL,
  `token` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `vendor_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(400) DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `opening` time DEFAULT '10:00:00',
  `closing` time DEFAULT '21:00:00',
  `address` text,
  `latitude` float(12,8) DEFAULT NULL,
  `longitude` float(12,8) DEFAULT NULL,
  `is_closed` enum('yes','no') DEFAULT NULL,
  `is_verified` enum('yes','no') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`vendor_id`, `user_id`, `name`, `gstin`, `opening`, `closing`, `address`, `latitude`, `longitude`, `is_closed`, `is_verified`) VALUES
(26, 47, NULL, NULL, '10:00:00', '21:00:00', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `balance` float(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`ID`, `user_id`, `balance`, `created_at`, `updated_at`) VALUES
(1, 1, 2810.00, '2019-02-10 19:24:45', '2018-10-12 11:30:00'),
(81, 47, 0.00, '2019-03-17 21:51:23', '2019-03-17 21:51:23');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `wallet_txid` int(11) NOT NULL,
  `wallet_id` int(11) DEFAULT NULL,
  `amount` float(9,2) NOT NULL DEFAULT '0.00',
  `type` enum('credit','debit') DEFAULT NULL,
  `meta` text,
  `status` enum('pending','verified','dispute') DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`wallet_txid`, `wallet_id`, `amount`, `type`, `meta`, `status`, `description`, `created_at`) VALUES
(1, 1, 2000.00, 'credit', '', 'pending', '', '2018-10-12 11:30:00'),
(2, 1, 10.00, 'credit', '', 'pending', 'Referral amount..', '2019-02-11 23:06:28'),
(4, 1, 20.00, 'debit', '', 'pending', 'Referral amount..', '2019-02-11 23:06:28'),
(5, 1, 10.00, 'credit', '', 'pending', 'Referral amount..', '2019-02-11 23:08:07'),
(7, 1, 20.00, 'debit', '', 'pending', 'Referral amount..', '2019-02-11 23:08:07'),
(10, 1, 20.00, 'debit', '', 'pending', 'Referral amount..', '2019-02-11 23:08:44'),
(13, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:10:24'),
(16, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:15:11'),
(34, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:18:42'),
(40, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:22:57'),
(43, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:29:41'),
(52, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-11 23:33:15'),
(73, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 08:40:02'),
(75, 1, 10.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 08:47:59'),
(77, 1, 10.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 08:49:39'),
(79, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 08:50:12'),
(81, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 08:53:28'),
(83, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 09:14:24'),
(85, 1, 20.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 09:14:50'),
(88, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 09:15:13'),
(91, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 22:55:24'),
(94, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 22:56:11'),
(97, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-12 23:00:22'),
(100, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-13 00:07:41'),
(101, 1, 2000.00, 'credit', '', 'pending', '', '2018-10-12 11:30:00'),
(102, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:16:44'),
(104, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:16:44'),
(105, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:17:20'),
(107, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:17:20'),
(108, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:19:21'),
(110, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:19:21'),
(111, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:19:37'),
(113, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:19:37'),
(114, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:20:16'),
(116, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:20:16'),
(117, 1, 10.00, 'credit', '', 'pending', 'referrer amount', '2019-02-26 23:23:13'),
(119, 1, 30.00, 'debit', '', 'pending', 'Referral amount', '2019-02-26 23:23:13'),
(120, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 21:27:49'),
(122, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 21:27:49'),
(123, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 21:29:56'),
(125, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 21:29:56'),
(126, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 21:32:09'),
(128, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 21:32:09'),
(129, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 21:33:14'),
(131, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 21:33:14'),
(132, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 21:34:07'),
(134, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 21:34:07'),
(204, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 22:46:25'),
(206, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 22:46:25'),
(219, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 22:48:32'),
(221, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 22:48:32'),
(222, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 22:49:03'),
(224, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 22:49:03'),
(225, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-04 22:49:46'),
(227, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-04 22:49:46'),
(246, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:02:34'),
(248, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:02:34'),
(261, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:05:37'),
(263, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:05:37'),
(276, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:09:44'),
(278, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:09:44'),
(279, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:10:54'),
(281, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:10:54'),
(291, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:12:40'),
(293, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:12:40'),
(294, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:12:58'),
(296, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:12:58'),
(297, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:13:21'),
(299, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:13:21'),
(300, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:13:56'),
(302, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:13:56'),
(303, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:14:47'),
(305, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:14:47'),
(333, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 08:30:46'),
(335, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 08:30:46'),
(336, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 09:17:27'),
(338, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 09:17:27'),
(354, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 09:24:06'),
(356, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 09:24:06'),
(357, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 09:24:28'),
(359, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 09:24:28'),
(360, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 20:33:44'),
(362, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 20:33:44'),
(363, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 20:35:47'),
(365, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 20:35:47'),
(366, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 20:36:40'),
(368, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 20:36:40'),
(369, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 20:37:05'),
(371, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 20:37:05'),
(372, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 20:38:17'),
(374, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 20:38:17'),
(375, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 21:47:25'),
(377, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 21:47:25'),
(378, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 21:48:35'),
(380, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 21:48:35'),
(381, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-05 22:00:28'),
(383, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-05 22:00:28'),
(384, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-06 22:55:43'),
(386, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-06 22:55:43'),
(387, 1, 10.00, 'credit', NULL, NULL, 'referrer amount', '2019-03-06 22:56:17'),
(389, 1, 30.00, 'debit', NULL, NULL, 'Referral amount', '2019-03-06 22:56:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `currency_code` (`currency_id`),
  ADD KEY `flag__doc` (`flag__doc`);

--
-- Indexes for table `cuisines`
--
ALTER TABLE `cuisines`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `cuisines_ibfk_1` (`category_id`),
  ADD KEY `cuisines_ibfk_2` (`user_id`);

--
-- Indexes for table `cuisine_categories`
--
ALTER TABLE `cuisine_categories`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `cuisine_prices`
--
ALTER TABLE `cuisine_prices`
  ADD PRIMARY KEY (`cuisine_priceid`),
  ADD KEY `cuisine_prices_ibfk_1` (`cuisine_id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD KEY `user_id` (`name`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `firebase`
--
ALTER TABLE `firebase`
  ADD PRIMARY KEY (`firebase_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`provider`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `sockets`
--
ALTER TABLE `sockets`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `referred_by` (`referrer`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `user_id` (`user_id`,`type`,`token`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`vendor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`wallet_txid`),
  ADD KEY `wallet_id` (`wallet_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cuisines`
--
ALTER TABLE `cuisines`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cuisine_categories`
--
ALTER TABLE `cuisine_categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cuisine_prices`
--
ALTER TABLE `cuisine_prices`
  MODIFY `cuisine_priceid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `firebase`
--
ALTER TABLE `firebase`
  MODIFY `firebase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sockets`
--
ALTER TABLE `sockets`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `wallet_txid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=390;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `countries`
--
ALTER TABLE `countries`
  ADD CONSTRAINT `currency_code` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`ID`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `flag__doc` FOREIGN KEY (`flag__doc`) REFERENCES `documents` (`ID`);

--
-- Constraints for table `cuisines`
--
ALTER TABLE `cuisines`
  ADD CONSTRAINT `cuisines_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `cuisine_categories` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `cuisines_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `cuisine_prices`
--
ALTER TABLE `cuisine_prices`
  ADD CONSTRAINT `cuisine_prices_ibfk_1` FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `firebase`
--
ALTER TABLE `firebase`
  ADD CONSTRAINT `firebase_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `sockets`
--
ALTER TABLE `sockets`
  ADD CONSTRAINT `sockets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `country_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`ID`) ON UPDATE NO ACTION;

--
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `vendors`
--
ALTER TABLE `vendors`
  ADD CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
