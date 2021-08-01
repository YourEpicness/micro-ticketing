import {Request, Response, NextFunction} from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// should be used after currentUser middleware or will break
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
}