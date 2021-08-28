import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@phill-sdk/common';
import { Product } from '../models/product';

const router = express.Router();

router.post(
  '/api/products',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('quantity')
      .isInt({ gt: 0 })
      .withMessage('Quantity must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, price, quantity } = req.body;

    const product = Product.build({
      name,
      price,
      quantity,
    });
    await product.save();

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
