import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/respondeUtil';
import QrService from '../services/QrService';

export default class QrController {

    private qrService: QrService;
    constructor(qrService: QrService) {
        this.qrService = qrService;
        this.getQrById = this.getQrById.bind(this);
        console.log('Servicio de qr activo');
    }

    async getQrById(req: Request, res: Response, next:NextFunction): Promise<void> {
        const qrId = req.params.qr;
        try {
            const qr = await this.qrService.getQrById(qrId);
            sendSuccess(res, qr);
        } catch (error) {
            next(error);
    }
    }
}