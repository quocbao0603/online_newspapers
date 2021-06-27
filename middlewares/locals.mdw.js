const categoryModel = require('../models/category.model');
module.exports = function (app) {

  app.use(function (req, res, next) {
    if (typeof req.user === "undefined") {
      res.locals.auth = false;
      res.locals.authUser = null;
    }
    else {
      res.locals.auth = true;
      res.locals.authUser = req.user;
    }
    next();
  })

  app.use(async function (req, res, next) {
    const raw_data = await categoryModel.allWithDetails();
    const list = raw_data[0];
    // list[1].IsActive = true;
    res.locals.lcCategories = list;
    next();
  })
}
