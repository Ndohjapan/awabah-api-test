const en = require("../../locale/en");
const AuthException = require("../error/auth-exception");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");
const { AdminService } = require("../service/admin-service");

const adminAuth = async (req, res, next) => {

  const admin = new AdminService();
  
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const result = await admin.FindByEmail(decoded.email);

    if (result.status === "active") {
      req.user = result;
      return next();
    }

    return next(new AuthException(en["account-disabled"]));
  } catch (error) {
    return next(new AuthException(en["authentication-failure"]));
  }
};

module.exports = { adminAuth };
