const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Product } = require("../model");

class ProductRepository {
  async CreateProduct({ name, description, stock, price, category, supplier }) {
    try {
      const product = await Product.create({
        name,
        description,
        stock,
        price,
        category,
        supplier,
      });
      return product;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FuzzySearchName(searchTerm) {
    try {
      let productAggregate = [
        {
          $match: {
            $or: [{ name: searchTerm }],
            active: true,
          },
        },
      ];

      const existingProduct = await Product.aggregate(productAggregate);

      if (!existingProduct) throw new Error();

      return existingProduct;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindProductById(id) {
    try {
      const product = await Product.findById(id, { active: 0 });

      if (!product) throw new Error();

      if (product.active) {
        return product;
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
          select: "-active",
        };

        Product.paginate({}, options, function (err, result) {
          if (err) {
            throw Error("Error in getting products");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en["server-error"]);
      }
    });
  }

  async DeleteProduct(id) {
    try {
      await Product.findByIdAndUpdate(id, { $set: { active: false } });
      console.log(id);
      return true;
    } catch (error) {
      console.log(error);
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id, active: true },
        updateData,
        {
          new: true,
        },
      );

      return product;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FilterProduct({ page, limit, data }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
        };

        Product.paginate(data, options, function (err, result) {
          if (err) {
            throw Error("Error in getting products");
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

module.exports = ProductRepository;
