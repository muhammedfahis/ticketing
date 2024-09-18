import { Publisher, OrderCreatedEvent, Subjects } from "@fayisorg/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}