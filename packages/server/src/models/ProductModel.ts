import { Document, model, ObjectId } from "mongoose";
import ProductSchema from "../schemas/ProductSchema";

type Product = {
  slug: string;
  title: string;
};

interface ProductDocument extends Product, Document {}

export default model<ProductDocument>("Product", ProductSchema);
