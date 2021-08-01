import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';

import cookieSession from 'cookie-session';

//import routers from routes folder
import { currentUserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); // used because we are using ingress-nginx as proxy
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
// use our imported routes
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// checks for any operation at any endpoint not already registered
app.all('*', async (req, res) => {
    throw new NotFoundError()
});

app.use(errorHandler)

export {app};