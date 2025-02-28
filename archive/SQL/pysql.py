import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('../DB/casa.db')

# Create a cursor object
cursor = conn.cursor()

# Example query to create a table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
)
''')

# Commit the changes and close the connection
conn.commit()
conn.close()