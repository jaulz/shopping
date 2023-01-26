import DataSource from "./DataSource";
import ProductModel from "./../models/ProductModel";

export default class ProductDataSource extends DataSource<typeof ProductModel> {
  async list(category?: string, offset = 0, limit = 10) {
    const items = await this.model
      .find({
        category,
      })
      .skip(offset)
      .limit(limit);

    return items;
  }

  async get(id: string) {
    return await this.findOneById(id);
  }

  async count(category?: string) {
    return await this.model.count({
      category,
    });
  }
}
