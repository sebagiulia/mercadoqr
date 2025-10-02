import {  Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannService from "../services/ScannService";
import { AuthRequest } from "../middleware/tokenAuth";

export default class ScannController {
  private scannService: ScannService;
  constructor(scannService: ScannService) {
    this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
    this.getQRData = this.getQRData.bind(this);
    this.scannService = scannService;
    console.log("✅ Servicio de Scann activo");
  }

  async consumeQrByQrId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
   const {qr_code} = req.body;
   const { placeId, scannerId } = req;
    
    // TEST //
    if(qr_code === "ESTOesUNtestDEprueba") {
      sendSuccess(res, { message: "QR de prueba consumido correctamente" });
      return;
    }
      
    
    try {
      const prod = await this.scannService.consumeQrByQrId(qr_code, placeId || 0, scannerId || 0);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }

  }

  async getQRData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const {qr_code} = req.body;
    const { placeId, scannerId } = req;


    try {
      const prod = await this.scannService.getQRData(qr_code, placeId || 0, scannerId || 0);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }
  }

}