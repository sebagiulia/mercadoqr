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
        console.log('✅ Servicio de Places activo');

    }

    async createProduct(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
        const product = req.body as Product;
        try {
            if(req.placeId !== product.place_id) {
                throw new TokenError('El token no es válido para este lugar');
            }
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

    async deleteProduct(req: AuthRequest, res: Response, next:NextFunction): Promise<void> {
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