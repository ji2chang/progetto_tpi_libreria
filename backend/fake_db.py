from faker import Faker
import random
import time
import string

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
        self.faker = Faker(locale='it_IT')
	

    def all(self):
        """Restituisce tutti i libri come lista."""
        return list(self.libri.values())

    def get_by_id(self, book_id):
        """Restituisce un libro dato il suo ID, oppure None."""
        return self.libri.get(book_id)

    def _genera_id_unico(self):
        """Genera un ID alfanumerico unico che non esiste già nei libri."""
        max_tentativi = 100  # Evita loop infiniti
        for _ in range(max_tentativi):
            nuovo_id = self.faker.bothify(text='?????????#########').upper()
            # Verifica che l'ID non esista già
            if nuovo_id not in self.libri:
                return nuovo_id
        
        # Se dopo 100 tentativi non trova un ID unico, usa un approccio diverso
        # Fallback: timestamp + random
        
        timestamp = int(time.time() * 1000)
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"{timestamp}_{random_part}"
    
    def add(self,dati_libro):
        """Aggiunge un nuovo libro assegnando automaticamente un ID unico alfanumerico."""
        nuovo_id = self._genera_id_unico()
        self.libri[nuovo_id] = dati_libro
        return nuovo_id

    def delete(self, book_id):
        """Elimina un libro per ID. Restituisce True se eliminato, False altrimenti."""
        return self.libri.pop(book_id, None) is not None

    def delete_all(self):
        self.libri.clear()
    
    def get_generi(self):
        global GENERI
        return GENERI

