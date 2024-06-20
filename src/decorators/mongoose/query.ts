import { Request, Response, NextFunction } from 'express';
import { Model, Document, FilterQuery } from 'mongoose';

export interface QueryParams {
    author?: string;
    title?: string;
    year?: string;
    page?: string;
    limit?: string;
    minPages?: string;
}

export function MongoQuery(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const query: FilterQuery<Document> = { ...req.query }; // Lấy query parameters
                const queryParams: QueryParams = req.query;

                const page = parseInt(queryParams.page as string) || 1; // Lấy tham số trang
                const limit = parseInt(queryParams.limit as string) || 10; // Lấy tham số số lượng mỗi trang

                delete queryParams.page; // Xóa tham số page khỏi query để không ảnh hưởng đến truy vấn
                delete queryParams.limit; // Xóa tham số limit khỏi query để không ảnh hưởng đến truy vấn

                // Thêm điều kiện kiểm tra số trang lớn hơn hoặc bằng 150
                if (queryParams.minPages) {
                    query.page = { $gte: parseInt(queryParams.minPages) };
                    delete query.minPages; // Xóa điều kiện minPages khỏi query parameters
                }

                const skip = (page - 1) * limit; // Tính số lượng document cần bỏ qua

                console.log('Query Parameters:', query); // In ra các query parameters
                const documents = await model.find(query).skip(skip).limit(limit).exec(); // Thực hiện truy vấn với phân trang
                console.log('Query Results:', documents); // In ra kết quả truy vấn

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
