# -*- coding: utf-8 -*-
import sqlite3
import os

path = "./archive/SQL_DB/"

# Connect to SQLite database
conn = sqlite3.connect(path+"casa.db")

# Create a cursor object
cursor = conn.cursor()


#--- Normalisation des Noms prénoms (upper et capitalize)
# Requête
cursor.execute('''
SELECT NOM,PRENOM FROM Grimpeur;
''')
rows = cursor.fetchall()

# Traitement
# formatted_rows = [(nom.upper(), prenom.capitalize()) for nom, prenom in rows]

# Mise à jour
for nom, prenom in rows:
    cursor.execute('''
        UPDATE Grimpeur
        SET NOM = ?, PRENOM = ?
        WHERE NOM = ? AND PRENOM = ?
        ''', (nom.upper(), prenom.capitalize(), nom, prenom))
conn.commit()


# Detection des Edge cases
print("Selecton des Abonnements DUO ?")
cursor.execute('''
               SELECT NOM,PRENOM FROM Grimpeur 
               WHERE NOM LIKE '%/%' OR PRENOM LIKE '%/%'
               ORDER BY NUMGRIMP DESC
               ''')
rows = cursor.fetchall()
print(rows)
print('_'*12+'\n')


print("Tentative de détection des noms suspects")
cursor.execute('''
               SELECT NOM,PRENOM FROM Grimpeur 
               WHERE NOM LIKE '% % %' OR PRENOM LIKE '% % %'  
               ORDER BY NUMGRIMP DESC
               ''')


rows = cursor.fetchall()
print(rows)
print('_'*12+'\n')


print("Extraction des comptes doublons")
cursor.execute('''
               WITH G AS (SELECT NOM,PRENOM,NUMGRIMP,DATNAIS FROM Grimpeur)
               SELECT DISTINCT GG.PRENOM, GG.NOM, GG.NUMGRIMP, GG.DATNAIS FROM Grimpeur as GG
               JOIN G ON G.NOM = GG.NOM AND G.PRENOM = GG.PRENOM
               WHERE G.NUMGRIMP != GG.NUMGRIMP AND G.DATNAIS=GG.DATNAIS
               ORDER BY GG.NOM ASC
               ''')

rows = cursor.fetchall()
row_count = len(rows)
print(f"Number of rows: {row_count}")
# print(rows)
for w in rows:
    print(w)
print('_'*12+'\n')

# rows = cursor.fetchall()
# for elt in rows:
#     champ = "".join(elt)
#     champ  = champ.upper()
#     print("mon champ:", champ)
    
# print(rows)
# Commit the changes and close the connection
# conn.commit()
conn.close()