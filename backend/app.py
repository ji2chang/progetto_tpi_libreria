from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.get("/api/libri")
def list_books():
    ...

@app.post("/api/libri")
def add_book():
    ...

@app.delete("/api/libri/<int:id>")
def delete_book_by_id(id: int):
    ...

@app.delete("/api/libri")
def delete_all_books():
    ...


if __name__ == "main":
    app.run(host="0.0.0.0",port=12345,debug=True)