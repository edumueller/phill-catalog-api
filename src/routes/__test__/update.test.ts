import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'aslkdfj',
      price: 20,
      quantity: 10,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .send({
      name: 'aslkdfj',
      price: 20,
      quantity: 10,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid name or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      name: 'asldkfj',
      price: 20,
      quantity: 10,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: '',
      price: 20,
      quantity: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'alskdfjj',
      price: -10,
      quantity: 10,
    })
    .expect(400);
});

it('updates the product provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      name: 'asldkfj',
      price: 20,
      quantity: 10,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'new name',
      price: 100,
      quantity: 10,
    })
    .expect(200);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();

  expect(productResponse.body.name).toEqual('new name');
  expect(productResponse.body.price).toEqual(100);
});
