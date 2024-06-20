import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import Joi from 'joi';
import { Validate } from '../decorators/validate';

type dataValidation = {
    name: string;
    reason?: string;
};

const dataValidationTest = Joi.object<dataValidation>({
    name: Joi.string().required(),
    reason: Joi.string()
});

@Controller('/main')
class MainController {
    @Route('get', '/healthcheck')
    getHealthCheck(req: Request, res: Response, next: NextFunction) {
        logging.info('Healthcheck route called successfully!');
        return res.status(200).json({ hello: 'world!' });
    }
    @Route('post', '/healthcheck')
    @Validate(dataValidationTest)
    posstHealthCheck(req: Request, res: Response, next: NextFunction) {
        logging.info('Healthcheck route called successfully!');
        return res.status(200).json({ ...req.body });
    }
}

export default MainController;
