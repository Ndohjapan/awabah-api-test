const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Supplier } = require("../model");

class SupplierRepository {
  async CreateSupplier({ name, address, email, phone }) {
    try {
      const supplier = await Supplier.create({ name, address, email, phone });
      return supplier;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindSupplierByName({ name }) {
    try {
      const existingSupplier = await Supplier.findOne({ name, active: true });

      if (!existingSupplier) throw new Error();

      return existingSupplier;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindSupplierById(id) {
    try {
      const supplier = await Supplier.findById(id);

      if (!supplier) throw new Error();

      if (supplier.active) {
        return supplier;
      }

      throw new Error();
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindAll() {
    try {
      const suppliers = await Supplier.find({ active: true }).sort({
        createdAt: -1,
      });
      if (!suppliers) throw new Error();
      return suppliers;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async DeleteSupplier(id) {
    try {
      await Supplier.findByIdAndUpdate(id, { $set: { active: false } });
      return true;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const supplier = await Supplier.findOneAndUpdate(
        { _id: id, active: true },
        updateData,
        {
          new: true,
          select: "-active"
        },
      );

      return supplier;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FilterSupplier({ filterData }) {
    try {
      const suppliers = await Supplier.find(filterData).sort({
        createdAt: -1,
      });
      if (!suppliers) throw new Error();
      return suppliers;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }
}

module.exports = SupplierRepository;
