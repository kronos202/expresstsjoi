import { Request, Response, NextFunction } from 'express';
import { Document, FlattenMaps } from 'mongoose';
import { QueryParams } from '../decorators/mongoose/query';

declare global {
    namespace Express {
        interface Request {
            mongoGet: Document | undefined;
            mongoGetAll: Document[];
            mongoCreate: Document | undefined;
            mongoUpdate: Document | undefined;
            mongoQuery: Document[];
            pagination?: { limit: number; page: number };
            // parsedQuery?: QueryParams;
        }
    }
}

export function declareHandler(req: Request, res: Response, next: NextFunction) {
    req.mongoGet = undefined;
    req.mongoGetAll = [];
    req.mongoCreate = undefined;
    req.mongoUpdate = undefined;
    req.mongoQuery = [];
    req.pagination = undefined;
    // req.parsedQuery = undefined;

    next();
}
