import request from "supertest";
import { app } from "../../app";


it('should return 201 status when signup successful', () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('should return 400 status with invalid email', () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'password'
        })
        .expect(400);
});

it('should return 400 status with invalid password', () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'fahis@gmail.com',
            password: 'pa'
        })
        .expect(400);
});
it('should return 400 status without email and password', () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('should disallow duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('should return 201 status with cookie', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});