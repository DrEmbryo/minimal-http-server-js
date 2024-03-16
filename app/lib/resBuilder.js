const fs = require("node:fs");
const path = require("path");
const { STATUS_CODES, PROTOCOL_VERSION, CRLF } = require("./constants/index");

function combineHeaders(headers) {
  return Object.entries(headers || {}).reduce((acc, cur) => {
    const [name, value] = cur;
    return (acc += `${name}: ${value}${CRLF}`);
  }, "");
}

function buildResponse(startLine, headers, body) {
  return (
    startLine +
    CRLF +
    (headers.length ? headers : "") +
    CRLF +
    (body ? body + CRLF : "")
  );
}

module.exports = function (templateEngine) {
  const res = {};
  return {
    status: function (statusCode) {
      res.startLine = `${PROTOCOL_VERSION} ${STATUS_CODES[statusCode]}`;
      return this;
    },
    headers: function (headers) {
      res.headers = headers;
      return this;
    },
    body: function (body) {
      res.body = body;
      return this;
    },
    render: function (templatePath, ctx) {
      if (!templateEngine.instance)
        throw {
          name: "ViewEngineError",
          message: `View engine is not registered`,
          code: 500,
        };

      const { startLine, headers } = res;

      const filePath = templateEngine?.options?.templateDir
        ? path.join(templateEngine.options.templateDir, templatePath)
        : templatePath;
      const isFileExists = fs.existsSync(filePath);

      if (isFileExists) {
        const templateFile = fs.readFileSync(filePath).toString();
        let template;
        if (templateEngine.options.renderFn) {
          template = templateEngine.instance[templateEngine.options.renderFn](
            templateFile,
            ctx
          );
        } else {
          template = templateEngine.instance.compile(templateFile, ctx);
        }

        return buildResponse(
          startLine,
          {
            "Content-Type": "text/html",
            "Content-Length": template.length,
            ...combineHeaders(headers),
          },
          template
        );
      }
    },
    send: function () {
      const { startLine, headers, body } = res;
      return buildResponse(startLine, combineHeaders(headers), body);
    },
  };
};
