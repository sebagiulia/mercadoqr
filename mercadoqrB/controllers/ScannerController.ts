import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannerService from "../services/ScannerService";
import { AuthRequest } from "../middleware/tokenAuth";
export default class ScannerController {
    private scannerService: ScannerService;
    constructor(scannerService:ScannerService) {
        this.scannerService = scannerService;
        console.log("✅ Servicio de Scanner activo");
        this.getScanners = this.getScanners.bind(this);
        this.addScanner = this.addScanner.bind(this);
        this.removeScanner = this.removeScanner.bind(this);
        this.updateScanner = this.updateScanner.bind(this);
    }

    async getScanners(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const { placeId } = req;
        try {
            const scanners = await this.scannerService.getScanners(placeId || 0);
            sendSuccess(res, scanners);
        } catch (error) {
            next(error);
        }
    }

    async addScanner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const { placeId } = req;
        const scanner = req.body;
        try {
            const newScanner = await this.scannerService.addScanner(placeId || 0, scanner);
            sendSuccess(res, newScanner);
        } catch (error) {
            next(error);
        }
    }

    async removeScanner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const id = req.body.scannerId;
        try { 
            const result = await this.scannerService.removeScanner(id);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    async updateScanner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const { placeId } = req;
        const scanner = req.body;
        try {
            const updatedScanner = await this.scannerService.updateScanner(placeId || 0, scanner);
            sendSuccess(res, updatedScanner);
        } catch (error) {
            next(error);
        }
    }
}