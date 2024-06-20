import { Request, Response, NextFunction } from 'express';

export function Authenticate(target: any, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDescriptor.value;

    propertyDescriptor.value = function (req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).send('Forbidden');
        }

        // Giả sử chúng ta có một hàm verifyToken để kiểm tra token
        const isValid = verifyToken(token);

        if (!isValid) {
            return res.status(403).send('Forbidden');
        }

        return method.apply(this, [req, res, next]);
    };

    return propertyDescriptor;
}

// Giả sử hàm verifyToken kiểm tra tính hợp lệ của token
function verifyToken(token: string): boolean {
    // Thực hiện kiểm tra token ở đây
    return token === 'valid-token'; // Thay bằng logic thực tế
}
