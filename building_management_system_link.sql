-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2025 at 04:17 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `building_management_system_link`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `image_url` text DEFAULT NULL,
  `status` enum('READ','RECEIVED','SENT') NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `content`, `image_url`, `status`, `room_id`, `user_id`) VALUES
(1, '2025-01-27 02:43:21.000000', 'user@gmail.com', '2025-01-27 02:43:53.000000', 'admin@gmail.com', 'halo', '', 'READ', 1, 2),
(2, '2025-01-27 02:44:12.000000', 'admin@gmail.com', '2025-01-27 02:44:25.000000', 'user@gmail.com', 'xin chào', '', 'READ', 1, 1),
(3, '2025-01-27 02:44:44.000000', 'user@gmail.com', '2025-01-27 02:45:03.000000', 'admin@gmail.com', 'tôi muốn hỏi về hợp dồng', '', 'READ', 1, 2),
(4, '2025-01-27 02:45:24.000000', 'admin@gmail.com', '2025-01-27 02:45:24.000000', NULL, 'dạ anh muốn hỏi về vấn đề gì ạ', '', 'RECEIVED', 1, 1),
(5, '2025-01-28 00:56:43.000000', 'admin@gmail.com', '2025-01-28 00:56:43.000000', NULL, 'good morning', '', 'RECEIVED', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_private` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `description`, `is_private`, `name`) VALUES
(1, '2025-01-27 02:43:13.000000', 'user@gmail.com', '2025-01-27 02:43:13.000000', NULL, 'I\'m User & I\'m Admin', b'1', 'I\'m User & I\'m Admin');

-- --------------------------------------------------------

--
-- Table structure for table `chat_room_users`
--

CREATE TABLE `chat_room_users` (
  `id` bigint(20) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_room_users`
--

INSERT INTO `chat_room_users` (`id`, `joined_at`, `room_id`, `user_id`) VALUES
(1, '2025-01-27 02:43:13.000000', 1, 2),
(2, '2025-01-27 02:43:13.000000', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `check_result`
--

CREATE TABLE `check_result` (
  `id` bigint(20) NOT NULL,
  `checked_at` datetime(6) NOT NULL,
  `note` text DEFAULT NULL,
  `result` enum('CẦN_SỬA_CHỮA','KHÔNG_ĐẠT','ĐẠT') NOT NULL,
  `technichan_name` varchar(255) DEFAULT NULL,
  `check_item_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `check_result`
--

INSERT INTO `check_result` (`id`, `checked_at`, `note`, `result`, `technichan_name`, `check_item_id`) VALUES
(1, '2025-02-20 03:30:00.000000', 'Không có lỗi phát hiện', 'ĐẠT', 'Nguyễn Văn B', 1);

-- --------------------------------------------------------

--
-- Table structure for table `common_area`
--

CREATE TABLE `common_area` (
  `common_area_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `area` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `location_id` int(11) NOT NULL,
  `endx` double NOT NULL,
  `endy` double NOT NULL,
  `startx` double NOT NULL,
  `starty` double NOT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `common_area`
--

INSERT INTO `common_area` (`common_area_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `area`, `name`, `location_id`, `endx`, `endy`, `startx`, `starty`, `color`) VALUES
(3, '2025-02-13 07:51:46.000000', 'anonymousUser', '2025-02-13 07:51:46.000000', NULL, 50, 'sanh và hành  lang', 14, 16, 41, 14, 16, NULL),
(4, '2025-02-13 07:54:40.000000', 'anonymousUser', '2025-02-13 07:54:40.000000', NULL, 144, 'sanh và hành  lang', 14, 30, 25, 14, 16, NULL),
(5, '2025-02-14 02:26:21.000000', 'anonymousUser', '2025-02-14 02:26:21.000000', NULL, 15, 'nhà vệ sinh nũ', 14, 30, 22, 25, 20, 'pink'),
(6, '2025-02-14 02:58:36.000000', 'anonymousUser', '2025-02-14 02:58:36.000000', NULL, 15, 'nhà vệ sinh nam', 14, 30, 25, 25, 22, 'green'),
(7, '2025-02-14 03:05:09.000000', 'anonymousUser', '2025-02-14 03:05:09.000000', NULL, 10, 'phòng kỹ thuật', 14, 24, 25, 22, 20, 'purple'),
(8, '2025-02-14 03:10:15.000000', 'anonymousUser', '2025-02-14 03:10:15.000000', NULL, 4, 'thang máy 3', 14, 22, 22, 20, 20, 'beige'),
(9, '2025-02-14 03:12:31.000000', 'anonymousUser', '2025-02-14 03:12:31.000000', NULL, 4, 'thang máy 2', 14, 20, 22, 18, 20, 'brown'),
(10, '2025-02-14 03:17:46.000000', 'anonymousUser', '2025-02-14 03:17:46.000000', NULL, 4, 'thang máy 1', 14, 18, 22, 16, 20, 'brown'),
(11, '2025-02-14 03:22:38.000000', 'anonymousUser', '2025-02-14 03:22:38.000000', NULL, 27, 'thang bộ', 14, 22, 25, 16, 22, 'brown'),
(12, '2025-02-14 08:07:25.000000', 'anonymousUser', '2025-02-14 08:07:25.000000', NULL, 25, 'Kho vật tư', 15, 4, 41, 0, 38, 'brown'),
(13, '2025-02-14 08:10:15.000000', 'anonymousUser', '2025-02-14 08:10:15.000000', NULL, 15, 'Phòng điện tủ nguồn ', 15, 7, 41, 4, 38, 'brown'),
(14, '2025-02-14 08:10:51.000000', 'anonymousUser', '2025-02-14 08:10:51.000000', NULL, 20, 'Phòng Kỹ thuật ', 15, 11, 41, 7, 38, 'brown'),
(15, '2025-02-14 08:12:34.000000', 'anonymousUser', '2025-02-14 08:12:34.000000', NULL, 25, 'Phòng chiler', 15, 30, 41, 14, 38, 'brown'),
(16, '2025-02-14 08:25:26.000000', 'anonymousUser', '2025-02-14 08:25:26.000000', NULL, 20, 'Phòng Bơm NƯớc Sinh Hoạt', 15, 44, 5, 37, 0, 'brown'),
(17, '2025-02-14 08:26:37.000000', 'anonymousUser', '2025-02-14 08:26:37.000000', NULL, 20, 'Phòng bơm Xử lý nước thải', 15, 4, 5, 0, 0, 'brown'),
(18, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 50, 'Sảnh và hành lang', 16, 16, 41, 14, 16, NULL),
(19, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 144, 'Sảnh và hanh lang', 16, 30, 25, 14, 16, NULL),
(20, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 15, 'Nhà vệ sinh nữ', 16, 30, 22, 25, 20, 'pink'),
(21, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 15, 'Nhà vệ sinh nam', 16, 30, 25, 25, 22, 'green'),
(22, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 10, 'Phòng kỹ thuật', 16, 24, 25, 22, 20, 'purple'),
(23, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 4, 'Thang máy 3', 16, 22, 22, 20, 20, 'beige'),
(24, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 4, 'Thang máy 2', 16, 20, 22, 18, 20, 'beige'),
(25, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 4, 'Thang máy 1', 16, 18, 22, 16, 20, 'beige'),
(26, '2025-02-15 08:03:43.000000', 'anonymousUser', '2025-02-15 08:03:43.000000', NULL, 27, 'Thang bộ', 16, 22, 25, 16, 22, 'orange');

-- --------------------------------------------------------

--
-- Table structure for table `common_area_template`
--

CREATE TABLE `common_area_template` (
  `template_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `area` double NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `endx` double NOT NULL,
  `endy` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `startx` double NOT NULL,
  `starty` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `common_area_template`
--

INSERT INTO `common_area_template` (`template_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `area`, `color`, `endx`, `endy`, `name`, `startx`, `starty`) VALUES
(1, '2025-02-15 14:40:07.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 50, NULL, 16, 41, 'Sảnh và hành lang', 14, 16),
(2, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 144, NULL, 30, 25, 'Sảnh và hanh lang', 14, 16),
(3, '2025-02-15 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 15, 'pink', 30, 22, 'Nhà vệ sinh nữ', 25, 20),
(4, NULL, NULL, '2025-02-14 14:03:05.000000', NULL, 15, 'green', 30, 25, 'Nhà vệ sinh nam', 25, 22),
(5, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 10, 'purpel', 24, 25, 'Phòng kỹ thuật', 22, 20),
(6, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 4, 'beige', 22, 22, 'Thang máy 3', 20, 20),
(7, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 4, 'beige', 20, 22, 'Thang máy 2', 18, 20),
(8, NULL, NULL, '2025-02-14 14:03:05.000000', NULL, 4, 'beige', 18, 22, 'Thang máy 1', 16, 20),
(9, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 27, 'brow', 22, 25, 'Thang bộ', 16, 20);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contactid` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contract`
--

CREATE TABLE `contract` (
  `contract_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `lease_status` tinytext DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `customerid` int(11) DEFAULT NULL,
  `officeid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contract`
--

INSERT INTO `contract` (`contract_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `end_date`, `file_name`, `lease_status`, `start_date`, `total_amount`, `customerid`, `officeid`) VALUES
(1, '2025-01-27 02:30:23.000000', 'admin@gmail.com', '2025-01-27 02:30:23.000000', NULL, '2026-01-30', '1737945023095-mau-hop-dong-cho-thue-van-phong-moi-nhat_1108094846.pdf', 'Active', '2022-01-04', 768000.00, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `director_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` tinytext DEFAULT NULL,
  `customer_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `address`, `birthday`, `company_name`, `director_name`, `email`, `phone`, `status`, `customer_type_id`, `user_id`) VALUES
(1, '2025-01-27 02:29:36.000000', 'admin@gmail.com', '2025-01-27 02:29:36.000000', NULL, '1a/28 Trần Bình ', '1970-08-20', 'Công ty Thiên An', 'Nguyễn Thiên An', 'ThienAn@group.com', '+12345678', 'ACTIV', 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `customertype`
--

CREATE TABLE `customertype` (
  `customer_type_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `type_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customertype`
--

INSERT INTO `customertype` (`customer_type_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`, `type_name`) VALUES
(1, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, b'1', 'Customer Type 1'),
(2, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, b'1', 'Customer Type 2'),
(3, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, b'1', 'Customer Type 3'),
(4, '2025-01-27 02:27:36.000000', 'admin@gmail.com', '2025-01-27 02:27:36.000000', NULL, b'1', 'Khách hàng dài hạn');

-- --------------------------------------------------------

--
-- Table structure for table `customertypedocument`
--

CREATE TABLE `customertypedocument` (
  `customer_document_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `document_type` varchar(255) NOT NULL,
  `status` bit(1) NOT NULL,
  `customer_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customertypedocument`
--

INSERT INTO `customertypedocument` (`customer_document_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `document_type`, `status`, `customer_type_id`) VALUES
(4, '2025-01-27 08:04:30.000000', 'admin@gmail.com', '2025-01-27 08:04:30.000000', NULL, 'Giấy đăng ký kinh doanh (đối với doanh nghiệp).', b'1', 4),
(5, '2025-01-27 08:05:12.000000', 'admin@gmail.com', '2025-01-27 08:05:12.000000', NULL, 'Mã số thuế cá nhân hoặc doanh nghiệp.', b'1', 4),
(6, '2025-01-27 08:05:44.000000', 'admin@gmail.com', '2025-01-27 08:05:44.000000', NULL, 'Hợp đồng lao động hoặc giấy xác nhận thu nhập', b'0', 4),
(7, '2025-01-27 08:05:44.000000', 'admin@gmail.com', '2025-01-27 08:05:44.000000', NULL, 'Hợp đồng lao động hoặc giấy xác nhận thu nhập', b'1', 4);

-- --------------------------------------------------------

--
-- Table structure for table `customer_document`
--

CREATE TABLE `customer_document` (
  `customer_document_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `is_approved` bit(1) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_type_document_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_document`
--

INSERT INTO `customer_document` (`customer_document_id`, `file_path`, `is_approved`, `customer_id`, `customer_type_document_id`) VALUES
(5, '/uploads/docs/business_license.pdf', b'1', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `device_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `lifespan` int(11) DEFAULT NULL,
  `status` enum('ACTIVE','FAULTY','UNDER_MAINTENANCE') DEFAULT NULL,
  `device_type_id` bigint(20) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `maintenance_service_id` bigint(20) DEFAULT NULL,
  `system_id` bigint(20) DEFAULT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`device_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `device_name`, `installation_date`, `lifespan`, `status`, `device_type_id`, `location_id`, `maintenance_service_id`, `system_id`, `x`, `y`) VALUES
(1, '2025-01-27 08:39:07.000000', 'admin@gmail.com', '2025-01-27 08:39:07.000000', NULL, 'Đầu Báo Nhiệt', '2025-01-29', 2, 'ACTIVE', 1, 14, 2, 4, 2, 2),
(2, '2025-02-13 10:52:51.000000', NULL, NULL, NULL, 'đau báo khói 2', '2025-02-21', 4, 'ACTIVE', 1, 14, 2, 4, 2, 10),
(9, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 3', '2025-02-21', 4, 'ACTIVE', 1, 14, 2, 4, 2, 20),
(10, '2025-02-14 13:56:47.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 4', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 2, 32),
(11, '2025-02-14 14:01:27.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 5', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 2, 39),
(12, '2025-02-14 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 6', '2025-02-21', 4, 'ACTIVE', 1, 14, 2, 4, 12, 2),
(13, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Đầu báo khói 7', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 22, 2),
(14, '2025-02-14 14:07:55.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 8', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 32, 2),
(15, '2025-02-14 14:09:23.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đâu báo khói 9', '2025-02-14', NULL, NULL, 1, 14, 2, 4, 42, 2),
(16, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 10', '2025-02-14', 4, NULL, 1, 14, 2, 4, 12, 10),
(17, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 11', '2025-02-14', NULL, 'ACTIVE', 1, 14, 2, 4, 22, 10),
(18, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khoi 12', '2025-02-14', NULL, 'ACTIVE', 1, 14, 2, 4, 32, 10),
(19, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Đầu báo khói 13', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 40, 10),
(20, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đàu báo khói 14', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 10, 20),
(21, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 15', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 10, 26),
(22, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Dầu báo khói 16', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 2, 26),
(23, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Dầu báo khói 19', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 18, 23),
(24, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 20', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 27, 24),
(25, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đâì báo khói 21', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 26, 21),
(26, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 22', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 20, 30),
(27, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Đàu báo khoi 24', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 20, 37),
(28, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Dầu báo khói 23', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 25, 30),
(29, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'đầu bso khói 25', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 25, 37),
(30, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Dầu báo khói 26', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 10, 32),
(31, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Đàu báo khói 27', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 10, 37),
(32, '2025-02-14 14:01:27.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo khói 31', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 15, 35),
(33, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Đầu báo khói 28', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 15, 26),
(34, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Dầu báo khói 29', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 15, 18),
(35, NULL, NULL, '2025-02-14 14:03:05.000000', NULL, 'Dầu báo khói 30', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 20, 18),
(36, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Đầu báo 31', '2025-02-14', 4, 'ACTIVE', 1, 14, 2, 4, 25, 18),
(37, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước sinh hoạt 1', '2025-02-15', 4, 'ACTIVE', 2, 15, 1, 1, 43, 2),
(38, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước sinh hoạt 2', '2025-02-15', 4, 'ACTIVE', 2, 15, 1, 2, 42, 2),
(39, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm bù tăng ap 1', '2025-02-15', 4, 'ACTIVE', 1, 15, 2, 4, 41, 2),
(40, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Bơm tăng  ap 2', '2025-02-15', 4, 'ACTIVE', 2, 15, 2, 4, 40, 2),
(41, '2025-02-13 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm diesel', '2025-02-15', 6, 'ACTIVE', 2, 15, 2, 4, 39, 2),
(42, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Tủ diều khiển nước sinh hoạt', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 2, 43, 1),
(43, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Tủ điều khiển quạt thông gió', '2025-02-14', 6, 'ACTIVE', 3, 15, 2, 4, 39, 4),
(44, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Tủ điện điều khiển bơm cứu hỏa', '2025-02-14', 4, 'ACTIVE', 3, 15, 2, 4, 38, 4),
(45, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Tủ động lực 1', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 1, 6, 40),
(46, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'tủ doomh lưc 2', '2025-02-15', 4, 'ACTIVE', 3, 15, 1, 1, 6, 39),
(47, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Tủ điều khiển chiler', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 3, 29, 40),
(50, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước giải nhiệt 1', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 3, 28, 39),
(51, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Bơm nước giải nhiệt 2', '2025-02-15', 4, 'ACTIVE', 3, 15, 1, 3, 27, 39),
(52, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước giải nhiệt 3', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 3, 26, 39),
(53, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Bơm nước gải nhiệt 4', '2025-02-14', 4, 'ACTIVE', 3, 15, 1, 3, 25, 39),
(54, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước lạnh 1', '2025-02-15', 6, 'ACTIVE', 3, 15, 1, 3, 28, 40),
(55, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Bơm nước gải nhiệt 2', '2025-02-15', 4, 'ACTIVE', 3, 15, 1, 3, 27, 40),
(56, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Bơm nước giải nhiệt 3', '2025-02-15', 4, 'ACTIVE', 3, 15, 1, 3, 26, 40),
(57, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Bơm nước gải nhiệt 4', '2025-02-15', 4, 'ACTIVE', 1, 15, 1, 3, 25, 40),
(58, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Chiller 1', '2025-02-15', 10, 'ACTIVE', 4, 15, 1, 3, 23, 39),
(59, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Chille 2', '2025-02-15', 10, 'ACTIVE', 4, 15, 1, 3, 20, 39),
(60, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Chiller 3', '2025-02-15', 10, 'ACTIVE', 4, 15, 1, 3, 17, 39),
(61, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 1', '2025-02-14', 6, 'ACTIVE', 5, 14, 1, 3, 41, 2),
(62, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 2', '2025-02-14', 6, 'ACTIVE', 5, 14, 1, 3, 41, 17),
(63, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 3', '2025-02-15', 6, 'ACTIVE', 5, 14, 1, 3, 32, 17),
(64, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 4', NULL, NULL, 'ACTIVE', 5, 14, 1, 3, 32, 2),
(65, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu5', '2025-02-15', 6, 'ACTIVE', 5, 14, 1, 3, 27, 2),
(66, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 6', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 27, 14),
(67, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 7', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 27, 18),
(68, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 8', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 18, 2),
(69, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 9', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 18, 14),
(70, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 10', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 18, 18),
(71, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 11', '2025-02-14', 4, 'ACTIVE', 5, 14, 1, 3, 2, 14),
(72, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 12', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 2, 2),
(73, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 13', '2025-02-15', 6, 'ACTIVE', 5, 14, 1, 3, 10, 14),
(74, '2025-02-13 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 14', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 10, 2),
(75, '2025-02-13 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 15', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 5, 23),
(76, '2025-02-15 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 16', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 2, 30),
(77, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 17', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 2, 38),
(78, '2025-02-15 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 18', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 10, 30),
(79, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 19', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 10, 38),
(80, '2025-02-15 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Fcu 20', '2025-02-14', 4, 'ACTIVE', 5, 14, 1, 3, 18, 30),
(81, NULL, NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 21', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 18, 38),
(82, '2025-02-15 10:52:51.000000', NULL, '2025-02-15 13:56:47.000000', NULL, 'Fcu 22', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 27, 30),
(83, '2025-02-14 14:03:05.000000', NULL, '2025-02-14 14:03:05.000000', NULL, 'Fcu 23', '2025-02-15', 4, 'ACTIVE', 5, 14, 1, 3, 27, 38);

-- --------------------------------------------------------

--
-- Table structure for table `device_type`
--

CREATE TABLE `device_type` (
  `device_type_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device_type`
--

INSERT INTO `device_type` (`device_type_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `description`, `type_name`) VALUES
(1, '2025-01-27 08:27:22.000000', 'admin@gmail.com', '2025-01-27 08:27:22.000000', NULL, 'sensor trở kháng ', 'Sensor'),
(2, '2025-02-15 08:09:11.000000', 'admin@gmail.com\r\n', '2025-02-15 13:56:47.000000', NULL, ' bơm nước', 'Pumb'),
(3, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'tủ điện điều khiển ', 'electrical cabinet'),
(4, '2025-02-13 10:52:51.000000', NULL, '2025-02-14 13:56:47.000000', NULL, 'Cụm chiller', 'Chiller'),
(5, '2025-02-13 10:52:51.000000', 'luongth', '2025-02-14 13:56:47.000000', NULL, 'Fcu ', 'Fcu');

-- --------------------------------------------------------

--
-- Table structure for table `electricity_rate`
--

CREATE TABLE `electricity_rate` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `max_usage` int(11) DEFAULT NULL,
  `min_usage` int(11) NOT NULL,
  `rate` double NOT NULL,
  `tier_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `electricity_usage`
--

CREATE TABLE `electricity_usage` (
  `usageid` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `electricity_cost` decimal(15,2) NOT NULL,
  `electricity_rate` decimal(15,2) NOT NULL,
  `end_reading` decimal(15,2) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `reading_date` date NOT NULL,
  `start_reading` decimal(15,2) NOT NULL,
  `usage_amount` decimal(15,2) NOT NULL,
  `meter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `electricity_usage`
--

INSERT INTO `electricity_usage` (`usageid`, `created_at`, `created_by`, `updated_at`, `updated_by`, `comments`, `electricity_cost`, `electricity_rate`, `end_reading`, `image_name`, `reading_date`, `start_reading`, `usage_amount`, `meter_id`) VALUES
(1, '2025-01-28 05:17:33.000000', 'anonymousUser', '2025-01-28 05:17:33.000000', NULL, NULL, 0.00, 1.20, 7043.00, '1738041453211-5bdf4f1d-ccf2-4f5a-85c9-6c7e130c50568987647345966362344.jpg', '2024-12-28', 0.00, 7043.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `electricity_usage_verification`
--

CREATE TABLE `electricity_usage_verification` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `current_month_cost` decimal(38,2) DEFAULT NULL,
  `end_reading` decimal(38,2) NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `previous_month_cost` decimal(38,2) DEFAULT NULL,
  `previous_month_image_name` varchar(255) DEFAULT NULL,
  `reading_date` date NOT NULL,
  `start_reading` decimal(38,2) NOT NULL,
  `status` enum('ACTIV','UNACTIV') NOT NULL,
  `usage_amount_current_month` decimal(38,2) DEFAULT NULL,
  `usage_amount_previous_month` decimal(38,2) DEFAULT NULL,
  `meter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `electricity_usage_verification`
--

INSERT INTO `electricity_usage_verification` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `current_month_cost`, `end_reading`, `image_name`, `previous_month_cost`, `previous_month_image_name`, `reading_date`, `start_reading`, `status`, `usage_amount_current_month`, `usage_amount_previous_month`, `meter_id`) VALUES
(1, '2025-01-28 05:17:33.000000', 'anonymousUser', '2025-01-28 05:17:33.000000', NULL, 0.00, 7043.00, '1738041453211-5bdf4f1d-ccf2-4f5a-85c9-6c7e130c50568987647345966362344.jpg', 0.00, NULL, '2025-01-28', 0.00, 'UNACTIV', 7043.00, 0.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `grid_cell`
--

CREATE TABLE `grid_cell` (
  `grid_cell_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `area` decimal(15,2) NOT NULL,
  `is_usable` bit(1) NOT NULL,
  `unusable_area` decimal(15,2) DEFAULT NULL,
  `location_id` int(11) NOT NULL,
  `office_id` int(11) DEFAULT NULL,
  `grid_col` int(11) NOT NULL,
  `grid_row` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `handoverstatus`
--

CREATE TABLE `handoverstatus` (
  `handover_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `drawing_file` varchar(255) DEFAULT NULL,
  `equipment_file` varchar(255) DEFAULT NULL,
  `handover_date` date DEFAULT NULL,
  `status` tinytext DEFAULT NULL,
  `office_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `handoverstatus`
--

INSERT INTO `handoverstatus` (`handover_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `drawing_file`, `equipment_file`, `handover_date`, `status`, `office_id`) VALUES
(1, '2025-01-27 02:38:46.000000', 'admin@gmail.com', '2025-01-27 02:38:46.000000', NULL, '1737945526036-Completed-drawing-Madagui-office-Page-009.pdf', 'Thiết bị chiếu sáng và tủ nguồn', '2022-08-19', 'ACTIV', 1);

-- --------------------------------------------------------

--
-- Table structure for table `item_check`
--

CREATE TABLE `item_check` (
  `id` bigint(20) NOT NULL,
  `check_category` varchar(255) NOT NULL,
  `check_name` text NOT NULL,
  `frequency` enum('HÀNG_NGÀY','HÀNG_NĂM','HÀNG_QUÝ','HÀNG_THÁNG','HÀNG_TUẦN') DEFAULT NULL,
  `standard` varchar(255) DEFAULT NULL,
  `device_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_check`
--

INSERT INTO `item_check` (`id`, `check_category`, `check_name`, `frequency`, `standard`, `device_id`) VALUES
(1, 'Kiểm tra vi sử lý', 'Kiểm tra vi sử lý', 'HÀNG_THÁNG', 'Thông số chạy ổn dính', 1),
(2, 'Kiểm tra nguồn', 'Kiểm tra nguồn', 'HÀNG_TUẦN', 'Đảm bảo 5 v', 1);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `floor` varchar(255) DEFAULT NULL,
  `numbe_floor` int(11) DEFAULT NULL,
  `total_area` double NOT NULL,
  `common_area` double NOT NULL,
  `net_area` double NOT NULL,
  `endx` double NOT NULL,
  `endy` double NOT NULL,
  `startx` double NOT NULL,
  `starty` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `floor`, `numbe_floor`, `total_area`, `common_area`, `net_area`, `endx`, `endy`, `startx`, `starty`) VALUES
(1, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, 'Lầu 1', 1, 1000, 100, 900, 0, 0, 0, 0),
(14, '2025-02-13 07:44:52.000000', 'anonymousUser', '2025-02-14 03:22:38.000000', 'anonymousUser', 'Tầng 2', 2, 0, 663, 0, 44, 41, 0, 0),
(15, '2025-02-14 08:01:16.000000', 'anonymousUser', '2025-02-14 08:26:37.000000', 'anonymousUser', 'Tầng Hầm', 0, 0, 125, 0, 44, 41, 0, 0),
(16, '2025-02-15 08:03:42.000000', 'anonymousUser', '2025-02-15 08:03:42.000000', NULL, 'Tầng 3', 3, 1804, 0, 0, 44, 41, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_history`
--

CREATE TABLE `maintenance_history` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `findings` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `performed_date` date DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `resolution` varchar(255) DEFAULT NULL,
  `maintenance_id` bigint(20) DEFAULT NULL,
  `technician` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_history`
--

INSERT INTO `maintenance_history` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `findings`, `notes`, `performed_date`, `phone`, `resolution`, `maintenance_id`, `technician`) VALUES
(1, '2025-01-27 08:43:27.000000', 'admin@gmail.com', '2025-01-27 08:43:27.000000', NULL, 'không có vấn đề', 'đảm bảo  thông số đầu da của sensor', '2025-01-04', '+1111809090', 'làm vệ sinh định kỳ đầu báo ', 2, 4),
(2, '2025-01-30 10:01:22.000000', 'anonymousUser', '2025-01-30 10:01:22.000000', NULL, 'Components performing within expected parameters', 'Routine inspection and calibration', '2025-01-30', NULL, 'Calibration completed; no issues found', NULL, 4),
(3, '2025-01-30 10:05:52.000000', 'anonymousUser', '2025-01-30 10:05:52.000000', NULL, 'Components performing within expected parameters', 'Routine inspection and calibration', '2025-01-30', NULL, 'Calibration completed; no issues found', NULL, 4),
(4, '2025-01-30 10:08:28.000000', 'anonymousUser', '2025-01-30 10:08:28.000000', NULL, 'Components performing within expected parameters', 'Routine inspection and calibration', '2025-01-30', NULL, 'Calibration completed; no issues found', 2, 4),
(5, '2025-01-31 02:35:28.000000', 'anonymousUser', '2025-01-31 02:35:28.000000', NULL, 'tôt', 'Kiểm tra vệ sinh không có hỏng hóc đáng kể', '2025-01-31', NULL, 'tôt', 2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_task`
--

CREATE TABLE `maintenance_task` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `assigned_to_phone` varchar(255) DEFAULT NULL,
  `expected_duration` int(11) NOT NULL,
  `maintenance_type` enum('EMERGENCY','SCHEDULED') NOT NULL,
  `task_description` varchar(255) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `assigned_to` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meter`
--

CREATE TABLE `meter` (
  `meter_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `meter_type` enum('SINGLE_PHASE','THREE_PHASE') NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `office_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meter`
--

INSERT INTO `meter` (`meter_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `installation_date`, `meter_type`, `serial_number`, `office_id`) VALUES
(1, '2025-01-27 02:35:02.000000', 'admin@gmail.com', '2025-01-27 02:35:02.000000', NULL, '2022-08-20', 'THREE_PHASE', 'Serial Number 23232', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(255) DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','READ','SENT') NOT NULL,
  `recipient_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_maintenance`
--

CREATE TABLE `notification_maintenance` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `maintenance_date` datetime(6) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `status` enum('PENDING','READ','SENT') NOT NULL,
  `title` varchar(255) NOT NULL,
  `task_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `office`
--

CREATE TABLE `office` (
  `office_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `drawing_file` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rent_price` decimal(15,2) DEFAULT NULL,
  `service_fee` decimal(15,2) DEFAULT NULL,
  `status` tinytext DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `total_area` decimal(15,2) NOT NULL,
  `endx` double NOT NULL,
  `endy` double NOT NULL,
  `startx` double NOT NULL,
  `starty` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `office`
--

INSERT INTO `office` (`office_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `drawing_file`, `name`, `rent_price`, `service_fee`, `status`, `location_id`, `total_area`, `endx`, `endy`, `startx`, `starty`) VALUES
(1, '2025-01-27 02:17:01.000000', 'admin@gmail.com', '2025-01-27 02:17:01.000000', NULL, '1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Công ty Thiên An', 20.00, 4.00, 'ACTIV', 1, 0.00, 0, 0, 0, 0),
(44, '2025-02-14 01:35:23.000000', 'anonymousUser', '2025-02-14 01:35:23.000000', NULL, '1739496923207-1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Văn phòng A4', 27.00, 4.00, NULL, 14, 224.00, 30, 41, 16, 25),
(45, '2025-02-14 01:45:49.000000', 'anonymousUser', '2025-02-14 01:45:49.000000', NULL, '1739497549671-1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Văn phòng A4', 27.00, 4.00, NULL, 14, 154.00, 14, 41, 0, 30),
(46, '2025-02-14 01:47:15.000000', 'anonymousUser', '2025-02-14 01:47:15.000000', NULL, '1739497635927-1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Văn phòng A4', 27.00, 4.00, NULL, 14, 196.00, 14, 30, 0, 16),
(47, '2025-02-14 01:49:45.000000', 'anonymousUser', '2025-02-14 01:49:45.000000', NULL, '1739497785501-1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Văn phòng A4', 27.00, 4.00, NULL, 14, 320.00, 20, 16, 0, 0),
(48, '2025-02-14 01:53:13.000000', 'anonymousUser', '2025-02-14 01:53:13.000000', NULL, '1739497993246-1737944221303-Bản-vẽ-thiết-kế-2D-văn-phòng-Luxurious-Design.pdf', 'Văn phòng A4', 27.00, 4.00, NULL, 14, 160.00, 30, 16, 20, 0);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `icon`, `name`, `route`, `status`) VALUES
(1, 'home', 'Home', '/home', b'1'),
(2, 'history', 'History', '/history', b'1'),
(3, 'electric_bolt', 'History Electric', '/history-electric', b'1'),
(4, 'qr_code', 'Scan', '/scan', b'1'),
(5, 'chat', 'Chat', '/chat', b'1'),
(6, 'person', 'Profile', '/profile', b'1'),
(7, 'person', 'Profile', '/profile', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `passwordresettokens`
--

CREATE TABLE `passwordresettokens` (
  `id` int(11) NOT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `used` bit(1) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_contracts`
--

CREATE TABLE `payment_contracts` (
  `payment_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `payment_amount` decimal(38,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_status` enum('PAID','UNPAID') NOT NULL,
  `contract_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `api_path` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `api_path`, `method`, `module`, `name`, `status`) VALUES
(1, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/permissions', 'POST', 'PERMISSIONS', 'Create a permission', b'1'),
(2, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/permissions/{id}', 'PUT', 'PERMISSIONS', 'Update a permission', b'1'),
(3, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/permissions/{id}', 'DELETE', 'PERMISSIONS', 'Delete a permission', b'1'),
(4, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/permissions', 'GET', 'PERMISSIONS', 'Get permissions with pagination', b'1'),
(5, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/roles', 'POST', 'ROLES', 'Create a role', b'1'),
(6, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/roles/{id}', 'PUT', 'ROLES', 'Update a role', b'1'),
(7, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/roles/{id}', 'DELETE', 'ROLES', 'Delete a role', b'1'),
(8, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/roles', 'GET', 'ROLES', 'Get roles with pagination', b'1'),
(9, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/devices', 'POST', 'DEVICES', 'Create a device', b'1'),
(10, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/devices/{id}', 'PUT', 'DEVICES', 'Update a device', b'1'),
(11, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/devices/{id}', 'DELETE', 'DEVICES', 'Delete a device', b'1'),
(12, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/devices', 'GET', 'DEVICES', 'Get devices with pagination', b'1'),
(13, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/users', 'POST', 'USERS', 'Create a user', b'1'),
(14, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/users/{id}', 'PUT', 'USERS', 'Update a user', b'1'),
(15, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/users/{id}', 'DELETE', 'USERS', 'Delete a user', b'1'),
(16, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/users', 'GET', 'USERS', 'Get users with pagination', b'1'),
(17, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-types', 'POST', 'CUSTOMER_TYPES', 'Create a customer type', b'1'),
(18, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-types/{id}', 'PUT', 'CUSTOMER_TYPES', 'Update a customer type', b'1'),
(19, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-types/{id}', 'DELETE', 'CUSTOMER_TYPES', 'Delete a customer type', b'1'),
(20, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-types', 'GET', 'CUSTOMER_TYPES', 'Get customer types with pagination', b'1'),
(21, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-type-documents', 'POST', 'CUSTOMER_TYPE_DOCUMENTS', 'Create a customer type document', b'1'),
(22, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-type-documents/{id}', 'PUT', 'CUSTOMER_TYPE_DOCUMENTS', 'Update a customer type document', b'1'),
(23, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-type-documents/{id}', 'DELETE', 'CUSTOMER_TYPE_DOCUMENTS', 'Delete a customer type document', b'1'),
(24, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customer-type-documents', 'GET', 'CUSTOMER_TYPE_DOCUMENTS', 'Get customer type documents with pagination', b'1'),
(25, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customers', 'POST', 'CUSTOMERS', 'Create a customer', b'1'),
(26, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customers/{id}', 'PUT', 'CUSTOMERS', 'Update a customer', b'1'),
(27, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customers/{id}', 'DELETE', 'CUSTOMERS', 'Delete a customer', b'1'),
(28, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/customers', 'GET', 'CUSTOMERS', 'Get customers with pagination', b'1'),
(29, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/offices', 'POST', 'OFFICES', 'Create a office', b'1'),
(30, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/offices/{id}', 'PUT', 'OFFICES', 'Update a office', b'1'),
(31, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/offices/{id}', 'DELETE', 'OFFICES', 'Delete a office', b'1'),
(32, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/offices', 'GET', 'OFFICES', 'Get offices with pagination', b'1'),
(33, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/contracts', 'POST', 'CONTRACTS', 'Create a contract', b'1'),
(34, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/contracts/{id}', 'PUT', 'CONTRACTS', 'Update a contract', b'1'),
(35, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/contracts/{id}', 'DELETE', 'CONTRACTS', 'Delete a contract', b'1'),
(36, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/contracts', 'GET', 'CONTRACTS', 'Get contracts with pagination', b'1'),
(37, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/payments', 'POST', 'PAYMENT_CONTRACTS', 'Create a payment contract', b'1'),
(38, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/payments/{id}', 'PUT', 'PAYMENT_CONTRACTS', 'Update a payment contract', b'1'),
(39, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/payments/{id}', 'DELETE', 'PAYMENT_CONTRACTS', 'Delete a payment contract', b'1'),
(40, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/payments', 'GET', 'PAYMENT_CONTRACTS', 'Get payment contracts with pagination', b'1'),
(41, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/payments/sendPaymentRequest/{paymentId}', 'POST', 'PAYMENT_CONTRACTS', 'Send payment request', b'1'),
(42, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/handover-status', 'POST', 'HANDOVER_STATUS', 'Create a handover status', b'1'),
(43, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/handover-status/{id}', 'PUT', 'HANDOVER_STATUS', 'Update a handover status', b'1'),
(44, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/handover-status/{id}', 'DELETE', 'HANDOVER_STATUS', 'Delete a handover status', b'1'),
(45, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/handover-status', 'GET', 'HANDOVER_STATUS', 'Get handover status with pagination', b'1'),
(46, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/systems', 'POST', 'SYSTEMS', 'Create a system', b'1'),
(47, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/systems/{id}', 'PUT', 'SYSTEMS', 'Update a system', b'1'),
(48, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/systems/{id}', 'DELETE', 'SYSTEMS', 'Delete a system', b'1'),
(49, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/systems', 'GET', 'SYSTEMS', 'Get systems with pagination', b'1'),
(50, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/subcontractors', 'POST', 'SUBCONTRACTS', 'Create a subcontractor', b'1'),
(51, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/subcontractors/{id}', 'PUT', 'SUBCONTRACTS', 'Update a subcontractor', b'1'),
(52, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/subcontractors/{id}', 'DELETE', 'SUBCONTRACTS', 'Delete a subcontractor', b'1'),
(53, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/subcontractors', 'GET', 'SUBCONTRACTS', 'Get subcontractors with pagination', b'1'),
(54, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/system-maintenances', 'POST', 'SYSTEM_MAINTENANCE_SERVICES', 'Create a system maintenance service', b'1'),
(55, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/system-maintenances/{id}', 'PUT', 'SYSTEM_MAINTENANCE_SERVICES', 'Update a system maintenance service', b'1'),
(56, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/system-maintenances/{id}', 'DELETE', 'SYSTEM_MAINTENANCE_SERVICES', 'Delete a system maintenance service', b'1'),
(57, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/system-maintenances', 'GET', 'SYSTEM_MAINTENANCE_SERVICES', 'Get system maintenance services with pagination', b'1'),
(58, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/maintenance_histories', 'POST', 'MAINTENANCE_HISTORIES', 'Create a maintenance history', b'1'),
(59, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/maintenance_histories/{id}', 'PUT', 'MAINTENANCE_HISTORIES', 'Update a maintenance history', b'1'),
(60, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/maintenance_histories/{id}', 'DELETE', 'MAINTENANCE_HISTORIES', 'Delete a maintenance history', b'1'),
(61, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/maintenance_histories', 'GET', 'MAINTENANCE_HISTORIES', 'Get maintenance histories with pagination', b'1'),
(62, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/device-types', 'POST', 'DEVICE_TYPES', 'Create a device type', b'1'),
(63, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/device-types/{id}', 'PUT', 'DEVICE_TYPES', 'Update a device type', b'1'),
(64, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/device-types/{id}', 'DELETE', 'DEVICE_TYPES', 'Delete a device type', b'1'),
(65, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/device-types', 'GET', 'DEVICE_TYPES', 'Get device types with pagination', b'1'),
(66, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/electricity-usages', 'POST', 'ELECTRICITY_USAGES', 'Create a electricity usage', b'1'),
(67, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/electricity-usages/{id}', 'PUT', 'ELECTRICITY_USAGES', 'Update a electricity usage', b'1'),
(68, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/electricity-usages/{id}', 'DELETE', 'ELECTRICITY_USAGES', 'Delete a electricity usage', b'1'),
(69, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/electricity-usages', 'GET', 'ELECTRICITY_USAGES', 'Get electricity usages with pagination', b'1'),
(70, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/meters', 'POST', 'METERS', 'Create a meter', b'1'),
(71, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/meters/{id}', 'PUT', 'METERS', 'Update a meter', b'1'),
(72, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/meters/{id}', 'DELETE', 'METERS', 'Delete a meter', b'1'),
(73, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/meters', 'GET', 'METERS', 'Get meters with pagination', b'1'),
(74, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/quotations', 'POST', 'QUOTATIONS', 'Create a quotation', b'1'),
(75, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/quotations/{id}', 'PUT', 'QUOTATIONS', 'Update a quotation', b'1'),
(76, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/quotations/{id}', 'DELETE', 'QUOTATIONS', 'Delete a quotation', b'1'),
(77, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/quotations', 'GET', 'QUOTATIONS', 'Get quotations with pagination', b'1'),
(78, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-proposals', 'POST', 'REPAIR_PROPOSALS', 'Create a repair proposal', b'1'),
(79, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-proposals/{id}', 'PUT', 'REPAIR_PROPOSALS', 'Update a repair proposal', b'1'),
(80, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-proposals/{id}', 'DELETE', 'REPAIR_PROPOSALS', 'Delete a repair proposal', b'1'),
(81, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-proposals', 'GET', 'REPAIR_PROPOSALS', 'Get repair proposals with pagination', b'1'),
(82, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/notifications', 'POST', 'NOTIFICATION_MAINTENANCES', 'Create a notification maintenance', b'1'),
(83, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/notifications/{id}', 'PUT', 'NOTIFICATION_MAINTENANCES', 'Update a notification maintenance', b'1'),
(84, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/notifications/{id}', 'DELETE', 'NOTIFICATION_MAINTENANCES', 'Delete a notification maintenance', b'1'),
(85, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/notifications', 'GET', 'NOTIFICATION_MAINTENANCES', 'Get notification maintenances with pagination', b'1'),
(86, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks', 'POST', 'TASKS', 'Create a task', b'1'),
(87, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks/{id}', 'PUT', 'TASKS', 'Update a task', b'1'),
(88, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks/{id}', 'DELETE', 'TASKS', 'Delete a task', b'1'),
(89, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks', 'GET', 'TASKS', 'Get tasks with pagination', b'1'),
(90, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks', 'POST', 'TASKS', 'Create a task', b'1'),
(91, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks/{id}', 'PUT', 'TASKS', 'Update a task', b'1'),
(92, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks/{id}', 'DELETE', 'TASKS', 'Delete a task', b'1'),
(93, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/tasks', 'GET', 'TASKS', 'Get tasks with pagination', b'1'),
(94, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-requests', 'POST', 'REPAIR_REQUEST', 'Create a repair request', b'1'),
(95, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-requests/{id}', 'PUT', 'REPAIR_REQUEST', 'Update a repair request', b'1'),
(96, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-requests/{id}', 'DELETE', 'REPAIR_REQUEST', 'Delete a repair request', b'1'),
(97, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/repair-requests', 'GET', 'REPAIR_REQUEST', 'Get repair requests with pagination', b'1'),
(98, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/work-registrations', 'POST', 'WORK_REGISTRATIONS', 'Create a work registration', b'1'),
(99, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/work-registrations/{id}', 'PUT', 'WORK_REGISTRATIONS', 'Update a work registration', b'1'),
(100, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/work-registrations/{id}', 'DELETE', 'WORK_REGISTRATIONS', 'Delete a work registration', b'1'),
(101, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/work-registrations', 'GET', 'WORK_REGISTRATIONS', 'Get work registrations with pagination', b'1'),
(102, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/risk-assessments', 'POST', 'RISK_ASSESSMENTS', 'Create a risk assessment', b'1'),
(103, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/risk-assessments/{id}', 'PUT', 'RISK_ASSESSMENTS', 'Update a risk assessment', b'1'),
(104, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/risk-assessments/{id}', 'DELETE', 'RISK_ASSESSMENTS', 'Delete a risk assessment', b'1'),
(105, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, '/api/risk-assessments', 'GET', 'RISK_ASSESSMENTS', 'Get risk assessments with pagination', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `permission_role`
--

CREATE TABLE `permission_role` (
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission_role`
--

INSERT INTO `permission_role` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(1, 50),
(1, 51),
(1, 52),
(1, 53),
(1, 54),
(1, 55),
(1, 56),
(1, 57),
(1, 58),
(1, 59),
(1, 60),
(1, 61),
(1, 62),
(1, 63),
(1, 64),
(1, 65),
(1, 66),
(1, 67),
(1, 68),
(1, 69),
(1, 70),
(1, 71),
(1, 72),
(1, 73),
(1, 74),
(1, 75),
(1, 76),
(1, 77),
(1, 78),
(1, 79),
(1, 80),
(1, 81),
(1, 82),
(1, 83),
(1, 84),
(1, 85),
(1, 86),
(1, 87),
(1, 88),
(1, 89),
(1, 90),
(1, 91),
(1, 92),
(1, 93),
(1, 94),
(1, 95),
(1, 96),
(1, 97),
(1, 98),
(1, 99),
(1, 100),
(1, 101),
(1, 102),
(1, 103),
(1, 104),
(1, 105);

-- --------------------------------------------------------

--
-- Table structure for table `quotation`
--

CREATE TABLE `quotation` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `details` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `repair_proposal_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipient`
--

CREATE TABLE `recipient` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `reference_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipient`
--

INSERT INTO `recipient` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `reference_id`, `type`) VALUES
(1, '2025-01-28 05:17:33.000000', 'anonymousUser', '2025-01-28 05:17:33.000000', NULL, 'Electricity usage verification', 2, 'Contact');

-- --------------------------------------------------------

--
-- Table structure for table `repair_proposal`
--

CREATE TABLE `repair_proposal` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL,
  `proposal_type` enum('ABNORMAL_FAILURE','RISK_ASSESSMENT') NOT NULL,
  `request_date` date NOT NULL,
  `status` enum('APPROVED','COMPLETED','IN_PROGRESS','PENDING','REJECTED') NOT NULL,
  `title` varchar(255) NOT NULL,
  `risk_assessment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_request`
--

CREATE TABLE `repair_request` (
  `requestid` bigint(20) NOT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `request_date` datetime(6) NOT NULL,
  `status` enum('FAILED','PENDING','SUCCESS') NOT NULL,
  `accountid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `risk_assessment`
--

CREATE TABLE `risk_assessment` (
  `risk_assessmentid` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `assessment_date` date DEFAULT NULL,
  `mitigation_action` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `risk_detection` int(11) NOT NULL,
  `risk_impact` int(11) NOT NULL,
  `risk_priority_number` int(11) NOT NULL,
  `risk_probability` int(11) NOT NULL,
  `system_type` enum('ELECTRICAL','FIRE_PROTECTION','HVAC','PLUMBING') DEFAULT NULL,
  `contractorid` int(11) NOT NULL,
  `deviceid` bigint(20) NOT NULL,
  `maintenanceid` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `risk_assessment`
--

INSERT INTO `risk_assessment` (`risk_assessmentid`, `created_at`, `created_by`, `updated_at`, `updated_by`, `assessment_date`, `mitigation_action`, `remarks`, `risk_detection`, `risk_impact`, `risk_priority_number`, `risk_probability`, `system_type`, `contractorid`, `deviceid`, `maintenanceid`) VALUES
(1, '2025-01-27 08:46:45.000000', 'admin@gmail.com', '2025-01-27 08:46:45.000000', NULL, '2025-01-29', 'vệ sinh đàu báo nhiệt ', 'thiết bị trong tình trạng tôt', 7, 8, 448, 8, 'FIRE_PROTECTION', 2, 1, 1),
(2, '2025-01-30 10:01:22.000000', 'anonymousUser', '2025-01-30 10:01:22.000000', NULL, '2025-01-30', 'Install additional smoke detectors and improve alarm system sensitivity.', 'Install', 7, 9, 504, 8, NULL, 1, 1, 2),
(3, '2025-01-30 10:05:52.000000', 'anonymousUser', '2025-01-30 10:05:52.000000', NULL, '2025-01-30', 'tôt.', 'Install', 7, 9, 504, 8, NULL, 1, 1, 3),
(4, '2025-01-30 10:08:28.000000', 'anonymousUser', '2025-01-30 10:08:28.000000', NULL, '2025-01-30', 'tôt.', 'Install', 7, 9, 504, 8, NULL, 1, 1, 4),
(5, '2025-01-31 02:35:28.000000', 'anonymousUser', '2025-01-31 02:35:28.000000', NULL, '2025-01-31', 'không có sự cố', 'không có sự cố', 8, 9, 432, 6, NULL, 2, 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `status`) VALUES
(1, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'ADMIN', b'1'),
(2, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'USER', b'1'),
(3, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'TECHNICAL_MANAGER', b'1'),
(4, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'ENGINEERING', b'1'),
(5, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'SERVICE', b'1'),
(6, '2025-01-27 01:21:33.000000', NULL, '2025-01-27 01:21:33.000000', NULL, 'CEO', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `role_pages`
--

CREATE TABLE `role_pages` (
  `id` bigint(20) NOT NULL,
  `page_id` bigint(20) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_pages`
--

INSERT INTO `role_pages` (`id`, `page_id`, `role_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subcontractors`
--

CREATE TABLE `subcontractors` (
  `subcontractorid` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `contract_start_date` date DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `service_type` tinyint(4) DEFAULT NULL,
  `systemid` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcontractors`
--

INSERT INTO `subcontractors` (`subcontractorid`, `created_at`, `created_by`, `updated_at`, `updated_by`, `contract_end_date`, `contract_start_date`, `name`, `phone`, `rating`, `service_type`, `systemid`) VALUES
(1, '2025-01-27 08:32:31.000000', 'admin@gmail.com', '2025-01-27 08:32:31.000000', NULL, '2026-01-17', '2023-01-25', 'Nhà Thầu Điện Máy Xanh', '+126795050', 2.00, 2, 3),
(2, '2025-01-27 08:35:37.000000', 'admin@gmail.com', '2025-01-27 08:35:37.000000', NULL, '2027-01-30', '2023-01-04', 'Nhà Thầu Tân lan', '+123456090', 2.00, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `systems`
--

CREATE TABLE `systems` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `maintenance_cycle` int(11) NOT NULL,
  `system_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `systems`
--

INSERT INTO `systems` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `description`, `maintenance_cycle`, `system_name`) VALUES
(1, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, NULL, 12, 'Hệ thống Điện'),
(2, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, NULL, 12, 'Hệ thống Cấp thoát nước'),
(3, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, NULL, 12, 'Hệ thống Điều hòa không khí'),
(4, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, NULL, 12, 'Hệ thống Phòng cháy');

-- --------------------------------------------------------

--
-- Table structure for table `system_maintenance_services`
--

CREATE TABLE `system_maintenance_services` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `frequency` enum('ANNUALLY','MONTHLY','QUARTERLY') DEFAULT NULL,
  `maintenance_scope` varchar(255) DEFAULT NULL,
  `next_scheduled_date` date DEFAULT NULL,
  `service_type` enum('ELECTRICAL','FIRE_PROTECTION','HVAC','PLUMBING') DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','PENDING') DEFAULT NULL,
  `subcontractor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_maintenance_services`
--

INSERT INTO `system_maintenance_services` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `frequency`, `maintenance_scope`, `next_scheduled_date`, `service_type`, `status`, `subcontractor_id`) VALUES
(1, '2025-01-27 08:34:14.000000', 'admin@gmail.com', '2025-01-27 08:34:14.000000', NULL, 'MONTHLY', 'Bảo trì cụm dàn lạnh', '2023-01-14', 'HVAC', 'IN_PROGRESS', 1),
(2, '2025-01-27 08:38:16.000000', 'admin@gmail.com', '2025-01-27 08:38:16.000000', NULL, 'MONTHLY', 'Bảo Trì Toàn Hệ Thống Pccc', '2023-01-28', 'FIRE_PROTECTION', 'IN_PROGRESS', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_online` bit(1) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `refresh_token` mediumtext DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `email`, `is_online`, `mobile`, `name`, `password`, `refresh_token`, `status`, `role_id`) VALUES
(1, '2025-01-27 01:21:34.000000', NULL, '2025-02-15 12:31:37.000000', 'admin@gmail.com', 'admin@gmail.com', b'1', NULL, 'I\'m Admin', '$2a$10$ZcJPxGFRhT/m7S6EHWDT9.oH0BPJQ2gMaOTLH8V8.9M0TwabKha5m', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3Mzk3MDkwOTcsImlhdCI6MTczOTYyMjY5NywidXNlciI6eyJpZCI6MSwibmFtZSI6IkknbSBBZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIn19.aoFaYHJk14yz6twUCE6NF-h-U1d9twkpG5V0vIBwoFGvZkn3bHSbzXmZz2zRMyiYBCHvHp5ov1YagMV_OZp1Mg', b'1', 1),
(2, '2025-01-27 01:21:34.000000', NULL, '2025-01-29 03:21:45.000000', 'user@gmail.com', 'user@gmail.com', b'1', NULL, 'I\'m User', '$2a$10$VpfHSYePg/EVs8C/mmXFEOdZD4D2HmlaPOBGjqZIvM9gxWy27OBD6', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImV4cCI6MTczODIwNzMwNSwiaWF0IjoxNzM4MTIwOTA1LCJ1c2VyIjp7ImlkIjoyLCJuYW1lIjoiSSdtIFVzZXIiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIn19.XAscxsLxdKaWERb4qi8MyB24-2oOsdh8H18cXpZpQIJykUKXNVGPNjK0qC1iypO657-o19w2CcnaFZF3y-Bd3w', b'1', 2),
(3, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, 'technical_management@gmail.com', b'0', NULL, 'I\'m Technical Management', '$2a$10$9y2l2R3D2sZq2EkkqvHmROwTBS6YcHWC7DIKZp8RSLbaXLWdduJRe', NULL, b'1', 3),
(4, '2025-01-27 01:21:34.000000', NULL, '2025-02-01 02:32:57.000000', 'engineering@gmail.com', 'engineering@gmail.com', b'1', NULL, 'I\'m Engineering', '$2a$10$OVRGCIuxFcrovPCTSMHHq.wQNo6ZZJazKY3h6Z04OAo0xuZ21SXsC', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbmdpbmVlcmluZ0BnbWFpbC5jb20iLCJleHAiOjE3Mzg0NjM1NzcsImlhdCI6MTczODM3NzE3NywidXNlciI6eyJpZCI6NCwibmFtZSI6IkknbSBFbmdpbmVlcmluZyIsImVtYWlsIjoiZW5naW5lZXJpbmdAZ21haWwuY29tIn19.jGHamCA75rOsZqVyjFRhAVDtYh3lkclwH6SJBhsyYOGWai5hTDv855KNWsMTzem4zrPrCnmlJR5Y6qGFZSEOBA', b'1', 4),
(5, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, 'ceo@gmail.com', b'0', NULL, 'I\'m CEO', '$2a$10$fH3AnGdgDRD8Um9.bNyVDOkYP1BQSLC2GmmIRFe.mg7ZDd5v5dKim', NULL, b'1', 6),
(6, '2025-01-27 01:21:34.000000', NULL, '2025-01-27 01:21:34.000000', NULL, 'services@gmail.com', b'0', NULL, 'I\'m Services', '$2a$10$gQqM6/MK/QarFJ.f90K6..Mz7YyNMcpRYQX/4UbIwVRG5znvZvJmm', NULL, b'1', 5),
(7, '2025-01-28 00:42:55.000000', 'admin@gmail.com', '2025-01-28 00:42:55.000000', NULL, 'HaiThanh@gamil.com', b'0', '+12378543', 'Trần Thanh Hải', '$2a$10$30DfDBTaklyxVQcEeqf2feqFxl597.lCM.p/t3K5edkMIXvT21j3S', NULL, b'1', 4);

-- --------------------------------------------------------

--
-- Table structure for table `work_registration`
--

CREATE TABLE `work_registration` (
  `registrationid` bigint(20) NOT NULL,
  `drawing_url` varchar(500) DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `registration_date` datetime(6) NOT NULL,
  `scheduled_date` datetime(6) NOT NULL,
  `status` enum('APPROVED','COMPLETED','PENDING','REJECTED') NOT NULL,
  `accountid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhalwepod3944695ji0suwoqb9` (`room_id`),
  ADD KEY `FK6f0y4l43ihmgfswkgy9yrtjkh` (`user_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_room_users`
--
ALTER TABLE `chat_room_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7ht9oefwyqncvt3h8134fb5ri` (`room_id`),
  ADD KEY `FKa4i754uhscevbsye3dmeuma5t` (`user_id`);

--
-- Indexes for table `check_result`
--
ALTER TABLE `check_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhi8vy9h6yjbonekvh8wg04nde` (`check_item_id`);

--
-- Indexes for table `common_area`
--
ALTER TABLE `common_area`
  ADD PRIMARY KEY (`common_area_id`),
  ADD KEY `FK2m11wxq23cr8k4u21v1iv9k2t` (`location_id`);

--
-- Indexes for table `common_area_template`
--
ALTER TABLE `common_area_template`
  ADD PRIMARY KEY (`template_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`contactid`),
  ADD KEY `FKckoarj5a5jmet3b3smgdhaopw` (`customer_id`);

--
-- Indexes for table `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `FK6y15vdr97pc7huhqp1j6vpxn1` (`customerid`),
  ADD KEY `FKj0lmdch7vkweibwbi9moyqery` (`officeid`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `UKj7ja2xvrxudhvssosd4nu1o92` (`user_id`),
  ADD KEY `FKbl66fsffn3yewjw22kh672imw` (`customer_type_id`);

--
-- Indexes for table `customertype`
--
ALTER TABLE `customertype`
  ADD PRIMARY KEY (`customer_type_id`);

--
-- Indexes for table `customertypedocument`
--
ALTER TABLE `customertypedocument`
  ADD PRIMARY KEY (`customer_document_id`),
  ADD KEY `FK94fufkhl8h4mikmxckh081ufj` (`customer_type_id`);

--
-- Indexes for table `customer_document`
--
ALTER TABLE `customer_document`
  ADD PRIMARY KEY (`customer_document_id`),
  ADD KEY `FK5146mcr0wlbs9a4lr0kx7uusr` (`customer_id`),
  ADD KEY `FK5so7wxkr6tbyjhx8now6qf408` (`customer_type_document_id`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`device_id`),
  ADD KEY `FKo9oabhnk3f79y77ifapu6yp7t` (`device_type_id`),
  ADD KEY `FKsnkatwjfxj6oyyven1lici26q` (`location_id`),
  ADD KEY `FKpq8fyuotigj5jgj2fbxk2qdek` (`maintenance_service_id`),
  ADD KEY `FKrymjd4qfx1pc5h6u3fkock4nu` (`system_id`);

--
-- Indexes for table `device_type`
--
ALTER TABLE `device_type`
  ADD PRIMARY KEY (`device_type_id`);

--
-- Indexes for table `electricity_rate`
--
ALTER TABLE `electricity_rate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `electricity_usage`
--
ALTER TABLE `electricity_usage`
  ADD PRIMARY KEY (`usageid`),
  ADD KEY `FKk1e473rnmo3iy7s9tj4tihhju` (`meter_id`);

--
-- Indexes for table `electricity_usage_verification`
--
ALTER TABLE `electricity_usage_verification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1bo4dul26smttbeigsldj63e3` (`meter_id`);

--
-- Indexes for table `grid_cell`
--
ALTER TABLE `grid_cell`
  ADD PRIMARY KEY (`grid_cell_id`),
  ADD UNIQUE KEY `UKk7edxoog0tsjgmhrex4gb5vvg` (`office_id`),
  ADD KEY `FKl7xdk9ertaq8j5w2uyvxepbp4` (`location_id`);

--
-- Indexes for table `handoverstatus`
--
ALTER TABLE `handoverstatus`
  ADD PRIMARY KEY (`handover_id`),
  ADD KEY `FKc7sw4mr8la2915v5gcljqietg` (`office_id`);

--
-- Indexes for table `item_check`
--
ALTER TABLE `item_check`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrq1idyi58y0m1e63m9flnehi` (`device_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `maintenance_history`
--
ALTER TABLE `maintenance_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKo109hht5gd70q83q00v7ayifa` (`maintenance_id`),
  ADD KEY `FK9243ox869ypbkyn17pom8il1w` (`technician`);

--
-- Indexes for table `maintenance_task`
--
ALTER TABLE `maintenance_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi8d1iw47myu49skdqq8x0se3t` (`assigned_to`);

--
-- Indexes for table `meter`
--
ALTER TABLE `meter`
  ADD PRIMARY KEY (`meter_id`),
  ADD KEY `FKl8cjr7wswqnb7y5wj70253iw7` (`office_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1mh2ias3p23pod6kfho6ee2qw` (`recipient_id`);

--
-- Indexes for table `notification_maintenance`
--
ALTER TABLE `notification_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5hsdpxh71bq82j3b87lbd2383` (`task_id`);

--
-- Indexes for table `office`
--
ALTER TABLE `office`
  ADD PRIMARY KEY (`office_id`),
  ADD KEY `FKgwmyqtv378y1m3hus16tktphb` (`location_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `passwordresettokens`
--
ALTER TABLE `passwordresettokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbmg2gtwgskshmyeh59ogb4q54` (`user_id`);

--
-- Indexes for table `payment_contracts`
--
ALTER TABLE `payment_contracts`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `FKn3yniupw0tk8ur95a2qnbhsbx` (`contract_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD KEY `FK50wdyw1wm37j19mq1qood18vt` (`role_id`),
  ADD KEY `FK6lahau8iot279umab4rc61omq` (`permission_id`);

--
-- Indexes for table `quotation`
--
ALTER TABLE `quotation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8jfrjy5eph1d7a7sm9nyad42y` (`repair_proposal_id`);

--
-- Indexes for table `recipient`
--
ALTER TABLE `recipient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repair_proposal`
--
ALTER TABLE `repair_proposal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrsb342u14gc1wjufthv1o9bsi` (`risk_assessment_id`);

--
-- Indexes for table `repair_request`
--
ALTER TABLE `repair_request`
  ADD PRIMARY KEY (`requestid`),
  ADD KEY `FK7jb05abh6qi7u3br42hkb6xoe` (`accountid`);

--
-- Indexes for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  ADD PRIMARY KEY (`risk_assessmentid`),
  ADD KEY `FKkaa871uvdty7h57ewc1edm83v` (`contractorid`),
  ADD KEY `FKquti8c3dhk52x6ain7ph4u6um` (`deviceid`),
  ADD KEY `FKb89rrwt776f2ow8ec9y5sce4l` (`maintenanceid`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_pages`
--
ALTER TABLE `role_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlk223m6ovehdoq861b1rcksbe` (`page_id`),
  ADD KEY `FKomej6fxta5yy4ahedu616utbn` (`role_id`);

--
-- Indexes for table `subcontractors`
--
ALTER TABLE `subcontractors`
  ADD PRIMARY KEY (`subcontractorid`),
  ADD KEY `FKdd439ti3bfag791wwdqjeo2wq` (`systemid`);

--
-- Indexes for table `systems`
--
ALTER TABLE `systems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_maintenance_services`
--
ALTER TABLE `system_maintenance_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrw49cq2tgivo6gfo15x0t6mbk` (`subcontractor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`);

--
-- Indexes for table `work_registration`
--
ALTER TABLE `work_registration`
  ADD PRIMARY KEY (`registrationid`),
  ADD KEY `FKcomr5hi7httpb9ifjs5msnf8y` (`accountid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat_room_users`
--
ALTER TABLE `chat_room_users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `check_result`
--
ALTER TABLE `check_result`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `common_area`
--
ALTER TABLE `common_area`
  MODIFY `common_area_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `common_area_template`
--
ALTER TABLE `common_area_template`
  MODIFY `template_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `contactid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contract`
--
ALTER TABLE `contract`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customertype`
--
ALTER TABLE `customertype`
  MODIFY `customer_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customertypedocument`
--
ALTER TABLE `customertypedocument`
  MODIFY `customer_document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer_document`
--
ALTER TABLE `customer_document`
  MODIFY `customer_document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `device`
--
ALTER TABLE `device`
  MODIFY `device_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `device_type`
--
ALTER TABLE `device_type`
  MODIFY `device_type_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `electricity_rate`
--
ALTER TABLE `electricity_rate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `electricity_usage`
--
ALTER TABLE `electricity_usage`
  MODIFY `usageid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `electricity_usage_verification`
--
ALTER TABLE `electricity_usage_verification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `grid_cell`
--
ALTER TABLE `grid_cell`
  MODIFY `grid_cell_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `handoverstatus`
--
ALTER TABLE `handoverstatus`
  MODIFY `handover_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `item_check`
--
ALTER TABLE `item_check`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `maintenance_history`
--
ALTER TABLE `maintenance_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance_task`
--
ALTER TABLE `maintenance_task`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meter`
--
ALTER TABLE `meter`
  MODIFY `meter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_maintenance`
--
ALTER TABLE `notification_maintenance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `office`
--
ALTER TABLE `office`
  MODIFY `office_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `passwordresettokens`
--
ALTER TABLE `passwordresettokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_contracts`
--
ALTER TABLE `payment_contracts`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `quotation`
--
ALTER TABLE `quotation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipient`
--
ALTER TABLE `recipient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `repair_proposal`
--
ALTER TABLE `repair_proposal`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `repair_request`
--
ALTER TABLE `repair_request`
  MODIFY `requestid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  MODIFY `risk_assessmentid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `role_pages`
--
ALTER TABLE `role_pages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subcontractors`
--
ALTER TABLE `subcontractors`
  MODIFY `subcontractorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `systems`
--
ALTER TABLE `systems`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `system_maintenance_services`
--
ALTER TABLE `system_maintenance_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `work_registration`
--
ALTER TABLE `work_registration`
  MODIFY `registrationid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `FK6f0y4l43ihmgfswkgy9yrtjkh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKhalwepod3944695ji0suwoqb9` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`);

--
-- Constraints for table `chat_room_users`
--
ALTER TABLE `chat_room_users`
  ADD CONSTRAINT `FK7ht9oefwyqncvt3h8134fb5ri` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`),
  ADD CONSTRAINT `FKa4i754uhscevbsye3dmeuma5t` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `check_result`
--
ALTER TABLE `check_result`
  ADD CONSTRAINT `FKhi8vy9h6yjbonekvh8wg04nde` FOREIGN KEY (`check_item_id`) REFERENCES `item_check` (`id`);

--
-- Constraints for table `common_area`
--
ALTER TABLE `common_area`
  ADD CONSTRAINT `FK2m11wxq23cr8k4u21v1iv9k2t` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`);

--
-- Constraints for table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `FKckoarj5a5jmet3b3smgdhaopw` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

--
-- Constraints for table `contract`
--
ALTER TABLE `contract`
  ADD CONSTRAINT `FK6y15vdr97pc7huhqp1j6vpxn1` FOREIGN KEY (`customerid`) REFERENCES `customer` (`customer_id`),
  ADD CONSTRAINT `FKj0lmdch7vkweibwbi9moyqery` FOREIGN KEY (`officeid`) REFERENCES `office` (`office_id`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `FKbl66fsffn3yewjw22kh672imw` FOREIGN KEY (`customer_type_id`) REFERENCES `customertype` (`customer_type_id`),
  ADD CONSTRAINT `FKra1cb3fu95r1a0m7aksow0nk4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customertypedocument`
--
ALTER TABLE `customertypedocument`
  ADD CONSTRAINT `FK94fufkhl8h4mikmxckh081ufj` FOREIGN KEY (`customer_type_id`) REFERENCES `customertype` (`customer_type_id`);

--
-- Constraints for table `customer_document`
--
ALTER TABLE `customer_document`
  ADD CONSTRAINT `FK5146mcr0wlbs9a4lr0kx7uusr` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  ADD CONSTRAINT `FK5so7wxkr6tbyjhx8now6qf408` FOREIGN KEY (`customer_type_document_id`) REFERENCES `customertypedocument` (`customer_document_id`);

--
-- Constraints for table `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `FKo9oabhnk3f79y77ifapu6yp7t` FOREIGN KEY (`device_type_id`) REFERENCES `device_type` (`device_type_id`),
  ADD CONSTRAINT `FKpq8fyuotigj5jgj2fbxk2qdek` FOREIGN KEY (`maintenance_service_id`) REFERENCES `system_maintenance_services` (`id`),
  ADD CONSTRAINT `FKrymjd4qfx1pc5h6u3fkock4nu` FOREIGN KEY (`system_id`) REFERENCES `systems` (`id`),
  ADD CONSTRAINT `FKsnkatwjfxj6oyyven1lici26q` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`);

--
-- Constraints for table `electricity_usage`
--
ALTER TABLE `electricity_usage`
  ADD CONSTRAINT `FKk1e473rnmo3iy7s9tj4tihhju` FOREIGN KEY (`meter_id`) REFERENCES `meter` (`meter_id`);

--
-- Constraints for table `electricity_usage_verification`
--
ALTER TABLE `electricity_usage_verification`
  ADD CONSTRAINT `FK1bo4dul26smttbeigsldj63e3` FOREIGN KEY (`meter_id`) REFERENCES `meter` (`meter_id`);

--
-- Constraints for table `grid_cell`
--
ALTER TABLE `grid_cell`
  ADD CONSTRAINT `FKl7xdk9ertaq8j5w2uyvxepbp4` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  ADD CONSTRAINT `FKli3gh94j19fgucqtdgmogfndb` FOREIGN KEY (`office_id`) REFERENCES `office` (`office_id`);

--
-- Constraints for table `handoverstatus`
--
ALTER TABLE `handoverstatus`
  ADD CONSTRAINT `FKc7sw4mr8la2915v5gcljqietg` FOREIGN KEY (`office_id`) REFERENCES `office` (`office_id`);

--
-- Constraints for table `item_check`
--
ALTER TABLE `item_check`
  ADD CONSTRAINT `FKrq1idyi58y0m1e63m9flnehi` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`);

--
-- Constraints for table `maintenance_history`
--
ALTER TABLE `maintenance_history`
  ADD CONSTRAINT `FK9243ox869ypbkyn17pom8il1w` FOREIGN KEY (`technician`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKo109hht5gd70q83q00v7ayifa` FOREIGN KEY (`maintenance_id`) REFERENCES `system_maintenance_services` (`id`);

--
-- Constraints for table `maintenance_task`
--
ALTER TABLE `maintenance_task`
  ADD CONSTRAINT `FKi8d1iw47myu49skdqq8x0se3t` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`);

--
-- Constraints for table `meter`
--
ALTER TABLE `meter`
  ADD CONSTRAINT `FKl8cjr7wswqnb7y5wj70253iw7` FOREIGN KEY (`office_id`) REFERENCES `office` (`office_id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FK1mh2ias3p23pod6kfho6ee2qw` FOREIGN KEY (`recipient_id`) REFERENCES `recipient` (`id`);

--
-- Constraints for table `notification_maintenance`
--
ALTER TABLE `notification_maintenance`
  ADD CONSTRAINT `FK5hsdpxh71bq82j3b87lbd2383` FOREIGN KEY (`task_id`) REFERENCES `maintenance_task` (`id`);

--
-- Constraints for table `office`
--
ALTER TABLE `office`
  ADD CONSTRAINT `FKgwmyqtv378y1m3hus16tktphb` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`);

--
-- Constraints for table `passwordresettokens`
--
ALTER TABLE `passwordresettokens`
  ADD CONSTRAINT `FKbmg2gtwgskshmyeh59ogb4q54` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_contracts`
--
ALTER TABLE `payment_contracts`
  ADD CONSTRAINT `FKn3yniupw0tk8ur95a2qnbhsbx` FOREIGN KEY (`contract_id`) REFERENCES `contract` (`contract_id`);

--
-- Constraints for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD CONSTRAINT `FK50wdyw1wm37j19mq1qood18vt` FOREIGN KEY (`role_id`) REFERENCES `permissions` (`id`),
  ADD CONSTRAINT `FK6lahau8iot279umab4rc61omq` FOREIGN KEY (`permission_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `quotation`
--
ALTER TABLE `quotation`
  ADD CONSTRAINT `FK8jfrjy5eph1d7a7sm9nyad42y` FOREIGN KEY (`repair_proposal_id`) REFERENCES `repair_proposal` (`id`);

--
-- Constraints for table `repair_proposal`
--
ALTER TABLE `repair_proposal`
  ADD CONSTRAINT `FKrsb342u14gc1wjufthv1o9bsi` FOREIGN KEY (`risk_assessment_id`) REFERENCES `risk_assessment` (`risk_assessmentid`);

--
-- Constraints for table `repair_request`
--
ALTER TABLE `repair_request`
  ADD CONSTRAINT `FK7jb05abh6qi7u3br42hkb6xoe` FOREIGN KEY (`accountid`) REFERENCES `users` (`id`);

--
-- Constraints for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  ADD CONSTRAINT `FKb89rrwt776f2ow8ec9y5sce4l` FOREIGN KEY (`maintenanceid`) REFERENCES `maintenance_history` (`id`),
  ADD CONSTRAINT `FKkaa871uvdty7h57ewc1edm83v` FOREIGN KEY (`contractorid`) REFERENCES `subcontractors` (`subcontractorid`),
  ADD CONSTRAINT `FKquti8c3dhk52x6ain7ph4u6um` FOREIGN KEY (`deviceid`) REFERENCES `device` (`device_id`);

--
-- Constraints for table `role_pages`
--
ALTER TABLE `role_pages`
  ADD CONSTRAINT `FKlk223m6ovehdoq861b1rcksbe` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`),
  ADD CONSTRAINT `FKomej6fxta5yy4ahedu616utbn` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `subcontractors`
--
ALTER TABLE `subcontractors`
  ADD CONSTRAINT `FKdd439ti3bfag791wwdqjeo2wq` FOREIGN KEY (`systemid`) REFERENCES `systems` (`id`);

--
-- Constraints for table `system_maintenance_services`
--
ALTER TABLE `system_maintenance_services`
  ADD CONSTRAINT `FKrw49cq2tgivo6gfo15x0t6mbk` FOREIGN KEY (`subcontractor_id`) REFERENCES `subcontractors` (`subcontractorid`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `work_registration`
--
ALTER TABLE `work_registration`
  ADD CONSTRAINT `FKcomr5hi7httpb9ifjs5msnf8y` FOREIGN KEY (`accountid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
