import React, { useState } from "react";
import styles from "./Product.module.css";
import placeServices from "../../../services/placeServices.js"
import { Popup } from "../../../Popup/Popup.js";

function Product({ data, closeClick, user, place_id }) {
    const [modal, setModal] = useState(false);
    const [qr, setQr] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleQuantity = ({ target }) => {
        if (target.value >= 1) setQuantity(target.value);
        return;
    }

    const handleConfirmedBuy = async (e) => {
        e.preventDefault();
        if (user.balance >= data.product_price * quantity) {
            try {
                const result = await placeServices.buyqr(place_id, user.id, data.prod_id, quantity)
                if (result.success) {
                    setQr(result.qr);
                }
            } catch (e) {
                console.error('No se pudo realizar la compora' + e);
            }
        }
        else {
            alert("No tienes saldo suficiente");
        }
    }

    return (
        <Popup close={closeClick} top={false} modal={modal}>
            {!modal ?
                <div className={styles.product_card}>
                    <div className={styles.product_img}>
                        <img src={data.product_img} alt={data.product_name} />
                    </div>
                    <div className={styles.product_info}>
                        <p className={styles.product_name}>{data.product_name}</p>
                        <p className={styles.product_price}>${quantity * data.product_price}</p>
                    </div>
                    <input type="number" value={quantity} onChange={handleQuantity} placeholder="cantidad" />
                    <div>
                        <button className={styles.product_fastbuy} onClick={() => setModal(true)}>Compra Rapida</button>
                    </div>

                </div>
                : !qr ?
                    <div className={styles.product_card}>
                        <p>Vas a comprar {quantity} {data.product_name}</p>
                        <div className={styles.product_img}>
                            <img src={data.product_img} alt={data.product_name} />
                        </div>
                        <div className={styles.product_info}>
                            <p className={styles.product_price}>${quantity * data.product_price}</p>
                        </div>
                        <div>
                            <button className={styles.product_fastbuy} onClick={handleConfirmedBuy}>Confirmar Compra</button>
                        </div>

                    </div>
                    :
                    <div className={styles.product_card}>
                        <h3>Gracias por tu compra!</h3>
                        <img height={"200px"} src="../../qr.png" alt="qrcode" />
                        <p>{qr}</p>
                    </div>

            }

        </Popup>
    )
}

export default Product;