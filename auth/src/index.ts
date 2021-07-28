import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';

//import routers from routes folder
import { currentUserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

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

app.listen(3000, () => {
    console.log("Listening on port 3000!!!")
});