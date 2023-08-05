const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CustomerRepository = require("../database/repository/customer-repository");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async FindById(id) {
    try {
      const customer = await this.repository.FindCustomerById(id);

      return customer;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }

  async FindByEmail(email) {
    try {
      const customer = await this.repository.FindCustomerByEmail({ email });
      return customer;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }

  async SearchCustomerName(searchTerm) {
    try {
      const customers = await this.repository.FuzzySearchName(searchTerm);

      return customers;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }

  async FindAll({ page, limit }) {
    try {
      const customers = await this.repository.FindAll({
        page,
        limit,
      });
      return customers;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }

  async DeleteCustomer(id, user) {
    try {

      if (!user.isAdmin && user._id === id) {
        throw new Error(en["customer-delete-error"]);
      }

      const isCustomer = await this.repository.FindCustomerById(id);
      
      if (isCustomer.id) {
        const customer = await this.repository.DeleteCustomer(id);

        return customer;
      }

      throw new Error(en["customer-find-error"]);
      
    } catch (error) {
      throw new NotFoundException(
        error.customer || en["customer-delete-error"],
      );
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
      const customer = await this.repository.UpdateOne({ id, updateData });

      return customer;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }

  async FilterCustomers({ page, limit, data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const customers = await this.repository.FilterUsers({
        page,
        limit,
        data: updateData,
      });
      return customers;
    } catch (error) {
      throw new NotFoundException(en["customer-find-error"]);
    }
  }
}

module.exports = { CustomerService };
