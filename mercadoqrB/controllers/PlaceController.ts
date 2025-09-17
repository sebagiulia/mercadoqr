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
        this.getCategories = this.getCategories.bind(this);
        this.createPlace = this.createPlace.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        console.log('✅ Servicio de Places activo');

    }

    async createPlace(req: Request, res: Response, next:NextFunction): Promise<void> {
        const place = req.body;
        try {
            const newPlace = await this.placeService.createPlace(place);
            sendSuccess(res, newPlace, 'Solicitud recibida');
        } catch (error) {
            next(error)
        }
    }

    async getPlace(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeName = req.params.place
        try {
            const place = await this.placeService.getPlace(placeName)
            sendSuccess(res, place)
        } catch (error) {
            next(error)
        }
    }

    async getPlaces(req:Request, res:Response, next:NextFunction): Promise<void> {
        const placeName = req.params.place;
        try {
            const places = await this.placeService.getPlaces(placeName)

            sendSuccess(res, places)
        } catch (error) {
            next(error)
        }
    }
    async getProducts(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeId = req.params.id;
        const category = req.params.category;
        try {
            const products = await this.placeService.getProducts(parseInt(placeId, 10), category);
            sendSuccess(res, products);
        } catch (error) {
            next(error)
        }    
    }
    async getProduct(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeName = req.params.place;
        const productName = req.params.product;
        try {
            const product = await this.placeService.getProduct(placeName, productName);
            sendSuccess(res, product);
        } catch (error) {
            next(error)        
        }
    }

    async getCategories(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeName = req.params.place;
        try {
            const categories = await this.placeService.getCategories(placeName);
            sendSuccess(res, categories);
        } catch (error) {
            next(error)        
        }
    }

    async updateProduct(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeId = req.params.placeId;
        const productId = req.params.productId;
        const product = req.body;
        try {
            const updatedProduct = await this.placeService.updateProduct(parseInt(placeId, 10), parseInt(productId, 10), product);
            sendSuccess(res, updatedProduct);
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req: Request, res: Response, next:NextFunction): Promise<void> {
        const placeId = req.params.placeId;
        const productId = req.params.productId;
        try {
            await this.placeService.deleteProduct(parseInt(placeId, 10), parseInt(productId, 10));
            sendSuccess(res, 'Producto eliminado');
        } catch (error) {
            next(error)
        }
    }
}