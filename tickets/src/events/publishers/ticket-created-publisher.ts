import { Publisher, Subjects, TicketCreatedEvent } from '@fayisorg/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}