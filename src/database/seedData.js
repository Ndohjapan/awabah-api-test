module.exports = {
  admins: [
    {
      name: "Ndoh Joel",
      email: "admin1@mail.com",
      type: "main-admin",
      permissions: ["all"],
      password: "$2a$12$s9UsA8dSLGFD0rsSSpzq8.vZt.1QdZYxXWxtnjPWadxZqQ39ErmKS",
    },
    {
      username: "John Doe",
      email: "admin2@mail.com",
      type: "sub-admin",
      permissions: ["create product"],
      password: "$2a$12$s9UsA8dSLGFD0rsSSpzq8.vZt.1QdZYxXWxtnjPWadxZqQ39ErmKS",
    },
  ],
  categories: [
    {name: "Toys"},
    {name: "Electronics"},
    {name: "Mobile Accesories"},
    {name: "Apparels"}
  ]
};
