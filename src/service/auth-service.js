const AdminRepository = require("../database/repository/admin-repository");
const AuthException = require("../error/auth-exception");
const en = require("../../locale/en");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CustomerRepository = require("../database/repository/customer-repository");

class AuthService {
  constructor() {
    this.repository = new AdminRepository();
    this.customerRepository = new CustomerRepository();
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
          existingAdmin.permissions = undefined;
          existingAdmin.status = undefined;
          existingAdmin.type = undefined;
          const secretKey = jwtConfig.secret;
          const token = jwt.sign({ email }, secretKey, { expiresIn: "1d" });
          return { admin: existingAdmin, token };
        }
      }

      throw new AuthException(en["login-failure"]);
    } catch (error) {
      throw new AuthException(en["login-failure"]);
    }
  }

  async CustomerSignUp(userInput) {
    try {
      const { name, email, password, address, phone } = userInput;
      const existingCustomer =
        await this.customerRepository.FindCustomerByEmail({ email });
      const existingAdmin = await this.repository.FindAdminByEmail({ email });

      if (!existingCustomer && !existingAdmin) {
        const hashedPassword = bcrypt.hashSync(password, 12);

        this.customerRepository.CreateCustomer({
          name,
          email,
          password: hashedPassword,
          address,
          phone,
        });

        return {message: en["signup-successful"]};
      }

      throw new AuthException(en["email-taken"], 409);
    } catch (error) {
      if (error.status === 409) {
        throw new AuthException(en["email-taken"], 409);
      }

      throw new AuthException(en["customer-creation-error"]);
    }
  }

  async CustomerSignIn(userInput) {
    const { email, password } = userInput;
    try {
      const existingCustomer =
        await this.customerRepository.FindCustomerByEmail({
          email,
        });

      if (existingCustomer) {
        const passwordCheck = await this.customerRepository.validatePassword({
          customer: existingCustomer,
          password,
        });

        if (passwordCheck) {
          existingCustomer.password = undefined;
          const secretKey = jwtConfig.secret;
          const token = jwt.sign({ email }, secretKey, { expiresIn: "1d" });
          return { customer: existingCustomer, token };
        }
      }

      throw new AuthException(en["login-failure"]);
    } catch (error) {
      throw new AuthException(en["login-failure"]);
    }
  }
}

module.exports = { AuthService };
