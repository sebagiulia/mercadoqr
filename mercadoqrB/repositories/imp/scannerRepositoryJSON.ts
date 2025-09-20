import { NotFoundError } from "../../errors/errors";
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
    async addScanner(place_id:number, sc: Scanner): Promise<Scanner> {
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