import { RateLimiterRedis } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';
import redis from 'ioredis';

import { TooManyRequestError } from '../core/errors/TooMuchRequest';
export const redisClient = new redis();

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10, // Số lượng điểm cho mỗi chu kỳ
    duration: 60 // Thời gian chu kỳ (60 giây)
});

const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip as string); // Sử dụng địa chỉ IP của người dùng làm khóa
        next();
    } catch (err) {
        next(new TooManyRequestError()); // Trả về lỗi khi quá giới hạn
    }
};
export default rateLimitMiddleware;
