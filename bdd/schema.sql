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
  `IdAbo`    int(11)       NOT NULL COMMENT 'Identifiant unique de l\'abonnement',
  `DureeAbo` int(11)       NOT NULL COMMENT 'Durée de l\'abonnement en jours',
  `TypeAbo`  text          NOT NULL COMMENT 'Type d\'abonnement (ex: annuel, mensuel, ...)',
  `PrixAbo`  decimal(10,2) DEFAULT NULL COMMENT 'Prix de l\'abonnement en euros'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Club`
--

CREATE TABLE `Club` (
  `IdClub`       int(11)    NOT NULL COMMENT 'Identifiant unique du club',
  `NomClub`      text       DEFAULT NULL COMMENT 'Nom du club',
  `AdresseClub`  text       DEFAULT NULL COMMENT 'Adresse postale du club',
  `CodePostClub` text       DEFAULT NULL COMMENT 'Code postal du club',
  `VilleClub`    text       DEFAULT NULL COMMENT 'Ville du club',
  `TelClub`      text       DEFAULT NULL COMMENT 'Numéro de téléphone du club',
  `EmailClub`    text       DEFAULT NULL COMMENT 'Adresse email du club',
  `SiteInternet` text       DEFAULT NULL COMMENT 'URL du site internet du club',
  `PuyDeDome`    tinyint(1) DEFAULT NULL COMMENT 'Indique si le club est dans le Puy-de-Dôme (1=oui, 0=non), afin de ne pas obligé la cotisation'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Grimpeur`
--

CREATE TABLE `Grimpeur` (
  `NumGrimpeur`        int(11)     NOT NULL COMMENT 'Identifiant unique du grimpeur',
  `NomGrimpeur`        varchar(50) NOT NULL COMMENT 'Nom de famille du grimpeur',
  `PrenomGrimpeur`     varchar(50) NOT NULL COMMENT 'Prénom du grimpeur',
  `AccordReglement`    tinyint(1)  NOT NULL DEFAULT 0 COMMENT 'Accord du règlement intérieur (1=oui, 0=non)',
  `DateInscrGrimpeur`  date        DEFAULT NULL COMMENT 'Date d\'inscription du grimpeur',
  `DateNaissGrimpeur`  date        DEFAULT NULL COMMENT 'Date de naissance du grimpeur',
  `AccordParental`     tinyint(1)  DEFAULT NULL COMMENT 'Accord parental pour les mineurs (1=oui, 0=non)',
  `TelGrimpeur`        text        DEFAULT NULL COMMENT 'Numéro de téléphone du grimpeur',
  `StatutGrimpeur`     text        DEFAULT NULL COMMENT 'Statut du grimpeur (ex: étudiant, chomeur, travailleur, ...)',
  `NumLicenceGrimpeur` text        DEFAULT NULL COMMENT 'Numéro de licence FFME du grimpeur',
  `DateFinAbo`         date        DEFAULT NULL COMMENT 'Date de fin de l\'abonnement en cours',
  `Note`               text        DEFAULT NULL COMMENT 'Notes libres sur le grimpeur',
  `EmailGrimpeur`      text        DEFAULT NULL COMMENT 'Adresse email du grimpeur',
  `StatutVoie`         int(2)      NOT NULL DEFAULT 0 COMMENT 'Statut d\'accès aux voies (0=bloc, 1=moulinette, 2=tête)',
  `DateFinCoti`        date        DEFAULT NULL COMMENT 'Date de fin de cotisation',
  `NbSeanceRest`       int(11)     DEFAULT 0 COMMENT 'Nombre de séances restantes sur le ticket en cours',
  `Solde`              float       DEFAULT 0 COMMENT 'Solde du compte du grimpeur en euros',
  `CheminSignature`    text        DEFAULT NULL COMMENT 'Chemin vers le fichier de signature du grimpeur',
  `ClubId`             int(11)     DEFAULT NULL COMMENT 'Référence vers le club d\'appartenance (FK Club)',
  `AboId`              int(11)     DEFAULT NULL COMMENT 'Référence vers l\'abonnement en cours (FK Abonnement)',
  `TicketId`           int(11)     DEFAULT NULL COMMENT 'Référence vers le ticket en cours (FK Ticket)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Seance`
--

CREATE TABLE `Seance` (
  `IdSeance`    int(11) NOT NULL COMMENT 'Identifiant unique de la séance',
  `DateSeance`  date    NOT NULL COMMENT 'Date d\'entrée en salle',
  `HeureSeance` time    NOT NULL COMMENT 'Heure d\'entrée en salle',
  `NumGrimpeur` int(11) DEFAULT NULL COMMENT 'Référence vers le grimpeur concerné (FK Grimpeur)',
  `TicketId`    int(11) DEFAULT NULL COMMENT 'Référence vers le ticket utilisé (FK Ticket), l\'un ou l\'autre (AboId) est null',
  `AboId`       int(11) DEFAULT NULL COMMENT 'Référence vers l\'abonnement utilisé (FK Abonnement), l\'un ou l\'autre (TicketId) est null'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `IdTicket`       int(11)       NOT NULL COMMENT 'Identifiant unique du ticket',
  `TypeTicket`     text          NOT NULL COMMENT 'Type de ticket (ex: unitaire, 10 séances, ...)',
  `NbSeanceTicket` int(11)       DEFAULT NULL COMMENT 'Nombre de séances incluses dans le ticket',
  `PrixTicket`     decimal(10,2) DEFAULT NULL COMMENT 'Prix du ticket en euros'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Transaction`
--

CREATE TABLE `Transaction` (
  `IdTransac`           int(11)                              NOT NULL COMMENT 'Identifiant unique de la transaction',
  `TypeObjet`           enum('ticket','abonnement','produit') NOT NULL COMMENT 'Type d\'objet acheté (ticket, abonnement ou produit)',
  `IdObjet`             int(11)      NOT NULL COMMENT 'Identifiant de l\'objet acheté (FK selon TypeObjet)',
  `ModePaiment`         varchar(255) DEFAULT NULL COMMENT 'Mode de paiement (ex: CB, espèces, chèque, ...)',
  `DateTransac`         date         NOT NULL COMMENT 'Date de la transaction',
  `HeureTransac`        time         NOT NULL COMMENT 'Heure de la transaction',
  `MontantFinalTransac` float        DEFAULT NULL COMMENT 'Montant final payé en euros',
  `Note`                varchar(100) DEFAULT NULL COMMENT 'Notes libres sur la transaction',
  `NumGrimpeur`         int(11)      DEFAULT NULL COMMENT 'Référence vers le grimpeur concerné (FK Grimpeur)'
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
-- AUTO_INCREMENT for table `Club`
--
ALTER TABLE `Club`
  MODIFY `IdClub` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_grimpeur_abo`    FOREIGN KEY (`AboId`)    REFERENCES `Abonnement` (`IdAbo`),
  ADD CONSTRAINT `fk_grimpeur_ticket` FOREIGN KEY (`TicketId`) REFERENCES `Ticket` (`IdTicket`),
  ADD CONSTRAINT `fk_grimpeur_club`   FOREIGN KEY (`ClubId`)   REFERENCES `Club` (`IdClub`);

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

CREATE DATABASE IF NOT EXISTS metabaseappdb;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
