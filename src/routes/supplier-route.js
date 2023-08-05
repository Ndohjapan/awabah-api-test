const {
  validateCreateSupplierInput, validateSupplierId
} = require("../middleware/input-validations/supplier-validation");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { adminAuth } = require("../middleware/protect");
const { SupplierService } = require("../service/supplier-service");

module.exports = async (app) => {
  const service = new SupplierService();

  app.post(
    "/api/1.0/supplier",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    validateCreateSupplierInput,
    catchAsync(async (req, res) => {
      let data = req.body;
      const category = await service.CreateSupplier(data);
      res.send(category);
    }),
  );

  app.get(
    "/api/1.0/supplier",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    catchAsync(async (req, res) => {
      const categories = await service.FindAll();
      res.send(categories);
    }),
  );

  app.get(
    "/api/1.0/supplier/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateSupplierId,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const category = await service.FindById(id);
      res.send(category);
    }),
  );

  app.patch(
    "/api/1.0/supplier/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const category = await service.UpdateOne(id, data);
      res.send(category);
    }),
  );

  app.post(
    "/api/1.0/supplier/filter",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const categories = await service.FilterSuppliers(id, data);
      res.send(categories);
    }),
  );

  app.delete(
    "/api/1.0/supplier/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let id = req.params.id;
      const category = await service.DeleteSupplier(id);
      res.status(204).send(category);
    }),
  );
};
