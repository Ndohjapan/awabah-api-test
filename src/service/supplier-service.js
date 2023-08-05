const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const SupplierRepository = require("../database/repository/supplier-repository");

class SupplierService {
  constructor() {
    this.repository = new SupplierRepository();
  }

  async CreateSupplier(data) {
    try {
      const supplier = await this.repository.CreateSupplier(data);

      supplier.active = undefined;

      return supplier;
    } catch (error) {
      throw new CreationException(en["supplier-creation-error"], 401);
    }
  }

  async FindById(id) {
    try {
      const supplier = await this.repository.FindSupplierById(id);

      return supplier;
    } catch (error) {
      throw new NotFoundException(en["supplier-find-error"]);
    }
  }

  async FindAll() {
    try {
      const supplier = await this.repository.FindAll();

      return supplier;
    } catch (error) {
      throw new NotFoundException(en["supplier-find-error"]);
    }
  }

  async DeleteSupplier(id) {
    try {
      const isSupplier = await this.repository.FindSupplierById(id);
      if (isSupplier.id) {
        const supplier = await this.repository.DeleteSupplier(id);

        return supplier;
      }
      throw new Error(en["supplier-find-error"]);
    } catch (error) {
      throw new NotFoundException(
        error.supplier || en["supplier-delete-error"],
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
      const supplier = await this.repository.UpdateOne({ id, updateData });

      return supplier;
    } catch (error) {
      throw new NotFoundException(en["supplier-find-error"]);
    }
  }

  async FilterSuppliers(data) {
    let filterData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        filterData[key] = value;
      }
    });

    try {
      const supplier = await this.repository.FilterSupplier({ filterData });

      return supplier;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(en["supplier-find-error"]);
    }
  }
}

module.exports = { SupplierService };
