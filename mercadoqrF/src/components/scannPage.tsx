import { Dispatch, SetStateAction, useState } from 'react';
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
    };

    const handleNext = async () => {
        // Lógica para procesar el código ingresado y avanzar a la siguiente página
        try {
            const {success, data, error } = await ScannService.getScann(code, place.id)
            if (success) {
                openPopup(data as Product);
            } else {
                setError(error?.message || 'Error al escanear el código');
            } 
        } catch (error) {
            console.error(error);
            setError('Error al escanear el código');
        }

    };

    return (
        <div className={styles.scannPage_container}>
            {product && <PopUpScann product={product} qrcode={code} setProduct={setProduct}/>}
            <h1>Scanner de {place.name}</h1>
            <div className={styles.camera}> <p>ENFOCAR QR</p></div>
            <input type="text" value={code} onChange={handleCodeChange} placeholder='código' />
            <button onClick={handleNext}>Buscar</button>
            {error && <p>{error}</p>}
        </div>
    );
};

function PopUpScann({ product, qrcode, setProduct }:{product: Product, qrcode:string, setProduct: Dispatch<SetStateAction<Product | undefined>>}) {
    const { error, setError } = useError();
    const [scanned, setScanned] = useState(false);

    const handleConsume = async () => {
        // Lógica para consumir el producto escaneado
        try {
            const {success, error } = await ScannService.consume(qrcode);
            if (success) {
                setScanned(true);
            } else {
                setError(error?.message || 'Error al consumir el producto');
            }
        } catch (error) {
            console.error(error);
            setError('Error al consumir el producto');
        }
    };

    return (
        <div className={styles.popup_container}>
        <div className={styles.popup_data}>
            <h3>{product.name}</h3>
            <img src={product.img} alt={product.name} />
            <p>{product.description}</p>
            {scanned ? <span>Consumido</span> :<button onClick={handleConsume}>Consumir</button> }
            <button onClick={() => setProduct(undefined)}>Seguir escaneando</button>
            {error && <p>{error}</p>}
        </div>
        </div>
    );
}
