import { ModelOrCollection, MongoDataSource } from "apollo-datasource-mongodb";
import { Model } from "mongoose";

export type DataSourceConfig = import("apollo-datasource").DataSourceConfig<{
  token: string;
}>;

export default class DataSource<
  TModel extends Model<any>,
  TData extends any = TModel extends Model<infer TData> ? TData : never
> extends MongoDataSource<TData> {
  constructor(collection: ModelOrCollection<TData>, config: DataSourceConfig) {
    super(collection);

    this.initialize(config);
  }
}
