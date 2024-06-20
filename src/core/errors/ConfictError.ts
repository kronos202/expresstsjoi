import { CustomError } from '../../utils/customError';

export class ConflictError extends CustomError {
    statusCode = 409;
    constructor() {
        super('Conflict Error.');
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Conflict Error.' };
    }
}
