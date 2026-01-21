function Libreria(baseUrl = "http://127.0.0.1:12345/api/libri") {

    // GET: Ottieni tutti i libri
    const getLibri = async () => {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error("Errore nel recupero dei libri");
        return await response.json();
    };

    // POST: Aggiungi un nuovo libro
    const aggiungiLibro = async (libro) => {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(libro)
        });
        if (!response.ok) throw new Error("Errore nell'aggiunta del libro");
        return await response.json();
    };

    // DELETE: Cancella un libro tramite ID
    const cancellaLibro = async (id) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Errore nella cancellazione del libro");
        return await response.json();
    };

    // DELETE: Cancella tutti i libri
    const cancellaTutti = async () => {
        const response = await fetch(baseUrl, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Errore nella cancellazione di tutti i libri");
        return await response.json();
    };

    // ritorno i metodi come oggetto
    return {
        getLibri,
        aggiungiLibro,
        cancellaLibro,
        cancellaTutti
    };
}

export default Libreria;
