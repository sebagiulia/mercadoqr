'use client'
import styles from './place.module.css';
import  PlaceType from '../models/place';
import  ProductType from '../models/product';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { GridLoader } from 'react-spinners';
import Image from 'next/image';
import Arrow from '../../public/arrow.svg';

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
  
  export function PlaceHeaderSkeleton() {
      return (
        <div className={styles.header}>
              <div className={styles.skeleton} style={{width:'50%', height:'100px', borderRadius:'20px'}} />
        </div>
      );
  }

function Product({product, placename}: { product: ProductType, placename: string }) {
    const router = useRouter();
    const [click, setClick] = useState(false);
    const handleClick = () => {
        setClick(true);
        if (product.stock === "Agotado") {
          setClick(false);
          alert("Producto agotado");
          return;
        }
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
            {product.stock === "Agotado" ? 
            <div className={styles.product_stock_agotado}>AGOTADO</div> :
            <div className={styles.product_price}>$ {product.price}</div>}
        </div>
        {click && (
        <div className={styles.loader_overlay}>
          <GridLoader color="#ffffff" size={15} />
        </div>
      )}
      </div>
    );
}

function ProductSekeleton() {
  return (
    <div className={styles.product_skeleton}>
      <div className={styles.skeleton} style={{width:'100%', height:'100%', borderRadius:'20px'}}/>
    </div>
  );
}

export function PlaceCategories({categories, selectedCategory, changeCategory}: { categories: string[], selectedCategory: string, changeCategory: (category: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  const handleClose = (element: string): React.MouseEventHandler<HTMLDivElement> => () => {
    changeCategory(element);
    setIsOpen(false);
  }

  return (<div className={styles.place_categories_container}>
    {!isOpen && <div className={styles.selected_category} onClick={handleOpen}>{selectedCategory} <Image src={Arrow} alt={''} height={20} /></div>
}
               <div  className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
                {[...categories, "Todo"].map((element, index) => <div  onClick={handleClose(element)} key={index} className={styles.catalog_category}>{element}</div>)}
              </div>


  </div>) 
}

export function PlaceCategoriesSkeleton() {
  return (
    <div className={styles.place_categories_container}>
    </div>
  );
}

export function PlaceCatalog({products, place}:{products: ProductType[], place: PlaceType}) {
    return (
      <div className={`${styles.catalog} ${products.length === 0? styles.catalog_no_products:'' }` }>
        {products.length === 0 ? <div className={styles.no_products}>Catalogo no disponible</div> :
        products.map(element => <Product placename={place.name} key={element.id} product={element} />)}
      </div>
    );
}

export function PlaceCatalogSkeleton() {
    return (
      <div className={styles.catalog}>
        <ProductSekeleton />
        <ProductSekeleton />
        <ProductSekeleton />
        <ProductSekeleton />
        <ProductSekeleton />
        <ProductSekeleton />
      </div>
    );
}





