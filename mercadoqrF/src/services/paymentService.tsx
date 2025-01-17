import FormPayment from "@/models/formpayment";
import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";

export default class PaymentService {
    static async processPayment(form: FormPayment): Promise<any> {
        return apiClient(endpoints.payment.processPayment, {method: 'POST', body: JSON.stringify(form)});
    }

    static async refundPayment(): Promise<void> {
        return Promise.resolve()
    }
}