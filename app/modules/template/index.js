const Router = require("../../lib/router");

const templateRouter = new Router("/template").get("/ejs", (req, res) =>
  res.status(200).render("ejs.ejs", {
    title: "ejs render",
    body: "this page rendered with ejs template engine",
  })
);
// .get("/pug", (req, res) =>
//   res.status(200).render("pug.pug", {
//     title: "pug render",
//     body: "this page rendered with pug template engine",
//   })
// );

module.exports = templateRouter;
