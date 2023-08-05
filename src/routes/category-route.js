const {
  validateCreateCategoryInput,
  validateCategoryId,
} = require("../middleware/input-validations/category-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { CategoryService } = require("../service/category-service");
const { adminAuth } = require("../middleware/protect");

module.exports = async (app) => {
  const service = new CategoryService();

  app.post(
    "/api/1.0/category",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    validateCreateCategoryInput,
    catchAsync(async (req, res) => {
      let data = req.body;
      const category = await service.CreateCategory(data);
      res.send(category);
    }),
  );

  app.get(
    "/api/1.0/category",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    catchAsync(async (req, res) => {
      const categories = await service.FindAll();
      res.send(categories);
    }),
  );

  app.get(
    "/api/1.0/category/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateCategoryId,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const category = await service.FindById(id);
      res.send(category);
    }),
  );

  app.patch(
    "/api/1.0/category/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const category = await service.UpdateOne(id, data);
      res.send(category);
    }),
  );

  app.delete(
    "/api/1.0/category/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let id = req.params.id;
      const category = await service.DeleteCategory(id);
      res.status(204).send(category);
    }),
  );
};
