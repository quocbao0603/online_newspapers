const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
app.use(morgan("dev"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static("public"));

require("./middlewares/session.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw.js")(app);

app.listen(process.env.PORT, function () {
  console.log(`News Web App listening at http://localhost:${process.env.PORT}`);
});
