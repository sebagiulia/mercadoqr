"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoError = exports.PaymentError = exports.InternalServerError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype); // Necesario para clases personalizadas
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message = 'Datos inválidos', details) {
        super(message, 400, details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado', details) {
        super(message, 404, details);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends AppError {
    constructor(message = 'Error interno del servidor', details) {
        super(message, 500, details);
    }
}
exports.InternalServerError = InternalServerError;
class PaymentError extends AppError {
    constructor(message = 'Error en el pago', details) {
        super(message, 500, details);
    }
}
exports.PaymentError = PaymentError;
class MercadoPagoError extends AppError {
    constructor(message = 'Error de preferencia', details) {
        super(message, 500, details);
    }
}
exports.MercadoPagoError = MercadoPagoError;
