import axios from 'axios'
const baseUrl = process.env.REACT_APP_SERVER_URL + "/register";

const register = async input => {
    const { data } = await axios.post(baseUrl, input);
    return data;
}
const registerServices = { register }
export default registerServices

