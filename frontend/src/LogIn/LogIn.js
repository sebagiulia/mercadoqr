
import React, { useState } from 'react';
import styles from './LogIn.module.css'
import { Link } from 'react-router-dom'
import loginService from '../services/loginServices'
import { Popup } from '../Popup/Popup.js'
import { Input } from '../Input/Input.js'

function LogIn({ close }) {

	const [errorMessage, setErrorMessage] = useState({});
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const user = await loginService.login({
				email,
				password
			})
			if(user.state){
				console.log(user);
				window.localStorage.setItem('userToken', user.token);
				window.location.reload();
			} else {
				setErrorMessage(user.error)
				return;
			} 
		} catch (e) {
			setErrorMessage({submit: true});
			console.log(errorMessage);
		}

	}

	return (
		<Popup close={close} top={false}>
			<div className={styles.login}>

				<p>Iniciar Sesión</p>
				<form className={styles.form} onSubmit={handleSubmit}>

					<Input type="email"
						   name="email"
						   value={email}
						   onChange={({ target }) => setEmail(target.value)}
						   error={errorMessage?.email}
					/>

					<Input type="password"
						   name="password"
						   value={password}
						   onChange={({ target }) => setPassword(target.value)}
						   error={errorMessage?.password}
					/>
					<div className="d-grid gap-2">
						<button className="btn btn-primary rounded-5" type="submit">Ingresar</button>
					</div>
				</form>
				<div>
					<p>¿No tenés cuenta?</p>
					<Link to="/register">Registrarse</Link>
				</div>
			</div>
		</Popup>
	);
}

export default LogIn;