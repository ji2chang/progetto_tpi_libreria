from flask import Flask,jsonify
from flask_cors import CORS
from fake_db import FakeDatabase

localDatabase = FakeDatabase()
app = Flask(__name__)
CORS(app)

@app.get("/api/libri")
def list_books():
    return jsonify(localDatabase.all())

@app.post("/api/libri")
def add_book():
    localDatabase.add()
    return jsonify({"success": True})

@app.delete("/api/libri/<int:id>")
def delete_book_by_id(id: int):
    success = localDatabase.delete(id)
    return jsonify({"success": success})

@app.delete("/api/libri")
def delete_all_books():
    localDatabase.delete_all()
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=12345,debug=True)