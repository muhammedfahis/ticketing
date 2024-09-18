import { Listener, ExpriationCompleteEvent, Subjects, OrderStatus } from "@fayisorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";


export class ExpirationCompletedListener extends Listener<ExpriationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroupName;
    async onMessage(data: ExpriationCompleteEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order) {
            throw new Error('Order Not Found');
        }
        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version:order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}