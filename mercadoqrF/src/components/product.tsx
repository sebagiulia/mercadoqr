'use client'; // Marca todo el componente como cliente

import styles from './product.module.css';
import ProductType from '../models/product';
import PlaceType from '../models/place';
import { MouseEventHandler, useState } from 'react';
import MercadoPagoService from 'services/mercadoPagoService';
import { GridLoader } from 'react-spinners';


export default function Product({ product, place }: { product: ProductType, place:PlaceType }) {
    const etiquetasComprador:string[] = [];
    const etiquetasEnvio = ["Email", "Telefono"];
    const [cant, setCant] = useState("1");

    const [step, setStep] = useState(etiquetasComprador.length > 0 ? 0 : 1);
    const [isProcessing, setIsProcessing] = useState(false);
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

    const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCant(e.target.value);
    }
    
    const handleDatosComprador = () => {
        if(Object.values(datosComprador).some((value) => value === "")) {
            alert("Debe completar todos los campos");
            return;
        }
        setStep(1);
    }


    const handleDatosEnvio = () => {
        if(Object.values(datosEnvio).some((value) => value === "")) {
            alert("Debe completar todos los campos");
            return;
        }

        if(datosEnvio["Telefono"].length < 10 || datosEnvio["Telefono"].match(/\D/)) {
            alert("Ingrese un número de teléfono válido");
            return;
        }

        if(!datosEnvio["Email"].includes("@")) {
            alert("Ingrese un correo válido");
            return;
        }

        setStep(product.stock > 1 ? 2 : 3);
    }

    const handleCantidad = () => {
        const number = parseInt(cant);
        if(isNaN(number)) {
            alert("Escriba un número válido");
        }
        else if(number <= 0) {
            alert("La cantidad debe ser mayor a 0");
        } else {

            setStep(3);
        }
    }


    const handleCompra = async () => {
        setIsProcessing(true);
        const datosProd = {place_id: place.id, prod_id: product.id, cant: parseInt(cant)};
        const response = await MercadoPagoService.getInitPoint(datosProd, datosComprador, datosEnvio);
        if(response.success) {
            const url = response.data as string;
            setIsProcessing(false)
            window.location.href = url;
        } else {            
            setIsProcessing(false)
            console.log(response);
            alert("No se pudo procesar el pedido");
        }
    }

    const handleStep = (step: number) => {
        setStep(step);
    }
    return (
        <div className={styles.page}>
            <div className={styles.title}><p>{product.name}</p></div>
            <div className={styles.info}>
                <div className={styles.imgs_product_place}>
                    <img className={styles.src_img_place} src={place.img} alt={place.name} />
                    <img className={styles.src_img_product} src={product.img} alt={product.name} />
                </div>
                <div className={styles.description_product}>{product.description}</div>
            </div>
            { product.stock === 0 ? 
                <div className="">AGOTADO</div>
                :
              step === 0 ?
                <Block  title={"Datos del comprador"}
                        description={"Estos datos son solicitados directamente por el vendedor"}
                        form={datosComprador}
                        etiquetas={etiquetasComprador}
                        button="Siguiente"
                        buttonAction={handleDatosComprador}
                        change={handleChangeDatosComprador} />

            :
            step === 1 ?
                <Block title={"Datos de envío"}
                        description={"Rellene correctamente los campos del envío, mercadoqr le enviará su QR a estos destinos"}
                        form={datosEnvio}
                        etiquetas={etiquetasEnvio}
                        button="Siguiente"
                        buttonAction={handleDatosEnvio}
                        change={handleChangeDatosEnvio} />
            : step === 2?
                <Block title={"Cantidad"}
                        description={"Seleccione la cantidad de este producto que desea comprar"}
                        form={{Cantidad: cant.toString()}}
                        etiquetas={["Cantidad"]}
                        button="Siguiente"
                        buttonAction={handleCantidad}
                        change={handleChangeCantidad} />
                
            : step === 3 ?
                <DetalleCompra
                 title='Revisa tu pedido'
                 datosComprador={datosComprador}
                 datosEnvio={datosEnvio}
                 items={[{name: product.name, price: product.price, cant: parseInt(cant)}]}
                 service_price={0}
                 button='Comprar'
                 buttonAction={handleCompra}
                 handleStep={handleStep}
                 processing={isProcessing}
                    stock={product.stock}
                />
            : <></>
            }
        </div>
    );
}
function Block({title, description, form, etiquetas, button, buttonAction, change}:
               {title: string, description: string, form: Record<string, string>,
                etiquetas: Array<string>, button: string, buttonAction:() => void , change:(e: React.ChangeEvent<HTMLInputElement>) => void}) {
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
                                                 placeholder={et}
                                                 autoCapitalize='none'
                                                 />)}
            <button className={styles.block_button} onClick={buttonAction} >{button}</button>
        </div>
    )
}

function DetalleCompra({title, datosComprador, datosEnvio, items, service_price, button, buttonAction, handleStep, stock, processing}:
    {title: string,
     datosComprador:Record<string,string>,
     datosEnvio:Record<string,string>,
     items: Array<{name:string, price:number, cant:number}>,
     service_price:number, button: string, buttonAction: () => void,
     handleStep: (step: number) => void,
     stock: number,
     processing: boolean}) {
return(
<div className={styles.block}>
 <p className={styles.block_title}>{title}</p>


{Object.keys(datosComprador).length > 0 &&
   <div className={styles.block_section}>
<div className={styles.block_section_hd}><p>Datos del comprador</p><span onClick={() => handleStep(0)}>Modificar</span></div>
<div className={styles.block_data_block}>

       {Object.entries(datosComprador).map(([key, value]: [string, string], index: number) => <div key={index} className={styles.block_item} >
                                       <p className={styles.block_item_name}>{key}</p>
                                       <p className={styles.block_item_value}>{value}</p>
                                     </div>
                                       )}
                                </div>
   </div>
     }
     <div className={styles.block_section}>
<div className={styles.block_section_hd}><p>Datos del envío</p><span onClick={() => handleStep(1)}>Modificar</span></div>
<div className={styles.block_data_block}>
 {Object.entries(datosEnvio).map(([key,value], index) => <div key={index} className={styles.block_item} >
                                <p className={styles.block_item_name}>{key}</p>
                                <p className={styles.block_item_value}>{value}</p>
                              </div>
                                )}
                                </div>
</div>
     <div className={styles.block_section}>
      <div className={styles.block_section_hd}><p>Detalle de la compra</p>{stock > 1 ?<span onClick={() => handleStep(2)}>Modificar</span>:<></>}</div>
<div className={styles.block_data_block}>
{items.map((item, index) => <div key={index} className={styles.block_item} >
                                <p className={styles.block_item_name}>{item.name} x {item.cant}</p>
                                <p className={styles.block_item_value}>$ {item.price * item.cant}</p>
                              </div>
                                )}
 <div  className={styles.block_item} >
                                <p className={styles.block_item_name}>Costo de servicio</p>
                                <p className={styles.block_item_value}>$ {service_price}</p>
                              </div>
                              </div>
</div>
    <div className={styles.block_total}>

        <p className={styles.block_total_name}>Total</p>
        <p className={styles.block_total_value}>$ {items.reduce((acc, item) => acc + item.price * item.cant, 0) + service_price} </p>
    </div>

 <button className={styles.block_button_comp} onClick={buttonAction} >{button}</button>
 { processing && (
        <div className={styles.loader_overlay}>
          <GridLoader color="#ffffff" size={15} />
        </div>
      )}
</div>
)
}
