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

    def filter_by_genere(self, genere):
        """Restituisce tutti i libri di un certo genere."""
        return [libro for libro in self.libri.values() if libro["genere"] == genere]

    def add(self, libro):
        """Aggiunge un nuovo libro assegnando automaticamente un ID."""
        nuovo_id = max(self.libri.keys()) + 1 if self.libri else 1
        libro["id"] = nuovo_id
        self.libri[nuovo_id] = libro
        return libro

    def delete(self, book_id):
        """Elimina un libro per ID. Restituisce True se eliminato, False altrimenti."""
        return self.libri.pop(book_id, None) is not None
