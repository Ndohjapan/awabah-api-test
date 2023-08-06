const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const ProductRepository = require("../database/repository/product-repository");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  async CreateProduct(data) {
    try {
      const product = await this.repository.CreateProduct(data);

      return product;
    } catch (error) {
      throw new CreationException(en["product-creation-error"], 401);
    }
  }

  async FindById(id) {
    try {
      const product = await this.repository.FindProductById(id);

      return product;
    } catch (error) {
      throw new NotFoundException(en["product-find-error"]);
    }
  }

  async SearchProductName(searchTerm) {
    try {
      const regex = new RegExp(this.escapeRegex(searchTerm), "gi");

      const products = await this.repository.FuzzySearchName(regex);

      return products;
    } catch (error) {
      throw new NotFoundException(en["product-find-error"]);
    }
  }

  async FindAll({ page, limit }) {
    try {
      const products = await this.repository.FindAll({
        page,
        limit,
      });
      return products;
    } catch (error) {
      throw new NotFoundException(en["product-find-error"]);
    }
  }

  async DeleteProduct(id) {
    try {
      const isProduct = await this.repository.FindProductById(id);
      console.log(isProduct);
      if (isProduct.id) {
        const product = await this.repository.DeleteProduct(id);

        return product;
      }
      throw new Error(en["product-find-error"]);
    } catch (error) {
      throw new NotFoundException(error.product || en["product-delete-error"]);
    }
  }

  async UpdateOne(id, data) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    updateData.active = undefined;

    try {
      const product = await this.repository.UpdateOne({ id, updateData });

      return product;
    } catch (error) {
      throw new NotFoundException(en["product-find-error"]);
    }
  }

  async FilterProducts({ page, limit, data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    updateData.active = true;

    try {
      const products = await this.repository.FilterUsers({
        page,
        limit,
        data: updateData,
      });
      return products;
    } catch (error) {
      throw new NotFoundException(en["product-find-error"]);
    }
  }
}

module.exports = { ProductService };
