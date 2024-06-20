import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { redisClient } from '../../server';

export function MongoGetAll(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const cache = await redisClient.get(`${model}`);
                if (cache) {
                    return res.json(JSON.parse(cache));
                } else {
                    const documents = await model.find({}).exec();
                    req.mongoGetAll = documents;

                    await redisClient.set(`${model}`, JSON.stringify(documents), 'EX', 3600); // Lưu cache trong 1 giờ

                    return res.json(documents);
                }
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
