import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


declare global {
    var signup: () => Promise<string[]>;
  }


let mongoServer:any;
beforeAll( async () => {
    process.env.JWT_KEY ='asdf';
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach( async() => {
    const collections = await mongoose.connection.db?.collections();
    if(collections) {
        for(const collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if(mongoServer) {
        await mongoServer.stop();
    }
    await mongoose.connection.close();
});

global.signup  = async () => {
    const response = await request(app)
       .post('/api/users/signup')
       .send({
            email: 'test@test.com',
            password: 'password'
        })
       .expect(201);
    const cookie = response.get('Set-Cookie');
    return cookie || [];
}