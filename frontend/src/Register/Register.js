import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../Input/Input.js'
import styles from './Register.module.css'
import registerService from '../services/registerService'

function SuccessRegister({ name }) {
	return (
		<div className={styles.reg_container}>
			<h1>{name} te has registrado correctamente!</h1>
			<Link to="/">Iniciar sesion</Link>
		</div>
	);
}

function Register() {

	const [inputs, setInputs] = useState({
		name: '',
		lastname: '',
		email: '',
		password: '',
	})

	const [repeatPassword, setRepeatPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (inputs.password !== repeatPassword) {
			setErrorMessage({ repeatPassword: true })
			return;
		}

		try {
			const result = await registerService.register(inputs);
			if (result.error) {
				if (result.error?.email)
					setErrorMessage({ email: true });
				return;
			}
			
			if(result.success)	
				setSuccess(true);

		} catch (error) {
			console.error("There was an error: " + error);
		}

	}

	const handleInputChange = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value
		})
	}

	return (!success ?
		<div className={styles.reg_container}>
			<p>Registrarse</p>
			<div className={styles.link}>
				<p>¿Ya tenés una cuenta?</p>
				<Link to="/">Ingresa aquí</Link>
			</div>
			<form className={styles.form} onSubmit={handleSubmit}>
				<Input onChange={handleInputChange} name={"name"} type={"text"} value={inputs.name} />
				<Input onChange={handleInputChange} name={"lastname"} type={"text"} value={inputs.lastname} />
				<Input error={errorMessage?.email} onChange={handleInputChange} name={"email"} type={"email"} value={inputs.email} />
				<Input onChange={handleInputChange} name={"password"} type={"password"} value={inputs.password} />
				<Input error={errorMessage?.repeatPassword} onChange={({ target }) => setRepeatPassword(target.value)} name={"repeat password"} type={"password"} value={repeatPassword} />
				<div className="d-grid gap-2">
					<button className="btn btn-primary rounded-5">Registrarse</button>
				</div>
			</form>
		</div> :
		<SuccessRegister name={inputs.name} />)

}

export default Register;