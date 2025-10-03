import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { sendSuccess } from '../utils/respondeUtil';

export default class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService;
        this.authAdmin = this.authAdmin.bind(this);
        this.authScann = this.authScann.bind(this);
        console.log('✅ Servicio AuthController activo');
    }

    async authAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
	    const { name, password } = req.body;

        try {
          const result = await this.authService.loginAdmin(name, password);
          sendSuccess(res, result);
        } catch (err: any) {
          next(err);
        }
    }

    async authScann(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, password, place } = req.body;
        try {
          const result = await this.authService.loginScanner(name, password, place);
          sendSuccess(res, result);
        } catch (err: any) {
          next(err);
        }
      }
    }
