import axios from 'axios'
const baseUrl = process.env.REACT_APP_SERVER_URL + + "/api/qrs";
const subsUrl = process.env.REACT_APP_SERVER_URL + + "/api/subs";
const placesUrl = process.env.REACT_APP_SERVER_URL + + "/api/userplaces";

const getqrs = async user_id => {
    const { data } = await axios.post(baseUrl, { user_id });
    return data;
}

const getsubs = async user_id => {
    const { data } = await axios.post(subsUrl, { user_id });
    return data;
}

const getplaces = async user_id => {
    const { data } = await axios.post(placesUrl, { user_id });
    return data;
}

const userServices = { getqrs, getsubs, getplaces }
export default userServices