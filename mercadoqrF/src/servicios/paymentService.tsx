import FormPayment from "@/models/formpayment";
export default interface PaymentService {
    processPayment(form:FormPayment):Promise<any>;
    refundPayment():Promise<void>;
}