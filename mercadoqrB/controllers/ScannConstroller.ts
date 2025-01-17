import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannService from "../services/ScannService";

export default class ScannController {
  private scannService: ScannService;
  constructor(scannService: ScannService) {
    this.scannService = scannService;
    this.getProdByQrId = this.getProdByQrId.bind(this);
    this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
    console.log("Servicio de scann activo");
  }

  async getProdByQrId(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("solicitud getProdByQrId");
    const qrId = req.params.id;
    try {
      const prod = await this.scannService.getProdByQrId(qrId);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }
  }


  async consumeQrByQrId(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log("solicitud consumeQrByQrId");
    const qrId = req.params.id;
    try {
      const prod = await this.scannService.consumeQrByQrId(qrId);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }

  }
}