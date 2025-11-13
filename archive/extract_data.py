import csv
import sqlite3
import mariadb
import sys
from datetime import datetime
from dotenv import load_dotenv
import os

#-------- Constantes des chemins de fichiers --------#
load_dotenv()
PATH_SQL = os.getenv("PATH_SQL")
PATH_DB = os.getenv("PATH_DB")

CSV_CLUB = os.getenv("CSV_CLUB")
CSV_ABO = os.getenv("CSV_ABO")
CSV_STATUS = os.getenv("CSV_STATUS")
CSV_GRIMPEUR = os.getenv("CSV_GRIMPEUR")
CSV_SEANCE = os.getenv("CSV_SEANCE")

ANNEE_MIN_SEANCE_EXTRACT = int(os.getenv("ANNEE_MIN_SEANCE_EXTRACT"))

tables_db = ["Club", "Abonnement", "Ticket", "Grimpeur", "Seance"]
tables_mariadb = ["Seance", "Transaction", "Grimpeur", "Ticket", "Abonnement", "Club"]

USER=os.getenv("MY_USER")
PASSWORD=os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))
DATABASE=os.getenv("DATABASE")

#-------- Fonctions Utilitaires --------#

def format_date(date_string):
    if not date_string:
        return None
    date_obj = datetime.strptime(date_string.split(' ')[0], "%d/%m/%Y")
    return date_obj.strftime("%Y-%m-%d")

def format_heure(date_string):
    if date_string:
        return date_string.split(' ')[1]
    return None

def status_mapping(statut_code):
    mapping = {
        "CC":"Carte couple",
        "EN":"Enfant de moins de 10ans",
        "ET":"Etudiant, Scolaire, Chomeur ou appelés",
        "F2":"Famille de 2 personnes",
        "F3":"Famille de 3 personnes",
        "F4":"Famille de 4 et + personnes",
        "NO":"NORMAL"
    }
    return mapping.get(statut_code.upper(), ValueError(f"Statut inconnu: {statut_code}"))

def abo_ticktet_mapping(type_code, is_abo):
    if is_abo:
        mapping = {
            "A":1,
            "T":2
        }
    if not is_abo:
        mapping = {
            "C":2,
            "S":1
        }
    return mapping.get(type_code.upper(), None)

def numClub_mapping(num_club):
    if num_club:
        return int(num_club)
    return None

#-------- Fonctions d'extraction et de création de la base de données --------#

def createBaseSQL():
    # Écriture du fichier SQL, et de la BDD SQLite locale
    with open(PATH_SQL, "w", encoding="utf-8") as f:
        f.write("""
CREATE TABLE IF NOT EXISTS Club (
    IdClub INTEGER PRIMARY KEY,
    NomClub TEXT,
    AdresseClub TEXT,
    CodePostClub TEXT,
    VilleClub TEXT,
    TelClub TEXT,
    EmailClub TEXT,
    SiteInternet TEXT
);

CREATE TABLE IF NOT EXISTS Abonnement (
    IdAbo INTEGER PRIMARY KEY,
    DureeAbo INTEGER,
    TypeAbo TEXT
);
                
CREATE TABLE IF NOT EXISTS Ticket (
    IdTicket INTEGER PRIMARY KEY,
    TypeTicket TEXT,
    NbSeanceTicket INTEGER
);

CREATE TABLE IF NOT EXISTS Grimpeur (
    NumGrimpeur INTEGER PRIMARY KEY,
    NomGrimpeur TEXT,
    PrenomGrimpeur TEXT,
    DateNaissGrimpeur DATE,
    TelGrimpeur TEXT,
    StatutGrimpeur TEXT,
    NumLicenceGrimpeur TEXT,
    DateFinAbo DATE,
    Note TEXT,
    EmailGrimpeur TEXT,
    ClubId INTEGER,
    AboId INTEGER,
    TicketId INTEGER,
    FOREIGN KEY (AboId) REFERENCES Abonnement(IdAbo),
    FOREIGN KEY (TicketId) REFERENCES Ticket(IdTicket),
    FOREIGN KEY (ClubId) REFERENCES Club(IdClub)
);

CREATE TABLE IF NOT EXISTS Seance (
    IdSeance INTEGER PRIMARY KEY AUTOINCREMENT,
    DateSeance DATE,
    HeureSeance TIME,
    NumGrimpeur INTEGER,
    FOREIGN KEY (NumGrimpeur) REFERENCES Grimpeur(NumGrimpeur)
);
""")

    print("Fichier "+ PATH_SQL +" créé avec succès.")

    # Création d'une base SQLite locale
    conn = sqlite3.connect(PATH_DB)  # fichier local sur ton disque
    cursor = conn.cursor()

    # Lecture et exécution du SQL
    with open(PATH_SQL, "r", encoding="utf-8") as f:
        sql_script = f.read()

    cursor.executescript(sql_script)

    conn.commit()
    conn.close()

    print("Base locale "+ PATH_DB +" initialisée avec succès à partir du fichier SQL.")

def extractClub():
    # Extraction des données des clubs depuis le CSV et insertion dans la BDD
    conn = sqlite3.connect(PATH_DB)
    cursor = conn.cursor()

    with open(CSV_CLUB, mode='r', encoding='utf-8-sig') as clubFile:
        csvClub = csv.reader(clubFile)

        inserted = 0
        for row in csvClub:
            cursor.execute("""
                INSERT INTO Club (IdClub, NomClub, AdresseClub, CodePostClub, VilleClub, TelClub, EmailClub, SiteInternet)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                row[0],
                row[1],
                row[2],
                row[3],
                row[4],
                row[5],
                row[6],
                row[7].replace("#","")
            ))
            inserted += 1

    conn.commit()
    conn.close()
    print(f"{inserted} clubs insérés dans la base avec succès.")

def extractAbo():
    # Extraction des données des abonnements depuis le CSV et insertion dans la BDD
    conn = sqlite3.connect(PATH_DB)
    cursor = conn.cursor()
    inserted = 2

    cursor.execute("""
        INSERT INTO Abonnement (IdAbo, DureeAbo, TypeAbo)
        VALUES (1, 365, 'Annuel');
    """)
    cursor.execute("""
        INSERT INTO Abonnement (IdAbo, DureeAbo, TypeAbo)
        VALUES (2, 90, 'Trimestriel');
    """)

    conn.commit()
    conn.close()
    print(f"{inserted} Abonnement insérés dans la base avec succès.")

def extractTicket():
    # Extraction des données des tickets depuis le CSV et insertion dans la BDD
    conn = sqlite3.connect(PATH_DB)
    cursor = conn.cursor()
    inserted = 2

    cursor.execute("""
        INSERT INTO Ticket (IdTicket, TypeTicket, NbSeanceTicket)
        VALUES (1, 'Carte Séance', 1);
    """)
    cursor.execute("""
        INSERT INTO Ticket (IdTicket, TypeTicket, NbSeanceTicket)
        VALUES (2, 'Carte de 10', 10);
    """)

    conn.commit()
    conn.close()
    print(f"{inserted} Ticket insérés dans la base avec succès.")

def extractGrimpeur():
    # Extraction des données des grimpeurs depuis le CSV et insertion dans la BDD
    conn = sqlite3.connect(PATH_DB)
    cursor = conn.cursor()

    with open(CSV_GRIMPEUR, mode='r', encoding='utf-8-sig') as grimpeurFile:
        csvGrimpeur = csv.reader(grimpeurFile)

        inserted = 0
        pb = 0
        noteNumCarte = ""
        for row in csvGrimpeur:
            if row[13] and row[13] != row[0]:
                noteNumCarte += f"\nProblème NumCarte pour Grimpeur Num {row[0]}: NumCarte={row[13]}\n"
                pb += 1
            cursor.execute("""
                INSERT INTO Grimpeur (NumGrimpeur, NomGrimpeur, PrenomGrimpeur, DateNaissGrimpeur,
                                     TelGrimpeur, StatutGrimpeur, ClubId, NumLicenceGrimpeur, DateFinAbo, Note, EmailGrimpeur,
                                     AboId, TicketId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                row[0], #num
                row[1].upper(), #nom
                row[2].capitalize(), #prenom
                #row[3], sexe ignored
                format_date(row[4]), # dateNaiss a voir si le format de la date est bon
                #row[5], adresse ignored
                #row[6], ville ignored
                #row[7], CPG ignored
                row[8], #tel
                status_mapping(row[9]), #statut
                #row[10], TyepAbo ignored
                numClub_mapping(row[11]), #NumClub
                row[12], #NumLicence
                #row[13], #NumCarte ?????
                #row[14], DateDeb ignored
                format_date(row[15]), #DateFinAbo
                row[16], #Note
                row[17], #Email
                abo_ticktet_mapping(row[10], True), #AboId
                abo_ticktet_mapping(row[10], False)  #TicketId
            ))
            inserted += 1
            noteNumCarte = ""
    conn.commit()
    conn.close()
    print(f"{inserted} grimpeurs insérés dans la base avec succès. Et {pb} problèmes de NumCarte.")

def extractSeance():
    # Extraction des données des séances depuis le CSV et insertion dans la BDD
    conn = sqlite3.connect(PATH_DB)
    cursor = conn.cursor()

    with open(CSV_SEANCE, mode='r', encoding='utf-8-sig') as seanceFile:
        csvSeance = csv.reader(seanceFile)

        inserted = 0
        not_inserted = 0
        for row in csvSeance:
            date = format_date(row[0])
            if date and int(date.split('-')[0]) >= ANNEE_MIN_SEANCE_EXTRACT:
                cursor.execute("""
                    INSERT INTO Seance (DateSeance, HeureSeance, NumGrimpeur)
                    VALUES (?, ?, ?)
                """, (
                    date,                #DateSeance
                    format_heure(row[1]),#HeureSeance
                    row[3],              #NumGrimpeur
                ))
                inserted += 1
            else:
                not_inserted += 1

    conn.commit()
    conn.close()
    print(f"{inserted} séances insérées dans la base avec succès. {not_inserted} séances non insérées (avant {ANNEE_MIN_SEANCE_EXTRACT}).")

#-------- Fonction d'exportation des données vers MariaDB --------#

import sys
import mariadb
import sqlite3
from datetime import datetime

def exportDataToMariaDb():
    try:
        mariadb_conn = mariadb.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            database=DATABASE,
            autocommit=False
        )
    except mariadb.Error as e:
        print("Échec de la connexion à MariaDB:", e)
        sys.exit(1)

    mariadb_cur = mariadb_conn.cursor()
    sqlite_conn = sqlite3.connect(PATH_DB)
    sqlite_cur = sqlite_conn.cursor()

    # Vider les tables dans MariaDB
    for table in tables_mariadb:
        try:
            mariadb_cur.execute(f"DELETE FROM {table}")
        except mariadb.Error as e:
            print(f"Erreur lors du vidage de la table {table} : {e}")
            mariadb_conn.rollback()
            mariadb_conn.close()
            sqlite_conn.close()
            sys.exit(1)

    mariadb_conn.commit()

    # Pour chaque table, copier les données de SQLite vers MariaDB
    for table in tables_db:
        try:
            # Récupérer les colonnes de la table
            sqlite_cur.execute(f"PRAGMA table_info({table})")
            columns_info = sqlite_cur.fetchall()
            columns = [col[1] for col in columns_info]

            # Récupérer les données
            sqlite_cur.execute(f"SELECT * FROM {table}")
            rows = sqlite_cur.fetchall()

            # Préparer la requête d'insertion
            placeholders = ','.join(['%s'] * len(columns))
            columns_str = ','.join(columns)

            # Insérer les données
            if rows:
                try:
                    mariadb_cur.executemany(
                        f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})",
                        rows
                    )
                except mariadb.Error as e:
                    # Afficher des informations détaillées sur l'erreur
                    print(f"\nErreur lors de l'insertion dans la table {table} : {e}")
                    print(f"Nombre de colonnes : {len(columns)}")
                    print(f"Colonnes : {columns}")

                    # Trouver la ligne problématique
                    for i, row in enumerate(rows):
                        try:
                            mariadb_cur.execute(
                                f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})",
                                row
                            )
                        except mariadb.Error as row_error:
                            print(f"\nErreur à la ligne {i + 1} : {row_error}")
                            print(f"Valeurs de la ligne : {row}")

                            # Afficher la valeur problématique pour chaque colonne
                            for j, value in enumerate(row):
                                print(f"  Colonne {j + 1} ({columns[j]}) : {value} (Type: {type(value).__name__})")

                            # Annuler la transaction et quitter
                            mariadb_conn.rollback()
                            mariadb_conn.close()
                            sqlite_conn.close()
                            sys.exit(1)

                    mariadb_conn.rollback()
                    mariadb_conn.close()
                    sqlite_conn.close()
                    sys.exit(1)

        except sqlite3.Error as e:
            print(f"Erreur SQLite lors du traitement de la table {table} : {e}")
            mariadb_conn.rollback()
            mariadb_conn.close()
            sqlite_conn.close()
            sys.exit(1)

    mariadb_conn.commit()
    mariadb_conn.close()
    sqlite_conn.close()
    print("Données exportées avec succès vers MariaDB")

#-------- Clean Up --------#

if os.path.exists(PATH_SQL):
  os.remove(PATH_SQL)
else:
  print(f"The file '{PATH_SQL}' does not exist")

if os.path.exists(PATH_DB):
  os.remove(PATH_DB)
else:
  print(f"The file '{PATH_DB}' does not exist")

#-------- Exécution des fonctions --------#

#Création de la base SQL et SQLite locale
createBaseSQL()

#Extraction et insertion des données dans la BDD
extractClub()
extractAbo()
extractTicket()
extractGrimpeur()
extractSeance()


#Exportation des données vers MariaDB
exportDataToMariaDb()
