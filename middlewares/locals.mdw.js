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
    const category = await categoryModel.category();

    // const list1 = await categoryModel.category();
    const list = raw_data[0];
    const CatLv1 =category.length
    const AllCat = list.length
    const ls=[]

    //console.log(list)
    index=1
    for(i=1;i<=CatLv1;i++){
      const Cat=[]
      for(j=0;j<AllCat;j++){
          if(list[j].ID === i){
              index=j
              Cat.push({ID2: i+list[j].ID2, CatNameLv2: list[j].NameLv2})
          }
      }
      ls.push({ ID: i,CatNameLv1: list[index].NameLv1,CatName:Cat});
    }



   
    // list[1].IsActive = true;
    res.locals.lcCategories = ls;
    //console.log(res.locals.lcCategories)
   
    next();
  })
}
