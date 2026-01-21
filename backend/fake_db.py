from faker import Faker
import random

fake = Faker(locale='it_IT')

GENERI = ["Romanzo", "Giallo", "Fantascienza", "Fantasy", "Saggio", "Biografia"]

def genera_libro(i):
    return {
        "id": i,
        "titolo": " ".join(fake.words(2)),
        "autore": fake.name(),
        "anno": random.randint(1900, 2026),
        "genere": random.choice(GENERI)
    }

class FakeDatabase:
    def __init__(self, size=20):
        # Dizionario: { id : libro }
        self.libri = {i: genera_libro(i) for i in range(1, size + 1)}

    def all(self):
        """Restituisce tutti i libri come lista."""
        return list(self.libri.values())

    def get_by_id(self, book_id):
        """Restituisce un libro dato il suo ID, oppure None."""
        return self.libri.get(book_id)

    def add(self):
        """Aggiunge un nuovo libro assegnando automaticamente un ID."""
        nuovo_id = max(self.libri.keys()) + 1 if self.libri else 1
        self.libri[nuovo_id] = genera_libro(nuovo_id)

    def delete(self, book_id):
        """Elimina un libro per ID. Restituisce True se eliminato, False altrimenti."""
        return self.libri.pop(book_id, None) is not None

    def delete_all(self):
        self.libri.clear()
