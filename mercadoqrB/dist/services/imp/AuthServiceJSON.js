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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../errors/errors");
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";
class AuthServiceJSON {
    constructor(placeRepository, scannerRepository) {
        this.placeRepository = placeRepository;
        this.scannerRepository = scannerRepository;
    }
    loginAdmin(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.placeRepository.getPlace(name);
            if (!place)
                throw new errors_1.NotFoundError("Lugar no encontrado");
            const valid = yield bcrypt_1.default.compare(password, place.passwordHash);
            if (!valid)
                throw new errors_1.AuthorizationError("Credenciales inválidas");
            const token = jsonwebtoken_1.default.sign({ placeId: place.id }, JWT_SECRET, { expiresIn: "1h" });
            return { token };
        });
    }
    loginScanner(name, password, place) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeData = yield this.placeRepository.getPlace(place);
            if (!placeData)
                throw new errors_1.NotFoundError("Lugar no encontrado");
            const scanners = yield this.scannerRepository.getScanners(placeData.id);
            const scanner = scanners.find((s) => s.name === name);
            if (!scanner)
                throw new errors_1.NotFoundError("Escáner no encontrado");
            /* const valid = await bcrypt.compare(password, scanner.passwordHash); */
            const valid = password === scanner.accessCode; // Temporal mientras no se implemente el registro de escáneres
            if (!valid)
                throw new errors_1.AuthorizationError("Credenciales inválidas");
            const token = jsonwebtoken_1.default.sign({ placeId: scanner.place_id, scannerId: scanner.id }, JWT_SECRET, { expiresIn: "5h" });
            return { token };
        });
    }
}
exports.default = AuthServiceJSON;
