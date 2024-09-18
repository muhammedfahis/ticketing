import { app } from '../../app';
import request from 'supertest';


it('should logout with 200', async () => {
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
    const response1 = await request(app)
       .post('/api/users/signout')
       .send({})
       expect(response1.status).toEqual(200);
       expect(response1.get('Set-Cookie')?.[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');

});