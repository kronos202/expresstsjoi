import { CustomError } from '../../utils/customError';

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('Not Found Error.');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Not Found Error.' };
    }
}
