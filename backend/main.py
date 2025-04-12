from flask import Flask
from routes import bp as supply_chain_api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(supply_chain_api)

if __name__ == '__main__':
    app.run(debug=True)
