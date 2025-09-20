import Scanner from "../../models/Scanner";
import ScannerRepository from "../../repositories/scannerRepository";
import ScannerService from "../ScannerService";

export default class ScannerServiceImp implements ScannerService {
    private scannerRepository: ScannerRepository;
    constructor(scannerRepository: ScannerRepository) {
        console.log("✅ Servicio de Scanner activo");
        this.scannerRepository = scannerRepository;
    }

    async getScanners(place_id:number): Promise<Scanner[]> {
        return this.scannerRepository.getScanners(place_id); 
    }

    async addScanner(place_id: number, sc:Scanner): Promise<Scanner> {
        console.log(`Agregando escáner al lugar con ID ${place_id}`);
        const newScanner = { ...sc, place_id };
        this.scannerRepository.addScanner(place_id, newScanner);
        return newScanner;
    }

    async removeScanner(id: number): Promise<void> {
        console.log(`Eliminando escáner con ID ${id}`);
        const scanner = await this.scannerRepository.removeScanner(id);
    }

    async updateScanner(id: number, sc:Partial<Scanner>): Promise<Scanner>{
        console.log(`Actualizando escáner con ID ${id}`);
        const updatedScanner = await this.scannerRepository.updateScanner(id, sc);
        return updatedScanner;
    }
}