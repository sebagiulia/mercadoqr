'use client'
import { useState } from "react";
import styles from './userPaymentDataForm.module.css'

interface FormularioProps {
    price: number;
    handleSubmit2: any;
  }
export default function UserPaymentDataForm(arg: FormularioProps) {
    return Formulario(arg);
}

const Formulario : React.FC<FormularioProps> = ({ price, handleSubmit2 } ) => {
    const [formData, setFormData] = useState({
      name: '',
      lastname: '',
      email: '',
      repeatEmail: '',
      phone: '',
      natiolal_id: '',
      payment_method: '',
      quantity: 1,
    });
    
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
        !formData.name ||
        !formData.lastname ||
        !formData.email ||
        !formData.repeatEmail ||
        !formData.phone ||
        !formData.natiolal_id ||
        !formData.payment_method ||
        !formData.quantity
      ) {
        setError('Todos los campos son obligatorios.');
        return;
      }
      
      // Validar que los emails coincidan
      if (formData.email !== formData.repeatEmail) {
        setError('Los emails no coinciden.');
        return;
      }
  
      // Validación exitosa
      setError(null);
      handleSubmit2(formData);
      console.log('Formulario enviado:', formData);
      alert('Formulario enviado exitosamente');
    };
    
    const handleMedioPagoChange = (payment_method: string) => {
      setFormData({
        ...formData,
        payment_method,
      });
    };  

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.subtitle}>Datos del Comprador</div>
          <input className={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
          />
          <input className={styles.input}
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder='Apellido'
          />
          <input className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
          />
          <input className={styles.input}
            type="email"
            id="repeatEmail"
            name="repeatEmail"
            value={formData.repeatEmail}
            onChange={handleChange}
            placeholder='Repetir email'
          />
          <input className={styles.input}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder='Telefono'
          />
          <input className={styles.input}
            type="text"
            id="natiolal_id"
            name="natiolal_id"
            value={formData.natiolal_id}
            onChange={handleChange}
            placeholder='DNI'
          />
        <div className={styles.subtitle}>Seleccionar medio de pago</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Mercado Pago', 'Mercado Crédito'].map((opcion) => (
            <button
              type="button"
              key={opcion}
              onClick={() => handleMedioPagoChange(opcion)}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: formData.payment_method === opcion ? '#007BFF' : '#fff',
                color: formData.payment_method === opcion ? '#fff' : '#000',
                cursor: 'pointer',
              }}
            >
              {opcion}
            </button>
          ))}
        </div>
        <input className={styles.input}
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChangeCant}
            placeholder='quantity'
          />
           <div className={styles.price_product}> 
          <div>Total</div>
          <div>$ {price * formData.quantity}</div>
          </div>  
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className={styles.button} type="submit">Comprar</button>
      </form>
    );
  };