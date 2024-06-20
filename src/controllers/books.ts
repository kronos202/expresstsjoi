import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { MongoGetAll } from '../decorators/mongoose/getAll';
import { Book } from '../models/book';
import { MongoGet } from '../decorators/mongoose/get';
import { MongoQuery } from '../decorators/mongoose/queryIndex';
import { MongoUpdate } from '../decorators/mongoose/update';
import { MongoCreate } from '../decorators/mongoose/create';
import { MongoDelete } from '../decorators/mongoose/delete';

@Controller('/books')
class BookController {
    @Route('get', '/get/all')
    @MongoGetAll(Book)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGetAll);
    }
    @Route('get', '/get/:id')
    @MongoGet(Book)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGet);
    }
    @Route('get', '/title')
    @MongoGet(Book)
    getByTitle(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGet);
    }
    @Route('post', '/create')
    @MongoCreate(Book)
    async create(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoCreate);
    }
    @Route('get', '/query')
    @MongoQuery(Book)
    query(req: Request, res: Response, next: NextFunction) {
        const books = req.mongoQuery; // Truy cập kết quả truy vấn từ đối tượng request
        const pagination = req.pagination; // Truy cập thông tin phân trang từ đối tượng request
        return res.status(200).json({ books, pagination });
    }
    @Route('patch', '/update/:id')
    @MongoUpdate(Book)
    update(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoUpdate);
    }
    @Route('delete', '/delete/:id')
    @MongoDelete(Book)
    delete(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({});
    }
}

export default BookController;
