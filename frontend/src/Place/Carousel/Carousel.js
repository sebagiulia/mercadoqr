import React, { useState } from "react";
import styles from "./Carousel.module.css"
import Product from "./Product/Product.js"

function ProdCarousel({ data, user, place_id }) {
    const [state, setState] = useState({
        there_is_click: false,
        product_data: {}
    });

    const productClick = (prod_data) => {
        setState({
            there_is_click: true,
            product_data: prod_data
        });
    }

    const closeClick = () => {
        setState({
            there_is_click: false,
            product_data: {}
        });
    }
    return (
        <div onClick={() => productClick(data)} className={styles.prod_carousel}>
            <div className={styles.product_img}>
                <img src={data.product_img} alt={data.product_name} />
            </div>
            <div className={styles.prod_carousel_header}>
                <p className={styles.name}>{data.product_name}</p>
                <p className={styles.price}><strong>$</strong>{data.product_price}</p>
            </div>
            {state.there_is_click ? <Product data={state.product_data} closeClick={closeClick} place_id={place_id} user={user} /> : null}
        </div>
    );
}

function Carousel({ products, click, user, place_id }) {
    return (
        <div className={styles.carousel} >
            {products.map(prod => <ProdCarousel key={prod.product_id} data={prod} place_id={place_id} click={click} user={user} />)}
        </div>
    );
}

export default Carousel;