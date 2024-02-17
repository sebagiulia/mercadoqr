import React, { useEffect, useState } from "react";
import styles from './UserInfo.module.css'
import { Popup } from "../Popup/Popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import tokenServices from '../services/tokenServices'
import { useNavigate } from "react-router";
import userServices from '../services/userServices.js'
import QrList from "../Place/Qrpage/Qrpage.js";
import { SearchPlaces } from "../Search/Search.js";

function PlacesInfo({ user_id }) {
    const [places, setPlaces] = useState({ state: false, list: [] });

    const navigate = useNavigate();

    const handleNewPlaceClick = (e) => {
        e.preventDefault();
        navigate('/create');
    }

    useEffect(() => {
        const getSucs = async () => {
            try {
                const result = await userServices.getplaces(user_id);
                if (result?.success) {
                    setPlaces({ state: true, list: result.places });
                } else {
                    setPlaces({ state: true, list: [] });
                }
            } catch (e) {
                console.error('No se pudo recuperar la lista de subs:' + e);
                setPlaces({ state: true, list: [] });
            }
        }

        getSucs();
    }, [user_id])

    return (
        <div className={styles.subscriptions_popup_container}>
            <h3>Mis Sucursales</h3>
            <div className={styles.subscriptions_container}>
                {!places.state ? <>Cargando</> :
                    !places.list ? <>No se pudo recuperar la lista</> :
                        <SearchPlaces places={places.list} />
                }

                <div onClick={handleNewPlaceClick}>
                    <p>Nueva sucursal</p>
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </div>
            </div>
        </div>
    );
}

function SubscriptionsInfo({ user_id }) {
    const [subs, setSubs] = useState({ state: false, list: [] });

    useEffect(() => {
        const getSubs = async () => {
            try {
                const result = await userServices.getsubs(user_id);
                if (result?.success) {
                    setSubs({ state: true, list: result.subs });
                } else {
                    setSubs({ state: true, list: [] });
                }
            } catch (e) {
                console.error('No se pudo recuperar la lista de subs:' + e);
                setSubs({ state: true, list: [] });
            }
        }

        getSubs();
    }, [user_id])

    return (
        <div className={styles.subscriptions_popup_container}>
            <h3>Mis subscripciones</h3>
            <div className={styles.subscriptions_container}>
                {!subs.state ? <>Cargando</> :
                    !subs.list ? <>No se pudo recuperar la lista</> :
                        <SearchPlaces places={subs.list} />
                }
            </div>
        </div>
    );
}

export function QrsInfo({ user_id }) {

    const [qr_list, setQr_list] = useState({ state: false, list: [] });

    useEffect(() => {
        const getQrs = async () => {
            try {
                const result = await userServices.getqrs(user_id);
                if (result?.success) {
                    setQr_list({ state: true, list: result.qr_list });
                } else {
                    setQr_list({ state: true, list: [] });
                }
            } catch (e) {
                console.error('No se pudo recuperar la lista de qrs:' + e);
                setQr_list({ state: true, list: [] });
            }
        }

        getQrs();
    }, [user_id])

    return (
        <div className={styles.qrs_popup_container}>
            <h3>Mis Qrs</h3>
            <div className={styles.qrs_container}>
                {!qr_list.state ? <>Cargando</> :
                    !qr_list.list ? <>No se pudo recuperar la lista</> :
                        <QrList qrs={qr_list.list} />
                }
            </div>
        </div>
    );
}

export function UserInfo({ close, user }) {

    const [options, setOptions] = useState({ misqr: false, subscriptions: false, balance: false, places: false });

    const navigate = useNavigate()

    const handleProfileClick = (e) => {
        // Cierra el popup solo si el clic ocurre en el fondo (overlay)
        close();
        e.stopPropagation();
    }

    const handleLogInButton = (e) => {
        e.preventDefault();
        navigate("/");
    }

    const handleLogOutButton = (e) => {
        e.preventDefault();
        tokenServices.removeToken();
        window.location.reload();
    }

    return (

        <Popup close={close} top={!(options.balance || options.misqr || options.subscriptions || options.places)}>
            {options.misqr ? <QrsInfo user_id={user.user_id} /> :
                options.subscriptions ? <SubscriptionsInfo user_id={user.user_id} /> :
                    options.places ? <PlacesInfo user_id={user.user_id} /> :
                        user.user_name !== 'Visitante' ?
                            <>
                                <div className={styles.popup_options}>
                                    <div onClick={() => setOptions({ ...options, balance: true })} className={styles.popup_option}>
                                        <p>Saldo</p>
                                        <p>{user.user_balance}</p>
                                    </div>
                                    <div onClick={() => setOptions({ ...options, misqr: true })} className={styles.popup_option}>
                                        <p>Mis Qrs</p>
                                        <p>{user.user_qrs}</p>
                                    </div>
                                    <div onClick={() => setOptions({ ...options, subscriptions: true })} className={styles.popup_option}>
                                        <p>Suscripciones</p>
                                        <p>{user.user_subscriptions}</p>
                                    </div>
                                    <div onClick={() => setOptions({ ...options, places: true })} className={styles.popup_option}>
                                        <p>Mis Sucursales</p>
                                        <p></p>
                                    </div>
                                    {window.location.pathname !== '/' ? <div onClick={() => navigate("/")} className={styles.popup_option}>
                                        <p>Inicio</p>
                                    </div> : null}
                                    <button className={styles.logout_button} onClick={handleLogOutButton}>Cerrar Sesion</button>
                                </div>
                                <div onClick={handleProfileClick} className={styles.popup_profile}>
                                    <p>{user ? user.name : "Visitante"} <FontAwesomeIcon icon="fa-solid fa-chevron-up" /></p>
                                </div>
                            </>
                            :
                            <>
                                <div className={styles.popup_options}>
                                    <div onClick={handleLogInButton} className={styles.popup_option}>
                                        <p>Ingresar</p>
                                    </div>
                                </div>

                            </>}

        </Popup>
    );
}