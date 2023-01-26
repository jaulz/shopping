import { Schema } from "mongoose";

export default new Schema({
  ip: String,
  draft: {
    type: Boolean,
    default: true,
  },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
});
