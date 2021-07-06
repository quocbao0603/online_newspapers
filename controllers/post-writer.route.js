const express = require("express");
const postModel = require("../models/post.model");
const tagModel =require("../models/tag.model");
const tagPostModel =require("../models/tag_post.model");
const moment = require("moment");
const authWriter = require("../middlewares/auth-writer.mdw");
const router = express.Router();

router.get("/myposts", authWriter, async function (req, res) {
  const userID = req.user.id || 0;
  title = "Bài viết của bạn";

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countByAuthor(userID);
  console.log(total);
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
  const list = await postModel.findByAuthor(userID, offset);

  res.render("vwposts/myPosts", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/posts/add",authWriter, async function (req, res) {
  const allTag = await tagModel.all();
  res.render("vwposts/addPost", {
    tags: allTag
  });
});

router.post("/posts/add",authWriter, async function (req, res) {
  const new_post = {
    CatIDLv1: req.body.CatIDLv1,
    CatIDLv2: req.body.CatIDLv2,
    Author: req.user.id,
    PostName: req.body.txtPostName,
    Date: new Date(),
    TinyContent: req.body.txtTinyContent,
    FullContent: req.body.txtContent,
    Status: 3,
    Premium: 0,
    Views: 0,
  }
  const PostID = await postModel.add(new_post);
  await tagPostModel.add(req.body.TagID, PostID)
  res.redirect('/writer/myposts');
});

module.exports = router;