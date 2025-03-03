import { Request, Response, NextFunction } from 'express';
import MercadoPagoService from '../services/MercadoPagoService';
import { sendSuccess } from '../utils/respondeUtil';

export default class MercadoPagoController {
    private mercadoPagoService: MercadoPagoService;
    constructor(mercadoPagoService: MercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
        this.getInitPoint = this.getInitPoint.bind(this);
    }
    async getInitPoint(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('getInitPoint');
        const {place_id, prod_id} = req.body;
        try {
            const preferenceId = await this.mercadoPagoService.getInitPoint(place_id, prod_id, 1)
            sendSuccess(res,preferenceId)
        } catch (error) {
            next(error)
        }
    }
}