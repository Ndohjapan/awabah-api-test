const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Customer } = require("../model");

class CustomerRepository {
  async CreateCustomer({ name, email, password, address, phone }) {
    try {
      const customer = await Customer.create({
        name,
        email,
        password,
        address,
        phone,
      });
      return customer;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindCustomerByEmail({ email }) {
    try {
      const existingCustomer = await Customer.findOne(
        { email },
        { createAt: 0, updatedAt: 0 },
      );

      return existingCustomer;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FuzzySearchName(searchTerm) {
    try {
      const existingCustomer = await Customer.find({
        $text: { $search: searchTerm },
        active: true,
      }, {password: 0});

      if (!existingCustomer) throw new Error();

      return existingCustomer;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindCustomerById(id) {
    try {
      const customer = await Customer.findById(id, {password: 0});

      if (!customer) throw new Error();

      if (customer.active) {
        return customer;
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
          select: "-password"
        };

        Customer.paginate({}, options, function (err, result) {
          if (err) {
            throw Error("Error in getting customers");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en["server-error"]);
      }
    });
  }

  async DeleteCustomer(id) {
    try {
      await Customer.findByIdAndUpdate(id, { $set: { active: false } });
      return true;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { _id: id, active: true },
        updateData,
        {
          new: true,
        },
      );

      customer.password = undefined;

      return customer;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FilterCustomer({ page, limit, data }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
          select: "-password"
        };

        Customer.paginate(data, options, function (err, result) {
          if (err) {
            throw Error("Error in getting customers");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en["server-error"]);
      }
    });
  }

  async validatePassword({ customer, password }) {
    return await customer.validatePassword(password);
  }
}

module.exports = CustomerRepository;
