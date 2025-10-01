import Scanner from "../../models/Scanner";
import ScannerRepository from "../../repositories/scannerRepository";
import ScannerService from "../ScannerService";

export default class ScannerServiceImp implements ScannerService {
    private scannerRepository: ScannerRepository;
    constructor(scannerRepository: ScannerRepository) {
        console.log("✅ Servicio de Scanner activo");
        this.scannerRepository = scannerRepository;
    }

    async getScanner(place_id:number, scanner_id:number): Promise<Scanner> {
        return this.scannerRepository.getScannerById(place_id, scanner_id); 
    }

    async getScanners(place_id:number): Promise<Scanner[]> {
        return this.scannerRepository.getScanners(place_id); 
    }

    async addScanner(place_id: number, sc:Scanner): Promise<Scanner> {
        const newScanner = { ...sc, place_id };
        this.scannerRepository.addScanner(place_id, newScanner);
        return newScanner;
    }

    async removeScanner(id: number): Promise<void> {
        const scanner = await this.scannerRepository.removeScanner(id);
    }

    async updateScanner(id: number, sc:Partial<Scanner>): Promise<Scanner>{
        const updatedScanner = await this.scannerRepository.updateScanner(id, sc);
        return updatedScanner;
    }
}