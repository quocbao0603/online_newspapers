const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

const moment = require("moment");
module.exports = function (app) {
  app.use( function (req, res, next) {
    res.locals.premium=0;
    if (typeof req.user === "undefined") {
      res.locals.auth = false;
      res.locals.authUser = null;
      
    } else {
      res.locals.auth = true;
      res.locals.authUser = req.user;
      user = req.user;
      id = user.id;
      res.locals.premium = user.premium;
      setTimeout(async function(){
        console.log("Tai khoan het han premium");
        await userModel.updatePremium(id,0);
        res.locals.premium = 0;
      },+user.premium,id)
    }
    next();
  });
  app.use(async function(req,res,next){
    const posts = await postModel.getPostsWaitUp();
    const now =  moment().format("YYYY-MM-DD h:m:s");
    for(i=0;i<posts.length;i++){
      const timeUp = moment(posts[i].Date, "YYYY-MM-DDTh:m").format("YYYY-MM-DD h:m:s");
      if(now>timeUp){
        await postModel.updatePostStatusByPostID(posts[i].PostID,1)
      }
    }
    next();
  });


  app.use(async function (req, res, next) {
    const raw_data = await categoryModel.allWithDetails();
    const category = await categoryModel.categoryLv1();
    const list = raw_data[0];
    const LengthCatLv1 = category.length;
    const AllCat = list.length;
    const ls = [];

    //console.log(list);
    index = 1;
    for (i = 0; i < LengthCatLv1; i++) {
      const Cat = [];
      for (j = 0; j < AllCat; j++) {
        if (list[j].CatIDLv1 === category[i].CatIDLv1) {
          index = j;
          Cat.push({
            CatIDLv1: list[j].CatIDLv1,
            CatIDLv2: list[j].CatIDLv2,
            CatNameLv2: list[j].CatNameLv2,
          });
        }
      }
      ls.push({
        CatIDLv1: category[i].CatIDLv1,
        CatNameLv1: list[index].CatNameLv1,
        CatName: Cat,
      });
    }
    // list[1].IsActive = true;
    res.locals.lcCategories = ls;

    next();
  });
};
