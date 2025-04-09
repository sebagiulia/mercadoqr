'use client'
import styles from './place.module.css';
import  PlaceType from '../models/place';
import  ProductType from '../models/product';
import { useState } from 'react';
import Image from 'next/image';
import Arrow from '../../public/arrow.svg';
import { motion } from 'framer-motion';

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

function Product({hp, product}: { hp: (prod:ProductType) => void, product: ProductType }) {
    const handleClick = () => {
        if (product.stock === "Agotado") {
          alert("Producto agotado");
          return;
        }
        hp(product);
    };

    return (
      <div onClick={handleClick} className={styles.product}>
        <div className={styles.product_image_container}>
            <img className={styles.product_image} src={product.img} /* product.img */ 
               alt=""
               width={200}
               height={200}/>
        </div>
        <div className={styles.product_info}>
            <div className={styles.product_cat}>{product.category}</div>
            <div className={styles.product_name}>{(product.name)}</div>
            {product.stock === "Agotado" ? 
            <div className={styles.product_stock_agotado}>AGOTADO</div> :
            <div className={styles.product_price}>$ {product.price}</div>}
        </div>
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
    <div className={styles.place_categories_mobile}>
    <div className={styles.selected_category} onClick={handleOpen}>{selectedCategory} <Image src={Arrow} alt={''} height={20} /></div>

    {isOpen && <motion.div 
                className={styles.categories_list} 
                initial={{ opacity: 0 }} // Inicio invisible
                animate={{ opacity: 1 }} // Aparece gradualmente
                exit={{ opacity: 0 }} // Desaparece suavemente
                transition={{ duration: 0.2, ease: "easeOut" }} // Suavidad en la animación
        > 
                 {[...categories, "Todo"].map((element, index) => <div  onClick={handleClose(element)} key={index} className={`${styles.catalog_category} ${element === selectedCategory ? styles.selected : ''}`}>{element}</div>)}
              </motion.div>}
      </div>
              {<div  className={styles.place_categories_desktop}>
                <span>Categorías</span>
                {[...categories, "Todo"].map((element, index) => <div  onClick={handleClose(element)} key={index} className={`${styles.catalog_category_desktop} ${element === selectedCategory ? styles.selected : ''}`}>{element}</div>)}
              </div>}


  </div>) 
}

export function PlaceCategoriesSkeleton() {
  return (
    <div className={styles.place_categories_container}>
    </div>
  );
}

export function PlaceCatalog({selected, products, handleSelectProd}:{selected:string, products: Record<string, ProductType[]>, handleSelectProd: (product: ProductType) => void}) {
    const prods = selected === "Todo" ? Object.values(products).reduce((acc, curr) => acc.concat(curr), []) 
                                      :  products[selected];
    return (
      <div className={`${styles.catalog} ${prods.length === 0? styles.catalog_no_products:'' }` }>
        {prods.length === 0 ? <div className={styles.no_products}>Catalogo no disponible</div> :
        prods.map(element => <Product hp={handleSelectProd} key={element.id} product={element} />)}
      </div>
    );
}

export function PlaceCatalogSkeleton({selected, products, handleSelectProd}:{selected:string, products: Record<string, ProductType[]>, handleSelectProd: (product: ProductType) => void}) {
  const prods = selected === "Todo" ? Object.values(products).reduce((acc, curr) => acc.concat(curr), []) 
  : products[selected];
const skeletons = Math.abs(10 - prods.length);
const rest = Array.from({ length: skeletons }, (_, index) => index);
return (
<div className={styles.catalog} >
  {prods.map(element => <Product hp={handleSelectProd} key={element.id} product={element} />)}
  {rest.map((index) => <ProductSekeleton key={index} />)}
</div>
);
}

export function PopupProduct({ product, placename, handleClose }: { product: ProductType, placename: string, handleClose: () => void }) {

  const handleClick = () => {
      window.location.href = "/local/" + placename + '/' + product.name.replace(" ", "-");
  };

  const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      handleClose();
  }

  return (
      <motion.div 
        className={styles.popup} 
        onClick={handlePopupClick}
        initial={{ opacity: 0 }} // Inicio invisible
        animate={{ opacity: 1 }} // Aparece gradualmente
        exit={{ opacity: 0 }} // Desaparece suavemente
        >
          <motion.div 
            className={styles.popup_content} 
            onClick={(e) => e.stopPropagation()} 
            initial={{ y: 50, opacity: 0 }} // Comienza más abajo con opacidad 0
            animate={{ y: 0, opacity: 1 }} // Se mueve hacia arriba y se hace visible
            exit={{ y: 50, opacity: 0 }} // Se desliza hacia abajo al cerrar
            transition={{ duration: 0.1, ease: "easeOut" }} // Suavidad en la animación
            >
              <img
                  className={styles.product_image}
                  src={product.img}
                  alt={product.name}
                  width={200}
                  height={200}
              />
              <div className={styles.popup_product_info}>
                  <div className={styles.product_cat}>{product.category}</div>
                  <div className={styles.popup_product_description}>{product.description}</div>
                  <div className={styles.popup_product_name}>{product.name}</div>
                  <div className={styles.popup_product_price}>$ {product.price}</div>
              </div>
              <span className={styles.popup_button} onClick={handleClick}>
                  Compra rápida
              </span>
          </motion.div>
      </motion.div>
  );
}





