import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";





it('should return 401 status when unauthrized request', async () => {
    const response = await request(app)
       .post('/api/tickets')
       .send({})
    expect(response.status).toEqual(401)
})

it('should return 200 status when authrized request', async () => {
    const cookie = global.signup();    
    const response = await request(app)
       .post('/api/tickets')
       .set('Cookie', cookie)
       .send({title:'test ticket',price:20})
    expect(response.status).toEqual(201)
})

it('should return 400 status when invalid title', async () => {
    const cookie = global.signup();
    const response = await request(app)
   .post('/api/tickets')
   .set('Cookie', cookie)
   .send({title:''})
    expect(response.status).toEqual(400)

});

it('should return 201 status when valid input', async () => {
    const cookie = global.signup();
    const tickets = await Ticket.find({}); 
    expect(tickets).toHaveLength(0);
    const title =  'asgasgfas';
    const price = 20;
    const response = await request(app)
   .post('/api/tickets')
   .set('Cookie', cookie)
   .send({title,price})
   .expect(201);
   expect(response.body.title).toEqual(title);
   expect(response.body.price).toEqual(price);
   const ticketsFinal = await Ticket.find({});
   expect(ticketsFinal).toHaveLength(1);

});



