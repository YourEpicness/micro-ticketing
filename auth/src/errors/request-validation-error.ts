import {ValidationError} from 'express-validator';
import { CustomError } from "./custom-error";
// Returns a reason related to validating error
// Creates a custom error class that utilizies express-validator's Error

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending a buily in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {
                message: err.msg,
                field: err.param
            }
        })
    }
}

