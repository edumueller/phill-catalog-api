import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it('returns the product if the product is found', async () => {
  const name = 'concert';
  const price = 20;
  const quantity = 10;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      name,
      price,
      quantity,
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.name).toEqual(name);
  expect(productResponse.body.price).toEqual(price);
  expect(productResponse.body.quantity).toEqual(quantity);
});
