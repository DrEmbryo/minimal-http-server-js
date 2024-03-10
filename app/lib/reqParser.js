function parsePath(fullPath) {
  let parsedQuery = "";
  let hash = "";
  const [path, queryArgs] = fullPath.split("?");
  if (queryArgs?.length) {
    const [query, queryHash] = queryArgs.split("#");
    if (queryHash?.length) hash = queryHash;
    if (query?.length) {
      parsedQuery = query.split("&").reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        return { ...acc, [key]: value };
      }, {});
    }
  }
  return { path, query: parsedQuery, hash };
}

module.exports = function (reqRaw) {
  const [request, body] = reqRaw.toString().split("\r\n\r\n");
  const [startLine, ...headers] = request.toString().split("\r\n");
  const [method, fullPath, protocol] = startLine.split(" ");
  const { path, query, hash } = parsePath(fullPath);
  const [basePath, ...restPath] = path.split(/(?=[//])/g);

  const parsedHeaders = headers
    .filter((header) => header !== "")
    .reduce((acc, cur) => {
      const separator = cur.indexOf(":");
      return {
        ...acc,
        [cur.substring(0, separator)]: cur.substring(separator + 1).trim(),
      };
    }, {});

  return {
    method,
    protocol,
    path: {
      base: basePath,
      full: fullPath,
      current: restPath.join(""),
      query,
      hash,
    },
    headers: parsedHeaders,
    body,
  };
};
