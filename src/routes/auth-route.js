const {
  validateAdminLoginInput,
} = require("../middleware/input-validations/auth-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { AuthService } = require("../service/auth-service");
const {
  methodAllowed,
  setContentType,
} = require("../middleware/res-secure-header");

module.exports = (app) => {
  const service = new AuthService();

  app.use(methodAllowed({ methodAllow: "POST" }));
  app.use(setContentType);

  app.post(
    "/api/1.0/login",
    rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
    validateAdminLoginInput,
    catchAsync(async (req, res, next) => {
      const userInput = req.body;
      const admin = await service.AdminSignIn(userInput);
      res.send(admin);
    }),
  );
};
