import MercadoPagoRepository from "../mercadoPagoRepository"
import PaymentRecord from "../../schemas/PaymentRecord";
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from "crypto";
import { NotFoundError } from "../../errors/errors";

const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/payments.json');


// Función para agregar datos al JSON
function writePayment(payment:PaymentRecord): void {
    const paymentsString = fs.readFileSync(filePath, 'utf-8');
    const payments = JSON.parse(paymentsString) as PaymentRecord[];
    if (!payments.find((paymentItem: PaymentRecord) => paymentItem.id === payment.id)) {
        payments.push(payment);
    } else {
        payments.map((paymentItem: PaymentRecord) => { 
            if (paymentItem.id === payment.id) {
                Object.assign(paymentItem, payment);
            }
        })
    }
    fs.writeFileSync(filePath, JSON.stringify(payments, null, 2));
}



export default class MercadoPagoRepositoryJSON implements MercadoPagoRepository {
    private payments: PaymentRecord[]
    
    constructor() {
        const paymentsString = fs.readFileSync(filePath, 'utf-8');
        this.payments = JSON.parse(paymentsString) as PaymentRecord[];
    }

    async createNewPayment(place_id:number, prod_id:number, prod_cant:number): Promise<string> {
        const id = randomUUID().toString();
        return id;
    }
    async saveDataPayment(payment:PaymentRecord): Promise<void> {
        writePayment(payment);
    }

    async getDataPayment(id:string): Promise<PaymentRecord> {
        const paymentsString = fs.readFileSync(filePath, 'utf-8');
        this.payments = JSON.parse(paymentsString) as PaymentRecord[];
        const payment = this.payments.find((payment: PaymentRecord) => payment.id === id);
        if(payment) {
            return payment;
        }
        throw new NotFoundError('No se encontró el pago');
    }

    async removeDataPayment(id:string): Promise<void> {
        const paymentsString = fs.readFileSync(filePath, 'utf-8');
        this.payments = JSON.parse(paymentsString) as PaymentRecord[];
        const payment = this.payments.find((payment: PaymentRecord) => payment.id === id);
        if(payment) {
            const index = this.payments.indexOf(payment);
            this.payments.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(this.payments, null, 2));
            return;
        }
        throw new NotFoundError('No se encontró el pago');
    }

    async updateStatus(id:string, status:string): Promise<void> {
        const paymentsString = fs.readFileSync(filePath, 'utf-8');
        this.payments = JSON.parse(paymentsString) as PaymentRecord[];
        const payment = this.payments.find((payment: PaymentRecord) => payment.id === id);
        if(payment) {
            payment.status = status;
            writePayment(payment);
            return;
        }
        throw new NotFoundError('No se encontró el pago');
    }

}