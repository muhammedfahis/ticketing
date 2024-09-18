import request from "supertest";
import { app } from "../../app";


it('should fail when request with invalid account', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(400);
})

it('should fail when request with incorrect password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@gmail.com',
            password: 'passw'
        })
        .expect(400);
});

it('should login successfully with 200', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(200);
});

it('should login successfully with 200 and return cookie', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(201);
   const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});