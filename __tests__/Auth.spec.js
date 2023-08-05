const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const { Admin } = require("../src/database/model");
const en = require("../locale/en");
const credentials = { email: "admin1@mail.com", password: "P4ssword@" };
const mockData = require("./resources/mock-data");

let token;

const addAdmin = async (admin = mockData.admin1) => {
  const data = await Admin.create(admin);
  return data;
};

const adminSignup = async (
  admin = { ...mockData.admin1, password: "P4ssword@" },
) => {
  let agent = await request(app).post("/api/1.0/signup").send(admin);

  return agent;
};

const adminLogin = async (admin = credentials) => {
  let agent = await request(app).post("/api/1.0/login").send(admin);

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

    expect(response.body.validationErrors.password).toBe(en["password-required"]);
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
    email                | message
    ${12345}                 | ${en["email-format"]}
    ${[123, 12]}             | ${en["email-format"]}
    ${["fewun", "wuinewfe"]} | ${en["email-format"]}
    ${{ hello: "world" }}    | ${en["email-format"]}
    ${"hello world"}    | ${en["email-format"]}
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
    const response = await adminLogin({ email: "admin1@mail.com", password: "12343" });

    expect(response.status).toBe(401);
  });

  it(`return - ${en["login-failure"]} when we login with invalid password`, async () => {
    await addAdmin();
    const response = await adminLogin({ email: "admin1@mail.com", password: "12343" });

    expect(response.body.message).toBe(en["login-failure"]);
  });

  it("returns - proper error body when authentication fails", async () => {
    await addAdmin();
    const nowInMillis = new Date().getTime();
    const response = await adminLogin({ ...credentials, email: "admin@mail.com" });
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
