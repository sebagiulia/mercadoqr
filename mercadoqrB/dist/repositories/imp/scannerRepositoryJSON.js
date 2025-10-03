"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const errors_1 = require("../../errors/errors");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/scanners.json');
// Función para agregar datos al JSON
function createScanner(newScanner) {
    const scannersString = fs.readFileSync(filePath, 'utf-8');
    const newScanners = JSON.parse(scannersString);
    newScanners.push(newScanner);
    fs.writeFileSync(filePath, JSON.stringify(newScanners, null, 2));
}
class ScannerRepositoryJSON {
    constructor() {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString);
    }
    getScannerById(place_id, scanner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            const scanner = this.scanners.find((scanner) => scanner.place_id === place_id && scanner.id === scanner_id);
            if (!scanner) {
                throw new errors_1.NotFoundError("Scanner not found");
            }
            return scanner;
        });
    }
    addScanner(place_id, sc) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            if (this.scanners.find((scanner) => scanner.name === sc.name && scanner.place_id === place_id)) {
                throw new errors_1.RegistrationError("El nombre del scanner ya existe en esta sucursal.");
            }
            let newId = Math.random() * (100000 - 1) + 1;
            while (this.scanners.find((scanner) => scanner.id === newId && scanner.place_id === place_id)) {
                newId = Math.random() * (100000 - 1) + 1;
            }
            let accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            while (this.scanners.find((scanner) => scanner.accessCode === accessCode && scanner.place_id === place_id)) {
                accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            }
            sc.id = newId;
            sc.place_id = place_id;
            sc.accessCode = accessCode;
            createScanner(sc);
            return sc;
        });
    }
    getScanner(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            const scanner = this.scanners.find((scanner) => scanner.name === name);
            if (!scanner) {
                throw new errors_1.NotFoundError("Scanner not found");
            }
            return scanner;
        });
    }
    getScanners(place_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            const scannersByPlace = this.scanners.filter((scanner) => scanner.place_id === place_id);
            return scannersByPlace;
        });
    }
    removeScanner(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            const scannerIndex = this.scanners.findIndex((scanner) => scanner.id === id);
            if (scannerIndex === -1) {
                throw new errors_1.NotFoundError("Scanner not found");
            }
            this.scanners.splice(scannerIndex, 1);
            fs.writeFileSync(filePath, JSON.stringify(this.scanners, null, 2));
        });
    }
    updateScanner(id, scanner) {
        return __awaiter(this, void 0, void 0, function* () {
            const scannersString = fs.readFileSync(filePath, 'utf-8');
            this.scanners = JSON.parse(scannersString);
            const scannerIndex = this.scanners.findIndex((scannerItem) => scannerItem.id === id);
            if (scannerIndex === -1) {
                throw new errors_1.NotFoundError("Scanner not found");
            }
            const updatedScanner = Object.assign(Object.assign({}, this.scanners[scannerIndex]), scanner);
            this.scanners[scannerIndex] = updatedScanner;
            fs.writeFileSync(filePath, JSON.stringify(this.scanners, null, 2));
            return updatedScanner;
        });
    }
}
exports.default = ScannerRepositoryJSON;
