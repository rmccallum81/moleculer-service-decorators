export class DecoratorError extends Error {
    constructor(message: string, public cause?: Error) {
        super(message);
        this.name = "DecoratorError";
    }
}
