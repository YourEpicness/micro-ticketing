import express, {Request, Response} from 'express';
// express-validator will return various structure for errors
import {body, validationResult} from 'express-validator'; // can validate body, strings, etc

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
] ,(req: Request, res:Response) => {
    const errors = validationResult(req);
    // checking errors, if exists, then send errors array back to user
    if(!errors.isEmpty()) {
        // better way of handling errors
        throw new Error('Invalid email or password')
        // return res.status(400).send(errors.array());
    }

    const {email, password} = req.body;

    console.log('Creating a user...');
    throw new Error('Error connecting to database')
    
    res.send({});
    // user validation


})

export {router as signupRouter}