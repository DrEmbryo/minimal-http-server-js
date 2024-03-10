const App = require("./lib/server")();

const baseRouter = require("./modules/base");
const userAgentRouter = require("./modules/userAgent");
const echoRouter = require("./modules/echo");
const fileRouter = require("./modules/files");

const PORT = 4221;

App.registerRouter(baseRouter)
  .registerRouter(userAgentRouter)
  .registerRouter(echoRouter)
  .registerRouter(fileRouter);

App.server.listen(PORT, "localhost", () =>
  console.log(`listening on port: ${PORT}`)
);
