import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | string[]; // Support both single image and array of images
  description: string;
  quantity: number;
}

export interface IOrder extends Document {
  items: ICartItem[];
  total: number;
  customerName: string;
  email: string;
  contactNumber: string;
  address: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: Schema.Types.Mixed, // Accept both string and array of strings
      required: true,
      validate: {
        validator: function (value: any) {
          // Accept both string and array of strings
          if (typeof value === 'string' && value.length > 0) return true;
          if (Array.isArray(value) && value.length > 0 && value.every((item: any) => typeof item === 'string')) return true;
          return false;
        },
        message: 'Image must be a valid URL string or array of URL strings',
      },
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    items: {
      type: [cartItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items: ICartItem[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', orderSchema);
