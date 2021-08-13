const express = require("express");
const postModel = require("../models/post.model");
const tagModel =require("../models/tag.model");
const tagPostModel =require("../models/tag_post.model");
const moment = require("moment");
const authWriter = require("../middlewares/auth-writer.mdw");
const multer = require('multer');
const fs = require('fs');
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
  console.log("add posts");
  const storage = multer.diskStorage({
    async destination(req, file, cb) {
      
      console.log(req.body);
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
      await tagPostModel.add(req.body.TagID, PostID[0])

      console.log(PostID[0]);
      var dir = './public/imgs/posts/'+PostID[0];

      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, dir)
    },
    filename(req, file, cb) {
      cb(null, 'main_thumbs.' + (file.originalname).split('.').pop());
    }
  });
  const upload = multer({
    storage
  });

  upload.array('cover', 12)(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/writer/myposts');
    }
  })
});

router.get("/posts/edit", authWriter, async function(req, res) {
  /*  const id = res.body.id;
   console.log("id");
   console.log("id"); */
  console.log(req.query.id);
  const id = req.query.id;
  const this_post = await postModel.findById(id);
  if (this_post === null) {
      return res.redirect("/posts");
  }
  const allTag = await tagModel.all();
  console.log(this_post);

  // res.locals.curEditPost = this_post;
  res.render("vwposts/editPost", {
      tags: allTag,
      post: this_post
  });
});

router.post("/posts/edit", authWriter, async function(req, res) {
  const update_post = {
      PostID: req.body.txtID,
      CatIDLv1: req.body.CatIDLv1,
      CatIDLv2: req.body.CatIDLv2,
      //Author: req.body.Author,
      PostName: req.body.txtPostName,
      Date: new Date(),
      TinyContent: req.body.txtTinyContent,
      FullContent: req.body.txtContent,
      //Status: req.body.Status,
      //Premium: req.body.Premium,
      //Views: req.body.Views,
  }
  console.log(update_post);
  await postModel.patch(update_post);
  console.log(req.body.TagID);
  console.log(req.body.txtID);
  await tagPostModel.patch(req.body.TagID, req.body.txtID)
  res.redirect('/writer/myposts');
});

router.get("/posts/del", authWriter, async function(req, res) {
  console.log(req.query.id);
  const id = req.query.id;
  await tagPostModel.del(id);
  await postModel.del(id);
  res.redirect('/writer/myposts')
});

module.exports = router;