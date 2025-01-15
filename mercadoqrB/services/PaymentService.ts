import { PaymentResult, RefundResult } from "../schemas/PaymentResult";

export default interface PaymentProvider {
    // Inicializa el cliente del proveedor de pagos.
    initialize(config: Record<string, any>): void;

    // Procesa un pago.
    processPayment(amount: number, currency: string, paymentDetails: Record<string, any>): Promise<PaymentResult>;

    // Realiza un reembolso.
    refund(transactionId: string, amount?: number): Promise<RefundResult>;
  }