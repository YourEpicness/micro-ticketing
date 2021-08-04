import express, { Request, Response} from 'express';
import { body} from 'express-validator';

import { validateRequest, BadRequestError } from '@epicmtickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], validateRequest, 
async (req: Request, res: Response) => {
    // grab properties off the body
    const {email, password} = req.body;

    // check if user already exists and throw a general error
    const existingUser = await User.findOne({email});
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }

    // check if passwords for users match
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if(!passwordsMatch) {
        throw new BadRequestError('Invalid credentials')
    }

    // generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!); // use ! to make typescript happy :)

    // store it on session object
    req.session = {
        jwt: userJwt //typescript specific
    };

    // user created
    res.status(200).send(existingUser);

})

export {router as signinRouter}