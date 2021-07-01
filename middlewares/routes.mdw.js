const moment = require("moment");
const { showCatNameLv1 } = require("../models/menu.model");
const menuModel = require("../models/menu.model");
module.exports = function (app) {
  app.get("/", async function (req, res) {
    const topNews = await menuModel.topNews();
    const news = await menuModel.news();
    const newsWorld = await menuModel.worldNews();
    top4News=[]
    formatDate(topNews);formatDate(news);formatDate(newsWorld);
    for(i=0;i<4;i++){
      top4News.push(topNews[i])
    }
    
    
    res.render("home",{
      topNewsRight: top4News,
      topNewsLeft: topNews[4],
      news: news,
      newsWorld: newsWorld
    });
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.get("/bs4", function (req, res) {
    res.sendFile(__dirname + "/bs4.html");
  });

  app.use("/account/", require("../controllers/account.route"));

  app.use("/admin/categories/", require("../controllers/category.route"));
  app.use("/products/", require("../controllers/product-user.route"));
  app.use("/posts/", require("../controllers/post-user.route"));
  app.use("/demo/", require("../controllers/demo.route"));
};

formatDate = function(list){
  for(i=0;i<list.length;i++)
    list[i].Date=moment(list[i].Date).format("ll")
  return list;
}
 
