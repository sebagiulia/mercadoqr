import PlaceService from "../services/PlaceService";
import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/respondeUtil";
import { AuthRequest } from "../middleware/tokenAuth";
import Product from "../schemas/ProductResponse";
import { TokenError } from "../errors/errors";
export default class AdminPlaceController {
    private placeService: PlaceService;

    constructor(placeService : PlaceService) {
        this.placeService = placeService;
        this.getPlace = this.getPlace.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getMovements = this.getMovements.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updatePlace = this.updatePlace.bind(this);
        this.deletePlace = this.deletePlace.bind(this);
        console.log('✅ Servicio de Places activo');

    }

    async createProduct(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const product = req.body as Product;
        try {
            const newProduct = await this.placeService.createProduct(req.placeId || 0, product);
            sendSuccess(res, newProduct);
        } catch (error) {
            next(error)
        }
    }

    async getPlace(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const place_id = req.placeId;
        try {
            const place = await this.placeService.getPlaceById(place_id || 0);
            sendSuccess(res, place)
        } catch (error) {
            next(error)
        }
    }

    async getProducts(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const place_id = req.placeId;
        try {
            const place = await this.placeService.getProducts(place_id || 0, "Todo");
            sendSuccess(res, place)
        } catch (error) {
            next(error)
        }
    }

    async getMovements(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const place_id = req.placeId;
        try {
            const movements = await this.placeService.getMovements(place_id || 0);
            sendSuccess(res, movements)
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const placeId = req.placeId;
        const product = req.body;
        try {
            const updatedProduct = await this.placeService.updateProduct(placeId || 0, parseInt(product.id, 10), product);
            sendSuccess(res, updatedProduct);
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const placeId = req.placeId;
        const productId = req.body.id;
        try {
            await this.placeService.deleteProduct(placeId||0 , parseInt(productId, 10));
            sendSuccess(res, 'Producto eliminado');
        } catch (error) {
            next(error)
        }
    }

    async updatePlace(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const place_id = req.placeId;
        const placeData = req.body;
        try {
            const updatedPlace = await this.placeService.updatePlace(place_id || 0, placeData);
            sendSuccess(res, updatedPlace);
        } catch (error) {
            next(error)
        }
    }

    async deletePlace(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const place_id = req.placeId;
        try {
            await this.placeService.deletePlace(place_id || 0);
            sendSuccess(res, 'Lugar eliminado');
        } catch (error) {
            next(error)
        }
    }
}