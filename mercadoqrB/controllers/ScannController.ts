import {  Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannService from "../services/ScannService";
import { AuthRequest } from "../middleware/tokenAuth";

export default class ScannController {
  private scannService: ScannService;
  constructor(scannService: ScannService) {
    this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
    this.validateScanner = this.validateScanner.bind(this);
    this.scannService = scannService;
    console.log("✅ Servicio de Scann activo");
  }

  async consumeQrByQrId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
   console.log("solicitud consumeQrByQrId");
    const qrId = req.params.id;
    const { placeId, scannerId } = req;
    
    // TEST //
    if(qrId === "ESTOesUNtestDEprueba") {
      sendSuccess(res, { message: "QR de prueba consumido correctamente" });
      return;
    }
      
    
    try {
      const prod = await this.scannService.consumeQrByQrId(qrId, placeId || 0, scannerId || 0);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }

  }

  async validateScanner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    console.log("solicitud validateScanner");
    const { localName, validationCode } = req.body;
    try {
      const isValid = await this.scannService.validate(localName, validationCode);
      sendSuccess(res, isValid);
    } catch (error) {
      next(error);
    }

  }


}