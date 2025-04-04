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
formatted_rows = [(nom.upper(), prenom.capitalize()) for nom, prenom in rows]
# for nom, prenom in formatted_rows:
    # print("NOM:", nom, "PRENOM:", prenom)

# Mise à jour
for nom, prenom in formatted_rows:
    cursor.execute('''
        UPDATE Grimpeur
        SET NOM = ?, PRENOM = ?
        WHERE NOM = ? AND PRENOM = ?
        ''', (nom, prenom, nom.lower(), prenom.lower()))
conn.commit()



cursor.execute('''
               SELECT NOM,PRENOM FROM Grimpeur 
               WHERE NOM LIKE '%/%' OR PRENOM LIKE '%/%'
               ''')
rows = cursor.fetchall()
print(rows)
# rows = cursor.fetchall()
# for elt in rows:
#     champ = "".join(elt)
#     champ  = champ.upper()
#     print("mon champ:", champ)
    
# print(rows)
# Commit the changes and close the connection
# conn.commit()
conn.close()