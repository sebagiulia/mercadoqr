export default interface MercadoPagoService {
    getInitPoint(place_id:string, prod_id:string, quantity: number): Promise<string>;
}