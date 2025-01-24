import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';
import { sendError } from '../utils/respondeUtil';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  console.log(err);
  if (err instanceof AppError) {
    sendError(res, err.statusCode.toString(), err.message);
  } else {
    console.log('Error inesperado: ' + err);
    sendError(res, '500', 'Internal Server Error');
  }
};
