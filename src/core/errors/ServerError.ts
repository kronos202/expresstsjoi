import { CustomError } from '../../utils/customError';

export class DatabaseError extends CustomError {
    statusCode = 500;
    constructor() {
        super('Internal Server Error.');
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Internal Server Error.' };
    }
}
