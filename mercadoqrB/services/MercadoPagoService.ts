export default interface MercadoPagoService {
    getInitPoint(place_id:number, prod_id:number, prod_cant:number, email:string, telefono:string): Promise<string>;
    notifyPayment(payment_id:string): Promise<void>;
    processMPNotification(payment_id:string, topic: any, id: any): Promise<void>;

}