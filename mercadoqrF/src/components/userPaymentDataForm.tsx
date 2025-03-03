'use client'
import { useState } from "react";
import styles from './userPaymentDataForm.module.css'
import PlaceType from '../models/place';
import { useRouter } from "next/navigation";

interface FormularioProps {
    price: number;
    place: PlaceType;
    initPoint: string;
  }
export default function UserPaymentDataForm(arg: FormularioProps) {
    return Formulario(arg);
}

const Formulario : React.FC<FormularioProps> = ({ price, place, initPoint } ) => {
  const [formData, setFormData] = useState({
      email: ''
    });
    
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleChangeCant = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const num = parseInt(value,10);
      if (num >= 1) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      // Validar que todos los campos están llenos
      if (
        !formData.email
      ) {
        setError('Todos los campos son obligatorios.');
        return;
      }
      
      // Validación exitosa
      setError(null);
      router.push(initPoint);
    };

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.subtitle}>Donde recibir el QR?</div>
          <input className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
          />
          <div className={styles.price_product}> 
            <div>Total</div>
            <div>$ {price}</div>
          </div>  
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className={styles.button} type="submit">Pagar</button>
        </form>
    );
  };