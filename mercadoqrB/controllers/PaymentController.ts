import PaymentService from "../services/PaymentService";
import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/respondeUtil";

export default class PaymentController {
    private paymentService: PaymentService;
    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
        this.processPayment = this.processPayment.bind(this);
        this.refund = this.refund.bind(this);
        console.log('Servicio de pagos activo');
    }
    async processPayment(req: Request, res: Response, next:NextFunction) : Promise<void> {
        const paymentDetails = req.body as unknown as { userData: any, productData: any };
        try {
            const result = await this.paymentService.processPayment(-1, 'ar', paymentDetails);
            sendSuccess(res, result);
        } catch (error) {
            next(error)   
        }
    }

    async refund(req: Request, res: Response) : Promise<void> {
        // do nothing
    }
}