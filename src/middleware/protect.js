const en = require("../../locale/en");
const AuthException = require("../error/auth-exception");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");
const { AdminService } = require("../service/admin-service");
const { CustomerService } = require("../service/customer-service");

const admin = new AdminService();
const customer = new CustomerService();

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const result = await admin.FindByEmail(decoded.email);

    if (result.status === "active") {
      req.user = result;
      req.user.isAdmin = true;
      return next();
    }

    return next(new AuthException(en["account-disabled"]));
  } catch (error) {
    return next(new AuthException(en["authentication-failure"]));
  }
};

const generalAuth = async (req, res, next) => {
  const admin = new AdminService();

  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, jwtConfig.secret);

    let result = await admin.FindByEmail(decoded.email);

    if (result && result.status === "active") {
      req.user = result;
      req.user.isAdmin = true;
      return next();
    } else {
      result = await customer.FindByEmail(decoded.email);

      if (result && result.active === true) {
        req.user = result;
        req.user.isAdmin = false;
        return next();
      }
    }

    return next(new AuthException(en["account-disabled"]));
  } catch (error) {
    return next(new AuthException(en["authentication-failure"]));
  }
};

module.exports = { adminAuth, generalAuth };
