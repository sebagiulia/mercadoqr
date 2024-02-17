import styles from "./ProfileHeader.module.css"
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserInfo } from '../../UserInfo/UserInfo.js'

function ProfileHeader({ user }) {
    const [state, setState] = useState({ click: false })

    const click = () => {setState({click:true})}
    const closeClick = () => {setState({click:false})}

    return (
        <div onClick={click} className={styles.place_profile_header}>
            <p>{user.user_name} <FontAwesomeIcon icon="fa-solid fa-chevron-down" /></p>
            {state.click ? <UserInfo user={user} close={closeClick}/> : null}
        </div>
    );
}

export default ProfileHeader;