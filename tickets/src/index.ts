import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';


(async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if(!process.env.NATS_CLUSTERID) {
        throw new Error('NATS_CLUSTERID must be defined');
    }
    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB');
        await natsWrapper.connect(process.env.NATS_CLUSTERID!,process.env.NATS_CLIENT_ID!,process.env.NATS_URL!);
        natsWrapper.client.on('close' , () => {
            console.log('client closed');
            process.exit();
            
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }
    app.listen(3000,() => {
        console.log('Listening on port 3000!!!');
    });
})();



