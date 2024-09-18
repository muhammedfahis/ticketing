import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@fayisorg/common";
import { queueGroupName } from "./message-queue-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price,
            version: data.version
        })
        await order.save();
        msg.ack();
    }
}