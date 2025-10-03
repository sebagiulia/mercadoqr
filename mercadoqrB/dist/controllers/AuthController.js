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
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.authAdmin = this.authAdmin.bind(this);
        this.authScann = this.authScann.bind(this);
        console.log('✅ Servicio AuthController activo');
    }
    authAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password } = req.body;
            try {
                const result = yield this.authService.loginAdmin(name, password);
                (0, respondeUtil_1.sendSuccess)(res, result);
            }
            catch (err) {
                next(err);
            }
        });
    }
    authScann(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password, place } = req.body;
            try {
                const result = yield this.authService.loginScanner(name, password, place);
                (0, respondeUtil_1.sendSuccess)(res, result);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = AuthController;
