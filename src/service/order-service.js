const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const OrderRepository = require("../database/repository/order-repository");
const ProductRepository = require("../database/repository/product-repository");

class OrderService {
  constructor() {
    this.repository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  async CreateOrder(data) {
    try {
      const productsLength = data.items.length;
      const productsArray = data.items.map((item) => item.product);
      const filter = { _id: { $in: productsArray } };

      const products = await this.productRepository.FilterProduct({
        page: 1,
        limit: productsLength,
        data: filter,
      });

      if (products.totalDocs !== data.items.length) {
        throw new Error(en["invalid-product-id"]);
      }

      let totalCost = 0;

      products.docs.forEach((product) => {
        const item = data.items.find(
          (item) => item.product.toString() === product._id.toString(),
        );
        if (!item) {
          throw new Error(en["invalid-product-id"]);
        }
        totalCost += product.price * item.amount;
      });

      if (totalCost !== data.totalAmount) {
        throw new Error(en["product-cost-invalid"]);
      }

      const order = await this.repository.CreateOrder(data);

      return order;
    } catch (error) {
      throw new CreationException(error.message || en["order-creation-error"], 401);
    }
  }

  async FindById(id) {
    try {
      const order = await this.repository.FindOrderById(id);

      return order;
    } catch (error) {
      throw new NotFoundException(en["order-find-error"]);
    }
  }

  async SearchOrderName(searchTerm) {
    try {
      const orders = await this.repository.FuzzySearchName(searchTerm);

      return orders;
    } catch (error) {
      throw new NotFoundException(en["order-find-error"]);
    }
  }

  async FindAll({ page, limit }) {
    try {
      const orders = await this.repository.FindAll({
        page,
        limit,
      });
      return orders;
    } catch (error) {
      throw new NotFoundException(en["order-find-error"]);
    }
  }

  async DeleteOrder(id) {
    try {
      const isOrder = await this.repository.FindOrderById(id);
      if (isOrder.id) {
        const order = await this.repository.DeleteOrder(id);

        return order;
      }
      throw new Error(en["order-find-error"]);
    } catch (error) {
      throw new NotFoundException(error.order || en["order-delete-error"]);
    }
  }

  async UpdateOne(id, data) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const order = await this.repository.UpdateOne({ id, updateData });

      return order;
    } catch (error) {
      throw new NotFoundException(en["order-find-error"]);
    }
  }

  async FilterOrders({ page, limit, data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const orders = await this.repository.FilterOrder({
        page,
        limit,
        data: updateData,
      });
      return orders;
    } catch (error) {
      throw new NotFoundException(en["order-find-error"]);
    }
  }
}

module.exports = { OrderService };
