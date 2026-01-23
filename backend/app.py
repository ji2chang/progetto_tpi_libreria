from flask import Flask,jsonify,request
from flask_cors import CORS
from fake_db import FakeDatabase
import datetime
localDatabase = FakeDatabase()
app = Flask(__name__)
CORS(app)

@app.get("/api/libri")
def list_books():
    return jsonify(localDatabase.all())

@app.get("/api/generi")
def get_generi():
   return jsonify(localDatabase.get_generi())

@app.post("/api/libri")
def add_book():
    """Aggiunge un nuovo libro con i dati forniti nel JSON."""
    try:
        # Ottieni i dati dal JSON della richiesta
        dati_libro = request.get_json()
        
        # Validazione dei campi obbligatori
        if not dati_libro:
            return jsonify({"success": False, "error": "Nessun dato fornito"}), 400
        
        campi_obbligatori = ["titolo", "genere", "anno", "autore"]
        for campo in campi_obbligatori:
            if campo not in dati_libro or not str(dati_libro[campo]).strip():
                return jsonify({"success": False, "error": f"Campo '{campo}' mancante o vuoto"}), 400
        
        # Validazione anno
        try:
            anno = int(dati_libro["anno"])
            anno_corrente = datetime.datetime.now().year
            if anno < 1000 or anno > anno_corrente:
                return jsonify({"success": False, "error": f"Anno non valido. Deve essere tra 1000 e {anno_corrente}"}), 400
            dati_libro["anno"] = anno
        except (ValueError, TypeError):
            return jsonify({"success": False, "error": "Anno deve essere un numero valido"}), 400
        
        # Validazione genere
        generi_disponibili = localDatabase.get_generi()
        if dati_libro["genere"] not in generi_disponibili:
            return jsonify({
                "success": False, 
                "error": f"Genere non valido. Generi disponibili: {', '.join(generi_disponibili)}"
            }), 400
        
        # Aggiungi il libro
        libro_id = localDatabase.add(dati_libro)
        
        return jsonify({
            "success": True,
            "id": libro_id,
            "message": "Libro aggiunto con successo"
        })
    
    except Exception as e:
        # Log dell'errore per debug
        print(f"Errore nell'aggiunta del libro: {str(e)}")
        return jsonify({"success": False, "error": "Errore interno del server"}), 500


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