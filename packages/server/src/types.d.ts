import { IncomingMessage } from "http";
import CategoriesDataSource from "./data-sources/CategoryDataSource";
import OrderDataSource from "./data-sources/OrderDataSource";
import ProductsDataSource from "./data-sources/ProductDataSource";

export interface Context {
  req: IncomingMessage;
  dataSources: {
    categories: CategoriesDataSource;
    products: ProductsDataSource;
    orders: OrderDataSource;
  };
  token?: string;
}
