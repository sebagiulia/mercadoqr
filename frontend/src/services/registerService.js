import axios from 'axios'
const baseUrl = process.env.SERVER_URL + "/register";

const register = async input => {
    const { data } = await axios.post(baseUrl, input);
    return data;
}
const registerServices = { register }
export default registerServices

