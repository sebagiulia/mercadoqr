import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import ScannService from "../services/ScannService";

export default class ScannController {
  private scannService: ScannService;
  constructor(scannService: ScannService) {
    this.getProdByQrId = this.getProdByQrId.bind(this);
    this.getProdByQrCode = this.getProdByQrCode.bind(this);
    this.consumeQrByQrCode = this.consumeQrByQrCode.bind(this);
    this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
    this.validateScanner = this.validateScanner.bind(this);
    this.scannService = scannService;
    console.log("Servicio de scann activo");
  }

  async getProdByQrCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("solicitud getProdByQrCode");
    const {code} = req.body;
    try {
      const prod = await this.scannService.getProdByQrCode(code);
      sendSuccess(res, prod);
    } catch (error) {
      next(error);
    }
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

  async consumeQrByQrCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("solicitud consumeQrByQrCode");
    const {qrcode } = req.body;
    try {
      const prod = await this.scannService.consumeQrByQrCode(qrcode);
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