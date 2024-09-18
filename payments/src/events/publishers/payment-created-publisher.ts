import { PaymentCreatedEvent, Publisher, Subjects } from "@fayisorg/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}