import request from "supertest";
import { app } from "../../app";



it('returns the users details for a valid user', async () => {
    const cookie = await global.signup()
    const response2 = await request(app)
       .get('/api/users/currentuser')
       .set('Cookie', cookie)
       .send()
    expect(response2.status).toEqual(200);
    expect(response2.body.currentUser).not.toBeNull();
});

it('response with null if not authenticated', async () => {
    const response2 = await request(app)
       .get('/api/users/currentuser')
       .send()
    expect(response2.status).toEqual(200);
    expect(response2.body.currentUser).toBeNull();
});

