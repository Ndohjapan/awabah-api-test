const request = require("supertest");
const { Admin, Category } = require("../../src/database/model");
const mockData = require("./mock-data");
const { app } = require("../../src/app");
const userCredentials = { email: "user1@mail.com", password: "P4ssword@" };
const adminCredentials = { email: "admin1@mail.com", password: "P4ssword@" };

let token;

const adminLogin = async (admin = adminCredentials) => {
  let agent = await request(app).post("/api/1.0/login").send(admin);

  token = agent.body.token;
  return token;
};

const addAdmin = async (admin = mockData.admin1) => {
  let data = await Admin.create(admin);
  return data;
};

const addCategory = async (categories = mockData.category) => {
  let result = await Category.create(categories);

  return result;
};

module.exports = { adminLogin, addAdmin, addCategory };
