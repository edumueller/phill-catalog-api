import { Publisher, Subjects, ProductCreatedEvent } from '@phill-sdk/common';

export class TicketCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
