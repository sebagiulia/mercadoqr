import axios from 'axios'
import tokenServices from './tokenServices.js'
const baseUrl = process.env.SERVER_URL + "/api/place/";
const userplaceUrl = process.env.SERVER_URL + "/api/userplace";
const qrsUrl = process.env.SERVER_URL + "/api/qrplace";
const subscribeUrl = process.env.SERVER_URL + "/api/subscribe"
const unsubscribeUrl = process.env.SERVER_URL + "/api/unsubscribe"
const buyqrUrl = process.env.SERVER_URL + "/api/buyqr"
const createUrl = process.env.SERVER_URL + "/api/create"

const getQrListFromUserId = async ({ place_id, user_id }) => {
    try {
        const qrs = await axios.post(qrsUrl, { place_id, user_id });
        if (qrs.data.error)
            return { error: { qr_list: true } };

        return qrs.data;
    } catch (e) {
        return { error: e }
    }
}

const getUserDataFromPlaceId = async place_id => {
    try {
        const data = await tokenServices.getUserData();
        if (data.user_id) {

            const userData = await axios.post(userplaceUrl, { place_id, user_id: data.user_id });
            if (userData.data.error)
                return { error: { token: true } };

            return userData.data;
        }
    } catch (e) {
        return { error: e }
    }
}

const getPlace = async place => {
    const { data } = await axios.get(baseUrl + place);
    return data;
}

const subscribeToPlace = async (place_id, user_id) => {
    const { data } = await axios.post(subscribeUrl, { place_id, user_id })
    return data;
}

const unsubscribeToPlace = async (place_id, user_id) => {
    const { data } = await axios.post(unsubscribeUrl, { place_id, user_id });
    return data;
}

const buyqr = async (place_id, user_id, product_id, quantity) => {
    const { data } = await axios.post(buyqrUrl, { place_id, user_id, product_id, quantity });
    return data;
}

const createPlace = async (inputs) => {
    try {
        const formDataForServer = new FormData();
        Object.entries(inputs).forEach(([key, value]) => {
            formDataForServer.append(key, value);
          });
          const data = await tokenServices.getUserData();
          if (data.user_id) {
            formDataForServer.append('user_id', data.user_id)
            const result = await axios.post(createUrl, formDataForServer, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (result.data.error)
                return { error: { token: true } };

            return result.data;
        } else {
            console.error("Token not found");
        }
    } catch (e) {
        return { error: "Error al crear Place" }
    }
}

const validateUserAdmin = async (place_name) => {
    try {
        const data = await tokenServices.getUserData();
        if (data?.user_id) {

            const place = await getPlace(place_name);
            if(data.user_id === place?.user_id)
                return {success: true}
            }
        return { error: "Error Validate User Admin." }
        } catch (e) {
        return { error: "Error Validate User Admin" }
    }
}


const placeServices = { getPlace, getUserDataFromPlaceId, getQrListFromUserId,
                        subscribeToPlace, unsubscribeToPlace, buyqr, createPlace,
                        validateUserAdmin }
export default placeServices
