const express = require("express");
const postModel = require("../models/post.model");

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
  console.log(catIdLv1, catIdLv2);

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

router.get("/details/:id", async function (req, res) {
  const CatID = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === CatID) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }

  const post = await postModel.findById(CatID);
  if (post === null) {
    return res.redirect("/");
  }

  res.render("vwposts/details", {
    post: post,
  });
});

module.exports = router;