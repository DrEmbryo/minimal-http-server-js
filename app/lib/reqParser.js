function parseSections(chunk) {
  const separator = ["\r", "\n"];
  const tokens = [];
  let section = [];
  let tmp = "";
  while (chunk.length) {
    const current = chunk.shift();
    if (separator.includes(current)) {
      let breakLine = 1;
      while (separator.includes(chunk[0])) {
        breakLine++;
        chunk.shift();
      }
      if (breakLine === 2) {
        section.push(tmp);
        tmp = "";
      } else if (breakLine === 4) {
        tokens.push(section);
        section = [];
      }
    } else {
      tmp += current;
    }
  }
  return { head: tokens[0], body: tokens[1] };
}

function parsePath(fullPath) {
  const [basePath, ...restPath] = fullPath.split(/(?=[//])/g);

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

  return {
    base: basePath,
    full: fullPath,
    current: restPath.join(""),
    query: parsedQuery,
    hash,
  };
}

function parsedHeaders(headers) {
  return headers.reduce((acc, cur) => {
    const separator = cur.indexOf(":");
    return {
      ...acc,
      [cur.substring(0, separator)]: cur.substring(separator + 1).trim(),
    };
  }, {});
}

module.exports = function (req) {
  const request = req.toString().split("");
  const { head, body } = parseSections(request);
  const [startLine, ...headers] = head;
  const [method, fullPath, protocol] = startLine.split(" ");

  return {
    method,
    protocol,
    path: parsePath(fullPath),
    headers: parsedHeaders(headers),
    body,
  };
};
