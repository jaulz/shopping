import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import slugify from "slugify";
import CategoryDataSource from "./data-sources/CategoryDataSource";
import { DataSourceConfig } from "./data-sources/DataSource";
import OrderDataSource from "./data-sources/OrderDataSource";
import ProductDataSource from "./data-sources/ProductDataSource";
import CategoryModel from "./models/CategoryModel";
import OrderModel from "./models/OrderModel";
import ProductModel from "./models/ProductModel";
import { Context } from "./types";
import { getRandomNumber } from "./utilities";

// Connect to database
const databaseUrl = "mongodb://localhost:27017/test";
console.log(`📚  Connecting to database: ${databaseUrl}`);
const database = await mongoose.connect(databaseUrl);

// Seed initial data
const categoriesSeed = [
  {
    title: "Vegetables",
    products: [
      "Artichoke",
      "Asparagus",
      "Beet",
      "Bell Pepper",
      "Broccoli",
      "Brussels Sprouts",
      "Cabbage",
      "Carrot",
      "Cauliflower",
      "Celery",
      "Collard Greens",
      "Cucumber",
      "Eggplant",
      "Fennel",
      "Garlic",
      "Green Beans",
      "Kale",
      "Lettuce",
      "Mushroom",
      "Onion",
      "Parsnip",
      "Peas",
      "Potato",
      "Pumpkin",
      "Radicchio",
      "Radish",
      "Spinach",
      "Squash",
      "Sweet Potato",
      "Swiss Chard",
      "Tomato",
      "Turnip",
      "Zucchini",
    ].map((productTitle) => {
      return {
        title: productTitle,
        stock: getRandomNumber(10, 20),
        price: getRandomNumber(1, 2),
      };
    }),
  },
  {
    title: "Fruits",
    products: [
      "Apple",
      "Apricot",
      "Avocado",
      "Banana",
      "Blackberry",
      "Blueberry",
      "Boysenberry",
      "Cantaloupe",
      "Cherry",
      "Clementine",
      "Coconut",
      "Crabapple",
      "Cranberry",
      "Date",
      "Dragonfruit",
      "Durian",
      "Elderberry",
      "Feijoa",
      "Fig",
      "Gooseberry",
      "Grape",
      "Grapefruit",
      "Guava",
      "Honeydew",
      "Huckleberry",
      "Jackfruit",
      "Jambul",
      "Kiwi",
      "Kumquat",
      "Lemon",
      "Lime",
      "Loquat",
      "Lychee",
      "Mango",
      "Mandarin",
      "Mulberry",
      "Nectarine",
      "Orange",
      "Papaya",
      "Passionfruit",
      "Peach",
      "Pear",
      "Persimmon",
      "Pineapple",
      "Plum",
      "Pomegranate",
      "Quince",
      "Raspberry",
      "Redcurrant",
      "Starfruit",
      "Strawberry",
      "Tangerine",
      "Ugli Fruit",
      "Watermelon",
    ].map((productTitle) => {
      return {
        title: productTitle,
        stock: getRandomNumber(10, 20),
        price: getRandomNumber(1, 2),
      };
    }),
  },
  {
    title: "Cheese",
    products: [
      "Cheddar",
      "Gouda",
      "Mozzarella",
      "Feta",
      "Brie",
      "Camembert",
      "Blue Cheese",
      "Provolone",
      "Swiss",
      "Parmesan",
      "Munster",
      "Roquefort",
      "Gorgonzola",
      "Ricotta",
      "Pecorino",
      "Cottage Cheese",
      "Creole Cream Cheese",
      "Boursault",
      "Monterey Jack",
      "Colby",
      "Colby-Jack",
      "Jarlsberg",
      "Emmental",
      "Comté",
      "Gruyère",
      "Leerdammer",
      "Edam",
      "Limburger",
      "Appenzeller",
    ].map((productTitle) => {
      return {
        title: productTitle,
        stock: getRandomNumber(10, 20),
        price: getRandomNumber(1, 2),
      };
    }),
  },
];
await database.connection.dropDatabase();
for (const categorySeed of categoriesSeed) {
  const category = await CategoryModel.create({
    slug: slugify(categorySeed.title, {
      lower: true,
    }),
    title: categorySeed.title,
  });

  for (const productSeed of categorySeed.products) {
    const product = await ProductModel.create({
      title: productSeed.title,
      price: productSeed.price,
      stock: productSeed.stock,
      category: category._id,
    });
  }
}

// Define types
const typeDefinitions = `#graphql
  type Category {
    _id: ID!
    slug: String
    title: String
    productCount: Int
    products(offset: Int = 0, limit: Int = 5): [Product]
  }

  type Product {
    _id: ID!
    title: String
    price: Float
    stock: Int
    category: Category
  }

  type Order {
    _id: ID!
    ip: String
    products: [OrderProduct]
  }

  type OrderProduct {
    productId: ID
    quantity: Int
    product: Product
  }

  type Query {
    order: Order
    categories: [Category]
    category(id: String): Category
    products(categoryId: String, offset: Int = 0, limit: Int = 5): [Product]
  }

  type Mutation {
    addProductToOrder(productId: String, quantity: Int = 1): Order
    updateProductInOrder(productId: String, quantity: Int = 1): Order
    removeProductFromOrder(productId: String): Order
    submitOrder: Order
  }
`;

// Run Apollo
const server = new ApolloServer<Context>({
  typeDefs: typeDefinitions,
  resolvers: {
    // Global query resolvers
    Query: {
      order: async (parent, args, context, info) => {
        return await context.dataSources.orders.get(
          context.req.socket.remoteAddress
        );
      },
      categories: async (parent, args, context, info) => {
        return await context.dataSources.categories.list();
      },
      category: async (parent, args, context, info) => {
        return await context.dataSources.categories.findOneById(args.id);
      },
      products: async (parent, args, context, info) => {
        return await context.dataSources.products.list(
          args.categoryId,
          args.offset,
          args.limit
        );
      },
    },

    // Global mutations
    Mutation: {
      addProductToOrder: async (root, args, context) => {
        const { productId, quantity } = args;
        const order = await context.dataSources.orders.addProductToOrder(
          context.req.socket.remoteAddress,
          productId,
          quantity
        );

        return order;
      },
      updateProductInOrder: async (root, args, context) => {
        const { productId, quantity } = args;
        const order = await context.dataSources.orders.updateProductInOrder(
          context.req.socket.remoteAddress,
          productId,
          quantity
        );

        return order;
      },
      removeProductFromOrder: async (root, args, context) => {
        const { productId, quantity } = args;
        const order = await context.dataSources.orders.removeProductFromOrder(
          context.req.socket.remoteAddress,
          productId
        );

        return order;
      },
      submitOrder: async (root, args, context) => {
        const order = await context.dataSources.orders.submitOrder(
          context.req.socket.remoteAddress
        );

        return order;
      },
    },

    // Specific resolvers
    Category: {
      productCount: async (parent, args, context, info) => {
        return await context.dataSources.products.count(parent._id);
      },
      products: async (parent, args, context, info) => {
        return await context.dataSources.products.list(
          parent._id,
          args.offset,
          args.limit
        );
      },
    },
    Order: {
      products: async (parent, args, context, info) => {
        const orderProducts = parent.products;
        const productIds = orderProducts.map(
          (orderProduct) => orderProduct.productId
        );
        const products = await context.dataSources.products.findManyByIds(
          productIds
        );
        const resolvedOrderProducts = orderProducts.map((orderProduct) => {
          return {
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            product: products.find((product) =>
              product._id.equals(orderProduct.productId)
            ),
          };
        });

        return resolvedOrderProducts;
      },
    },
  },
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const { cache } = server;
    const token = String(req.headers.token);
    const config: DataSourceConfig = {
      cache,
      context: {
        token,
      },
    };

    return {
      req,
      dataSources: {
        categories: new CategoryDataSource(CategoryModel, config),
        products: new ProductDataSource(ProductModel, config),
        orders: new OrderDataSource(OrderModel, config),
      },
      token,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
