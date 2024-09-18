import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';



it('should return 404 if the ticket is not found', async () => {
    const id = '66d83fd371d50fa87f0ac3d4';
    const response = await request(app)
       .get(`/api/tickets/66d83fd371d50fa87f0ac3d4`)
       .set('Cookie',global.signup())
       .send()
    expect(response.status).toEqual(404)
})

it('should return 200 if the ticket is found', async () => {
    const title = 'blah';
    const price = 20;

    const response1 = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({ title, price })
        .expect(201);
    expect(response1.body.title).toEqual(title);
    expect(response1.body.price).toEqual(price);
    const response2 = await request(app)
       .get(`/api/tickets/${response1.body.id}`)
       .set('Cookie',global.signup())
       .send()
    expect(response2.status).toEqual(200)
})
it('should return every tickets with 200 statuscode', async () => {
    const tickets = [
        {
            title:'blah',
            price: 20,
            userId:'66d83fd371d50fa87f0ac3d4'
        },
        {
            title:'shim',
            price:40,
            userId:'66d83fd371d50fa87f0ac3d4'
        }
    ]
    const savedTickets = await Ticket.insertMany(tickets);
    const response = await request(app)
       .get(`/api/tickets`)
       .set('Cookie',global.signup())
       .send()
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2)
    expect(response.body).toEqual(expect.arrayContaining(
        [
            expect.objectContaining({title:expect.any(String)}),
            expect.objectContaining({price:expect.any(Number)}),
            expect.objectContaining({userId:expect.any(String)})
        ])
    )
})