import { Request, Response, NextFunction } from 'express';
import { Model, Document, FilterQuery } from 'mongoose';
import { QueryParams } from '../../interfaces';

export function MongoQuery(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                // Lặp qua các trường trong QueryParams để xây dựng các điều kiện truy vấn
                const queryParams = req.query as QueryParams;

                const page = parseInt(queryParams.page as string) || 1; // Lấy tham số trang
                const limit = parseInt(queryParams.limit as string) || 2; // Lấy tham số số lượng mỗi trang

                delete queryParams.page; // Xóa tham số page khỏi query để không ảnh hưởng đến truy vấn
                delete queryParams.limit; // Xóa tham số limit khỏi query để không ảnh hưởng đến truy vấn

                const skip = (page - 1) * limit; // Tính số lượng document cần bỏ qua

                const documents = await model
                    .find({ $text: { $search: queryParams.title as string } }, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } })
                    .exec(); // Thực hiện truy vấn với phân trang

                req.mongoQuery = documents; // Đính kèm kết quả vào đối tượng request
                req.pagination = { page, limit }; // Đính kèm thông tin phân trang vào đối tượng request
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.apply(this, [req, res, next]);
        };

        return descriptor;
    };
}
