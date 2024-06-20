import http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import RedisStore from 'connect-redis';
import redis from 'ioredis';

// import { createClient } from 'redis';

import 'reflect-metadata';
import './configs/logging';

import { mongo, server } from './configs/config';
import { loggingHandler } from './middleware/logginHandler';
import MainController from './controllers/main';
import { defineRoutes } from './modules/routes';
import { declareHandler } from './middleware/declareHandler';
import BookController from './controllers/books';
import errorHandler from './middleware/errorHandler';
import { NotFoundError } from './core/errors/NotFoundError';
import rateLimitMiddleware from './middleware/rateLimit';

export let httpServer: ReturnType<typeof http.createServer>;
export const application = express();

export const redisClient = new redis();
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:'
});

const corsOptions = {
    origin: 'http://example.com',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600 // 10 minutes
};

export const Main = async () => {
    logging.info('----------------------------------------');
    logging.info('Initializing API');
    logging.info('----------------------------------------');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());
    application.use(
        session({
            store: redisStore,
            secret: 'your_secret_key', // Bạn nên đặt secret key của bạn ở đây
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // Đặt là true nếu sử dụng HTTPS
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 // Thời gian tồn tại của cookie (ở đây là 1 ngày)
            }
        })
    );

    logging.info('----------------------------------------');
    logging.info('Connect to Mongo');
    logging.info('----------------------------------------');
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
        logging.info('----------------------------------------');
        logging.info('Connectd to Mongo: ', connection.version);
        logging.info('----------------------------------------');
    } catch (error) {
        logging.info('----------------------------------------');
        logging.info('Unable to Connect to Mongo');
        logging.error(error);
        logging.info('----------------------------------------');
    }
    logging.info('----------------------------------------');
    logging.log('Logging & Configuration & Security && Rate Limiting');
    logging.log('----------------------------------------');
    logging.log('----------------------------------------');
    application.use(cors(corsOptions));
    application.use(loggingHandler);
    application.use(declareHandler);
    application.use(helmet());
    application.use(rateLimitMiddleware);
    application.use(
        compression({
            threshold: 1024
        })
    );
    logging.info('Define Controller Routing');
    logging.info('----------------------------------------');
    // logging.info('----------------------------------------');
    // logging.info('Connect Redis');
    // logging.info('----------------------------------------');
    // redisClient
    //     .connect()
    //     .then(() => logging.info('Connect Redis successfully'))
    //     .catch(console.error);
    logging.info('----------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('----------------------------------------');
    defineRoutes([MainController, BookController], application);
    logging.log('----------------------------------------');
    logging.log('Define Routing Error');
    logging.log('----------------------------------------');
    application.all('*', (req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError());
    });
    application.use(errorHandler);
    // application.use(routeNotFound);
    logging.info('----------------------------------------');
    logging.info('Start Server');
    logging.info('----------------------------------------');
    httpServer = http.createServer(application);
    httpServer.listen(server.SERVER_PORT, () => {
        logging.log('----------------------------------------');
        logging.log(`Server started on ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`);
        logging.log('----------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
