import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';


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

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompletedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }
    app.listen(3000,() => {
        console.log('Listening on port 3000!!!');
    });
})();



