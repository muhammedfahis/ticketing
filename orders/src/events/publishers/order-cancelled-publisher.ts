import { Publisher, OrderCancelledEvent, Subjects } from "@fayisorg/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}