import { CustomError } from '../../utils/customError';

export class TooManyRequestError extends CustomError {
    statusCode = 429;
    constructor() {
        super('Too Much Request. Please try again.');
        Object.setPrototypeOf(this, TooManyRequestError.prototype);
    }
    serialize(): { message: string } {
        return { message: 'Too Much Request. Please try again.' };
    }
}
