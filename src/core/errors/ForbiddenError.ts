import { CustomError } from '../../utils/customError';

export class ForbiddenError extends CustomError {
    statusCode = 403;
    constructor() {
        super('Forbidden');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Forbidden' };
    }
}
