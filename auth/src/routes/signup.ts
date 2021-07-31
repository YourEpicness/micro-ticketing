import express, {Request, Response} from 'express';
// express-validator will return various structure for errors
import {body, validationResult} from 'express-validator'; // can validate body, strings, etc
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { User } from '../models/user';
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
    .withMessage('Password must be between 4 and 20')
] , async (req: Request, res:Response) => {
    const errors = validationResult(req);
    // checking errors, if exists, then send errors array back to user
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password} = req.body;

    const existingUser = await User.findOne({ email});
    if(existingUser) {
        console.log('Email in use');
        return res.send({})
    }
    
    // creates and saves user to mongodb
    const user = User.build({ email, password})
    await user.save();

    // user created
    res.status(201).send(user);


})

export {router as signupRouter}