import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';
import { BadRequestError } from '../core/errors/BadRequestError';

const errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serialize());
    }

    next();
};
export default errorHandler;
