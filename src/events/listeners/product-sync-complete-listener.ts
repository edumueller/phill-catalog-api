import {
  Listener,
  Subjects,
  ProductSyncCompleteEvent,
} from '@phill-sdk/common';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductSyncCompleteListener extends Listener<ProductSyncCompleteEvent> {
  subject: Subjects.ProductSyncComplete = Subjects.ProductSyncComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductSyncCompleteEvent['data'], msg: Message) {
    const product = await Product.findByEvent(data);

    if (!product) {
      throw new Error('Product not found');
    }

    product.set({ syncCompletedAt: Date.now() });
    await product.save();

    msg.ack();
  }
}
