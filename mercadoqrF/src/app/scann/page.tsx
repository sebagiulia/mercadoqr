'use client'
import React, { useState } from 'react';
import ScannService from 'services/scannService';
import { useError, ErrorProvider } from 'errors/ErrorContext';

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
    const [showResult, setShowResult] = useState(false);

    const checkApi = async () => {
        try {
            // Llamada a la API para verificar los datos
            // Supongamos que la API devuelve un objeto con una propiedad "success" que indica si la verificación fue exitosa
            const response = await ScannService.validate(localName, validationCode);

            console.log(response);
            if ( !response.success || !response.data) {
                // Verificación fallida, mostrar el error
                setError('Error: Los datos ingresados son incorrectos');
            } else {
                // Verificación exitosa, mostrar la página X
                setShowResult(true);
            }
        } catch (error) {
            // Error al llamar a la API
            setError('Error: No se pudo conectar con la API');
        }
    };

    if (showResult) {
        return <div>Página X</div>;
    }

    return (
        <div>
            <h1>Verificación de datos de scann</h1>
            <p>Ingrese el nombre del local y el código habilitante</p>
            <input
                type="text"
                placeholder="Nombre del local"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Código habilitante"
                value={validationCode}
                onChange={(e) => setCodigoHabilitante(e.target.value)}
            />
            <button onClick={checkApi}>Verificar</button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Page;