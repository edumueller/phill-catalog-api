import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProductAttrs {
  name: string;
  price: number;
  quantity: number;
}

interface ProductDoc extends mongoose.Document {
  name: string;
  price: number;
  quantity: number;
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema
);

export { Product };
