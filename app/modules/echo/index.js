const Router = require("../../lib/router");

const echoRouter = new Router("/echo").get(
  "*",
  (req, res) => {
    const content = req.path.current.replace("/", "");
    return res
      .status(200)
      .headers({
        "Content-Type": "text/plain",
        "Content-Length": content.length,
      })
      .body(content)
      .send();
  },
  { wildcard: true }
);

module.exports = echoRouter;
