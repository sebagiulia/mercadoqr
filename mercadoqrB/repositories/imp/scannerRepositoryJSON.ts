import { NotFoundError, RegistrationError } from "../../errors/errors";
import Scanner from "../../models/Scanner";
import * as path from 'path';
import * as fs from 'fs';
import ScannerRepository from "../scannerRepository";

const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/scanners.json');

// Función para agregar datos al JSON
function createScanner(newScanner: Scanner): void {
    const scannersString = fs.readFileSync(filePath, 'utf-8');
    const newScanners = JSON.parse(scannersString) as Scanner[];
    newScanners.push(newScanner);
    fs.writeFileSync(filePath, JSON.stringify(newScanners, null, 2));
}


export default class ScannerRepositoryJSON implements ScannerRepository {

    private scanners: Scanner[];
    constructor() {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
    }

    async getScannerById(place_id:number, scanner_id:number): Promise<Scanner> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        const scanner = this.scanners.find((scanner:Scanner) => scanner.place_id === place_id && scanner.id === scanner_id);
        if (!scanner) {
            throw new NotFoundError("Scanner not found");
        }
        return scanner;
    }


    async addScanner(place_id:number, sc: Scanner): Promise<Scanner> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        if(this.scanners.find((scanner:Scanner) => scanner.name === sc.name && scanner.place_id === place_id)) {
            throw new RegistrationError("El nombre del scanner ya existe en esta sucursal.");
        }
        let newId = Math.random() * (100000 - 1) + 1;
        while (this.scanners.find((scanner:Scanner) => scanner.id === newId && scanner.place_id === place_id)) {
            newId = Math.random() * (100000 - 1) + 1;
        }
        let accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        while (this.scanners.find((scanner:Scanner) => scanner.accessCode === accessCode && scanner.place_id === place_id)) {
            accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        sc.id = newId;
        sc.place_id = place_id;
        sc.accessCode = accessCode;
        createScanner(sc);
        return sc
    }

    async getScanner(name: string): Promise<Scanner> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        const scanner = this.scanners.find((scanner:Scanner) => scanner.name === name);
        if (!scanner) {
            throw new NotFoundError("Scanner not found");
        }
        return scanner;
    }

    async getScanners(place_id:number): Promise<Scanner[]> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        const scannersByPlace = this.scanners.filter((scanner:Scanner) => scanner.place_id === place_id);
        return scannersByPlace;
    }

    async removeScanner(id: number): Promise<void> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        const scannerIndex = this.scanners.findIndex((scanner:Scanner) => scanner.id === id);
        if (scannerIndex === -1) {
            throw new NotFoundError("Scanner not found");
        }
        this.scanners.splice(scannerIndex, 1);
        fs.writeFileSync(filePath, JSON.stringify(this.scanners, null, 2));
    }

    async updateScanner(id: number, scanner: Partial<Scanner>): Promise<any> {
        const scannersString = fs.readFileSync(filePath, 'utf-8');
        this.scanners = JSON.parse(scannersString) as Scanner[];
        const scannerIndex = this.scanners.findIndex((scannerItem:Scanner) => scannerItem.id === id);
        if (scannerIndex === -1) {
            throw new NotFoundError("Scanner not found");
        }
        const updatedScanner = { ...this.scanners[scannerIndex], ...scanner };
        this.scanners[scannerIndex] = updatedScanner;
        fs.writeFileSync(filePath, JSON.stringify(this.scanners, null, 2));
        return updatedScanner;
    }

}