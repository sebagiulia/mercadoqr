import React, { useState } from "react";
import styles from './QrButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popup } from "../Popup/Popup";
import { QrsInfo } from  "../UserInfo/UserInfo.js"


export function QrButton( { user_id }) {
    const [click, setClick] = useState(false);

    if (click) {
        return (
            <Popup close={() => setClick(false)} top={false}>
                <QrsInfo  user_id={user_id}/>
            </Popup>
        );
    } else {
        return (
            <div className={styles.qr_button}>
                <div onClick={() => setClick(true)} className="btn btn-outline-primary rounded-5">
                    <FontAwesomeIcon icon="fa-solid fa-qrcode" />
                </div>
            </div>
        );
    }


}