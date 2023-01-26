import DataSource from "./DataSource";
import OrderModel from "../models/OrderModel";

export default class OrderDataSource extends DataSource<typeof OrderModel> {
  async get(ip: string) {
    const order = await this.model.findOne({
      ip,
      draft: true,
    });

    if (order) {
      return order;
    }

    return await this.model.create({
      ip,
    });
  }

  async removeProductFromOrder(ip: string, productId: string) {
    await this.model.updateOne(
      {
        ip,
      },
      {
        $pull: { products: { productId } },
      }
    );

    return await this.get(ip);
  }

  async updateProductInOrder(ip: string, productId: string, quantity: number) {
    const order = await this.get(ip);
    const orderProduct = order.products.find((orderProduct) =>
      orderProduct.productId.equals(productId)
    );

    // Remove product if quanity is below or equal zero
    if (orderProduct && quantity <= 0) {
      return this.removeProductFromOrder(ip, productId);
    }

    // Add product if it hasn't been created yet
    if (!orderProduct) {
      return this.addProductToOrder(ip, productId, quantity);
    }

    // Otherwise update quantity
    await this.model.updateOne(
      {
        _id: order.id,
        "products.productId": productId,
      },
      {
        $set: { "products.$.quantity": quantity },
      }
    );

    return await this.get(ip);
  }

  async addProductToOrder(ip: string, productId: string, quantity: number) {
    const order = await this.get(ip);
    const orderProduct = order.products.find((orderProduct) =>
      orderProduct.productId.equals(productId)
    );

    if (orderProduct) {
      await this.model.updateOne(
        {
          _id: order.id,
          "products.productId": productId,
        },
        {
          $inc: { "products.$.quantity": quantity },
        }
      );
    } else {
      await this.model.updateOne(
        {
          _id: order.id,
        },
        {
          $push: {
            products: {
              productId,
              quantity,
            },
          },
        }
      );
    }

    return await this.get(ip);
  }

  async submitOrder(ip: string) {
    const order = await this.get(ip);

    const result = await this.model.updateOne(
      {
        _id: order.id,
      },
      {
        draft: false,
      }
    );

    return this.model.findOne({
      _id: result.upsertedId,
    });
  }
}
