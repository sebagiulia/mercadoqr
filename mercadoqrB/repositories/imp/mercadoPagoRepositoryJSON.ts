import MercadoPagoRepository from "../mercadoPagoRepository"
import payments from '../../data/payments.json'
import PaymentRecord from "../../schemas/PaymentRecord";
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from "crypto";
import { NotFoundError } from "../../errors/errors";

const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/payments.json');


// Función para agregar datos al JSON
function writePayment(payment:PaymentRecord): void {
    const qrsString = fs.readFileSync(filePath, 'utf-8');
    const payments = JSON.parse(qrsString) as PaymentRecord[];
    payments.map((paymentItem: PaymentRecord) => { 
        if (paymentItem.payment_id === payment.payment_id) {
            paymentItem = payment
        }
    })
    fs.writeFileSync(filePath, JSON.stringify(payments, null, 2));
}



export default class MercadoPagoRepositoryJSON implements MercadoPagoRepository {
    private payments: PaymentRecord[]
    
    constructor() {
        this.payments = payments
    }

    async createNewPayment(): Promise<string> {
        const payment_id = randomUUID().toString();
        return payment_id;
    }
    async saveDataPayment(payment:PaymentRecord): Promise<void> {
        writePayment(payment);
    }

    async getDataPayment(payment_id:string): Promise<PaymentRecord> {
        const payment = this.payments.find((payment: PaymentRecord) => payment.payment_id === payment_id);
        if(payment) {
            return payment;
        }
        throw new NotFoundError('No se encontró el pago');
    }

    async removeDataPayment(payment_id:string): Promise<void> {
        const payment = this.payments.find((payment: PaymentRecord) => payment.payment_id === payment_id);
        if(payment) {
            const index = this.payments.indexOf(payment);
            this.payments.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(this.payments, null, 2));
            return;
        }
        throw new NotFoundError('No se encontró el pago');
    }

}