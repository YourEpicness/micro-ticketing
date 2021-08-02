import express, {Request, Response} from 'express';
// express-validator will return various structure for errors
import {body} from 'express-validator'; // can validate body, strings, etc
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
const router = express.Router();

// TODO: Automated API Integration Test for proper signup validation
router.post('/api/users/signup',[
    // check if body is an email, and if not send message
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),

    body('password')
    .trim()
    .isLength({min: 4,max: 20})
    .withMessage('Password must be between 4 and 20 characters')
], validateRequest, 
async (req: Request, res:Response) => {
    // moved errorchecking to middleware and calling it above as arguements

    const { email, password} = req.body;

    const existingUser = await User.findOne({ email});
    if(existingUser) {
        throw new BadRequestError('Email is already in use');
    }

    // creates and saves user to mongodb
    const user = User.build({ email, password})
    await user.save();

    // generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!); // use ! to make typescript happy :)

    // store it on session object
    req.session = {
        jwt: userJwt //typescript specific
    };

    // user created
    res.status(201).send(user);
})

export {router as signupRouter}