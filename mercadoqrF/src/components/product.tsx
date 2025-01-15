'use client'; // Marca todo el componente como cliente

import styles from './product.module.css';
import ProductType from '../models/product';
import UserPaymentDataForm from './userPaymentDataForm';

export default function Product({ product }: { product: ProductType }) {
    const handleClientSubmit = async (formData: any) => {
        try {
            const result = await fetch('http://localhost:1024/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            /* if (!result.ok) {
                throw new Error('Error en el servidor al procesar el pago.');
            } */
            const responseData = await result.json();
            console.log('Respuesta del servidor:', responseData);
            alert('Pago realizado con éxito.');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Ocurrió un error al procesar el pago.');
        }
    };

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
            <UserPaymentDataForm price={product.price} handleSubmit2={handleClientSubmit} />
        </div>
    );
}
