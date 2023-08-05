const {
  validateCreateProductInput, validateProductId
} = require("../middleware/input-validations/product-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { adminAuth } = require("../middleware/protect");
const { ProductService } = require("../service/product-service");

module.exports = async (app) => {
  const service = new ProductService();

  app.post(
    "/api/1.0/product",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    validateCreateProductInput,
    catchAsync(async (req, res) => {
      let data = req.body;
      const product = await service.CreateProduct(data);
      res.send(product);
    }),
  );

  app.get(
    "/api/1.0/product",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      const products = await service.FindAll({ page, limit });
      res.send(products);
    }),
  );

  app.get(
    "/api/1.0/product/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateProductId,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const product = await service.FindById(id);
      res.send(product);
    }),
  );

  app.get(
    "/api/1.0/product/search/:searchTerm",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    catchAsync(async (req, res) => {
      const searchTerm = req.params.searchTerm;
      const products = await service.SearchProductName(searchTerm);
      res.send(products);
    }),
  );

  app.patch(
    "/api/1.0/product/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const product = await service.UpdateOne(id, data);
      res.send(product);
    }),
  );

  app.post(
    "/api/1.0/product/filter",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      let data = req.body;
      const products = await service.FilterProducts({
        page,
        limit,
        data,
      });
      res.send(products);
    }),
  );

  app.delete(
    "/api/1.0/product/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let id = req.params.id;
      const product = await service.DeleteProduct(id);
      res.status(204).send(product);
    }),
  );
};
