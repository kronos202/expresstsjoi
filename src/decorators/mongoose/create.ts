import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';
import { ConflictError } from '../../core/errors/ConfictError';

export function MongoCreate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = new model({
                    _id: new mongoose.Types.ObjectId(),
                    ...req.body
                });

                await document.save();

                req.mongoCreate = document;
            } catch (error: any) {
                if (error.code === 11000) {
                    logging.error(new ConflictError().message);
                    next(new ConflictError());
                } else {
                    logging.error(error);
                    return res.status(400).json(error);
                }
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
