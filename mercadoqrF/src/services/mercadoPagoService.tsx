import { apiClient } from 'utils/apiClient';
import ProducType from '../models/product';
import endpoints from 'utils/endpoints';
import ErrorType from 'errors/errorType';

export default class MercadoPagoService {
    static async getInitPoint(product: ProducType): Promise<ErrorType<String>> {
        return apiClient(endpoints.mp.getInitPoint, {method: 'POST', body: JSON.stringify({prod_id:product.id, 
                                                                                              place_id:product.place_id})});
    }
}