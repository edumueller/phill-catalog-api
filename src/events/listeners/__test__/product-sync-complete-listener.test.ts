import { Product } from '../../../models/product';
import { ProductSyncCompleteEvent } from '@phill-sdk/common';
import { natsWrapper } from '../../../nats-wrapper';
import { ProductSyncCompleteListener } from '../product-sync-complete-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ProductSyncCompleteListener(natsWrapper.client);

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'concert',
    price: 20,
    quantity: 5,
  });
  await product.save();

  const data: ProductSyncCompleteEvent['data'] = {
    id: product.id,
    version: product.version,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, data, msg };
};

it('updates the product syncCompletedAt', async () => {
  const { listener, product, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.syncCompletedAt).not.toBeNull();
});

it('ack the message', async () => {
  const { listener, product, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
