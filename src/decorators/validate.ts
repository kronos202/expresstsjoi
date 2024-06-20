import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { UnprocessableEntityError } from '../core/errors/UnprocessableEntityError';

export function Validate<T = any>(schema: Joi.ObjectSchema<T>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            const { error } = await Promise.resolve(schema.validate(req.body));
            if (error) {
                next(new UnprocessableEntityError());
            }
            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
