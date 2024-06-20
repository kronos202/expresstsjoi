export abstract class CustomError extends Error {
    constructor(public message: string) {
        super(message);
    }
    abstract statusCode: number;
    abstract serialize(): { message: string };
}
