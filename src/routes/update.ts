import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth } from '@phill-sdk/common';
import { Product } from '../models/product';
import { natsWrapper } from '../nats-wrapper';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';

const router = express.Router();

router.put(
  '/api/products/:id',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
    body('quantity')
      .isInt({ gt: 0 })
      .withMessage('Quantity must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    product.set({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      syncCompletedAt: null,
    });
    await product.save();

    // Publish product updated event
    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      version: product.version,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
