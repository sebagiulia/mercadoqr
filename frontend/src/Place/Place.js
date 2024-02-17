import React, { useEffect, useState } from "react";
import styles from './Place.module.css';
import Carousel from "./Carousel/Carousel.js";
import QrList from "./Qrpage/Qrpage.js"
import ProfileHeader from "./ProfileHeader/ProfileHeader.js"
import { useNavigate, useParams } from "react-router";
import placeServices from "../services/placeServices";
import tokenServices from "../services/tokenServices";
import LogIn from '../LogIn/LogIn.js'


function QrPage({ user_id, place_id }) {

    const [qr_list, setQr_list] = useState([]);

    useEffect(() => {
        const getQrList = async () => {
            tokenServices.setToken();
            const data = await placeServices.getQrListFromUserId({ place_id, user_id });
            if (!data?.error) setQr_list(data);
        }

        if (user_id) getQrList();

    }, [user_id, place_id])

    return (
        <div className={styles.qr_page}>
            <QrList qrs={qr_list} />
        </div>
    );

}

function Store({ place, user }) {
    /* Aca deberia hacer un fetch a la api de sucursales con la id: id */
    const products = place.products;
    return (
        <div className={styles.store}>
            {Object.keys(products).map((prod_cat, idx) => <div key={idx} className={styles.category_card} >
                <p>{prod_cat}</p>
                <Carousel place_id={place.place_id} products={products[prod_cat]} user={user}/>
            </div>)}
        </div>
    );
}

function Place() {
    const params = useParams();
    const [user, setUser] = useState({
        id: null,
        user_name: "Visitante",
        user_balance: 0,
        subscriber: false,
        roll: null,
        admin: false
    });
    const [login, setLogin] = useState(false);
    const [place, setPlace] = useState(null);
    const [store, setStore] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await placeServices.getPlace(params.place_name);
                if (data.success) {
                    setPlace(data);
                }
            } catch (error) {
                console.error("There was an error: " + error);
            }
        }

        getData();
    }, [params.place_name]);

    useEffect(() => {
        const getUserData = async place_id => {
            tokenServices.setToken();
            const userData = await placeServices.getUserDataFromPlaceId(place_id);
            if (!userData?.error) setUser(userData);
        }

        if (place) getUserData(place.place_id);

    }, [place])

    const handleButton = async (e) => {
        e.preventDefault();
        if (user.subscriber) {
            setUser({ ...user, subscriber: false, roll: null })
            /* Eliminar seguidor */
            try {
                await placeServices.unsubscribeToPlace(place.place_id, user.user_id);
            } catch (e) {
                console.error('Hubo un error en la subscripcion' + e);
            }
        } else if(user.admin) {

            /* Verificar password */
            
            navigate('/' + place.place_name + '/admin');

        } else if(user.user_name === "Visitante") {
            setLogin(true);
            return;

        } else {
            /* Agregar seguidor */
            try {
                const result = await placeServices.subscribeToPlace(place.place_id, user.user_id);
                if (result.success)
                    setUser({ ...user, subscriber: true })
            } catch (e) {
                console.error('Hubo un error en la subscripcion' + e);
            }
        }
    }

    const radioChange = (e) => {
        e.target.value === 'store' ?
            setStore(true)
            :
            setStore(false);
    }

    if (!place) return (<div>Cargando</div>)
    return (
        <div>
            <ProfileHeader user={user} />
            <div className={styles.place_header}>
                <div className={styles.place_header_profile}>
                    <img src={place.place_img} alt={place.place_name} />
                    <div>
                        <p>{place.place_name}</p>
                        {user.subscriber ? <button onClick={handleButton} className={styles.subscribed_button}>Subscripto</button>
                            : user.admin? <button onClick={handleButton} className={styles.admin_button}>Administrar</button>: 
                                            <button onClick={handleButton} className={styles.subscribe_button}>Suscribirse</button>}
                        {user.roll ? <p>{user.roll.roll_name}</p> : null}
                    </div>
                </div>
                <div className={styles.place_options}>
                    <label className={styles.place_options_label} onChange={radioChange} >
                        <input type="radio" name="place" value="store" defaultChecked />
                        Store
                        <div className={styles.place_options_line} />
                    </label>
                    <label className={styles.place_options_label} onChange={radioChange}>
                        <input type="radio" name="place" value="qrckets" />
                        Qrckets
                        <div className={styles.place_options_line} />
                    </label>
                </div>
            </div>
            <div className={styles.place_options}>
                {store ?
                    <Store place={place} user={user} />
                    :
                    <QrPage place_id={place.id} user_id={user.id} />}
                {login ? <LogIn close={() => setLogin(false)} /> : null}

            </div>
        </div>
    );
}

export default Place;