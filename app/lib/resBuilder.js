const { STATUS_CODES, PROTOCOL_VERSION, CRLF } = require("./constants/index");

module.exports = function () {
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
    send: function () {
      const { startLine, headers, body } = res;
      const combinedHeaders = Object.entries(headers || {}).reduce(
        (acc, cur) => {
          const [name, value] = cur;
          return (acc += `${name}: ${value}${CRLF}`);
        },
        ""
      );

      return (
        startLine +
        CRLF +
        (combinedHeaders.length ? combinedHeaders : "") +
        CRLF +
        (body ? body + CRLF : "")
      );
    },
  };
};
