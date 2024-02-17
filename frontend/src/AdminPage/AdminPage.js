import { useParams } from 'react-router'
import styles from './AdminPage.module.css'
import placeServices from '../services/placeServices';
import tokenServices from '../services/tokenServices';
import loginServices from '../services/loginServices';
import adminServices from '../services/adminServices';
import { Input, InputSelect } from '../Input/Input';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Popup } from './../Popup/Popup.js'

function Subs() {
    return (
        <div>

        </div>
    );
}

function NewRoll() {
    return (
        <div className={styles.newprod_container}>
            <input type='text' placeholder='Nombre del roll' />
            <input type='text' placeholder='Capacidades' />
            <input type='text' placeholder='Color' />
            <button>Lanzar Roll</button>
        </div>
    );
}

function NewProduct({ close, place_id, products, rolls }) {
    const [product, setProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        visible: '',
        expiration: ''
    })

    const [img, setImg] = useState(false)

    const handleChange = (e) => setProduct({
        ...product,
        [e.target.name]: e.target.value
    })

    const handleClickButton = async (e) => {
        e.preventDefault();
        console.log({ ...product, img })
        if (!(Object.values(product).every(val => val !== '') && img !== null)) {
            alert('Por favor completar todos los campos');
            return;
        }

        tokenServices.setToken();
        const result = await adminServices.raiseProduct(place_id, { ...product, img })
        if (result?.success) {
            console.log('Producto pusheado')
            return;
        }
        console.error('Error en pusheo')
        console.log(product);
    }

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        // Verifica si el archivo seleccionado es una imagen
        if (file && file.type.startsWith('image/')) {
            setImg(file)
        } else {
            // Si el archivo no es una imagen, puedes mostrar un mensaje de error o realizar alguna acción adicional
            alert('Por favor, selecciona un archivo de imagen válido.');
        }
    }

    const srcImg = img => {
        const imgURL = URL.createObjectURL(img);
        return imgURL;
    }

    const categories = Object.keys(products);

    return (
        <Popup close={close}>
            <div className={styles.newprod_container}>

                <label className={styles.file}>
                    {img ?
                        <>
                            <input className={styles.inputimg} type="file" name="img" onChange={handleImgChange} />
                            <img className={styles.img} src={srcImg(img)} alt="foto" />:
                        </> : <>
                            <input className={styles.inputimg} type="file" name="img" onChange={handleImgChange} />
                            +
                        </>
                    }
                </label>


                <Input type={'text'} value={product.name} placeholder='Nombre del producto' name='name' onChange={handleChange} />
                <InputSelect type={'text'} value={product.category} placeholder='Categoria' name={'category'} onChange={handleChange} options={categories} create={true} />
                <Input type={'number'} value={product.price} placeholder='Precio' name='price' onChange={handleChange} />
                <Input type={'text'} value={product.description} name='description' placeholder='Descripcion' onChange={handleChange} />
                <InputSelect type={'text'} value={product.visible} name='visible' placeholder='Visible para' onChange={handleChange} options={['todos']} />
                <Input type={'date'} value={product.expiration} name={'expiration'} onChange={handleChange} />
                <button className={styles.raise_product_button} onClick={handleClickButton}>Lanzar producto</button>
            </div>
        </Popup>

    );
}

function Admin({ place_name }) {

    const [place, setPlace] = useState(null);
    const [newProd, setNewProd] = useState(null);
    const [rolls, setRolls] = useState(null);
    const [subs, setSubs] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                tokenServices.setToken();
                const place = await placeServices.getPlace(place_name);
                if (place.success) setPlace(place);
            } catch (error) {
                console.error("There was an error in admin.");
            }
        }

        getData();
    }, [place_name]);

    return (
        <>
            {!place ? <>Cargando...</>
                :
                <div>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <img src={place.place_img} alt={place.place_name} />
                        </div>
                        <h1>{place.place_name}</h1>
                    <Link to='/'>Volver al inicio</Link>
                    </div>
                    <div className={styles.edition_panel}>
                        <button className={styles.newprod_button} onClick={() => setNewProd(true)}>
                            Nuevo Producto
                        </button>
                        {newProd ?
                            <NewProduct place_id={place.place_id} close={() => setNewProd(false)} products={place.products} /> : null}
                        {!subs ?
                            <button className={styles.subs_button} onClick={() => setSubs(true)}>
                                Subscripciones
                            </button>
                            :
                            <Subs />}
                        {!rolls ?
                            <button className={styles.rolls_button} onClick={() => setRolls(true)}>
                                Roles
                            </button>
                            :
                            <Subs />}
                        {!products ?
                            <button className={styles.products_button} onClick={() => setProducts(true)}>
                                Productos
                            </button>
                            :
                            <Subs />}
                    </div>
                </div>
            }
        </>
    );
}

export function AdminPage() {
    const { place_name } = useParams();
    const [admin, setAdmin] = useState(false);
    const [access, setAccess] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const handleAdminButton = async (e) => {
        e.preventDefault();
        if (!(email && password)) {
            alert("Porfavor completa todos los campos.")
            return;
        }
        const user = await loginServices.login({ email, password });
        const place = await placeServices.getPlace(place_name);
        if (user.state && place.success) {
            if (user.user_id === place.user_id)
                setAdmin(true);
            else setErrorMessage(user.error);
        } else {
            setErrorMessage(user.error);
        }
    }

    useEffect(() => {
        const getData = async () => {
            try {
                tokenServices.setToken();
                const result = await placeServices.validateUserAdmin(place_name);
                if (result.success) setAccess(true);
            } catch (error) {
                console.error("There was an error in admin.");
            }
        }

        getData();
    }, [place_name]);

    return (
        <>
            {admin ?
                <Admin place_name={place_name} /> :
                access ?
                    <div className={styles.login_container}>
                        <h1>Administrador <strong>{place_name}</strong></h1>
                        <p>Porfavor ingrese sus credenciales</p>
                        <div className={styles.login_inputs}>
                            <Input type={'email'} name={'email'}
                                value={email} onChange={e => setEmail(e.target.value)} error={errorMessage} />
                            <Input type={'password'} name={'contraseña'}
                                value={password} onChange={e => setPassword(e.target.value)} error={errorMessage} />
                            <button onClick={handleAdminButton}>Administrar</button>
                        </div>
                            <Link to='/'>Volver al inicio</Link>
                    </div>
                    :
                    <div className={styles.intruder_container}>
                        <h1>404</h1>
                        <h2>Pagina no encontrada</h2>
                        <Link to='/'>Volver al inicio</Link>
                    </div>
            }
        </>
    )



}