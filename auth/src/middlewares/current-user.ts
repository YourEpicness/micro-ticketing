import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

// to see what we expect from our payload
interface UserPayload {
    id: string;
    email: string;
}

// modifies the Request interface
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (
    req: Request, 
    res: Response, 
    next: NextFunction) => {   
    // check if a req.session exists and if it does then check .jwt
    // ? checks if internal property exists
    if(!req.session?.jwt) {
        return next();
    }

    try {
        // check the jwt and make sure not changed
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch(err) {}

    // move to next middleware
    next();
}