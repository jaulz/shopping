import { Document, model, ObjectId } from "mongoose";
import OrderSchema from "../schemas/OrderSchema";

type Order = {
  ip: string;
  products: {
    // Needs a better type but I cannot find it right now
    productId: {
      equals: (value: any) => boolean;
    };
    price: number;
    quantity: number;
  }[];
};

interface OrderDocument extends Order, Document {}

export default model<OrderDocument>("Order", OrderSchema);
