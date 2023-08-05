const {
  validateCustomerId
} = require("../middleware/input-validations/customer-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { adminAuth, generalAuth } = require("../middleware/protect");
const { CustomerService } = require("../service/customer-service");

module.exports = async (app) => {
  const service = new CustomerService();

  app.get(
    "/api/1.0/customer",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      const customers = await service.FindAll({ page, limit });
      res.send(customers);
    }),
  );

  app.get(
    "/api/1.0/customer/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateCustomerId,
    generalAuth,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const customer = await service.FindById(id);
      res.send(customer);
    }),
  );

  app.get(
    "/api/1.0/customer/search/:searchTerm",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateCustomerId,
    generalAuth,
    catchAsync(async (req, res) => {
      const searchTerm = req.params.searchTerm;
      const customers = await service.SearchProductName(searchTerm);
      res.send(customers);
    }),
  );

  app.patch(
    "/api/1.0/customer/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    generalAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const customer = await service.UpdateOne(id, data);
      res.send(customer);
    }),
  );

  app.post(
    "/api/1.0/customer/filter",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      let data = req.body;
      const customers = await service.FilterUsers({
        page,
        limit,
        data,
      });
      res.send(customers);
    }),
  );

  app.delete(
    "/api/1.0/customer/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    generalAuth,
    catchAsync(async (req, res) => {
      let id = req.params.id;
      const user = req.user;
      const customer = await service.DeleteCustomer(id, user);
      res.status(204).send(customer);
    }),
  );
};
