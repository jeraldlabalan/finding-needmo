-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2024 at 08:10 AM
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
-- Database: `finding_needmo`
--

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE `content` (
  `ContentID` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `Program` int(11) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Course` int(11) DEFAULT NULL,
  `Format` enum('PDF','DOCX','PPTX','MP4','MP3') NOT NULL,
  `FileSize` bigint(20) UNSIGNED NOT NULL,
  `Tags` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT NULL,
  `UploadedAt` datetime DEFAULT NULL,
  `IsArchived` tinyint(1) DEFAULT 0,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `CourseID` int(11) NOT NULL,
  `Program` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`CourseID`, `Program`, `Title`) VALUES
(1, 1, 'Ethics'),
(2, 1, 'Purposive Communication'),
(3, 1, 'Kontekstwalisadong Komunikasyon sa Filipino'),
(4, 1, 'Discrete Structures I'),
(5, 1, 'Introduction to Computing'),
(6, 1, 'Computer Programming I'),
(7, 1, 'Movement Enhancement'),
(8, 1, 'National Service Training Program 1'),
(9, 1, 'Institutional Orientation'),
(10, 1, 'Art Appreciation'),
(11, 1, 'Mathematics in the Modern World'),
(12, 1, 'Science, Technology and Society'),
(13, 1, 'Dalumat Ng/Sa Filipino'),
(14, 1, 'Computer Programming II'),
(15, 1, 'Web Systems and Technologies'),
(16, 1, 'Fitness Exercises'),
(17, 1, 'National Service Training Program 2'),
(18, 1, 'Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas'),
(19, 1, 'Analytic Geometry'),
(20, 1, 'Discrete Structures II'),
(21, 1, 'Digital Logic Design'),
(22, 1, 'Object Oriented Programming'),
(23, 1, 'Information Management'),
(24, 1, 'Fundamentals of Information Systems'),
(25, 1, 'Physical Activities towards Health and Fitness 1'),
(26, 1, 'Understanding the Self'),
(27, 1, 'Panitikang Panlipunan'),
(28, 1, 'Calculus'),
(29, 1, 'Architecture and Organization'),
(30, 1, 'Software Engineering I'),
(31, 1, 'Data Structures and Algorithms'),
(32, 1, 'Advanced Database Management System'),
(33, 1, 'Physical Activities towards Health and Fitness 2'),
(34, 1, 'Linear Algebra'),
(35, 1, 'Software Engineering II'),
(36, 1, 'Operating Systems'),
(37, 1, 'Networks and Communication'),
(38, 1, 'CS Elective 1 (Computer Graphics and Visual Computing)'),
(39, 1, 'Applications Development and Emerging Technologies'),
(40, 1, 'Social and Professional Issues'),
(41, 1, 'Life and Works of Rizal'),
(42, 1, 'Experimental Statistics'),
(43, 1, 'Design and Analysis of Algorithm'),
(44, 1, 'Programming Languages'),
(45, 1, 'CS Elective 2 (Introduction to Game Development)'),
(46, 1, 'Methods of Research'),
(47, 1, 'Information Assurance and Security'),
(48, 1, 'Practicum (240 hours)'),
(49, 1, 'Human Computer Interaction'),
(50, 1, 'Automata Theory and Formal Languages'),
(51, 1, 'Intelligent Systems'),
(52, 1, 'CS Elective 3 (Internet of Things)'),
(53, 1, 'Undergraduate Thesis I'),
(54, 1, 'The Contemporary World'),
(55, 1, 'Gender and Society'),
(56, 1, 'Numerical and Symbolic Computation'),
(57, 1, 'Undergraduate Thesis II'),
(58, 2, 'Ethics'),
(59, 2, 'Purposive Communication'),
(60, 2, 'Kontekstwalisadong Komunikasyon sa Filpino'),
(61, 2, 'Discrete Structure'),
(62, 2, 'Introduction to Computing'),
(63, 2, 'Computer Programming 1'),
(64, 2, 'Movement Enhancement'),
(65, 2, 'National Service Training Program 1'),
(66, 2, 'Institutional Orientation'),
(67, 2, 'Art Appreciation'),
(68, 2, 'Science, Technology and Society'),
(69, 2, 'Dalumat Ng/Sa Filipino'),
(70, 2, 'Mathematics in the Modern World'),
(71, 2, 'Computer Programming 2'),
(72, 2, 'Web System and Technologies 1'),
(73, 2, 'Fitness Exercise'),
(74, 2, 'National Service Training Program 2'),
(75, 2, 'Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas'),
(76, 2, 'The Contemporary World'),
(77, 2, 'Gender and Society'),
(78, 2, 'Panitikang Panlipunan'),
(79, 2, 'Platform Technologies'),
(80, 2, 'Information Management'),
(81, 2, 'Object Oriented Programming'),
(82, 2, 'Physical Activities towards Health and Fitness 1'),
(83, 2, 'Understanding the Self'),
(84, 2, 'Data Structures and Algorithms'),
(85, 2, 'Integrated Programming and Technologies 1'),
(86, 2, 'Open Source Technology'),
(87, 2, 'Advanced Database System'),
(88, 2, 'Multimedia Systems'),
(89, 2, 'Physical Activities towards Health and Fitness 2'),
(90, 2, 'Applied Statistics'),
(91, 2, 'System Integration and Architecture 1'),
(92, 2, 'Introduction to Human Computer Interaction'),
(93, 2, 'Information Assurance and Security 1'),
(94, 2, 'Network Fundamentals'),
(95, 2, 'System Analysis and Design'),
(96, 2, 'Application Development and Emerging Technologies'),
(97, 2, 'Methods of Research'),
(98, 2, 'Rizal: Life, Works, and Writings'),
(99, 2, 'Quantitative Methods (Modeling & Simulation)'),
(100, 2, 'IT ELECTIVE 1 (Human Computer Interaction 2)'),
(101, 2, 'IT ELECTIVE 2 (Web System and Technologies 2)'),
(102, 2, 'Information Assurance and Security 2'),
(103, 2, 'Network Management'),
(104, 2, 'Capstone Project and Research 1'),
(105, 2, 'Social and Professional Issues'),
(106, 2, 'IT ELECTIVE 3 (Integrated Programming and Technologies 2)'),
(107, 2, 'IT ELECTIVE 4 (System Integration and Architecture 2)'),
(108, 2, 'Systems Administration and Maintenance'),
(109, 2, 'Capstone Project and Research 2'),
(110, 2, 'Practicum (minimum 486 hours)');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `ProfileID` int(11) NOT NULL,
  `User` int(11) NOT NULL,
  `Picture` varchar(255) DEFAULT 'uploads\\default-pfp.jpg',
  `Firstname` varchar(255) NOT NULL,
  `Lastname` varchar(255) NOT NULL,
  `Program` int(11) DEFAULT NULL,
  `Position` enum('Instructor 1','Instructor 2','Instructor 3','Assistant Professor 1','Assistant Professor 2') DEFAULT NULL,
  `School` varchar(255) NOT NULL DEFAULT 'Cavite State University - Bacoor Campus'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`ProfileID`, `User`, `Picture`, `Firstname`, `Lastname`, `Program`, `Position`, `School`) VALUES
(1, 3, 'uploads\\default-pfp.jpg', '', '', NULL, NULL, 'Cavite State University - Bacoor Campus'),
(2, 4, 'uploads\\1734851075368.png', 'DCS', 'Account', 1, 'Instructor 2', 'Cavite State University - Bacoor Campus');

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `ProgramID` int(11) NOT NULL,
  `Code` enum('BSCS','BSIT') NOT NULL,
  `Name` enum('Bachelor of Science in Computer Science','Bachelor of Science in Information Technology') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`ProgramID`, `Code`, `Name`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science'),
(2, 'BSIT', 'Bachelor of Science in Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `searchhistory`
--

CREATE TABLE `searchhistory` (
  `HistoryID` int(11) NOT NULL,
  `SearchedBy` int(11) NOT NULL,
  `Entry` varchar(255) NOT NULL,
  `SearchedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Student','Educator') NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT NULL,
  `LastLoginAt` datetime NOT NULL DEFAULT current_timestamp(),
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Email`, `Password`, `Role`, `CreatedAt`, `UpdatedAt`, `LastLoginAt`, `Status`) VALUES
(3, 'passwordnito123@gmail.com', '$2b$10$Wrhxjl437NvzgM3ZqKoee.iv6//z/yKKok00kNphJV8J.V4ys9asm', 'Student', '2024-12-22 10:40:22', NULL, '2024-12-22 10:40:22', 'Active'),
(4, 'dcs.ang.password@cvsu.edu.ph', '$2b$10$RcFagEuwDvdgKO/dAYVpo.lMTOjAZ5odhsf9GdYlkC.85XXOzAtiO', 'Educator', '2024-12-22 10:45:56', NULL, '2024-12-22 14:49:53', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`ContentID`),
  ADD KEY `UserID` (`CreatedBy`) USING BTREE,
  ADD KEY `CourseID` (`Course`) USING BTREE,
  ADD KEY `ProgramID` (`Program`) USING BTREE;
ALTER TABLE `content` ADD FULLTEXT KEY `idx_fulltext_searches` (`Title`,`Description`,`Tags`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`CourseID`),
  ADD KEY `idx_title` (`Title`) USING BTREE,
  ADD KEY `ProgramID` (`Program`) USING BTREE;

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`ProfileID`),
  ADD KEY `UserID` (`User`) USING BTREE,
  ADD KEY `ProgramID` (`Program`) USING BTREE;

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`ProgramID`),
  ADD UNIQUE KEY `Code` (`Code`),
  ADD UNIQUE KEY `Name` (`Name`),
  ADD KEY `idx_programcode` (`Code`) USING BTREE,
  ADD KEY `idx_programname` (`Name`) USING BTREE;

--
-- Indexes for table `searchhistory`
--
ALTER TABLE `searchhistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `UserID` (`SearchedBy`);
ALTER TABLE `searchhistory` ADD FULLTEXT KEY `idx_search_entry` (`Entry`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `idx_user_email` (`Email`),
  ADD KEY `idx_user_role` (`Role`) USING BTREE,
  ADD KEY `idx_user_status` (`Status`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `content`
--
ALTER TABLE `content`
  MODIFY `ContentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `CourseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `ProgramID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `searchhistory`
--
ALTER TABLE `searchhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `content`
--
ALTER TABLE `content`
  ADD CONSTRAINT `content_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `content_ibfk_2` FOREIGN KEY (`Program`) REFERENCES `program` (`ProgramID`),
  ADD CONSTRAINT `content_ibfk_3` FOREIGN KEY (`Course`) REFERENCES `course` (`CourseID`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`Program`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`Program`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `searchhistory`
--
ALTER TABLE `searchhistory`
  ADD CONSTRAINT `searchhistory_ibfk_1` FOREIGN KEY (`SearchedBy`) REFERENCES `user` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
