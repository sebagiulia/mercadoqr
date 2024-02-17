import axios from 'axios'
const baseUrl = process.env.REACT_APP_SERVER_URL + "/token";

let token = null;

const setToken = () => {
    const tok = window.localStorage.getItem('userToken');
    if (tok) {
        token = tok;
    }
}

const removeToken = () => {
    token = null;
    window.localStorage.removeItem('userToken');
}

const getUserData = async () => {
    if (token) {
        const { data } = await axios.get(baseUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Puedes añadir más cabeceras según sea necesario
            }
        });
        return data;
    }
    return null;
}


const tokenServices = { getUserData, setToken, token, removeToken }
export default tokenServices
