import { Document, model, ObjectId } from "mongoose";
import CategorySchema from "../schemas/CategorySchema";

type Category = {
  slug: string;
  title: string;
};

interface CategoryDocument extends Category, Document {}

export default model<CategoryDocument>("Category", CategorySchema);
