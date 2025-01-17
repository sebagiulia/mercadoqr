import PaymentService from "../PaymentService";
import PaymentProduct from "../../schemas/PaymentProduct";
import { PaymentResult, RefundResult } from "../../schemas/PaymentResult";
import { PaymentError } from "../../errors/errors";
import randomGenerator from '../../utils/randomGenerator';
import QrRepository from "../../repositories/qrRepository";

export default class PaymentServiceDefault implements PaymentService {
    private qrRepository: QrRepository;
    constructor(qrRepository: QrRepository) {
        this.qrRepository = qrRepository;
    }

    initialize(config: Record<string, any>): void {
        // Do nothing.
    }

    async processPayment(amount: number, currency: string, paymentDetails: PaymentProduct): Promise<PaymentResult> {
        const newQrCode = randomGenerator([]);
        const { place_id, prod_id } = paymentDetails;
        const date = new Date().toISOString();
        const qr = {place_id, prod_id, expiration: date, code: newQrCode, id:''};
        const qrid = await this.qrRepository.createQr(qr)
        return { transactionId: qrid };
    }

    async refund(transactionId: string, amount?: number): Promise<RefundResult> {
        throw new PaymentError("Refund not implemented");
    }
}