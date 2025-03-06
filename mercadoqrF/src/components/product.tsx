'use client'; // Marca todo el componente como cliente

import styles from './product.module.css';
import ProductType from '../models/product';
import PlaceType from '../models/place';
import UserPaymentDataForm from './userPaymentDataForm';
import { useEffect, useState } from 'react';
import MercadoPagoService from 'services/mercadoPagoService';


export default function Product({ product, place, cant }: { product: ProductType, place:PlaceType, cant: number }) {
    const [initPoint, setInitPoint] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const etiquetasComprador = ["Nombre y Apellido", "DNI"];
    const etiquetasEnvio = ["Email", "Telefono"];
    
    // Estado para manejar los valores de los inputs
    const [datosComprador, setDatosComprador] = useState(
        Object.fromEntries(etiquetasComprador.map((etiqueta) => [etiqueta, ""]))
    );

     // Manejar cambios en los inputs
    const handleChangeDatosComprador = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDatosComprador({ ...datosComprador, [e.target.name]: e.target.value });
     };

    // Estado para manejar los valores de los inputs
    const [datosEnvio, setDatosEnvio] = useState(
        Object.fromEntries(etiquetasEnvio.map((etiqueta) => [etiqueta, ""]))
    );

     // Manejar cambios en los inputs
    const handleChangeDatosEnvio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
     };
     
    const [step, setStep] = useState(0);

    /* useEffect(() => {
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
    }, []);  */
    

    const handleDatosComprador = (e: any) => {
        setStep(1);
    }
    
    const handleDatosEnvio = (e: any) => {
        setStep(2);
    }

    return (
        <div className={styles.page}>
            <div className={styles.subtitle}>{product.name}</div>
            <div className={styles.info}>
                <div className={styles.imgs_product_place}>
                    <img className={styles.src_img_place} src={place.img} alt={place.name} />
                    <img className={styles.src_img_product} src={product.img} alt={product.name} />
                </div>
                <div className={styles.description_product}>{product.description}</div>
            </div>
            {step === 0? 
                <Block  title={"Datos del comprador"}
                        description={"Estos datos son solicitados directamente por el vendedor"} 
                        form={datosComprador}
                        etiquetas={etiquetasComprador}
                        button="Siguiente"
                        buttonAction={handleDatosComprador}
                        change={handleChangeDatosComprador} />

            :
            step === 1?    
                <Block title={"Datos de envío"}
                        description={"Rellene correctamente los campos del envío, mercadoqr le enviará su QR a estos destinos"} 
                        form={datosEnvio}
                        etiquetas={etiquetasEnvio}
                        button="Siguiente"
                        buttonAction={handleDatosEnvio}
                        change={handleChangeDatosEnvio} />
            :
                <DetalleCompra 
                 title='Revisa tu pedido'
                 datosComprador={datosComprador}
                 datosEnvio={datosEnvio}
                 items={[{name: product.name, price: product.price, cant: 1}]}
                 service_price={1000}
                 button='Comprar'
                 buttonAction={() => alert('Compra')}
                />
            }
            

            
            {/* {isLoading? <div>Cargando...</div>:
            <UserPaymentDataForm place={place} price={product.price} initPoint={initPoint} />
            } */}
        </div>
    );
}
function Block({title, description, form, etiquetas, button, buttonAction, change}:
               {title: string, description: string, form: Record<string, string>,
                etiquetas: Array<string>, button: string, buttonAction: any, change:any}) {
    return(
        <div className={styles.block}>
            <p className={styles.block_title}>{title}</p>
            <p className={styles.block_description}>{description}</p>
            {etiquetas.map((et, index) => <input onChange={change}
                                                 className={styles.block_input}
                                                 value={form[et]}
                                                 key={index}
                                                 type="text"
                                                 name={et}
                                                 placeholder={et} />)}
            <button className={styles.block_button} onClick={buttonAction} >{button}</button>
        </div>
    )
}

function DetalleCompra({title, datosComprador, datosEnvio, items, service_price, button, buttonAction}:
    {title: string,
     datosComprador:Record<string,string>,
     datosEnvio:Record<string,string>,
     items: Array<{name:string, price:number, cant:number}>,
     service_price:number, button: string, buttonAction: any}) {
return(
<div className={styles.block}>
 <p className={styles.block_title}>{title}</p>
 <p className={styles.block_description}>{"Datos del comprador"}</p>
<div className={styles.block_data_block}>

{datosComprador !== undefined && Object.entries(datosComprador).map(([key, value]: [string, string], index: number) => <div key={index} className={styles.block_item} >
                                <p className={styles.block_item_name}>{key}</p>
                                <p className={styles.block_item_value}>{value}</p>
                              </div>  
                                )}
                                </div>
<div className={styles.block_data_block}>
<p className={styles.block_description}>{"Datos del envío"}</p>
 {Object.entries(datosEnvio).map(([key,value], index) => <div key={index} className={styles.block_item} >
                                <p className={styles.block_item_name}>{key}</p>
                                <p className={styles.block_item_value}>{value}</p>
                              </div>  
                                )}
                                </div>

 <p className={styles.block_description}>{"Detalle de la compra"}</p>
<div className={styles.block_data_block}>
{items.map((item, index) => <div key={index} className={styles.block_item} >
                                <p className={styles.block_item_name}>{item.name} x {item.cant}</p>
                                <p className={styles.block_item_value}>${item.price * item.cant}</p>
                              </div>  
                                )}
 <div  className={styles.block_item} >
                                <p className={styles.block_item_name}>Costo de servicio</p>
                                <p className={styles.block_item_value}>${service_price}</p>
                              </div>
                              </div>
    <div className={styles.block_total}>
        <p className={styles.block_total_name}>Total</p>
        <p className={styles.block_total_value}>${items.reduce((acc, item) => acc + item.price * item.cant, 0) + service_price} </p> 
    </div>

 <button className={styles.block_button_comp} onClick={buttonAction} >{button}</button>
</div>
)
}