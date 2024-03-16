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
      const { startLine, headers } = res;
      const template = templateEngine.render(templatePath, ctx);

      return buildResponse(
        startLine,
        {
          "Content-Type": "text/html",
          "Content-Length": template.length,
          ...combineHeaders(headers),
        },
        template
      );
    },
    send: function () {
      const { startLine, headers, body } = res;
      return buildResponse(startLine, combineHeaders(headers), body);
    },
  };
};
