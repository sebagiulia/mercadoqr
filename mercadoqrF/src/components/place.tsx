'use client'
import styles from './place.module.css';
import  PlaceType from '../models/place';
import  ProductType from '../models/product';
import { useRouter } from "next/navigation";
import { useState } from 'react';


export function PlaceHeader({place}: { place: PlaceType }) {
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
            <img className={styles.product_image} src={product.img} /* product.img */ 
               alt=""
               width={200}
               height={200}/>
        <div className={styles.product_info}>
            <div className={styles.product_cat}>{product.category}</div>
            <div className={styles.product_name}>{(product.name)}</div>
            <div className={styles.product_price}>$ {product.price}</div>
        </div>
      </div>
    );
}

export function PlaceCategories({categories, selectedCategory, changeCategory}: { categories: string[], selectedCategory: string, changeCategory: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  const handleClose = (element: string): React.MouseEventHandler<HTMLDivElement> => (event) => {
    changeCategory(element);
    setIsOpen(false);
  }

  return (<div className={styles.place_categories_container}>
    {!isOpen ? <div onClick={handleOpen}>Categoria: {selectedCategory}</div>
                 :
               <div>
                {[...categories, "Todo"].map((element, index) => <div onClick={handleClose(element)} key={index} className={styles.catalog_category}>{element}</div>)}
              </div>}


  </div>) 
}

export function PlaceCatalog({products, place}:{products: ProductType[], place: PlaceType}) {
    return (
      <div className={styles.catalog}>
        {products.map(element => <Product placename={place.name} key={element.id} product={element} />)}
      </div>
    );
}

