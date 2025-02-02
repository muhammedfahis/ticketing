
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';



(async () => {

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
        await natsWrapper.connect(process.env.NATS_CLUSTERID!,process.env.NATS_CLIENT_ID!,process.env.NATS_URL!);
        natsWrapper.client.on('close' , () => {
            console.log('client closed');
            process.exit();
            
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
})();



