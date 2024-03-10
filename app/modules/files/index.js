const fs = require("node:fs");
const path = require("path");

const Router = require("../../lib/router");

const requestLogMiddleware = require("../../middlewares/requestLogs");

const fileRouter = new Router("/files")
  .get(
    "*",
    (req, res) => {
      const fileDir = process.argv[3];
      const fileName = req.path.current.replace("/", "");
      const filePath = path.join(fileDir, fileName);
      const isFileExists = fs.existsSync(filePath);

      if (isFileExists) {
        const fileContent = fs.readFileSync(filePath);
        return res
          .status(200)
          .headers({
            "Content-Type": "application/octet-stream",
            "Content-Length": fileContent.length,
          })
          .body(fileContent)
          .send();
      } else return res.status(404).send();
    },
    { wildcard: true }
  )
  .post(
    "*",
    (req, res) => {
      const fileDir = process.argv[3];
      const fileName = req.path.current.replace("/", "");
      const filePath = path.join(fileDir, fileName);
      const isDirectoryExists = fs.existsSync(fileDir);

      if (!isDirectoryExists) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      fs.writeFileSync(filePath, req.body);
      return res.status(201).send();
    },
    { wildcard: true, middleware: [requestLogMiddleware] }
  );

module.exports = fileRouter;
