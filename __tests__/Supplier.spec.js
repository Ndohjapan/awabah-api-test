const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const { adminLogin, addAdmin } = require("./resources/frequent-functions");
const mockData = require("./resources/mock-data");
const { Supplier } = require("../src/database/model");
const suppliers = mockData.suppliers;

let token;

const createSupplier = async (supplier = suppliers[0]) => {
  let agent = request(app).post("/api/1.0/supplier");

  if (token) {
    agent.set("x-access-token", `${token}`);
  }

  return await agent.send(supplier);
};