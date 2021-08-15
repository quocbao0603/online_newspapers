const moment = require("moment");
const { showCatNameLv1, sciencesNews } = require("../models/menu.model");
const menuModel = require("../models/menu.model");
const tagModel = require("../models/tag.model");
module.exports = function(app) {
    app.get("/", async function(req, res) {
        const topNews = await menuModel.topNews();
        const news = await menuModel.news();
        const worldNews = await menuModel.worldNews();
        const perspectivesNews = await menuModel.perspectivesNews();
        const businessNews = await menuModel.businessNews();
        const sportsNews = await menuModel.sportsNews();
        const sciencesNews = await menuModel.sciencesNews();
        const topViewsNews = await menuModel.topNewNews();
        const topPopularNews = await menuModel.topPopularNews();
        const tags = await tagModel.all();
        top4News = []
        formatDate(topNews);
        formatDate(news);
        formatDate(worldNews);
        formatDate(sportsNews);
        formatDate(sciencesNews);
        formatDate(businessNews);
        formatDate(perspectivesNews);
        formatDate(topPopularNews); //formatDate(topViewsNews);
        const topViewsNewsMain = topViewsNews.pop();
        const topPopularNewsMain = topPopularNews.pop();
        console.log(topViewsNews);
        for (i = 0; i < 4; i++) {
            top4News.push(topNews[i])
        }
        res.render("home", {
            topNewsRight: top4News,
            topNewsLeft: topNews[4],
            news: news,
            worldNews: worldNews,
            perspectivesNews: perspectivesNews,
            businessNews: businessNews,
            sciencesNews: sciencesNews,
            sportsNews: sportsNews,
            topViewsNews: topViewsNews,
            topPopularNews: topPopularNews,
            topPopularNewsMain: topPopularNewsMain,
            topViewsNewsMain: topViewsNewsMain,
            tags: tags,
        });
    });

    app.get("/about", function(req, res) {
        res.render("about");
    });

    app.get("/bs4", function(req, res) {
        res.sendFile(__dirname + "/bs4.html");
    });

    app.use("/account/", require("../controllers/account.route"));

  app.use("/admin/categories/", require("../controllers/category.route"));
  app.use("/products/", require("../controllers/product-user.route"));
  app.use("/posts/", require("../controllers/post-user.route"));
  app.use("/writer/", require("../controllers/post-writer.route"));
  app.use("/demo/", require("../controllers/demo.route"));
  app.use("/editor/",require("../controllers/post-editor.route"));
  app.use("/administrator/", require("../controllers/post-administrator.route"));
  app.use("/admin/", require("../controllers/post-admin.route"));
};

formatDate = function(list) {
    for (i = 0; i < list.length; i++)
        list[i].Date = moment(list[i].Date).format("ll")
    return list;
}