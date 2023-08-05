const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Order } = require("../model");

class OrderRepository {
  async CreateOrder({ items, totalAmount, customer }) {
    try {
      const order = await Order.create({
        items,
        totalAmount,
        customer,
      });
      return order;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindOrderById(id) {
    try {
      const order = await Order.findById(id);

      if (!order) throw new Error();

      if (order.active) {
        return order;
      }

      throw new Error();
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindAll({ page, limit }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
        };

        Order.paginate({}, options, function (err, result) {
          if (err) {
            throw Error("Error in getting orders");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en["server-error"]);
      }
    });
  }

  async DeleteOrder(id) {
    try {
      await Order.findByIdAndUpdate(id, { $set: { active: false } });
      return true;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: id, active: true },
        updateData,
        {
          new: true,
        },
      );

      return order;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FilterOrder({ page, limit, data }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
        };

        Order.paginate(data, options, function (err, result) {
          if (err) {
            throw Error("Error in getting orders");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en["server-error"]);
      }
    });
  }
}

module.exports = OrderRepository;
