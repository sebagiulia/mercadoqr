"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, errorCode = 'INTERNAL_ERROR', message = 'Error interno del servidor', details = null, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            details,
        },
    });
};
exports.sendError = sendError;
