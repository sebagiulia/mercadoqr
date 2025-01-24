"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("./errors");
const respondeUtil_1 = require("../utils/respondeUtil");
const errorHandler = (err, req, res, next) => {
    if (err instanceof errors_1.AppError) {
        (0, respondeUtil_1.sendError)(res, err.statusCode.toString(), err.message);
    }
    else {
        console.log('Error inesperado: ' + err);
        (0, respondeUtil_1.sendError)(res, '500', 'Internal Server Error');
    }
};
exports.errorHandler = errorHandler;
