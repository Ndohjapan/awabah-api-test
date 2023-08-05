const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const { Admin, Customer } = require("../src/database/model");
const en = require("../locale/en");
const credentials = { email: "admin1@mail.com", password: "P4ssword@" };
const userCredentials = { email: "user1@mail.com", password: "P4ssword@" };
const mockData = require("./resources/mock-data");

const addAdmin = async (admin = mockData.admin1) => {
  const data = await Admin.create(admin);
  return data;
};

const addCustomer = async (customer = {...mockData.customers[0], password: mockData.admin1.password}) => {
  const data = await Customer.create(customer);
  return data;
};

const CustomerSignUp = async (customer = mockData.customers[0]) => {
  let agent = await request(app)
    .post("/api/1.0/customer/signup")
    .send(customer);

  if (agent.body.token) {
    token = agent.body.token;
  }

  return agent;
};

const adminLogin = async (admin = credentials) => {
  let agent = await request(app).post("/api/1.0/login").send(admin);

  if (agent.body.token) {
    token = agent.body.token;
  }

  return agent;
};

const customerLogin = async (customer = userCredentials) => {
  let agent = await request(app).post("/api/1.0/customer/login").send(customer);

  if (agent.body.token) {
    token = agent.body.token;
  }

  return agent;
};

describe("Admin Login", () => {
  it("returns - HTTP 429 when we exceed rate limit", async () => {
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    const response = await adminLogin();

    expect(response.status).toBe(429);
  });

  it(`returns - ${en["rate-limit-exceeded"]} when we exceed rate limit`, async () => {
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    await adminLogin();
    const response = await adminLogin();

    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it("returns - HTTP 400 when we try to pass an empty password", async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, password: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en["password-required"]} when we try to pass an empty password`, async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, password: "" });

    expect(response.body.validationErrors.password).toBe(
      en["password-required"],
    );
  });

  it("returns - HTTP 400 when we try to pass a number formatted password", async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, password: 1234345 });

    expect(response.status).toBe(400);
  });

  it.each`
    password                 | message
    ${12345}                 | ${en["password-format"]}
    ${[123, 12]}             | ${en["password-format"]}
    ${["fewun", "wuinewfe"]} | ${en["password-format"]}
    ${{ hello: "world" }}    | ${en["password-format"]}
  `(
    'returns - "$message" when password is wrongly formatted to "$password" ',
    async ({ password, message }) => {
      await addAdmin();
      const response = await adminLogin({ ...credentials, password });

      expect(response.body.validationErrors.password).toBe(message);
    },
  );

  it("returns - HTTP 400 when we try to pass an empty email", async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, email: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en["email-required"]} when we try to pass an empty email`, async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, email: "" });

    expect(response.body.validationErrors.email).toBe(en["email-required"]);
  });

  it("returns - HTTP 400 when we try to pass a number formatted", async () => {
    await addAdmin();
    const response = await adminLogin({ ...credentials, email: "" });

    expect(response.status).toBe(400);
  });

  it.each`
    email                    | message
    ${12345}                 | ${en["email-format"]}
    ${[123, 12]}             | ${en["email-format"]}
    ${["fewun", "wuinewfe"]} | ${en["email-format"]}
    ${{ hello: "world" }}    | ${en["email-format"]}
    ${"hello world"}         | ${en["email-format"]}
  `(
    'returns - "$message" when email is wrongly formatted to "$email" ',
    async ({ email, message }) => {
      await addAdmin();
      const response = await adminLogin({ ...credentials, email });

      expect(response.body.validationErrors.email).toBe(message);
    },
  );

  it("return - HTTP 401 when we login with invalid password", async () => {
    await addAdmin();
    const response = await adminLogin({
      email: "admin1@mail.com",
      password: "12343",
    });

    expect(response.status).toBe(401);
  });

  it(`return - ${en["login-failure"]} when we login with invalid password`, async () => {
    await addAdmin();
    const response = await adminLogin({
      email: "admin1@mail.com",
      password: "12343",
    });

    expect(response.body.message).toBe(en["login-failure"]);
  });

  it("returns - proper error body when authentication fails", async () => {
    await addAdmin();
    const nowInMillis = new Date().getTime();
    const response = await adminLogin({
      ...credentials,
      email: "admin@mail.com",
    });
    const error = response.body;
    expect(error.path).toBe("/api/1.0/login");
    expect(error.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(error)).toEqual(["path", "timestamp", "message"]);
  });

  it("return - HTTP 200 OK when the login is successful ", async () => {
    await addAdmin();
    const response = await adminLogin();

    expect(response.status).toBe(200);
  });

  it("returns - admin data when the login is successful", async () => {
    await addAdmin();
    const response = await adminLogin();

    expect(response.body.admin.name).toBe(mockData.admin1.name);
  });

  it("check - ensure no password, createdAt and updatedAt is returned on successful login", async () => {
    await addAdmin();
    const response = await adminLogin();

    expect(response.body.admin.password).toBeFalsy();
    expect(response.body.admin.createdAt).toBeFalsy();
    expect(response.body.admin.updatedAt).toBeFalsy();
  });
});

describe("User Signup", () => {
  it("returns - HTTP 429 when we exceed rate limit", async () => {
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    const response = await CustomerSignUp();

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we exceed rate limit`, async () => {
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    await CustomerSignUp();
    const response = await CustomerSignUp();

    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it.each`
    name                     | message
    ${null}                  | ${en["name-required"]}
    ${""}                    | ${en["name-required"]}
    ${[123, 12]}             | ${en["name-format"]}
    ${["fewun", "wuinewfe"]} | ${en["name-format"]}
    ${{ hello: "world" }}    | ${en["name-format"]}
  `(
    'returns - "$message" when name is wrongly formatted to "$name" ',
    async ({ name, message }) => {
      const response = await CustomerSignUp({ ...mockData.customers[0], name });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.name).toBe(message);
    },
  );

  it.each`
    address                  | message
    ${null}                  | ${en["address-required"]}
    ${""}                    | ${en["address-required"]}
    ${[123, 12]}             | ${en["address-format"]}
    ${["fewun", "wuinewfe"]} | ${en["address-format"]}
    ${{ hello: "world" }}    | ${en["address-format"]}
  `(
    'returns - "$message" when address is wrongly formatted to "$address" ',
    async ({ address, message }) => {
      const response = await CustomerSignUp({
        ...mockData.customers[0],
        address,
      });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.address).toBe(message);
    },
  );

  it.each`
    email                    | message
    ${null}                  | ${en["email-required"]}
    ${""}                    | ${en["email-required"]}
    ${[123, 12]}             | ${en["email-format"]}
    ${["fewun", "wuinewfe"]} | ${en["email-format"]}
    ${{ hello: "world" }}    | ${en["email-format"]}
    ${{ hello: "world" }}    | ${en["email-format"]}
    ${"user@"}               | ${en["email-format"]}
    ${"@mail"}               | ${en["email-format"]}
  `(
    'returns - "$message" when username is wrongly formatted to "$email" ',
    async ({ email, message }) => {
      const response = await CustomerSignUp({
        ...mockData.customers[0],
        email,
      });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.email).toBe(message);
    },
  );

  it.each`
    phone                            | message
    ${["irnewnow", 12, 120, 90, 89]} | ${en["phone-format"]}
    ${["fewun", "wuinewfe"]}         | ${en["phone-format"]}
    ${{ hello: "world" }}            | ${en["phone-format"]}
    ${12345}                         | ${en["phone-length"]}
    ${123456789012345}               | ${en["phone-length"]}
    ${""}                            | ${en["phone-required"]}
    ${null}                          | ${en["phone-required"]}
  `(
    'returns - "$message" when phone is wrongly formatted to "$phone" ',
    async ({ phone, message }) => {
      const response = await CustomerSignUp({
        ...mockData.customers[0],
        phone,
      });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.phone).toBe(message);
    },
  );

  it.each`
    password                 | message
    ${""}                    | ${en["password-required"]}
    ${null}                  | ${en["password-required"]}
    ${12345}                 | ${en["password-format"]}
    ${[123, 12]}             | ${en["password-format"]}
    ${["fewun", "wuinewfe"]} | ${en["password-format"]}
    ${{ hello: "world" }}    | ${en["password-format"]}
    ${"ewjinew"}             | ${en["password-length"]}
    ${"password"}            | ${en["password-requirement"]}
    ${"Password"}            | ${en["password-requirement"]}
    ${"P4ssword"}            | ${en["password-requirement"]}
  `(
    'returns - "$message" when password is wrongly formatted to "$password" ',
    async ({ password, message }) => {
      const response = await CustomerSignUp({
        ...mockData.customers[0],
        password,
      });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.password).toBe(message);
    },
  );

  it("return - HTTP 200 ok when signup is successful", async () => {
    const response = await CustomerSignUp();

    expect(response.status).toBe(200);
  });

  it(`return - ${en["signup-successful"]} ok when signup is successful`, async () => {
    const response = await CustomerSignUp();

    expect(response.body.message).toBe(en["signup-successful"]);
  });

  it("return - HTTP 409 when we try to signup with same username", async () => {
    await CustomerSignUp();
    const response = await CustomerSignUp();

    expect(response.status).toBe(409);
  });

  it(`return - ${en["email-taken"]} ok when we signup with duplicate user`, async () => {
    await CustomerSignUp();
    const response = await CustomerSignUp();

    expect(response.body.message).toBe(en["email-taken"]);
  });
});

describe("Customer Login", () => {
  it("returns - HTTP 429 when we exceed rate limit", async () => {
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    const response = await customerLogin();

    expect(response.status).toBe(429);
  });

  it(`returns - ${en["rate-limit-exceeded"]} when we exceed rate limit`, async () => {
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    await customerLogin();
    const response = await customerLogin();

    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it("returns - HTTP 400 when we try to pass an empty password", async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, password: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en["password-required"]} when we try to pass an empty password`, async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, password: "" });

    expect(response.body.validationErrors.password).toBe(
      en["password-required"],
    );
  });

  it("returns - HTTP 400 when we try to pass a number formatted password", async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, password: 1234345 });

    expect(response.status).toBe(400);
  });

  it.each`
    password                 | message
    ${12345}                 | ${en["password-format"]}
    ${[123, 12]}             | ${en["password-format"]}
    ${["fewun", "wuinewfe"]} | ${en["password-format"]}
    ${{ hello: "world" }}    | ${en["password-format"]}
  `(
    'returns - "$message" when password is wrongly formatted to "$password" ',
    async ({ password, message }) => {
      await addCustomer();
      const response = await customerLogin({ ...credentials, password });

      expect(response.body.validationErrors.password).toBe(message);
    },
  );

  it("returns - HTTP 400 when we try to pass an empty email", async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, email: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en["email-required"]} when we try to pass an empty email`, async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, email: "" });

    expect(response.body.validationErrors.email).toBe(en["email-required"]);
  });

  it("returns - HTTP 400 when we try to pass a number formatted", async () => {
    await addCustomer();
    const response = await customerLogin({ ...credentials, email: "" });

    expect(response.status).toBe(400);
  });

  it.each`
    email                    | message
    ${12345}                 | ${en["email-format"]}
    ${[123, 12]}             | ${en["email-format"]}
    ${["fewun", "wuinewfe"]} | ${en["email-format"]}
    ${{ hello: "world" }}    | ${en["email-format"]}
    ${"hello world"}         | ${en["email-format"]}
  `(
    'returns - "$message" when email is wrongly formatted to "$email" ',
    async ({ email, message }) => {
      await addCustomer();
      const response = await customerLogin({ ...credentials, email });

      expect(response.body.validationErrors.email).toBe(message);
    },
  );

  it("return - HTTP 401 when we login with invalid password", async () => {
    await addCustomer();
    const response = await customerLogin({
      email: "admin1@mail.com",
      password: "12343",
    });

    expect(response.status).toBe(401);
  });

  it(`return - ${en["login-failure"]} when we login with invalid password`, async () => {
    await addCustomer();
    const response = await customerLogin({
      email: "admin1@mail.com",
      password: "12343",
    });

    expect(response.body.message).toBe(en["login-failure"]);
  });

  it("returns - proper error body when authentication fails", async () => {
    await addCustomer();
    const nowInMillis = new Date().getTime();
    const response = await customerLogin({
      ...credentials,
      email: "admin@mail.com",
    });
    const error = response.body;
    expect(error.path).toBe("/api/1.0/customer/login");
    expect(error.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(error)).toEqual(["path", "timestamp", "message"]);
  });

  it("return - HTTP 200 OK when the login is successful ", async () => {
    await addCustomer();
    const response = await customerLogin();

    expect(response.status).toBe(200);
  });

  it("returns - customer data when the login is successful", async () => {
    await addCustomer();
    const response = await customerLogin();

    expect(response.body.customer.name).toBe(mockData.customers[0].name);
  });

  it("check - ensure no password, createdAt and updatedAt is returned on successful login", async () => {
    await addCustomer();
    const response = await customerLogin();

    expect(response.body.customer.password).toBeFalsy();
    expect(response.body.customer.createdAt).toBeFalsy();
    expect(response.body.customer.updatedAt).toBeFalsy();
  });
});
