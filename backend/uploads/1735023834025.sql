-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2024 at 06:07 PM
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
-- Database: `cvsuenrollmentsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `AccountID` int(11) NOT NULL,
  `Name` text NOT NULL,
  `Email` varchar(250) NOT NULL,
  `Password` varchar(250) NOT NULL,
  `Role` enum('Student','Enrollment Officer','Society Officer','Adviser','DCS Head','School Head') NOT NULL,
  `ProfilePicture` varchar(250) DEFAULT 'uploads\\default-pfp.jpg',
  `Status` enum('Active','Terminated') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`AccountID`, `Name`, `Email`, `Password`, `Role`, `ProfilePicture`, `Status`) VALUES
(1, 'Enrollment Officer', 'enrollmentofficer@cvsu.edu.ph', 'admin', 'Enrollment Officer', 'uploads\\default-pfp.jpg', 'Active'),
(2, 'Society Officer', 'socofficer@cvsu.edu.ph', 'admin', 'Society Officer', 'uploads\\default-pfp.jpg', 'Active'),
(3, 'Student Account', 'student@gmail.com', 'student', 'Student', 'uploads\\default-pfp.jpg', 'Active'),
(4, 'Adviser Account', 'adviser@gmail.com', 'admin', 'Adviser', 'uploads\\default-pfp.jpg', 'Active'),
(5, 'DCS Head Account', 'dcshead@gmail.com', 'admin', 'DCS Head', 'uploads\\default-pfp.jpg', 'Active'),
(6, 'School Head Account', 'schoolhead@gmail.com', 'admin', 'School Head', 'uploads\\default-pfp.jpg', 'Terminated'),
(22, 'DCS ijujoqi', 'asjkldha@gmail.com', '123', 'DCS Head', 'uploads\\default-pfp.jpg', 'Active'),
(23, 'Society Officer', 'ldko@gmail.com', 'xRADQB8b', 'Society Officer', 'uploads\\default-pfp.jpg', 'Active'),
(25, 'Gerlyn Tan', 'tangr.stem.dccs@gmail.com', 'tan', 'Student', 'uploads\\default-pfp.jpg', 'Active'),
(26, 'Gerlyn Tan', 'bc.gerlyn.tan@cvsu.edu.ph', 'tan', 'Student', 'uploads\\1733972790018.png', 'Active'),
(27, 'Shiftee Shifting', 'shifteeeeeee@gmail.com', '123', 'Student', 'uploads\\default-pfp.jpg', 'Active'),
(28, 'Employee oiudfiouiof', 'asjhdkjsa@gmail.com', 'rfZOwI3u', 'DCS Head', 'uploads\\default-pfp.jpg', 'Active'),
(29, 'School Head', 'ksajdkj@gmail.com', '123', 'School Head', 'uploads\\default-pfp.jpg', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `admissionform`
--

CREATE TABLE `admissionform` (
  `AdmissionID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `IDPicture` varchar(250) DEFAULT NULL,
  `Branch` enum('CvSU - Bacoor') NOT NULL,
  `ApplyingFor` enum('1st Year 1st Sem','1st Year 2nd Sem','2nd Year 1st Sem','2nd Year 2nd Sem','3rd Year 1st Sem','3rd Year 2nd Sem','4th Year 1st Sem','4th Year 2nd Sem','Midyear') DEFAULT NULL,
  `ExamControlNo` int(20) NOT NULL,
  `LRN` int(20) DEFAULT NULL,
  `SHSStrand` varchar(250) DEFAULT NULL,
  `FinalAverage` double DEFAULT NULL,
  `FirstQuarterAve` double DEFAULT NULL,
  `SecondQuarterAve` double DEFAULT NULL,
  `ThirdQuarterAve` double DEFAULT NULL,
  `FourthQuarterAve` double DEFAULT NULL,
  `ZipCode` int(20) DEFAULT NULL,
  `Religion` varchar(250) DEFAULT NULL,
  `Nationality` varchar(250) DEFAULT NULL,
  `CivilStatus` enum('Single','In a Relationship','Married','Widowed','Divorced','Separated','Annulled') DEFAULT NULL,
  `PWD` enum('Yes','No') DEFAULT NULL,
  `PWDSpecification` varchar(250) DEFAULT NULL,
  `Indigenous` enum('Yes','No') DEFAULT NULL,
  `IndigenousSpecification` varchar(250) DEFAULT NULL,
  `FatherName` varchar(250) DEFAULT NULL,
  `FatherContactNo` varchar(20) DEFAULT NULL,
  `FatherOccupation` varchar(250) DEFAULT NULL,
  `MotherName` varchar(250) DEFAULT NULL,
  `MotherContactNo` varchar(20) DEFAULT NULL,
  `MotherOccupation` varchar(250) DEFAULT NULL,
  `GuardianName` varchar(250) DEFAULT NULL,
  `GuardianRelationship` varchar(250) DEFAULT NULL,
  `GuardianContactNo` varchar(20) DEFAULT NULL,
  `GuardianOccupation` varchar(250) DEFAULT NULL,
  `NoOfSiblings` int(20) DEFAULT NULL,
  `BirthOrder` enum('Eldest','Second','Middle','Youngest','Only Child') DEFAULT NULL,
  `MonthlyFamilyIncome` enum('below - 10,000','11,000 - 20,000','21,000 - 30,000','31,000 - 40,000','41,000 - 50,000','above 50,000') DEFAULT NULL,
  `ElemSchoolName` varchar(250) DEFAULT NULL,
  `ElemSchoolAddress` varchar(250) DEFAULT NULL,
  `ElemYearGraduated` year(4) DEFAULT NULL,
  `ElemSchoolType` enum('Public','Private') DEFAULT NULL,
  `HighSchoolName` varchar(250) DEFAULT NULL,
  `HighSchoolAddress` varchar(250) DEFAULT NULL,
  `HighSchoolYearGraduated` year(4) DEFAULT NULL,
  `HighSchoolType` enum('Public','Private') DEFAULT NULL,
  `SHSchoolName` varchar(250) DEFAULT NULL,
  `SHSchoolAddress` varchar(250) DEFAULT NULL,
  `SHYearGraduated` year(4) DEFAULT NULL,
  `SHSchoolType` enum('Public','Private') DEFAULT NULL,
  `VocationalSchoolName` varchar(250) DEFAULT NULL,
  `VocationalSchoolAddress` varchar(250) DEFAULT NULL,
  `VocationalYearGraduated` year(4) DEFAULT NULL,
  `VocationalSchoolType` enum('Public','Private') DEFAULT NULL,
  `TransfereeCollegeSchoolName` varchar(250) DEFAULT NULL,
  `TransfereeCollegeSchoolAddress` varchar(250) DEFAULT NULL,
  `TransfereeCollegeCourse` varchar(250) DEFAULT NULL,
  `TransfereeCollegeSchoolType` enum('Public','Private') DEFAULT NULL,
  `SecondCourserCollegeSchoolName` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeSchoolAddress` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeCourse` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeSchoolType` enum('Public','Private') DEFAULT NULL,
  `Medication` varchar(250) DEFAULT NULL,
  `MedicalHistory` varchar(250) DEFAULT NULL,
  `DateOfExamAndTime` datetime DEFAULT NULL,
  `AssessedBy` varchar(250) DEFAULT NULL,
  `SubmissionSchedule` date DEFAULT NULL,
  `AdmissionStatus` enum('Pending','Approved','Rejected','Submitted') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admissionform`
--

INSERT INTO `admissionform` (`AdmissionID`, `StudentID`, `EmployeeID`, `IDPicture`, `Branch`, `ApplyingFor`, `ExamControlNo`, `LRN`, `SHSStrand`, `FinalAverage`, `FirstQuarterAve`, `SecondQuarterAve`, `ThirdQuarterAve`, `FourthQuarterAve`, `ZipCode`, `Religion`, `Nationality`, `CivilStatus`, `PWD`, `PWDSpecification`, `Indigenous`, `IndigenousSpecification`, `FatherName`, `FatherContactNo`, `FatherOccupation`, `MotherName`, `MotherContactNo`, `MotherOccupation`, `GuardianName`, `GuardianRelationship`, `GuardianContactNo`, `GuardianOccupation`, `NoOfSiblings`, `BirthOrder`, `MonthlyFamilyIncome`, `ElemSchoolName`, `ElemSchoolAddress`, `ElemYearGraduated`, `ElemSchoolType`, `HighSchoolName`, `HighSchoolAddress`, `HighSchoolYearGraduated`, `HighSchoolType`, `SHSchoolName`, `SHSchoolAddress`, `SHYearGraduated`, `SHSchoolType`, `VocationalSchoolName`, `VocationalSchoolAddress`, `VocationalYearGraduated`, `VocationalSchoolType`, `TransfereeCollegeSchoolName`, `TransfereeCollegeSchoolAddress`, `TransfereeCollegeCourse`, `TransfereeCollegeSchoolType`, `SecondCourserCollegeSchoolName`, `SecondCourserCollegeSchoolAddress`, `SecondCourserCollegeCourse`, `SecondCourserCollegeSchoolType`, `Medication`, `MedicalHistory`, `DateOfExamAndTime`, `AssessedBy`, `SubmissionSchedule`, `AdmissionStatus`) VALUES
(1, 52, 98123, 'uploads\\1734154045423.png', 'CvSU - Bacoor', '1st Year 1st Sem', 6770, 13678, 'STEM', 90, 90, 90, 90, 0, 1111, 'Catholic', 'Filipino', 'Single', 'No', '', 'No', '', 'John A. Doe', '09213823', 'superman', 'Jane B. Doe', '09238238', 'superwoman', 'Jane B. Doe', 'tropa', '09391738713', 'superhero', 1, 'Eldest', 'above 50,000', 'elem', 'klqjlekqwj', '2000', 'Public', 'jhs', 'doon', '2001', 'Public', 'sjkhdjkhjkhe', 'lkjqwlejlqwe', '2001', 'Public', '', '', '0000', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', '', '2024-12-25 01:04:00', 'School Head', '2024-12-27', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `advising`
--

CREATE TABLE `advising` (
  `AdvisingID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `StudentCourseChecklistID` int(11) DEFAULT NULL,
  `AdvisingStatus` enum('Pending','Approved','Rejected','') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `AnnouncementID` int(11) NOT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `AnnouncementType` enum('General','Class Schedule') NOT NULL,
  `AnnouncementTitle` varchar(250) DEFAULT NULL,
  `Message` text DEFAULT NULL,
  `YearLevel` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') DEFAULT NULL,
  `Section` varchar(50) DEFAULT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `SubjectCode` varchar(50) DEFAULT NULL,
  `SubjectTitle` varchar(250) DEFAULT NULL,
  `InstructorName` varchar(250) DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `Room` varchar(50) DEFAULT NULL,
  `DatePosted` datetime NOT NULL DEFAULT current_timestamp(),
  `DateModified` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `DateRemoved` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`AnnouncementID`, `SocietyOfficerID`, `AnnouncementType`, `AnnouncementTitle`, `Message`, `YearLevel`, `Section`, `Semester`, `SubjectCode`, `SubjectTitle`, `InstructorName`, `StartTime`, `EndTime`, `Day`, `Room`, `DatePosted`, `DateModified`, `DateRemoved`) VALUES
(1, 1, 'General', NULL, 'A bad news for y\'all. Sad to day, the sections are shuffled for this academic year. Kawawa naman kayo. :P', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-30 01:33:54', '2024-11-30 04:02:17', NULL),
(2, 1, 'General', NULL, 'Huwag po maghintayan sa pag-enroll. Late enrollees will have a penalty. Thank you!', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-30 01:38:31', '2024-12-17 20:12:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coursechecklist`
--

CREATE TABLE `coursechecklist` (
  `CourseChecklistID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `YearLevel` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') NOT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `CourseCode` varchar(50) NOT NULL,
  `CourseTitle` varchar(250) NOT NULL,
  `CreditUnitLec` int(11) NOT NULL,
  `CreditUnitLab` int(11) NOT NULL,
  `ContactHrsLec` int(11) NOT NULL,
  `ContactHrsLab` int(11) NOT NULL,
  `PreRequisite` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coursechecklist`
--

INSERT INTO `coursechecklist` (`CourseChecklistID`, `ProgramID`, `YearLevel`, `Semester`, `CourseCode`, `CourseTitle`, `CreditUnitLec`, `CreditUnitLab`, `ContactHrsLec`, `ContactHrsLab`, `PreRequisite`) VALUES
(1, 1, 'First Year', 'First Semester', 'GNED 02', 'Ethics', 3, 0, 3, 0, NULL),
(2, 1, 'First Year', 'First Semester', 'GNED 05', 'Purposive Communication', 3, 0, 3, 0, NULL),
(3, 1, 'First Year', 'First Semester', 'GNED 11', 'Kontekstwalisadong Komunikasyon sa Filipino', 3, 0, 3, 0, NULL),
(4, 1, 'First Year', 'First Semester', 'COSC 50', 'Discrete Structures I', 3, 0, 3, 0, NULL),
(5, 1, 'First Year', 'First Semester', 'DCIT 21', 'Introduction to Computing', 2, 1, 2, 6, NULL),
(6, 1, 'First Year', 'First Semester', 'DCIT 22', 'Computer Programming I', 1, 2, 1, 3, NULL),
(7, 1, 'First Year', 'First Semester', 'FITT 1', 'Movement Enhancement', 2, 0, 3, 0, NULL),
(8, 1, 'First Year', 'First Semester', 'NSTP 1', 'National Service Training Program 1', 3, 0, 2, 0, NULL),
(9, 1, 'First Year', 'First Semester', 'CvSU 101', 'Institutional Orientation', 0, 0, 1, 0, NULL),
(10, 1, 'First Year', 'Second Semester', 'GNED 01', 'Art Appreciation', 3, 0, 3, 0, NULL),
(11, 1, 'First Year', 'Second Semester', 'GNED 03', 'Mathematics in the Modern World', 3, 0, 3, 0, NULL),
(12, 1, 'First Year', 'Second Semester', 'GNED 06', 'Science, Technology and Society', 3, 0, 3, 0, NULL),
(13, 1, 'First Year', 'Second Semester', 'GNED 12', 'Dalumat Ng/Sa Filipino', 3, 0, 3, 0, 'GNED 11'),
(14, 1, 'First Year', 'Second Semester', 'DCIT 23', 'Computer Programming II', 1, 2, 1, 6, 'DCIT 22'),
(15, 1, 'First Year', 'Second Semester', 'ITEC 50', 'Web Systems and Technologies', 2, 1, 2, 3, 'DCIT 21'),
(16, 1, 'First Year', 'Second Semester', 'FITT 2', 'Fitness Exercises', 2, 0, 2, 0, 'FITT 1'),
(17, 1, 'First Year', 'Second Semester', 'NSTP 2', 'National Service Training Program 2', 3, 0, 3, 0, 'NSTP 1'),
(18, 1, 'Second Year', 'First Semester', 'GNED 04', 'Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas', 3, 0, 3, 0, NULL),
(19, 1, 'Second Year', 'First Semester', 'MATH 1', 'Analytic Geometry', 3, 0, 3, 0, 'GNED 03'),
(20, 1, 'Second Year', 'First Semester', 'COSC 55', 'Discrete Structures II', 3, 0, 3, 0, 'COSC 50'),
(21, 1, 'Second Year', 'First Semester', 'COSC 60', 'Digital Logic Design', 2, 1, 2, 3, 'COSC 50, DCIT 23'),
(22, 1, 'Second Year', 'First Semester', 'DCIT 50', 'Object Oriented Programming', 2, 1, 2, 3, 'DCIT 23'),
(23, 1, 'Second Year', 'First Semester', 'DCIT 24', 'Information Management', 2, 1, 2, 3, 'DCIT 23'),
(24, 1, 'Second Year', 'First Semester', 'INSY 50', 'Fundamentals of Information Systems', 3, 0, 3, 0, 'DCIT 21'),
(25, 1, 'Second Year', 'First Semester', 'FITT 3', 'Physical Activities towards Health and Fitness 1', 2, 0, 2, 0, 'FITT 1'),
(26, 1, 'Second Year', 'Second Semester', 'GNED 08', 'Understanding the Self', 3, 0, 3, 0, NULL),
(27, 1, 'Second Year', 'Second Semester', 'GNED 14', 'Panitikang Panlipunan', 3, 0, 3, 0, NULL),
(28, 1, 'Second Year', 'Second Semester', 'MATH 2', 'Calculus', 3, 0, 3, 0, 'MATH 1'),
(29, 1, 'Second Year', 'Second Semester', 'COSC 65', 'Architecture and Organization', 2, 1, 2, 3, 'COSC 60'),
(30, 1, 'Second Year', 'Second Semester', 'COSC 70', 'Software Engineering I', 3, 0, 3, 0, 'DCIT 50, DCIT 24'),
(31, 1, 'Second Year', 'Second Semester', 'DCIT 25', 'Data Structures and Algorithms', 2, 1, 2, 3, 'DCIT 23'),
(32, 1, 'Second Year', 'Second Semester', 'DCIT 55', 'Advanced Database Management System', 2, 1, 2, 3, 'DCIT 24'),
(33, 1, 'Second Year', 'Second Semester', 'FITT 4', 'Physical Activities towards Health and Fitness 2', 2, 0, 2, 0, 'FITT 1'),
(34, 1, 'Third Year', 'First Semester', 'MATH 3', 'Linear Algebra', 3, 0, 3, 0, 'MATH 2'),
(35, 1, 'Third Year', 'First Semester', 'COSC 75', 'Software Engineering II', 2, 1, 2, 3, 'COSC 70'),
(36, 1, 'Third Year', 'First Semester', 'COSC 80', 'Operating Systems', 2, 1, 2, 3, 'DCIT 25'),
(37, 1, 'Third Year', 'First Semester', 'COSC 85', 'Networks and Communication', 2, 1, 2, 3, 'ITEC 50'),
(38, 1, 'Third Year', 'First Semester', 'COSC 101', 'CS Elective 1 (Computer Graphics and Visual Computing)', 2, 1, 2, 3, 'DCIT 23'),
(39, 1, 'Third Year', 'First Semester', 'DCIT 26', 'Applications Development and Emerging Technologies', 2, 1, 2, 3, 'ITEC 50'),
(40, 1, 'Third Year', 'First Semester', 'DCIT 65', 'Social and Professional Issues', 3, 0, 3, 0, NULL),
(41, 1, 'Third Year', 'Second Semester', 'GNED 09', 'Life and Works of Rizal', 3, 0, 3, 0, 'GNED 04'),
(42, 1, 'Third Year', 'Second Semester', 'MATH 4', 'Experimental Statistics', 2, 1, 2, 3, 'MATH 2'),
(43, 1, 'Third Year', 'Second Semester', 'COSC 90', 'Design and Analysis of Algorithm', 3, 0, 3, 0, 'DCIT 25'),
(44, 1, 'Third Year', 'Second Semester', 'COSC 95', 'Programming Languages', 3, 0, 3, 0, 'DCIT 25'),
(45, 1, 'Third Year', 'Second Semester', 'COSC 106', 'CS Elective 2 (Introduction to Game Development)', 2, 1, 2, 3, 'MATH 3, COSC 101'),
(46, 1, 'Third Year', 'Second Semester', 'DCIT 60', 'Methods of Research', 3, 0, 3, 0, '3rd year standing'),
(47, 1, 'Third Year', 'Second Semester', 'ITEC 85', 'Information Assurance and Security', 3, 0, 3, 0, 'DCIT 24'),
(48, 1, 'Mid-Year', NULL, 'COSC 199', 'Practicum (240 hours)', 3, 0, 3, 0, 'Incoming 4th year'),
(49, 1, 'Fourth Year', 'First Semester', 'ITEC 80', 'Human Computer Interaction', 1, 0, 3, 0, 'ITEC 85'),
(50, 1, 'Fourth Year', 'First Semester', 'COSC 100', 'Automata Theory and Formal Languages', 3, 0, 3, 0, 'COSC 90'),
(51, 1, 'Fourth Year', 'First Semester', 'COSC 105', 'Intelligent Systems', 2, 1, 2, 3, 'MATH 4, COSC 55, DCIT 50'),
(52, 1, 'Fourth Year', 'First Semester', 'COSC 111', 'CS Elective 3 (Internet of Things)', 2, 1, 2, 3, 'COSC 60'),
(53, 1, 'Fourth Year', 'First Semester', 'COSC 200A', 'Undergraduate Thesis I', 3, 0, 1, 0, '4th year standing'),
(54, 1, 'Fourth Year', 'Second Semester', 'GNED 07', 'The Contemporary World', 3, 0, 3, 0, NULL),
(55, 1, 'Fourth Year', 'Second Semester', 'GNED 10', 'Gender and Society', 3, 0, 3, 0, NULL),
(56, 1, 'Fourth Year', 'Second Semester', 'COSC 110', 'Numerical and Symbolic Computation', 2, 1, 2, 3, 'COSC 60'),
(57, 1, 'Fourth Year', 'Second Semester', 'COSC 200B', 'Undergraduate Thesis II', 3, 0, 1, 0, 'COSC 200A'),
(58, 2, 'First Year', 'First Semester', 'GNED 02', 'Ethics', 3, 0, 3, 0, NULL),
(59, 2, 'First Year', 'First Semester', 'GNED 05', 'Purposive Communication', 3, 0, 3, 0, NULL),
(60, 2, 'First Year', 'First Semester', 'GNED 11', 'Kontekstwalisadong Komunikasyon sa Filpino', 3, 0, 3, 0, NULL),
(61, 2, 'First Year', 'First Semester', 'COSC 50', 'Discrete Structure', 3, 0, 3, 0, NULL),
(62, 2, 'First Year', 'First Semester', 'DCIT 21', 'Introduction to Computing', 2, 1, 2, 3, NULL),
(63, 2, 'First Year', 'First Semester', 'DCIT 22', 'Computer Programming 1', 1, 2, 1, 6, NULL),
(64, 2, 'First Year', 'First Semester', 'FITT 1', 'Movement Enhancement', 2, 0, 2, 0, NULL),
(65, 2, 'First Year', 'First Semester', 'NSTP 1', 'National Service Training Program 1', 3, 0, 3, 0, NULL),
(66, 2, 'First Year', 'First Semester', 'CvSU 101', 'Institutional Orientation', 0, 0, 1, 0, NULL),
(67, 2, 'First Year', 'Second Semester', 'GNED 01', 'Art Appreciation', 3, 0, 3, 0, NULL),
(68, 2, 'First Year', 'Second Semester', 'GNED 06', 'Science, Technology and Society', 3, 0, 3, 0, NULL),
(69, 2, 'First Year', 'Second Semester', 'GNED 12', 'Dalumat Ng/Sa Filipino', 3, 0, 3, 0, 'GNED 11'),
(70, 2, 'First Year', 'Second Semester', 'GNED 03', 'Mathematics in the Modern World', 3, 0, 3, 0, NULL),
(71, 2, 'First Year', 'Second Semester', 'DCIT 23', 'Computer Programming 2', 1, 2, 1, 6, 'DCIT 22'),
(72, 2, 'First Year', 'Second Semester', 'ITEC 50', 'Web System and Technologies 1', 2, 1, 2, 3, 'DCIT 21'),
(73, 2, 'First Year', 'Second Semester', 'FITT 2', 'Fitness Exercise', 2, 0, 2, 0, 'FITT 1'),
(74, 2, 'First Year', 'Second Semester', 'NSTP 2', 'National Service Training Program 2', 3, 0, 3, 0, 'NSTP 1'),
(75, 2, 'Second Year', 'First Semester', 'GNED 04', 'Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas', 3, 0, 3, 0, NULL),
(76, 2, 'Second Year', 'First Semester', 'GNED 07', 'The Contemporary World', 3, 0, 3, 0, NULL),
(77, 2, 'Second Year', 'First Semester', 'GNED 10', 'Gender and Society', 3, 0, 3, 0, NULL),
(78, 2, 'Second Year', 'First Semester', 'GNED 14', 'Panitikang Panlipunan', 3, 0, 3, 0, 'GNED 11'),
(79, 2, 'Second Year', 'First Semester', 'ITEC 55', 'Platform Technologies', 2, 1, 2, 3, 'DCIT 23'),
(80, 2, 'Second Year', 'First Semester', 'DCIT 24', 'Information Management', 2, 1, 2, 3, 'DCIT 23'),
(81, 2, 'Second Year', 'First Semester', 'DCIT 50', 'Object Oriented Programming', 2, 1, 2, 3, 'DCIT 23'),
(82, 2, 'Second Year', 'First Semester', 'FITT 3', 'Physical Activities towards Health and Fitness 1', 2, 0, 2, 0, NULL),
(83, 2, 'Second Year', 'Second Semester', 'GNED 08', 'Understanding the Self', 3, 0, 3, 0, NULL),
(84, 2, 'Second Year', 'Second Semester', 'DCIT 25', 'Data Structures and Algorithms', 2, 1, 2, 3, 'DCIT 50'),
(85, 2, 'Second Year', 'Second Semester', 'ITEC 60', 'Integrated Programming and Technologies 1', 2, 1, 2, 3, 'DCIT 50, ITEC 55'),
(86, 2, 'Second Year', 'Second Semester', 'ITEC 65', 'Open Source Technology', 2, 1, 2, 3, '2nd year standing'),
(87, 2, 'Second Year', 'Second Semester', 'DCIT 55', 'Advanced Database System', 2, 1, 2, 3, 'DCIT 24'),
(88, 2, 'Second Year', 'Second Semester', 'ITEC 70', 'Multimedia Systems', 2, 1, 2, 3, '2nd year standing'),
(89, 2, 'Second Year', 'Second Semester', 'FITT 4', 'Physical Activities towards Health and Fitness 2', 2, 0, 2, 0, NULL),
(90, 2, 'Mid-Year', NULL, 'STAT 2', 'Applied Statistics', 3, 0, 3, 0, '2nd year standing'),
(91, 2, 'Mid-Year', NULL, 'ITEC 75', 'System Integration and Architecture 1', 2, 1, 2, 3, 'ITEC 60'),
(92, 2, 'Third Year', 'First Semester', 'ITEC 80', 'Introduction to Human Computer Interaction', 2, 1, 2, 3, '3rd year standing'),
(93, 2, 'Third Year', 'First Semester', 'ITEC 85', 'Information Assurance and Security 1', 2, 1, 2, 3, 'ITEC 75'),
(94, 2, 'Third Year', 'First Semester', 'ITEC 90', 'Network Fundamentals', 2, 1, 2, 3, 'ITEC 55'),
(95, 2, 'Third Year', 'First Semester', 'INSY 55', 'System Analysis and Design', 2, 1, 2, 3, '3rd year standing'),
(96, 2, 'Third Year', 'First Semester', 'DCIT 26', 'Application Development and Emerging Technologies', 2, 1, 2, 3, 'DCIT 55'),
(97, 2, 'Third Year', 'First Semester', 'DCIT 60', 'Methods of Research', 3, 0, 3, 0, '3rd year standing'),
(98, 2, 'Third Year', 'Second Semester', 'GNED 09', 'Rizal: Life, Works, and Writings', 3, 0, 3, 0, 'GNED 04'),
(99, 2, 'Third Year', 'Second Semester', 'ITEC 95', 'Quantitative Methods (Modeling & Simulation)', 3, 0, 3, 0, 'COSC 50, STAT 2'),
(100, 2, 'Third Year', 'Second Semester', 'ITEC 101', 'IT ELECTIVE 1 (Human Computer Interaction 2)', 2, 1, 2, 3, 'ITEC 80'),
(101, 2, 'Third Year', 'Second Semester', 'ITEC 106', 'IT ELECTIVE 2 (Web System and Technologies 2)', 2, 1, 2, 3, 'ITEC 50'),
(102, 2, 'Third Year', 'Second Semester', 'ITEC 100', 'Information Assurance and Security 2', 2, 1, 2, 3, 'ITEC 85'),
(103, 2, 'Third Year', 'Second Semester', 'ITEC 105', 'Network Management', 2, 1, 2, 3, 'ITEC 90'),
(104, 2, 'Third Year', 'Second Semester', 'ITEC 200A', 'Capstone Project and Research 1', 3, 0, 3, 0, 'DCIT 60, DCIT 26, ITEC 85, 70% total units taken'),
(105, 2, 'Fourth Year', 'First Semester', 'DCIT 65', 'Social and Professional Issues', 3, 0, 3, 0, '3rd year standing'),
(106, 2, 'Fourth Year', 'First Semester', 'ITEC 111', 'IT ELECTIVE 3 (Integrated Programming and Technologies 2)', 2, 1, 2, 3, 'ITEC 60'),
(107, 2, 'Fourth Year', 'First Semester', 'ITEC 116', 'IT ELECTIVE 4 (System Integration and Architecture 2)', 2, 1, 2, 3, 'ITEC 75'),
(108, 2, 'Fourth Year', 'First Semester', 'ITEC 110', 'Systems Administration and Maintenance', 2, 1, 2, 3, 'ITEC 100'),
(109, 2, 'Fourth Year', 'First Semester', 'ITEC 200B', 'Capstone Project and Research 2', 3, 0, 3, 0, 'ITEC 200A'),
(110, 2, 'Fourth Year', 'Second Semester', 'ITEC 199', 'Practicum (minimum 486 hours)', 6, 0, 0, 0, 'DCIT 26, ITEC 85, 70% total units taken');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmployeeID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `DOB` date DEFAULT NULL,
  `CivilStatus` enum('Single','In a Relationship','Married','Widowed','Divorced','Separated','Annulled') DEFAULT NULL,
  `Gender` enum('F','M') DEFAULT NULL,
  `Address` varchar(250) DEFAULT NULL,
  `EmpJobRole` enum('Adviser','DCS Head','School Head','Enrollment Officer') NOT NULL,
  `EmpStatus` enum('Employed','Resigned') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`EmployeeID`, `ProgramID`, `Firstname`, `Middlename`, `Lastname`, `Email`, `PhoneNo`, `DOB`, `CivilStatus`, `Gender`, `Address`, `EmpJobRole`, `EmpStatus`, `RegStatus`) VALUES
(0, 1, 'Employee', 'gjhihquh', 'oiudfiouiof', 'asjhdkjsa@gmail.com', '0928772435', '0000-00-00', 'Single', NULL, '', 'DCS Head', 'Employed', 'Accepted'),
(1, NULL, 'Admin', NULL, 'Enrollment Officer', 'admin@gmail.com', '09123456781', '1996-01-16', 'Single', '', 'Cavite', 'Enrollment Officer', 'Employed', 'Accepted'),
(2322, 1, 'Adviser', 'lkjdsflkjlkd', 'kjkfjdjf', 'ffaiuh@gmail.com', '095897923875', '0000-00-00', 'Single', NULL, '', 'Adviser', 'Employed', 'Accepted'),
(8888, 1, 'Adviser', 'lkasjdou', 'iodofiiof', 'lkadjwjq@gmail.com', '092786487214', '0000-00-00', 'Single', NULL, '', 'Adviser', 'Employed', 'Pending'),
(11111, NULL, 'Enrollment', 'Officer', 'kjklafjajd', 'fkjhafh@gmail.com', '0948978941', '0000-00-00', 'Single', '', '', 'Enrollment Officer', 'Employed', 'Pending'),
(98123, NULL, 'School', '', 'Head', 'ksajdkj@gmail.com', '0948291712', '2024-12-03', NULL, 'F', 'qwertyuiop street', 'School Head', 'Employed', 'Accepted'),
(99999, 2, 'DCS', 'Head', 'ijujoqi', 'asjkldha@gmail.com', '09817424', '2024-07-17', 'Single', 'M', 'Diyan', 'DCS Head', 'Employed', 'Accepted');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `PreEnrollmentID` int(11) DEFAULT NULL,
  `EnrollmentStatus` enum('Pending','Enrolled','Not Enrolled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `noticeofadmission`
--

CREATE TABLE `noticeofadmission` (
  `NoticeOfAdmissionID` int(11) NOT NULL,
  `SlotConfirmationID` int(11) DEFAULT NULL,
  `IsDownloaded` tinyint(1) NOT NULL DEFAULT 0,
  `DateGenerated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preenrollment`
--

CREATE TABLE `preenrollment` (
  `PreEnrollmentID` int(11) NOT NULL,
  `StudentCourseChecklistID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `YearSection` varchar(20) DEFAULT NULL,
  `PreEnrollmentStatus` enum('Pending','Approved','Not Approved') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `ProgramID` int(11) NOT NULL,
  `ProgramCode` enum('BSCS','BSIT') NOT NULL,
  `ProgramName` enum('Bachelor of Science in Computer Science','Bachelor of Science in Information Technology') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`ProgramID`, `ProgramCode`, `ProgramName`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science'),
(2, 'BSIT', 'Bachelor of Science in Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `requirements`
--

CREATE TABLE `requirements` (
  `RequirementsID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `SocFeePayment` enum('Pending','Paid','Unpaid') NOT NULL DEFAULT 'Pending',
  `COG` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shiftingform`
--

CREATE TABLE `shiftingform` (
  `ShiftingID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `AcadYear` varchar(50) NOT NULL,
  `Reasons` text NOT NULL,
  `Date` date DEFAULT NULL,
  `PrevProgramAdviser` varchar(250) NOT NULL,
  `SchoolName` enum('CvSU - Bacoor') NOT NULL,
  `SubmissionSchedule` date DEFAULT NULL,
  `ShiftingStatus` enum('Pending','Approved','Rejected','Submitted') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shiftingform`
--

INSERT INTO `shiftingform` (`ShiftingID`, `StudentID`, `EmployeeID`, `AcadYear`, `Reasons`, `Date`, `PrevProgramAdviser`, `SchoolName`, `SubmissionSchedule`, `ShiftingStatus`) VALUES
(3, 222222, 99999, '2023-2024', '1. Ayoko na suko na ang eabab na ito\n2. Ayaw na\n3. Suko na', '2024-12-19', 'Ms. Teacher', 'CvSU - Bacoor', '2024-12-27', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `slotconfirmation`
--

CREATE TABLE `slotconfirmation` (
  `SlotConfirmationID` int(11) NOT NULL,
  `AdmissionID` int(11) DEFAULT NULL,
  `IsSlotConfirmed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `societyofficer`
--

CREATE TABLE `societyofficer` (
  `SocietyOfficerID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `DOB` date DEFAULT NULL,
  `Gender` enum('F','M') DEFAULT NULL,
  `Address` varchar(250) DEFAULT NULL,
  `Position` enum('President','Vice President','Secretary','Assistant Secretary','Treasurer','Assistant Treasurer','Business Manager','Auditor','P.R.O.','GAD Representative','1st Year Chairperson','2nd Year Chairperson','3rd Year Chairperson','4th Year Chairperson','1st Year Senator','2nd Year Senator','3rd Year Senator','4th Year Senator','Assistant P.R.O.') NOT NULL,
  `OfficerStatus` enum('Elected','Resigned') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `societyofficer`
--

INSERT INTO `societyofficer` (`SocietyOfficerID`, `ProgramID`, `Firstname`, `Middlename`, `Lastname`, `Email`, `PhoneNo`, `DOB`, `Gender`, `Address`, `Position`, `OfficerStatus`, `RegStatus`) VALUES
(1, 2, 'Society', 'salkdjakdj', 'Officer', 'ldko@gmail.com', '09148739814', '2024-12-04', 'M', 'doon', '3rd Year Senator', 'Elected', 'Accepted'),
(2, 1, 'sadasd', 'sadasd', 'asdasd', 'kas@gmail.com', '0921387213', NULL, NULL, NULL, 'Assistant P.R.O.', 'Elected', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `StudentID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `CvSUStudentID` int(20) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `Gender` enum('F','M') DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `PhoneNo` varchar(20) DEFAULT NULL,
  `Address` varchar(250) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `StudentType` enum('Regular','Irregular','Transferee','Freshman','Shiftee') NOT NULL,
  `Year` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') DEFAULT NULL,
  `Section` varchar(250) DEFAULT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `PrevProgram` varchar(250) DEFAULT NULL,
  `LastSchoolAttended` varchar(250) DEFAULT NULL,
  `StdStatus` enum('Active','Inactive','Dropped','Graduated','Suspended','Withdrawn','On Leave','Alumni','Transfer','Prospective') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`StudentID`, `ProgramID`, `CvSUStudentID`, `Firstname`, `Middlename`, `Lastname`, `Email`, `Gender`, `Age`, `PhoneNo`, `Address`, `DOB`, `StudentType`, `Year`, `Section`, `Semester`, `PrevProgram`, `LastSchoolAttended`, `StdStatus`, `RegStatus`) VALUES
(52, 1, NULL, 'Gerlyn', 'Rama', 'Tan', 'tangr.stem.dccs@gmail.com', 'F', 20, '098723897213', 'Sa tabi lang', '2024-09-27', 'Freshman', NULL, NULL, NULL, NULL, 'dccs', 'Active', 'Accepted'),
(53, 1, 0, '28382328372837283728732', '2328328328328', '329389283923983', '3283832392@gmail.com', NULL, NULL, '2njnfffnfndbfdnfn', NULL, NULL, 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Rejected'),
(54, 1, 202211645, 'Rosemarie', 'Adan', 'Abelon', 'bc.rosemarie.abelon@cvsu.edu.ph', NULL, NULL, NULL, NULL, NULL, 'Irregular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(62, 1, 202211701, 'Neil Yvan', 'Sandoval', 'Caliwan', 'bc.neilyvan.caliwan@cvsu.edu.ph\r\n', NULL, NULL, NULL, NULL, NULL, 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(63, 1, 202211734, 'Jessica', 'Hernandez', 'Dimailig', 'bc.jessica.dimailig@cvsu.edu.ph\r\n', NULL, NULL, NULL, NULL, NULL, 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(64, 1, 202211880, 'Jennylle', 'Cebrian', 'Adao', 'bc.jennyllefate.adao@cvsu.edu.ph\r\n', NULL, NULL, NULL, NULL, NULL, 'Irregular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(65, 1, 202211769, 'Anne Aubrey', 'Pagaduan', 'Gripon', 'bc.anneaubrey.gripon@cvsu.edu.ph\r\n', NULL, NULL, NULL, NULL, NULL, 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(66, 1, 202211860, 'Gerlyn', 'Rama', 'Tan', 'bc.gerlyn.tan@cvsu.edu.ph', '', 21, '09910328158', 'diyan lang', '2003-09-07', 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Accepted'),
(67, 1, 202211874, 'Donna Pauline', 'Forbile', 'Virtudez', 'bc.donnapauline.virtudez@cvsu.edu.ph\r\n', NULL, NULL, '09271503286', NULL, NULL, 'Regular', NULL, NULL, NULL, NULL, NULL, 'Active', 'Pending'),
(69, 2, 222222, 'Shiftee', 'Shift', 'Shifting', 'shifteeeeeee@gmail.com', 'M', NULL, '0923862314', NULL, '2003-06-18', 'Shiftee', 'Second Year', NULL, 'First Semester', 'Bachelor of Science in Business Management', NULL, 'Active', 'Accepted');

-- --------------------------------------------------------

--
-- Table structure for table `studentcoursechecklist`
--

CREATE TABLE `studentcoursechecklist` (
  `StudentCourseChecklistID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `StartYear` year(4) NOT NULL,
  `EndYear` year(4) NOT NULL,
  `FinalGrade` double NOT NULL,
  `InstructorName` varchar(250) NOT NULL,
  `AdviserName` varchar(250) NOT NULL,
  `StdChecklistStatus` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjectmodificationform`
--

CREATE TABLE `subjectmodificationform` (
  `SubjectModificationID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `Date` date DEFAULT current_timestamp(),
  `AcadYear` varchar(50) DEFAULT NULL,
  `Reasons` text DEFAULT NULL,
  `FromTime` time DEFAULT NULL,
  `FromDay` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `FromYearSection` varchar(20) DEFAULT NULL,
  `FromInstructorName` varchar(250) DEFAULT NULL,
  `ToTime` time DEFAULT NULL,
  `ToDay` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `ToYearSection` varchar(20) DEFAULT NULL,
  `ToInstructorName` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `admissionform`
--
ALTER TABLE `admissionform`
  ADD PRIMARY KEY (`AdmissionID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `advising`
--
ALTER TABLE `advising`
  ADD PRIMARY KEY (`AdvisingID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `StudentCourseChecklistID` (`StudentCourseChecklistID`);

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`AnnouncementID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`);

--
-- Indexes for table `coursechecklist`
--
ALTER TABLE `coursechecklist`
  ADD PRIMARY KEY (`CourseChecklistID`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `PhoneNo` (`PhoneNo`),
  ADD KEY `ProgramID_FK` (`ProgramID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `PreEnrollmentID` (`PreEnrollmentID`);

--
-- Indexes for table `noticeofadmission`
--
ALTER TABLE `noticeofadmission`
  ADD PRIMARY KEY (`NoticeOfAdmissionID`),
  ADD KEY `SlotConfirmationID` (`SlotConfirmationID`);

--
-- Indexes for table `preenrollment`
--
ALTER TABLE `preenrollment`
  ADD PRIMARY KEY (`PreEnrollmentID`),
  ADD KEY `StudentCourseChecklistID` (`StudentCourseChecklistID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`ProgramID`),
  ADD UNIQUE KEY `ProgramCode` (`ProgramCode`),
  ADD UNIQUE KEY `ProgramName` (`ProgramName`);

--
-- Indexes for table `requirements`
--
ALTER TABLE `requirements`
  ADD PRIMARY KEY (`RequirementsID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`);

--
-- Indexes for table `shiftingform`
--
ALTER TABLE `shiftingform`
  ADD PRIMARY KEY (`ShiftingID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `slotconfirmation`
--
ALTER TABLE `slotconfirmation`
  ADD PRIMARY KEY (`SlotConfirmationID`),
  ADD KEY `AdmissionID` (`AdmissionID`);

--
-- Indexes for table `societyofficer`
--
ALTER TABLE `societyofficer`
  ADD PRIMARY KEY (`SocietyOfficerID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `PhoneNo` (`PhoneNo`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `CvSUStudentID` (`CvSUStudentID`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `studentcoursechecklist`
--
ALTER TABLE `studentcoursechecklist`
  ADD PRIMARY KEY (`StudentCourseChecklistID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `subjectmodificationform`
--
ALTER TABLE `subjectmodificationform`
  ADD PRIMARY KEY (`SubjectModificationID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `AccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `admissionform`
--
ALTER TABLE `admissionform`
  MODIFY `AdmissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `advising`
--
ALTER TABLE `advising`
  MODIFY `AdvisingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coursechecklist`
--
ALTER TABLE `coursechecklist`
  MODIFY `CourseChecklistID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `noticeofadmission`
--
ALTER TABLE `noticeofadmission`
  MODIFY `NoticeOfAdmissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `preenrollment`
--
ALTER TABLE `preenrollment`
  MODIFY `PreEnrollmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `ProgramID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `requirements`
--
ALTER TABLE `requirements`
  MODIFY `RequirementsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shiftingform`
--
ALTER TABLE `shiftingform`
  MODIFY `ShiftingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `slotconfirmation`
--
ALTER TABLE `slotconfirmation`
  MODIFY `SlotConfirmationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `societyofficer`
--
ALTER TABLE `societyofficer`
  MODIFY `SocietyOfficerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `StudentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `studentcoursechecklist`
--
ALTER TABLE `studentcoursechecklist`
  MODIFY `StudentCourseChecklistID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjectmodificationform`
--
ALTER TABLE `subjectmodificationform`
  MODIFY `SubjectModificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admissionform`
--
ALTER TABLE `admissionform`
  ADD CONSTRAINT `admissionform_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `admissionform_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `advising`
--
ALTER TABLE `advising`
  ADD CONSTRAINT `advising_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  ADD CONSTRAINT `advising_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `advising_ibfk_3` FOREIGN KEY (`StudentCourseChecklistID`) REFERENCES `studentcoursechecklist` (`StudentCourseChecklistID`);

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`);

--
-- Constraints for table `coursechecklist`
--
ALTER TABLE `coursechecklist`
  ADD CONSTRAINT `coursechecklist_ibfk_1` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `ProgramID_FK` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`PreEnrollmentID`) REFERENCES `preenrollment` (`PreEnrollmentID`);

--
-- Constraints for table `noticeofadmission`
--
ALTER TABLE `noticeofadmission`
  ADD CONSTRAINT `noticeofadmission_ibfk_1` FOREIGN KEY (`SlotConfirmationID`) REFERENCES `slotconfirmation` (`SlotConfirmationID`);

--
-- Constraints for table `preenrollment`
--
ALTER TABLE `preenrollment`
  ADD CONSTRAINT `preenrollment_ibfk_1` FOREIGN KEY (`StudentCourseChecklistID`) REFERENCES `studentcoursechecklist` (`StudentCourseChecklistID`),
  ADD CONSTRAINT `preenrollment_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `preenrollment_ibfk_3` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `requirements`
--
ALTER TABLE `requirements`
  ADD CONSTRAINT `requirements_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `requirements_ibfk_2` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`);

--
-- Constraints for table `shiftingform`
--
ALTER TABLE `shiftingform`
  ADD CONSTRAINT `shiftingform_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`CvSUStudentID`),
  ADD CONSTRAINT `shiftingform_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `slotconfirmation`
--
ALTER TABLE `slotconfirmation`
  ADD CONSTRAINT `slotconfirmation_ibfk_1` FOREIGN KEY (`AdmissionID`) REFERENCES `admissionform` (`AdmissionID`);

--
-- Constraints for table `societyofficer`
--
ALTER TABLE `societyofficer`
  ADD CONSTRAINT `societyofficer_ibfk_1` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `studentcoursechecklist`
--
ALTER TABLE `studentcoursechecklist`
  ADD CONSTRAINT `studentcoursechecklist_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `studentcoursechecklist_ibfk_3` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`),
  ADD CONSTRAINT `studentcoursechecklist_ibfk_4` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`);

--
-- Constraints for table `subjectmodificationform`
--
ALTER TABLE `subjectmodificationform`
  ADD CONSTRAINT `subjectmodificationform_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `subjectmodificationform_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
