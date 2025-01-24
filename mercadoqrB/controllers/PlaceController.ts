import PlaceService from "../services/PlaceService";
import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/respondeUtil";
export default class PlaceController {
    private placeService: PlaceService;

    constructor(placeService : PlaceService) {
        this.placeService = placeService;
        this.getPlace = this.getPlace.bind(this);
        this.getPlaces = this.getPlaces.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.getTendences = this.getTendences.bind(this);
        console.log('Servicio de places activo');

    }

    async getTendences(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log('solicitud getTendences');
        try {
            const tendences = await this.placeService.getTendences()
            sendSuccess(res, tendences)
        } catch (error) {
            next(error)
        }
    }

    async getPlace(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log('solicitud getPlace');
        const placeName = req.params.place
        try {
            const place = await this.placeService.getPlace(placeName)
            sendSuccess(res, place)
        } catch (error) {
            next(error)
        }
    }

    async getPlaces(req:Request, res:Response, next:NextFunction): Promise<void> {
        console.log('solicitud getPlaces');
        const placeName = req.params.place;
        try {
            const places = await this.placeService.getPlaces(placeName)

            sendSuccess(res, places)
        } catch (error) {
            next(error)
        }
    }
    async getProducts(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log('solicitud getProducts');
        const placeId = req.params.id;
        try {
            const products = await this.placeService.getProducts(parseInt(placeId, 10));
            sendSuccess(res, products);
        } catch (error) {
            next(error)
        }    
    }
    async getProduct(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log('solicitud getProduct');
        const placeName = req.params.place;
        const productName = req.params.product;
        try {
            const product = await this.placeService.getProduct(placeName, productName);
            sendSuccess(res, product);
        } catch (error) {
            next(error)        
        }
    }
}