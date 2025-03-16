import e, { Request, Response, NextFunction } from 'express';
import MercadoPagoService from '../services/MercadoPagoService';
import { sendSuccess } from '../utils/respondeUtil';

export default class MercadoPagoController {
    private mercadoPagoService: MercadoPagoService;
    constructor(mercadoPagoService: MercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
        this.getInitPoint = this.getInitPoint.bind(this);
        console.log('Servicio MercadoPago activo');
    }
    async getInitPoint(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {envio_email, envio_telefono, prod_id, prod_cant, place_id} = req.body;
        try {
            const preference = await this.mercadoPagoService.getInitPoint(place_id, prod_id, prod_cant, envio_email, envio_telefono)
            sendSuccess(res,preference)
        } catch (error) {
            next(error)
        }
    }

    async processMPNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('processMPNotification');
        const {payment_id} = req.body;
        try {
            await this.mercadoPagoService.notifyPayment(payment_id)
            sendSuccess(res)
        } catch (error) {
            next(error)
        }
    }
}