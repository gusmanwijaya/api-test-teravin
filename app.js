const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// START: Import library
const cors = require("cors");
// END: Import library

// START: Import Routes
const employeesRouter = require("./app/api/v1/routers/employees");
// END: Import Routes

// START: Import middlewares
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handle-error");
// END: Import middlewares

const app = express();

// START: Menggunakan library
app.use(cors());
// END: Menggunakan library

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const API_VERSION = "api/v1";

// START: Create routes
app.use(`/${API_VERSION}/employees`, employeesRouter);
// END: Create routes

// START: Use middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);
// END: Use middlewares

module.exports = app;
