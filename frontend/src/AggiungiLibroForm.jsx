// AggiungiLibroForm.jsx
import React, { useState, useEffect } from 'react';
import Libreria from './Libreria';
import './AggiungiLibroForm.css';

function AggiungiLibroForm({ onLibroAggiunto, onCancel, onRefresh }) {
    const api = Libreria();
    const [generi, setGeneri] = useState([]);
    const [formData, setFormData] = useState({
        titolo: '',
        autore: '',
        anno: new Date().getFullYear(),
        genere: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Carica i generi dall'API
    useEffect(() => {
        const caricaGeneri = async () => {
            try {
                const response = await fetch('http://127.0.0.1:12345/api/generi');
                if (!response.ok) {
                    throw new Error('Errore nel caricamento dei generi');
                }
                const generiData = await response.json();
                console.log('Generi ricevuti:', generiData); // Debug
                
                // Se il backend restituisce un array di stringhe
                if (Array.isArray(generiData) && generiData.length > 0) {
                    if (typeof generiData[0] === 'string') {
                        // Se sono stringhe, trasformale in oggetti
                        const generiFormattati = generiData.map(nome => ({ nome }));
                        setGeneri(generiFormattati);
                    } else if (generiData[0].nome) {
                        // Se già sono oggetti con proprietà nome
                        setGeneri(generiData);
                    } else {
                        // Altrimenti gestisci l'errore
                        throw new Error('Formato generi non valido');
                    }
                }
            } catch (err) {
                console.error('Errore:', err);
                setError('Impossibile caricare i generi');
            }
        };

        caricaGeneri();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'anno' ? parseInt(value) || '' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validazione
        if (!formData.titolo.trim()) {
            setError('Il titolo è obbligatorio');
            return;
        }
        
        if (!formData.autore.trim()) {
            setError('L\'autore è obbligatorio');
            return;
        }
        
        if (!formData.anno || formData.anno < 1000 || formData.anno > new Date().getFullYear()) {
            setError('Inserisci un anno valido');
            return;
        }
        
        if (!formData.genere) {
            setError('Seleziona un genere');
            return;
        }

        setIsLoading(true);

        try {
            await api.aggiungiLibro(formData);
            
            
            // Reset form
            setFormData({
                titolo: '',
                autore: '',
                anno: new Date().getFullYear(),
                genere: ''
            });
            onLibroAggiunto();
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            setError('Errore durante l\'aggiunta del libro: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Genera gli anni per la select (ultimi 100 anni)
    const anni = [];
    const annoCorrente = new Date().getFullYear();
    for (let i = annoCorrente; i >= annoCorrente - 100; i--) {
        anni.push(i);
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Aggiungi Nuovo Libro</h2>
                    <button className="btn-close" onClick={onCancel}>×</button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="titolo">Titolo *</label>
                        <input
                            type="text"
                            id="titolo"
                            name="titolo"
                            value={formData.titolo}
                            onChange={handleChange}
                            placeholder="Inserisci il titolo del libro"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="autore">Autore *</label>
                        <input
                            type="text"
                            id="autore"
                            name="autore"
                            value={formData.autore}
                            onChange={handleChange}
                            placeholder="Inserisci l'autore"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="anno">Anno di pubblicazione *</label>
                        <select
                            id="anno"
                            name="anno"
                            value={formData.anno}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            {anni.map(anno => (
                                <option key={anno} value={anno}>
                                    {anno}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="genere">Genere *</label>
                        <select
                            id="genere"
                            name="genere"
                            value={formData.genere}
                            onChange={handleChange}
                            disabled={isLoading || generi.length === 0}
                        >
                            <option value="">Seleziona un genere</option>
                            {generi.map((genere, index) => {
                                // Controlla se genere è una stringa o un oggetto
                                const nomeGenere = typeof genere === 'string' ? genere : genere.nome;
                                const keyValue = typeof genere === 'string' ? genere : genere.nome;
                                
                                return (
                                    <option key={keyValue || index} value={nomeGenere}>
                                        {nomeGenere}
                                    </option>
                                );
                            })}
                        </select>
                        {generi.length === 0 && !error && (
                            <div className="loading-generi">Caricamento generi...</div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Aggiungendo...' : 'Aggiungi Libro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AggiungiLibroForm;