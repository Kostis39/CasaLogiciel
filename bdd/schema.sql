-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb:3306
-- Generation Time: Feb 02, 2026 at 03:36 PM
-- Server version: 12.1.2-MariaDB-ubu2404
-- PHP Version: 8.3.28

CREATE DATABASE IF NOT EXISTS `casabdd`;
USE `casabdd`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `casabdd`
--

-- --------------------------------------------------------

--
-- Table structure for table `Abonnement`
--

CREATE TABLE `Abonnement` (
  `IdAbo` int(11) NOT NULL,
  `DureeAbo` int(11) NOT NULL,
  `TypeAbo` text NOT NULL,
  `PrixAbo` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Club`
--

CREATE TABLE `Club` (
  `IdClub` int(11) NOT NULL,
  `NomClub` text DEFAULT NULL,
  `AdresseClub` text DEFAULT NULL,
  `CodePostClub` text DEFAULT NULL,
  `VilleClub` text DEFAULT NULL,
  `TelClub` text DEFAULT NULL,
  `EmailClub` text DEFAULT NULL,
  `SiteInternet` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Grimpeur`
--

CREATE TABLE `Grimpeur` (
  `NumGrimpeur` int(11) NOT NULL,
  `NomGrimpeur` varchar(50) NOT NULL,
  `PrenomGrimpeur` varchar(50) NOT NULL,
  `AccordReglement` tinyint(1) NOT NULL DEFAULT 0,
  `DateInscrGrimpeur` date DEFAULT NULL,
  `DateNaissGrimpeur` date DEFAULT NULL,
  `AccordParental` tinyint(1) DEFAULT NULL,
  `TelGrimpeur` text DEFAULT NULL,
  `StatutGrimpeur` text DEFAULT NULL,
  `NumLicenceGrimpeur` text DEFAULT NULL,
  `DateFinAbo` date DEFAULT NULL,
  `Note` text DEFAULT NULL,
  `EmailGrimpeur` text DEFAULT NULL,
  `StatutVoie` int(2) NOT NULL DEFAULT 0,
  `DateFinCoti` date DEFAULT NULL,
  `NbSeanceRest` int(11) DEFAULT 0,
  `Solde` float DEFAULT 0,
  `CheminSignature` text DEFAULT NULL,
  `ClubId` int(11) DEFAULT NULL,
  `AboId` int(11) DEFAULT NULL,
  `TicketId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Seance`
--

CREATE TABLE `Seance` (
  `IdSeance` int(11) NOT NULL,
  `DateSeance` date NOT NULL,
  `HeureSeance` time NOT NULL,
  `NumGrimpeur` int(11) DEFAULT NULL,
  `TicketId` int(11) DEFAULT NULL,
  `AboId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `IdTicket` int(11) NOT NULL,
  `TypeTicket` text NOT NULL,
  `NbSeanceTicket` int(11) DEFAULT NULL,
  `PrixTicket` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Transaction`
--

CREATE TABLE `Transaction` (
  `IdTransac` int(11) NOT NULL,
  `TypeObjet` enum('ticket','abonnement','produit') NOT NULL,
  `IdObjet` int(11) NOT NULL,
  `ModePaiment` varchar(255) DEFAULT NULL,
  `DateTransac` date NOT NULL,
  `HeureTransac` time NOT NULL,
  `MontantFinalTransac` float DEFAULT NULL,
  `Note` varchar(100) DEFAULT NULL,
  `NumGrimpeur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Abonnement`
--
ALTER TABLE `Abonnement`
  ADD PRIMARY KEY (`IdAbo`);

--
-- Indexes for table `Club`
--
ALTER TABLE `Club`
  ADD PRIMARY KEY (`IdClub`);

--
-- Indexes for table `Grimpeur`
--
ALTER TABLE `Grimpeur`
  ADD PRIMARY KEY (`NumGrimpeur`),
  ADD KEY `AboId` (`AboId`),
  ADD KEY `TicketId` (`TicketId`),
  ADD KEY `ClubId` (`ClubId`);

--
-- Indexes for table `Seance`
--
ALTER TABLE `Seance`
  ADD PRIMARY KEY (`IdSeance`),
  ADD KEY `NumGrimpeur` (`NumGrimpeur`),
  ADD KEY `fk_seance_ticket_id` (`TicketId`) USING BTREE,
  ADD KEY `fk_seance_abo_id` (`AboId`) USING BTREE;

--
-- Indexes for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`IdTicket`);

--
-- Indexes for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD PRIMARY KEY (`IdTransac`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Abonnement`
--
ALTER TABLE `Abonnement`
  MODIFY `IdAbo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Grimpeur`
--
ALTER TABLE `Grimpeur`
  MODIFY `NumGrimpeur` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Seance`
--
ALTER TABLE `Seance`
  MODIFY `IdSeance` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Ticket`
--
ALTER TABLE `Ticket`
  MODIFY `IdTicket` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Transaction`
--
ALTER TABLE `Transaction`
  MODIFY `IdTransac` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Grimpeur`
--
ALTER TABLE `Grimpeur`
  ADD CONSTRAINT `fk_grimpeur_abo` FOREIGN KEY (`AboId`) REFERENCES `Abonnement` (`IdAbo`),
  ADD CONSTRAINT `fk_grimpeur_ticket` FOREIGN KEY (`TicketId`) REFERENCES `Ticket` (`IdTicket`),
  ADD CONSTRAINT `fk_grimpeur_club` FOREIGN KEY (`ClubId`) REFERENCES `Club` (`IdClub`);

--
-- Constraints for table `Seance`
--
ALTER TABLE `Seance`
  ADD CONSTRAINT `fk_seance_grimpeur` FOREIGN KEY (`NumGrimpeur`) REFERENCES `Grimpeur` (`NumGrimpeur`);

INSERT INTO Ticket (IdTicket, TypeTicket, NbSeanceTicket)
VALUES (1, 'Carte Séance', 1);
-- Changer le délimiteur pour les triggers
DELIMITER //

DROP TRIGGER IF EXISTS prevent_delete_ticket1//

CREATE TRIGGER prevent_delete_ticket1
BEFORE DELETE ON Ticket
FOR EACH ROW
BEGIN
  IF OLD.IdTicket = 1 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'This ticket cannot be deleted because it is used as a reference in the application.';
  END IF;
END//

-- Rétablir le délimiteur normal
DELIMITER ;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
