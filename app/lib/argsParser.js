module.exports = function () {
  const argv = process.argv.slice(2);
  const args = {};

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg.includes("-")) {
      const next = argv[index + 1];
      const argKey = arg.replaceAll("-", "");

      if (arg.includes("=")) {
        const [key, value] = argKey.split("=");
        args[key] = value;
        continue;
      }

      if (next && !next.includes("-")) {
        args[argKey] = next;
        continue;
      }

      if (next && (!next.includes("-") || !arg.includes("="))) {
        args[argKey] = true;
      }
    }
  }

  return args;
};
