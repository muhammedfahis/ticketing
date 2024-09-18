import request from 'supertest';
import { app } from '../../app';



it('it should update the ticket with 200' , async () => {
    var title = 'title';
    var price = 20;
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({ title, price})
        .expect(201)
    expect(response.body.title).toBe(title);
    expect(response.body.price).toBe(price);
    price = 40;
    const updateRes = await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie',cookie)
        .send({ title, price })
        .expect(200);
        expect(updateRes.body.title).toBe(title);
        expect(updateRes.body.price).toBe(price);
    
});

it('it should return 401 with unathorized if the user is not the author' , async () => {
    var title = 'title';
    var price = 20;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signup())
        .send({ title, price})
        .expect(201)
    expect(response.body.title).toBe(title);
    expect(response.body.price).toBe(price);
    price = 40;
    const updateRes = await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie',global.signup())
        .send({ title, price })
        .expect(401);
    
});

it('it should return 404 if ticket is not found' , async () => {
    var title = 'title';
    var price = 20;
    const updateRes = await request(app)
        .put('/api/tickets/66d83fd371d50fa87f0ac3d4')
        .set('Cookie',global.signup())
        .send({ title, price })
        .expect(404);
});

it('it should return 401 if the user is unauthenticated' , async () => {
    var title = 'title';
    var price = 20;
    const updateRes = await request(app)
        .put('/api/tickets/66d83fd371d50fa87f0ac3d4')
        .send({ title, price })
        .expect(401);
});