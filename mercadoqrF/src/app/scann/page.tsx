'use client'
import React, { useState } from 'react';
import ScannService from 'services/scannService';
import { useError, ErrorProvider } from 'errors/ErrorContext';
import styles from './page.module.css';
import ScanPage from '@/components/scannPage';
import Place from '@/models/place';

const Page: React.FC = () => { 
    return ( 
        <ErrorProvider>
        <Scann />
        </ErrorProvider>
     );
 }

const Scann: React.FC = () => {
    const [localName, setLocalName] = useState('');
    const [validationCode, setCodigoHabilitante] = useState('');
    const {error, setError} = useError();
    const [place, setPlace] = useState<Place | null>(null);
    const [showResult, setShowResult] = useState(false);

    const checkApi = async () => {
        try {
            const response = await ScannService.validate(localName, validationCode);

            console.log(response);
            if ( !response.success || !response.data) {
                // Verificación fallida, mostrar el error
                setError('Error: Los datos ingresados son incorrectos');
            } else {
                // Verificación exitosa, mostrar la página ScannPage
                setPlace(response.data);
                setShowResult(true);
            }
        } catch (error) {
            // Error al llamar a la API
            setError('Error: No se pudo conectar con la API');
        }
    };

    const handleLocalNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setLocalName(e.target.value);
    };

    const handleValidationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setCodigoHabilitante(e.target.value);
    };

    if (true) {
        if(place) {
            return  <ScanPage place={place} />;
        }
    }

    return (
        <div className={styles.verification_container}>
            <h1>Verificación de datos de scann</h1>
            <p>Ingrese el nombre del local y el código habilitante</p>
            <input
                type="text"
                placeholder="Nombre del local"
                value={localName}
                onChange={handleLocalNameChange}
            />
            <input
                type="text"
                placeholder="Código habilitante"
                value={validationCode}
                onChange={handleValidationCodeChange}
            />
            <button onClick={checkApi}>Verificar</button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Page;