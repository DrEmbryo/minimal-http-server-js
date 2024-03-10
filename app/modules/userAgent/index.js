const Router = require("../../lib/router");

const userAgentRouter = new Router("/user-agent").get("", (req, res) => {
  return res
    .status(200)
    .headers({
      "Content-Type": "text/plain",
      "Content-Length": req.headers["User-Agent"].length,
    })
    .body(req.headers["User-Agent"])
    .send();
});

module.exports = userAgentRouter;
