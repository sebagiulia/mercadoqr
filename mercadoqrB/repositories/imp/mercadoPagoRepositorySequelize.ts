import MercadoPagoRepository from "../mercadoPagoRepository"
import PaymentRecord from "../../schemas/PaymentRecord";
import { NotFoundError } from "../../errors/errors";
import { Payment } from "../../models/Payment";

export default class MercadoPagoRepositorySequelize implements MercadoPagoRepository {

    async createNewPayment(place_id:number, prod_id:number, prod_cant:number): Promise<string> {
        const result = await Payment.create({place_id, prod_id, prod_cant}); 
        return result.id;
    }
    async saveDataPayment(payment:PaymentRecord): Promise<void> {
        Payment.update(payment, {where: {id: payment.id}});
    }

    async getDataPayment(payment_id:string): Promise<PaymentRecord> {
        const payment = await Payment.findByPk(payment_id);
        if(payment) {
            return payment;
        }
        throw new NotFoundError('No se encontró el pago');
    }

    async removeDataPayment(payment_id:string): Promise<void> {
        const payment = await Payment.findByPk(payment_id);
        if(payment) {
            payment.destroy();
            return;
        }
        throw new NotFoundError('No se encontró el pago');
    }

    async updateStatus(payment_id:string, status:string): Promise<void> {
        const payment = await Payment.findByPk(payment_id);
        if(payment) {
            payment.status = status;
            payment.save();
            return;
        }
        throw new NotFoundError('No se encontró el pago');
    }

}