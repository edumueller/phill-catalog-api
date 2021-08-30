import { Publisher, Subjects, ProductUpdatedEvent } from '@phill-sdk/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
