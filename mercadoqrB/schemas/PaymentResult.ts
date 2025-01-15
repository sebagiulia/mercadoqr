/**
 * Representa el resultado de un pago.
 */
export interface PaymentResult {
    transactionId: string;
  }
  
  /**
   * Representa el resultado de un reembolso.
   */
  export interface RefundResult {
    refundId: string;
  }