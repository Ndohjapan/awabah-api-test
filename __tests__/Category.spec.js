const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const {
  adminLogin,
  addAdmin,
  addCategory,
} = require("./resources/frequent-functions");
const mockData = require("./resources/mock-data");
const { Category } = require("../src/database/model");
const categoryName = { name: "Toys" };

let token;

const createCategory = async (category = categoryName) => {
  let agent = request(app).post("/api/1.0/category");

  if (token) {
    agent.set("x-access-token", `${token}`);
  }

  return await agent.send(category);
};

describe("Create a Category", () => {
  it("return - HTTP 401 when we try to create a category without login", async () => {
    const response = await createCategory();

    expect(response.status).toBe(401);
  });

  it(`return - ${en["authentication-failure"]} when we try to create category without login`, async () => {
    const response = await createCategory();

    expect(response.body.message).toBe(en["authentication-failure"]);
  });

  it(`return - HTTP 429 and "${en["rate-limit-exceeded"]}"  when category is created successfully`, async () => {
    await addAdmin();
    token = await adminLogin();

    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    await createCategory();
    const response = await createCategory();

    expect(response.status).toBe(429);
    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it.each`
    name                     | message
    ${null}                  | ${en["name-required"]}
    ${""}                    | ${en["name-required"]}
    ${123456767}             | ${en["name-format"]}
    ${[123, 12]}             | ${en["name-format"]}
    ${["fewun", "wuinewfe"]} | ${en["name-format"]}
    ${{ hello: "world" }}    | ${en["name-format"]}
  `(
    "returns - HTTP 400 and '$message' when name is wrongly formatted to '$name'",
    async ({ name, message }) => {
      await addAdmin();
      token = await adminLogin();

      const response = await createCategory({ name });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(en["validation-failure"]);
      expect(response.body.validationErrors.name).toBe(message);
    },
  );

  it("return - 200 ok when category is created successfully", async () => {
    await addAdmin();
    token = await adminLogin();

    const response = await createCategory();

    expect(response.status).toBe(200);
  });

  it("return - category data when category is created successfully", async () => {
    await addAdmin();
    token = await adminLogin();

    const response = await createCategory();

    expect(response.body.name).toBe(categoryName.name);
  });
});

describe("Get by id", () => {
  const getCategory = async (id) => {
    let agent = request(app)
      .get(`/api/1.0/category/${id}`)
      .set("Content-Type", "application/json");

    return await agent.send();
  };

  it("returns - HTTP 429 when we try to get categories", async () => {
    const categories = await addCategory();

    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    const response = await getCategory(categories[0].id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en["rate-limit-exceeded"]} when we try to get categories`, async () => {
    const categories = await addCategory();

    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    await getCategory(categories[0].id);
    const response = await getCategory(categories[0].id);

    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it("returns - HTTP 200 ok when we get category", async () => {
    const categories = await addCategory();

    const response = await getCategory(categories[0].id);

    expect(response.status).toBe(200);
  });

  it("returns - category  data when we get categoryt", async () => {
    const categories = await addCategory();

    const response = await getCategory(categories[0].id);

    expect(response.body.name).toBe(mockData.category[0].name);
  });

  it("returns - HTTP 400  when we get category with wrongly formatted id", async () => {
    const categories = await addCategory();

    const response = await getCategory("eiwnowin");

    expect(response.status).toBe(400);
  });

  it(`returns - ${en["db-id-format"]} when we get category wrongly formatted uid`, async () => {
    await addCategory();

    const response = await getCategory("eiwnowin");

    expect(response.body.message).toBe(en["validation-failure"]);
    expect(response.body.validationErrors.id).toBe(en["db-id-format"]);
  });
});

describe("Delete Category", () => {
  const deleteCategory = async (id) => {
    let agent = request(app)
      .delete(`/api/1.0/category/${id}`)
      .set("Content-Type", "application/json");

    if (token) {
      agent.set("x-access-token", token);
    }

    return await agent.send();
  };

  it("returns - HTTP 429 when we try to delete category without login", async () => {
    const categories = await addCategory();
    token = await adminLogin();

    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    const response = await deleteCategory(categories[0].id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en["rate-limit-exceeded"]} when we try to delete category without login`, async () => {
    const categories = await addCategory();
    token = await adminLogin();

    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    await deleteCategory(categories[0].id);
    const response = await deleteCategory(categories[0].id);

    expect(response.body.message).toBe(en["rate-limit-exceeded"]);
  });

  it("returns - HTTP 401 when we try to delete category without login", async () => {
    const categories = await addCategory();

    const response = await deleteCategory(categories[0].id);

    expect(response.status).toBe(401);
  });

  it(`returns - ${en["authentication-failure"]} when we try to delete category without login`, async () => {
    const categories = await addCategory();

    const response = await deleteCategory(categories[0].id);

    expect(response.body.message).toBe(en["authentication-failure"]);
  });

  it("returns - HTTP 204 ok when we delete categories with authenticated request", async () => {
    await addAdmin();
    const categories = await addCategory();
    token =  await adminLogin();

    const response = await deleteCategory(categories[0].id);


    expect(response.status).toBe(204);
  });

  it("check - set active to false since the document is deleted", async () => {
    await addAdmin();
    const categories = await addCategory();
    token =  await adminLogin();

    await deleteCategory(categories[0].id);

    const result = await Category.findById(categories[0].id);

    expect(result.active).toBe(false);
  });

});
