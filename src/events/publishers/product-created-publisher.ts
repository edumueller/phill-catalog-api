import { Publisher, Subjects, ProductCreatedEvent } from '@phill-sdk/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
