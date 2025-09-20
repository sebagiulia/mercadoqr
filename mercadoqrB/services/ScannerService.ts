import Scanner from "../models/Scanner";

export default interface ScannerService {
    getScanners(place_id:number): Promise<Scanner[]>;
    addScanner(place_id: number, sc:Scanner): Promise<Scanner>;
    removeScanner(id: number): Promise<void>;
    updateScanner(id: number, sc:Partial<Scanner>): Promise<Scanner>;
}