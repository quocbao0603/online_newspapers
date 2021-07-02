const express = require("express");
const postModel = require("../models/post.model");

const moment = require("moment");
const authWriter = require("../middlewares/auth-writer.mdw");
const router = express.Router();

router.get("/myposts", authWriter, async function (req, res) {
  const userID = req.user.id || 0;
  console.log(userID);
  title = "Bài viết của bạn";

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await postModel.countByAuthor(userID);
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
  res.render("vwposts/addPost", {
  });
});

module.exports = router;