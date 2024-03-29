import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    // check if keys are loaded
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_Key must be defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
        });
        console.log("Connected to mongodb!");
    } catch (err) {
    console.log(err);
    }
}

app.listen(3000, () => {
    console.log("Listening on port 3000!!!")
});

start();