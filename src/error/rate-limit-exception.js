const en = require("../../locale/en");

module.exports = function RateLimitException() {
  this.status = 429;
  this.message = en["rate-limit-exceeded"];
};
  