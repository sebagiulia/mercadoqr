import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

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
          res.json(result);
        } catch (err: any) {
          res.status(400).json({ message: err.message });
        }
    }

    async authScann(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, password } = req.body;

        try {
          const result = await this.authService.loginScanner(name, password);
          res.json(result);
        } catch (err: any) {
          res.status(400).json({ message: err.message });
        }
      }
    }