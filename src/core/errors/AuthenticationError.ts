import { CustomError } from '../../utils/customError';

export class AuthenticationError extends CustomError {
    statusCode = 401;
    constructor() {
        super('user unauthenticated');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'user unauthenticated' };
    }
}
