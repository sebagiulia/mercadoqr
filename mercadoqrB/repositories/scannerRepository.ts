import Scanner from "../models/Scanner";

export default interface ScannerRepository {
    getScannerById(place_id:number, scanner_id:number): Promise<Scanner>;
    getScanner(name: string): Promise<Scanner | null>;
    getScanners(place_id:number): Promise<Scanner[]>;
    addScanner(place_id: number, scanner:Scanner): Promise<Scanner>;
    removeScanner(id: number): Promise<void>;
    updateScanner(id: number, scanner:Partial<Scanner>): Promise<any>;
}