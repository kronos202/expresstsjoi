import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { BadRequestError } from '../../core/errors/BadRequestError';
import { NotFoundError } from '../../core/errors/NotFoundError';
import { redisClient } from '../../server';

export function MongoGet(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const cache = await redisClient.get(`${model}:${req.params.id}`);

                if (cache) {
                    return res.json(JSON.parse(cache));
                } else {
                    const document = await model.findById(req.params.id);
                    if (document) {
                        req.mongoGet = document;
                    } else {
                        return res.status(400).json({ error: 'Not found' });
                    }

                    await redisClient.set(`${model}:${req.params.id}`, JSON.stringify(document), 'EX', 3600); // Lưu cache trong 1 giờ

                    return res.json(document);
                }
            } catch (error) {
                logging.error(error);

                next(new NotFoundError());
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
