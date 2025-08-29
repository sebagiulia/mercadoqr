import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannService from "../services/ScannService";

export default class ScannController {
  private scannService: ScannService;
  constructor(scannService: ScannService) {
    this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
    this.validateScanner = this.validateScanner.bind(this);
    this.scannService = scannService;
    console.log("✅ Servicio de Scann activo");
  }

  async consumeQrByQrId(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log("solicitud consumeQrByQrId");
    const qrId = req.params.id;
    
    // TEST //
    if(qrId === "ESTOesUNtestDEprueba") {
      sendSuccess(res, { message: "QR de prueba consumido correctamente" });
      return;
    }
      
    
    try {
      const prod = await this.scannService.consumeQrByQrId(qrId);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }

  }

  async validateScanner(req: Request, res: Response, next: NextFunction): Promise<void> {
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