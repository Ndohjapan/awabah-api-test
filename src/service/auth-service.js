const AdminRepository = require("../database/repository/admin-repository");
const AuthException = require("../error/auth-exception");
const en = require("../../locale/en");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor() {
    this.repository = new AdminRepository();
  }

  async AdminSignIn(userInput) {
    const { email, password } = userInput;
    try {
      const existingAdmin = await this.repository.FindAdminByEmail({
        email,
      });

      if (existingAdmin) {
        const passwordCheck = await this.repository.validatePassword({
          admin: existingAdmin,
          password,
        });


        if (passwordCheck) {
          existingAdmin.password = undefined;
          const secretKey = jwtConfig.secret;
          const token = jwt.sign({email}, secretKey, { expiresIn: "1d" });
          return {admin: existingAdmin, token};
        }
      }

      throw new AuthException(en["login-failure"]);
    } catch (error) {
      throw new AuthException(en["login-failure"]);
    }
  }

}

module.exports = { AuthService };
