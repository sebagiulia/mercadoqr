import { apiClient } from '../utils/apiClient';
import endpoints from '../utils/endpoints';
import ErrorType from '../errors/errorType';

export default class MercadoPagoService {
    static async getInitPoint(datosProd: {place_id: number, prod_id:number, cant:number},
                              datosComprador: Record<string,string>,
                              datosEnvio: Record<string,string>): Promise<ErrorType<string>> {
                                
    const body = JSON.stringify({place_id:datosProd.place_id,
                                 prod_id:datosProd.prod_id, 
                                 prod_cant: datosProd.cant,
                                 envio_email: datosEnvio["Email"],
                                 envio_telefono: datosEnvio["Telefono"],
                                 ...datosComprador
                                });
    return apiClient(endpoints.mp.getInitPoint, {method: 'POST', body: body});
    }
}