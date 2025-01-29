'use client'
import styles from './place.module.css';
import  PlaceType from '../models/place';
import  ProductType from '../models/product';
import { useRouter } from "next/navigation";


function PlaceHeader({place}: { place: PlaceType }) {
    return (
      <div className={styles.header}>
          <div className={styles.place_img}>
          <img src={place.img} /* place.img */ 
                 alt=""
                 width={100} 
                height={100}/>
          </div>
          <div className={styles.place_name}>{place.name}</div>
          <div className={styles.place_address}>{place.address}</div>
      </div>
    );
}

function Product({product, placename}: { product: ProductType, placename: string }) {
    const router = useRouter();
    const handleClick = () => {
        router.push('/local/' + placename + '/'  + product.name.replace(' ', '-'));
    };

    return (
      <div onClick={handleClick} className={styles.product}>
        <div className={styles.product_image}>
            <img src={product.img} /* product.img */ 
               alt=""
               width={200}
               height={200}/>
        </div>
        <div className={styles.product_info}>
            <div className={styles.product_name}>{(product.name)}</div>
            <div className={styles.product_price}>$ {product.price}</div>
        </div>
      </div>
    );
}

function PlaceCatalog({products, placename}: { products: ProductType[], placename: string }) {
    return (
      <div className={styles.catalog}>
        {products.map(element => <Product placename={placename} key={element.id} product={element} />)}
      </div>
    );
}

export default function Place({place, products}: { place: PlaceType, products: ProductType[] }) {
    return (<div className={styles.place}>
        <PlaceHeader place={place}/>
        <PlaceCatalog placename={place.name} products={products}/>
        </div>);
}

