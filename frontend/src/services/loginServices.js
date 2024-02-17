import axios from 'axios'
const baseUrl = process.env.REACT_APP_SERVER_URL + "/login";

const login = async credentials => {
    const { data } = await axios.post(baseUrl, credentials);
    return data;
}

const loginServices = { login }
export default loginServices

