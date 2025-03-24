import PaymentRecord from "../schemas/PaymentRecord";

export default interface MercadoPagoRepository {
    createNewPayment(place_id:number, prod_id:number, prod_cant:number):Promise<string>;
    saveDataPayment(payment: PaymentRecord):Promise<void>;
    getDataPayment(payment_id:string):Promise<PaymentRecord>;
    removeDataPayment(payment_id:string):Promise<void>;
    updateStatus(payment_id:string, status:string):Promise<void>;
}