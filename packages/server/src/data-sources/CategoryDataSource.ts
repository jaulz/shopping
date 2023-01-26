import { Collection, ObjectId } from "mongodb";
import DataSource from "./DataSource";
import CategoryModel from "./../models/CategoryModel";

export default class CategoryDataSource extends DataSource<
  typeof CategoryModel
> {
  async list() {
    const items = await this.findByFields({});

    return items;
  }

  async get(slug: string) {
    const items = await this.findByFields({
      slug,
    });

    return items[0];
  }
}
