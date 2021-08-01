import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';
import request from 'supertest';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo:any;
// a hook to set up mongo db memory server
beforeAll(async () => {
    // pass in any secrets
    process.env.JWT_KEY = 'asdfasdf';

    // make new instance of mms and get uri from it to use
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    // pass in Uri and some mongoose default config stuff
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

// run this hook before each test
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// run this hook after all tests are complete
afterAll(async() => {
    await mongo.stop();
    await mongoose.connection.close();
})

// set up a global auth function
global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email, password
    })
    .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}