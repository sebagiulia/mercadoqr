import React, { useState, useEffect } from "react";
import styles from './CreatePlace.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import placeServices from '../../services/placeServices.js'
import tokenServices from "../../services/tokenServices";
import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div className={styles.container}>
            <h1>No fue posible crear el negocio</h1>
            <Link to="/">Volver al inicio</Link>
        </div>
    )
}

function SuccesfulPage( { place_name }) {
    return (
        <div className={styles.container}>
            <h1>Negocio creado correctamente!</h1>
            <Link to={"/" + place_name}>Visitar <strong>{place_name}</strong></Link>
        </div>
    )
}

export function CreatePlace() {

    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        instagram: '',
        location: ''
    });

    const [nameError, setNameError] = useState(null);

    const [img, setImg] = useState(null);
    const [succesfulPage, setSuccesfulPage] = useState(false);
    const [errorPage, setErrorPage] = useState(false);

    useEffect(() => {

        const doSearching = async () => {

            try {
                const place = await placeServices.getPlace(inputs.name)
                if (place.state) setNameError('nombre existente')
                else setNameError(null)
            } catch (e) {
                console.error('Error en la busqueda de places');
            }
            return;
        }

        const time = setTimeout(() => {
            if (inputs.name !== '')
                doSearching();
        }, 500); // Esperar 500 milisegundos después de que el usuario deja de escribir

        // Limpiar el temporizador anterior cada vez que el usuario escribe
        return () => clearTimeout(time);
    }, [inputs])


    const srcImg = img => {
        const imgURL = URL.createObjectURL(img);
        return imgURL;
    }

    const handleImgChange = (event) => {
        const file = event.target.files[0];

        // Verifica si el archivo seleccionado es una imagen
        if (file && file.type.startsWith('image/')) {
            setImg(file)

        } else {
            // Si el archivo no es una imagen, puedes mostrar un mensaje de error o realizar alguna acción adicional
            alert('Por favor, selecciona un archivo de imagen válido.');
        }
    };

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleClick = async (e) => {
        e.preventDefault();
        tokenServices.setToken();
        const result = await placeServices.createPlace({ ...inputs, img });
        if (result?.success) {
            setSuccesfulPage(true)
        } else {
            setErrorPage(true)
        }

    }

    return (
        <>
            {errorPage ? <ErrorPage /> :
                succesfulPage ? <SuccesfulPage place_name={inputs.name}/> :
                    <div className={styles.container}>
                        <label className={styles.file}>
                            {img ?
                                <>
                                    <input className={styles.inputimg} type="file" name="img" onChange={handleImgChange} />
                                    <img className={styles.img} src={srcImg(img)} alt="foto" />:
                                </> : <>
                                    <input className={styles.inputimg} type="file" name="img" onChange={handleImgChange} />
                                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                                </>
                            }
                        </label>
                        <label>
                            <input placeholder="Nombre" type="text" name="name" value={inputs.name} onChange={handleChange} />
                            {nameError ? <div className={styles.name_error}></div> : null}
                        </label>

                        <textarea placeholder="Descripcion" name="description" value={inputs.description} onChange={handleChange} />
                        <input placeholder="Ubicacion" type="text" name="location" value={inputs.location} onChange={handleChange} />
                        <input placeholder="Instagram" type="text" name="instagram" value={inputs.instagram} onChange={handleChange} />
                        <button onClick={handleClick}>Continuar</button>
                    </div>
            }
        </>
    );

}