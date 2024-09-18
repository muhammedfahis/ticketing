import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects";


interface Event {
    subject: Subjects,
    data:any;
}

export abstract class Listener<T extends Event> {

    abstract subject:T['subject'];
    abstract queueGroupName:string;
    abstract onMessage(data:T['data'],msg:Message):void
    protected ackWait = 5 * 1000;
    private client:Stan

    constructor(client:Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setDurableName(this.queueGroupName)
        .setAckWait(this.ackWait)
    }
    
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )
        subscription.on('message', (msg:Message) => {
            console.log('message recieved ' + this.subject + '-' + this.queueGroupName+ ' - ' + this.parseMessage(msg));
            this.onMessage(this.parseMessage(msg),msg)
        })
    }

    parseMessage(msg:Message) {
        const data = msg.getData();
        return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'));
    }
}