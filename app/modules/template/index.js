const Router = require("../../lib/router");
const requestLogMiddleware = require("../../middlewares/requestLogs");

const templateRouter = new Router("/template").get(
  "/ejs",
  (req, res) =>
    res.status(200).render("index.ejs", {
      title: "ejs render",
      body: "this page rendered with ejs template engine",
    }),
  { wildcard: false, middleware: [requestLogMiddleware] }
);

module.exports = templateRouter;
