/* eslint-disable no-undef */
require("dotenv").config();
module.exports = {
  database: {
    URL: `mongodb://127.0.0.1:27017/test_${new Date().getTime()}`,
  },
  
  jwt: {
    secret: "wofenwonewoinewoioewnoewiew"
  },

  redis: {
    URL: "127.0.0.1:6379",
  },

};
