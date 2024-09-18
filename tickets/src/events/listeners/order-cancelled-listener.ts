import { Listener, OrderCancelledEvent, Subjects } from "@fayisorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
   async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket) {
            throw Error('Ticket not found');
        }
        ticket.set({ orderId: undefined});
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