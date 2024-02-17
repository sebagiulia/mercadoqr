import axios from 'axios'
import tokenServices from './tokenServices.js'
const raiseProdUrl =  process.env.SERVER_URL +  "/api/raiseprod"

const raiseProduct = async (place_id, product) => {
    try {
        const formDataForServer = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formDataForServer.append(key, value);
        });
        formDataForServer.append('place_id', place_id)

        const data = await tokenServices.getUserData();
        if (data.user_id) {
            formDataForServer.append('user_id', data.user_id)
            const result = await axios.post(raiseProdUrl, formDataForServer, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return result.data;
        }
        } catch (e) {
            return { error: e }
        }
    }

const adminServices = { raiseProduct }
    export default adminServices
