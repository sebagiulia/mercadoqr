import { useState } from 'react';
import styles from './scannPage.module.css';
import Place from '@/models/place';
import ScannService from 'services/scannService';
import { useError } from 'errors/ErrorContext';
import Product from '@/models/product';

export default function ScanPage({ place }:{place: Place}) {
    const [code, setCode] = useState('');
    const { error, setError } = useError();
    const [product, setProduct] = useState<Product>();


    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setCode(event.target.value);
    };

    const openPopup = (product:Product) => {
        setProduct(product);
        // Lógica para abrir el popup con los botones "Seguir escaneando" y "Consumir"
    };

    const handleNext = async () => {
        // Lógica para procesar el código ingresado y avanzar a la siguiente página
        const response = await ScannService.getScann(code, place.id)
        if (!response.success) {
            setError('Error al escanear el código');
        } 
        else if (response.error) {
            setError(response.error.message);
        } else {
            if(response.data) openPopup(response.data);
        }

    };

    return (
        <div className={styles.scannPage_container}>
            {product && <PopUpScann product={product} qrcode={code}/>}
            <h1>Scanner de {place.name}</h1>
            <div className={styles.camera}> <p>ENFOCAR QR</p></div>
            <input type="text" value={code} onChange={handleCodeChange} placeholder='codigo' />
            <button onClick={handleNext}>Buscar</button>
        </div>
    );
};

function PopUpScann({ product, qrcode }:{product: Product, qrcode:string}) {
    const { error, setError } = useError();
    const [popup, setPopup] = useState(false);

    const handleConsume = async () => {
        // Lógica para consumir el producto escaneado
        const response = await ScannService.consume(qrcode);
        if (!response.success) {
            setError('Error al consumir el producto');
        } 
        else if (response.error) {
            setError(response.error.message);
        } else {
            setPopup(false);
        }
    };

    return (
        <div className={styles.popup_container}>
            <h1>Producto escaneado</h1>
            <p>{product.name}</p>
            <button onClick={handleConsume}>Consumir</button>
            <button onClick={() => setPopup(false)}>Seguir escaneando</button>
        </div>
    );
}
