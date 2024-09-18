import { Publisher, ExpriationCompleteEvent, Subjects } from "@fayisorg/common";




export class ExpirationCompletePublisher extends Publisher<ExpriationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}