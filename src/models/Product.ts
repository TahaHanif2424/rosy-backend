import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  price: number;
  image: string | string[];
  description: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: Schema.Types.Mixed,
      required: [true, 'Product image is required'],
      validate: {
        validator: function(v: any) {
          // Accept both string and array of strings
          if (typeof v === 'string') return v.length > 0;
          if (Array.isArray(v)) return v.length > 0 && v.every(item => typeof item === 'string');
          return false;
        },
        message: 'Image must be a valid URL string or array of URL strings'
      }
    },
    description: {
      type: String,
      required: false,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', productSchema);
