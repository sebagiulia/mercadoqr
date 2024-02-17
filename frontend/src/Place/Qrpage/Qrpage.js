import React, { useState } from "react";
import styles from "./Qrpage.module.css"
import qrcode from "qrcode-generator";

function QrPopUp( {qr, closeClick} ) {
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qrc = qrcode(typeNumber, errorCorrectionLevel);
    qrc.addData(qr.qr_id);
    qrc.make();
    var img = qrc.createImgTag()
    const handleOverlayClick = (e) => {
        // Cierra el popup solo si el clic ocurre en el fondo (overlay)
        if (Array.from(e.target.classList).some((clase) => /overlay/.test(clase))) {
            closeClick();
            e.stopPropagation();
        }
    }
    return(
        <div className={styles.qr_overlay} onClick={handleOverlayClick}>
            <div className={styles.qr_popup}>
                <div dangerouslySetInnerHTML={{ __html: img}} className={styles.qr_popup_container} />
                <p>{qr.code}</p>
                <p>{qr.name}</p>
            </div>
        </div>
    );
}

function Qr({ qr }) {
    const [state, setState] = useState({ click: false })
    
    const click = () => {setState({click:true})}

    const closeClick = () => {setState({click: false})}

    return (
        <div className={styles.qr_card} onClick={() => click()}>
            <div className={styles.qr_card_img}>
                <img src="qr.png" alt="qr" />
            </div>
            <div className={styles.qr_card_info}>
                <p>{qr.name}</p>
            </div>
            { state.click? <QrPopUp qr={qr} closeClick={closeClick}/>: null}
        </div>
    );
}



function QrList({ qrs }) {
    return (
        <div className={styles.qr_list}>
            {qrs.map((qr, i) => <Qr key={i} qr={qr} />)}
        </div>
    );
}

export default QrList;