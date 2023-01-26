import { Schema } from "mongoose";

export default new Schema({
  title: { type: String },
  price: { type: Number },
  stock: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});
