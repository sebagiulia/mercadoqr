export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: unknown;
    public readonly isOperational: boolean;
  
    constructor(message: string, statusCode: number, details?: unknown) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      this.isOperational = true;
  
      Object.setPrototypeOf(this, new.target.prototype); // Necesario para clases personalizadas
      Error.captureStackTrace(this);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message = 'Datos inválidos', details?: unknown) {
      super(message, 400, details);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado', details?: unknown) {
      super(message, 404, details);
    }
  }
  
  export class InternalServerError extends AppError {
    constructor(message = 'Error interno del servidor', details?: unknown) {
      super(message, 500, details);
    }
}
    export class PaymentError extends AppError {
        constructor(message = 'Error en el pago', details?: unknown) {
          super(message, 500, details);
        }
    }

    export class MercadoPagoError extends AppError {
      constructor(message = 'Error de preferencia', details?: unknown) {
        super(message, 500, details);
      }
    }
  