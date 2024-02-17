import React, { useState } from "react";
import styles from "./UserHomePage.module.css";
import { Search } from "../Search/Search.js";
import { QrButton } from "../Qr/QrButton.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserInfo } from "../UserInfo/UserInfo.js"

function UserPopUp({ user, close }) {
    return (
        <div className={styles.user_popup}>
            <UserInfo user={user} close={close} />
        </div>
    );
}
function UserHeader({ user }) {

    const [click, setClick] = useState(false);

    if (click) {
        return (
                <UserPopUp user={user} close={() => setClick(false)}/>
        );
    } else {
        return (
            <div className={styles.user_homepage_header}>
                <div onClick={() => setClick(true)} className={styles.user_homepage_header_name}>
                    <p>{user.user_name}</p>
                    <FontAwesomeIcon icon="fa-solid fa-caret-down" />
                </div>
            </div>
        );
    }
}

function UserHomePage({ user }) {
    return (
        <div className={styles.UserHomePage}>
            <UserHeader user={user} />
            <Search />
            <QrButton user_id={user.user_id} />
        </div>
    );
}

export default UserHomePage;