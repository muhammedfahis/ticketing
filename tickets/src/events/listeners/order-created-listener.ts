import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@fayisorg/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName:string = queueGroupName
 
   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket) {
            throw Error('Ticket not found');
        }
        ticket.set({ orderId: data.id});
        await ticket.save();
       await new TicketUpdatedPublisher(this.client).publish({
         title: ticket.title,
         price: ticket.price,
         version: ticket.version,
         orderId: ticket.orderId,
         id: ticket.id,
         userId: ticket.userId
        })
        msg.ack();

    }
}