const express = require("express");
const postModel = require("../models/post.model");

const moment = require("moment");
const auth = require("../middlewares/auth.mdw");
const { updateViewsPostByPostID } = require("../models/post.model");
const tagModel = require("../models/tag.model");
const commentsModel = require("../models/comments.model");
const router = express.Router();

router.get("/byCat/:id", async function (req, res) {
  const CatID = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === CatID) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }

  // const list = await postModel.findByCatIDLv1(CatID);
  // res.render('vwposts/byCat', {
  //   posts: list,
  //   empty: list.length === 0
  // });
  ls = res.locals.lcCategories;

  title = ls[CatID - 1].CatNameLv1;

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countByCatIDLv1(CatID);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page,
    });
  }

  const offset = (page - 1) * limit;
  const list = await postModel.findByCatIDLv1(CatID, offset);

  res.render("vwposts/byCat", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/byCat/:idLv1/:idLv2", async function (req, res) {
  const catIdLv1 = +req.params.idLv1 || 0;
  const catIdLv2 = +req.params.idLv2 || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === catIdLv1) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }
  ls = res.locals.lcCategories;
  title =
    ls[catIdLv1 - 1].CatNameLv1 +
    " | " +
    ls[catIdLv1 - 1].CatName[catIdLv2 - 1].CatNameLv2;

  // const list = await postModel.findByCatIDLv1(CatID);
  // res.render('vwposts/byCat', {
  //   posts: list,
  //   empty: list.length === 0
  // });

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countByCatIDLv2(catIdLv1, catIdLv2);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page,
    });
  }

  const offset = (page - 1) * limit;
  const list = await postModel.findByCatIDLv2(catIdLv1, catIdLv2, offset);
  res.render("vwposts/byCat", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});
router.post("/details/:id",auth,async function(req,res){
  const user = res.locals.authUser;
  const CatID = +req.params.id || 0;
  cmtID = await postModel.getCmtID();
  newCmt = {
    CmtID: +cmtID+1,
    PostsID: CatID,
    UserID: user.id,
    Date: moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY").format("YYYY-MM-DD"),
    Content: req.body.message
  }

  await postModel.addNewCmt(newCmt);
  const url = req.headers.referer || "/";
  res.redirect(url);
});
router.get("/details/:id", async function (req, res) {
  const CatID = +req.params.id || 0;


  const post = await postModel.findById(CatID);
  if (post === null) {
    return res.redirect("/");
  }
  
  if(post.Premium){
    if(!res.locals.auth){
      req.session.retUrl = req.originalUrl;
      res.redirect('/account/login');
    }
    if(!res.locals.premium){
      //alert("Ban phai dang ky tai khoan premium");
      req.session.retUrl = req.originalUrl;
      res.redirect('/account/resPremium');
      
    }
  }
  await postModel.updateViewsPostByPostID(CatID)
  const cmts = await postModel.getCmtsByPostID(CatID);
  formatDate(cmts)
  const postsSameCat =await postModel.findByCatIDLv1(post.CatIDLv1,0);
  postsSameCat.pop();
  const tags = await tagModel.getTagByPostID(post.PostID);
  const totalCmts = await commentsModel.countCmtsByPostID(post.PostID);
  const Author = await postModel.getAuthorByPostID(post.PostID);
  console.log(Author)
  
  res.render("vwposts/details", {
    post: post,
    comments: cmts,
    postsSameCat:postsSameCat,
    tags:tags,
    totalCmts:totalCmts,
    author:Author,
  });
});

router.get("/tags/:id", async function (req, res) {
  const TagID = +req.params.id || 0;
  const Tag = await tagModel.findByTagID(TagID);
  const title = "Tag: " + Tag.TagName;

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countByTagID(TagID);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page,
    });
  }

  const offset = (page - 1) * limit;
  const list = await postModel.findByTagID(TagID, offset);

  res.render("vwposts/byCat", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/search", async function (req, res) {
  const CatID = req.query.q || "";

  title = "K???t qu??? t??m ki???m: " + CatID;

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countSearchByText(CatID);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page,
    });
  }

  const offset = (page - 1) * limit;
  const list = await postModel.searchByText(CatID, offset);
  res.render("vwposts/byCat", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

module.exports = router;
formatDate = function(list){
  for(i=0;i<list.length;i++)
    list[i].Date=moment(list[i].Date).format("LL")
  return list;
}