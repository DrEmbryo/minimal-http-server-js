const { METHODS } = require("./constants/index");
const buildResponse = require("./resBuilder");

module.exports = function (basePath) {
  const registeredRoutes = [];

  return {
    route: function (method, path, handler, options) {
      registeredRoutes.push({
        method,
        path,
        handler,
        options,
      });
      return this;
    },
    get: function (path, handler, options) {
      this.route(METHODS.GET, path, handler, options);
      return this;
    },
    post: function (path, handler, options) {
      this.route(METHODS.POST, path, handler, options);
      return this;
    },
    handleRout: function (req, res) {
      const newRes = new buildResponse();
      const route = registeredRoutes.find(
        (route) =>
          route.path === req.path.current && route.method === req.method
      );
      if (route) {
        route?.options?.middleware?.map((middleware) =>
          middleware(req, res || newRes)
        );
        return route.handler(req, res || newRes);
      } else {
        const wildcardRoute = registeredRoutes.find(
          (route) => route.options.wildcard && route.method === req.method
        );
        if (!wildcardRoute) {
          throw {
            name: "RoutingError",
            message: `Router ${basePath}: request {${req.path.full}} caught without handling`,
            code: 404,
          };
        } else {
          wildcardRoute?.options?.middleware?.map((middleware) =>
            middleware(req, res || newRes)
          );
          return wildcardRoute.handler(req, res || newRes);
        }
      }
    },
    basePath,
  };
};
