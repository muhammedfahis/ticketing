import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>  {
   readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event emited');
        console.log(data.title)
        msg.ack()
    }
}