const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Category } = require("../model");

class CategoryRepository {
  async CreateCategory({ name }) {
    try {
      const category = await Category.create({ name });
      return category;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindCategoryByName({ name }) {
    try {
      const existingCategory = await Category.findOne({ name, active: true });

      if (!existingCategory) throw new Error();

      return existingCategory;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindCategoryById(id) {
    try {
      const category = await Category.findById(id);

      if (!category) throw new Error();

      if (category.active) {
        return category;
      }

      throw new Error();
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindAll() {
    try {
      const categorys = await Category.find({ active: true }).sort({
        createdAt: -1,
      });
      if (!categorys) throw new Error();
      return categorys;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async DeleteCategory(id) {
    try {
      await Category.findByIdAndUpdate(id, { $set: { active: false } });
      return true;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: id, active: true },
        updateData,
        {
          new: true,
        },
      );

      return category;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }
}

module.exports = CategoryRepository;
