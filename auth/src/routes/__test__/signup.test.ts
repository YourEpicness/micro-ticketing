import request from 'supertest';
import { app } from '../../app';

// describe('POST requests for routes', () => {})
it('Returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
})

it('Returns a 400 with an invalid email', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'tessjfklasfhjklas.com',
        password: 'password'
    })
    .expect(400);
})

it('Returns a 400 with an invalid password', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'tessjfklasfhjklas.com',
        password: 'p'
    })
    .expect(400);
})

it('Returns a 400 with missing email and password', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com'
    })
    .expect(400);

    return request(app)
    .post('/api/users/signup')
    .send({
        password:'asfhjaf'
    })
    .expect(400);
})

it('disallows duplicate emails', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password: 'password'
    })
    .expect(400);
})

it('has a header of Set-Cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})
