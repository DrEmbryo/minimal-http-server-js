const net = require("net");
const parseRequest = require("./reqParser");
const buildResponse = require("./resBuilder");

module.exports = function () {
  const registeredRouters = new Map();

  function registerRouter(router) {
    if (registeredRouters.has(router.basePath)) {
      throw new Error(
        `Router with base path of ${router.basePath} already exists`
      );
    } else {
      registeredRouters.set(router.basePath, router);
    }
    return this;
  }

  const server = net.createServer((socket) => {
    socket.on("close", () => {
      socket.end();
    });

    socket.on("data", (data) => {
      try {
        const req = parseRequest(data);
        const res = buildResponse();

        if (registeredRouters.has(req.path.base)) {
          socket.write(
            registeredRouters.get(req.path.base).handleRout(req, res)
          );
        } else
          throw {
            name: "RoutingError",
            message: `Unhandled {${req.path.base}} does not match any registered routers`,
            code: 404,
          };
      } catch (err) {
        console.error(
          `${err.name}: ${err.message}, respond with ${err.code} code`
        );
        socket.write(
          buildResponse()
            .status(err.code || 500)
            .send()
        );
      }
      socket.end();
    });
  });

  return { server, registerRouter };
};
