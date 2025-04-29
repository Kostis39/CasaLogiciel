from flask import Flask
from flask_cors import CORS
from flask_restful import Resource,Api
import sqlalchemy
from sqlalchemy import text

app = Flask(__name__)
CORS(app)
api = Api(app)

with open('../../vpn-auth.txt', 'r') as file:
    lines = file.readlines()
    secret = lines[1].strip() if len(lines) > 1 else None
if secret is None:
    print("Secret non trouvé")
    exit(1)
      
engine = sqlalchemy.create_engine(f"mariadb+mariadbconnector://root:{secret}@172.18.0.4:3306/casabase", echo=True)

with engine.connect() as connector:
    result = connector.execute(text('SHOW TABLES'))
    print(result.all())
    

class Users(Resource):
    def get(self):
        return {'users': ['Alice', 'Bob', 'Charlie']}

class Products(Resource):
    def get(self):
        return {'products': ['Laptop', 'Smartphone', 'Tablet']}

api.add_resource(Users, '/users')
api.add_resource(Products, '/products')

if __name__ == '__main__':
    app.run(debug=True)