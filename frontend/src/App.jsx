import React, { useEffect, useState } from "react";
import Libreria from "./Libreria";
import "./App.css"
import AggiungiLibroForm from "./AggiungiLibroForm";
function App() {
    const api = Libreria();
    const [libri, setLibri] = useState([]);
    const [search, setSearch] = useState(""); // Aggiungi questo stato
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const caricaLibri = async () => {
         api.getLibri().then(setLibri);
    };
    
    useEffect(() => {
        api.getLibri().then(setLibri);
    }, []);

     useEffect(() => {
        caricaLibri();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };


    const cancella = (id, titolo) => {
        const conferma = window.confirm(`Sei sicuro di voler cancellare il libro "${titolo}"?`);

        if (conferma) {
            api.cancellaLibro(id).then(() => {
                setLibri(libri.filter(l => l.id !== id));
                //alert(`Libro "${titolo}" cancellato con successo!`);
            });
        }
    };
    
    const libriFiltrati = libri.filter(libro => { 
        const testo = search.toLowerCase();
        return ( 
            libro.titolo.toLowerCase().includes(testo) ||
            libro.autore.toLowerCase().includes(testo) ||
            (libro.genere && libro.genere.toLowerCase().includes(testo)) || // Controllo per genere opzionale
            String(libro.anno).includes(testo) 
        ); 
    });

    const cancellaTutti = () => {
        if (libri.length === 0) {
            alert("Non ci sono libri da cancellare!");
            return;
        }

        const conferma = window.confirm(`Sei sicuro di voler cancellare tutti i ${libri.length} libri? Questa azione è irreversibile.`);

        if (conferma) {
            api.cancellaTutti().then(() => {
                setLibri([]);
                //alert("Tutti i libri sono stati cancellati con successo!");
            });
        }
    };

    return (
        <div className="libreria-container">
            <h1 className="libreria-titolo">Libreria</h1>
            

            <div className="libreria-controlli">
                <input 
                    type="text" 
                    placeholder="Cerca per titolo, autore, genere o anno..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-ricerca"
                />
                <button className="btn btn-aggiungi" onClick={() => setShowForm(true)}>
                    Aggiungi libro
                </button>
                <button className="btn btn-cancella-tutti" onClick={cancellaTutti}>Cancella tutti</button>
                
            </div>
            {showForm && (
                <AggiungiLibroForm 
                    onLibroAggiunto={() => {
                        setShowForm(false);
                        handleRefresh(); // Forza il refresh della lista
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <ul className="lista-libri">
                {libriFiltrati.map(libro => (
                    <li key={libro.id} className="libro-item">
                        <span className="libro-info">
                            <strong>{libro.titolo}</strong> – {libro.autore}<br />
                            <em>{libro.anno}</em> • {libro.genere}
                        </span>

                        <button 
                            className="btn btn-cancella" 
                            onClick={() => cancella(libro.id, libro.titolo)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;