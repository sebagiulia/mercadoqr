'use client'; // Marca todo el componente como cliente

import styles from './product.module.css';
import ProductType from '../models/product';
import UserPaymentDataForm from './userPaymentDataForm';
import { useDependencies } from "utils/dependencyContext";
import { useRouter } from 'next/navigation';

export default function Product({ product, place }: { product: ProductType, place:string }) {
    const { paymentService, qrService } = useDependencies();
    const  router = useRouter();
    const handleClientSubmit = async (formData: any) => {
        try {
            
            const result = await paymentService.processPayment({...formData, place_id: product.place_id, prod_id: product.id})
            router.push('/' + place + '/' + product.name + '/' + result.transactionId);
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
