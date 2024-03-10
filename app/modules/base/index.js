const Router = require("../../lib/router");

const baseRouter = new Router("/").get("", (req, res) =>
  res.status(200).send()
);

module.exports = baseRouter;
