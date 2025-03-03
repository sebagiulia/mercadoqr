"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const respondeUtil_1 = require("../utils/respondeUtil");
class MercadoPagoController {
    constructor(mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
        this.getInitPoint = this.getInitPoint.bind(this);
    }
    getInitPoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getInitPoint');
            const { place_id, prod_id } = req.body;
            try {
                const preferenceId = yield this.mercadoPagoService.getInitPoint(place_id, prod_id, 1);
                (0, respondeUtil_1.sendSuccess)(res, preferenceId);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = MercadoPagoController;
