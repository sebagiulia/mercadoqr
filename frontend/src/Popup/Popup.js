import React from 'react'
import styles from './Popup.module.css'
import clsx from 'clsx';
import { motion } from 'framer-motion'


export function Popup({ children, modal, top, close }) {
    const handleOverlayClick = (e) => {
        // Cierra el popup solo si el clic ocurre en el fondo (overlay)
        if (Array.from(e.target.classList).some((clase) => /overlay/.test(clase))) {
            close();
            e.stopPropagation();
        }
    }

    const style_overlay = clsx(styles.overlay, {
        [styles.overlay_center]: modal,
        [styles.overlay_top]: top,
        [styles.overlay_bottom]: !top && !modal,
    })

    const style_popup = clsx(styles.popup, {
        [styles.popup_top]: top,
        [styles.popup_bottom]: !top,
    })


    const variants = {
        top_initial: {  marginTop: "-100%" },
        top: { marginTop: 0 },
        bottom_initial: { marginBottom: "-100%" },
        bottom: { marginBottom: 0 }
      }

    return (
        <div className={style_overlay} onClick={handleOverlayClick}>
            {modal ?
                <div className={styles.modal}>
                    {children}
                </div>
                :
                <motion.div initial={top? "top_initial" : "bottom_initial"}
                            animate={top? "top" : "bottom"} 
                            transition={{ duration: .1 }} 
                            variants={variants}
                            className={style_popup}>
                    {children}
                </motion.div>
            }
        </div>
    );
}