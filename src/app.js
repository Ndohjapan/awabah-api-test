const express = require("express");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const { interceptorParam } = require("./middleware/logger");
const errorHandler = require("./error/error-handler");
const en = require("../locale/en");
const NotFundException = require("./error/not-found-exception");
const {auth, category} = require("./routes");
const { securityResponseHeader } = require("./middleware/res-secure-header");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(securityResponseHeader);

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "test") {
  app.use(interceptorParam);
}

auth(app);
category(app);

app.use((req, res, next) => {
  next(new NotFundException(en["page-not-found"]));
});

app.use(errorHandler);

module.exports = { app };
