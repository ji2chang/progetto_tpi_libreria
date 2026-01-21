import React, { useEffect, useState } from "react";
import Libreria from "./Libreria";
import "./App.css"

function App() {
    const api = Libreria();
    const [libri, setLibri] = useState([]);

    useEffect(() => {
        api.getLibri().then(setLibri);
    }, []);

    const aggiungi = () => {
        const nuovoLibro = { titolo: "Nuovo libro", autore: "Anonimo" };
        api.aggiungiLibro(nuovoLibro).then(() => {
            api.getLibri().then(setLibri);
        });
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
                <button className="btn btn-aggiungi" onClick={aggiungi}>Aggiungi libro</button>
                <button className="btn btn-cancella-tutti" onClick={cancellaTutti}>Cancella tutti</button>
            </div>

            <ul className="lista-libri">
                {libri.map(libro => (
                    <li key={libro.id} className="libro-item">
                        <span className="libro-info">{libro.titolo} - {libro.autore}</span>
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