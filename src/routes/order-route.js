const {validateCreateOrderInput, validateOrderId, validateFilterOrderInput} = require("../middleware/input-validations/order-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { adminAuth, generalAuth } = require("../middleware/protect");
const { OrderService } = require("../service/order-service");

module.exports = async (app) => {
  const service = new OrderService();

  app.post(
    "/api/1.0/order",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    generalAuth,
    validateCreateOrderInput,
    catchAsync(async (req, res) => {
      let data = req.body;
      data.customer = req.user.id;
      const order = await service.CreateOrder(data);
      res.send(order);
    }),
  );

  app.get(
    "/api/1.0/order",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    adminAuth,
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      const orders = await service.FindAll({ page, limit });
      res.send(orders);
    }),
  );

  app.get(
    "/api/1.0/order/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateOrderId,
    generalAuth,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const order = await service.FindById(id);
      res.send(order);
    }),
  );

  app.post(
    "/api/1.0/order/filter",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateFilterOrderInput,
    adminAuth,
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 50;
      let data = req.body;
      const orders = await service.FilterOrders({
        page,
        limit,
        data,
      });
      res.send(orders);
    }),
  );

  app.delete(
    "/api/1.0/order/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    generalAuth,
    catchAsync(async (req, res) => {
      let id = req.params.id;
      const order = await service.DeleteOrder(id);
      res.status(204).send(order);
    }),
  );
};
