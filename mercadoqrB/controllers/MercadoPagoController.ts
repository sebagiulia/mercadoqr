import e, { Request, Response, NextFunction } from 'express';
import MercadoPagoService from '../services/MercadoPagoService';
import { sendSuccess } from '../utils/respondeUtil';
import PlaceService from '../services/PlaceService';

export default class MercadoPagoController {
    private mercadoPagoService: MercadoPagoService;
    private placeService: PlaceService;
    constructor(mercadoPagoService: MercadoPagoService, placeService: PlaceService) {
        this.mercadoPagoService = mercadoPagoService;
        this.placeService = placeService;
        this.getInitPoint = this.getInitPoint.bind(this);
        this.processMPNotification = this.processMPNotification.bind(this);
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
        const { payment_id } = req.params;
        try {
            const { topic , id } = req.query;   
            await this.mercadoPagoService.processMPNotification(payment_id, topic, id)
            sendSuccess(res)
        } catch (error) {
            next(error)
        }
    }
}