import axios from 'axios'
const baseUrl = process.env.REACT_APP_SERVER_URL + "/api/places/";

const search = async (place, credentials) => {
    const { data } = await axios.get(baseUrl + place);
    return data;
}
const searchServices = { search }

export default searchServices
