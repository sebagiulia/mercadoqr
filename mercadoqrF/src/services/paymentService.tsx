import FormPayment from "@/models/formpayment";
import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";
import ErrorType from "errors/errorType";

export default class PaymentService {
    static async processPayment(form: FormPayment): Promise<ErrorType<{transactionId:string}>> {
        return apiClient(endpoints.payment.processPayment, {method: 'POST', body: JSON.stringify(form)});
    }

    static async refundPayment(): Promise<void> {
        return Promise.resolve()
    }
}