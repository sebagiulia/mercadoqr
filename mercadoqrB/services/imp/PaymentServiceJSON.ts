import PaymentService from "../PaymentService";
import PaymentProduct from "../../schemas/PaymentProduct";
import { PaymentResult, RefundResult } from "../../schemas/PaymentResult";
import { PaymentError } from "../../errors/errors";


export default class PaymentServiceJSON implements PaymentService {
    initialize(config: Record<string, any>): void {
        // Do nothing.
    }

    async processPayment(amount: number, currency: string, paymentDetails: PaymentProduct): Promise<PaymentResult> {
        if(paymentDetails.name === "test") {
            return { transactionId: "123456" };
        }
        if(amount > 0) {
            throw new PaymentError("Testing error");
        }
        throw new PaymentError("Amount error");
    }

    async refund(transactionId: string, amount?: number): Promise<RefundResult> {
        return { refundId: "654321" };
    }
}