'use client'; // Marca todo el componente como cliente

import styles from './product.module.css';
import ProductType from '../models/product';
import PlaceType from '../models/place';
import UserPaymentDataForm from './userPaymentDataForm';
import { useEffect, useState } from 'react';
import MercadoPagoService from 'services/mercadoPagoService';


export default function Product({ product, place }: { product: ProductType, place:PlaceType }) {
    const [initPoint, setInitPoint] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPreferenceId = async () => {
            try {
                const response = await MercadoPagoService.getInitPoint(product);
                if(!response.success) {
                    //undefined
                } else {
                    const url = response.data as string
                    console.log(url);
                    setInitPoint(url);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        }
        fetchPreferenceId();
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.subtitle}>Comprando</div>
            <div className={styles.info}>
                <div className={styles.img_product}>
                    <img className={styles.src_img_product} src={product.img} alt={product.name} />
                </div>
                <div className={styles.name_product}>{product.name}</div>
                <div className={styles.description_product}>{product.description}</div>
            </div>
            {isLoading? <div>Cargando...</div>:
            <UserPaymentDataForm place={place} price={product.price} initPoint={initPoint} />
            }
        </div>
    );
}
