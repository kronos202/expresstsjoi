import { CustomError } from '../../utils/customError';

export class UnprocessableEntityError extends CustomError {
    statusCode = 422;
    constructor() {
        super('Unprocessable Entity Error.');
        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Unprocessable Entity Error.' };
    }
}
