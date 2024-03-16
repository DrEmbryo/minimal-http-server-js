const path = require("path");
let ejs = require("ejs");

const App = require("./lib/server")();

const baseRouter = require("./modules/base");
const userAgentRouter = require("./modules/userAgent");
const echoRouter = require("./modules/echo");
const fileRouter = require("./modules/files");
const templateRouter = require("./modules/template");

const PORT = 4221;

App.registerTemplateEngine(ejs, {
  templateDir: path.join(__dirname, "views"),
  renderFn: "render",
})
  .registerRouter(baseRouter)
  .registerRouter(userAgentRouter)
  .registerRouter(echoRouter)
  .registerRouter(fileRouter)
  .registerRouter(templateRouter)
  .server.listen(PORT, "localhost", () =>
    console.log(`listening on port: ${PORT}`)
  );
