from flask import Flask
from flask_cors import CORS
from flask_restful import Resource,Api

app = Flask(__name__)
CORS(app)
api = Api(app)

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