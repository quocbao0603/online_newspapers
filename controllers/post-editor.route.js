const express = require("express");
const editorModel = require("../models/editor.model")
const postModel = require("../models/post.model");

const moment = require("moment");
const authEditor = require("../middlewares/auth-editor.mdw");
const e = require("express");
const router = express.Router();

router.get("/myposts",authEditor , async function (req, res) {
  const userID = req.user.id || 0;
  console.log(userID);
  title = "Bài viết quản lý";

//   const limit = 6;
//   const page = req.query.page || 1;
//   if (page < 1) page = 1;

//   const total = await postModel.countByAuthor(userID);
//   let nPages = Math.floor(total / limit);
//   if (total % limit > 0) nPages++;

//   const page_numbers = [];
//   for (i = 1; i <= nPages; i++) {
//     page_numbers.push({
//       value: i,
//       isCurrent: i === +page,
//     });
//   }

// const offset = (page - 1) * limit;
// const list = await postModel.findByAuthor(userID, offset);
CatManage = await editorModel.getCatsManage(userID);
list=[]
for(i=0;i<CatManage.length;i++){
    const posts = await editorModel.getPostsManage(CatManage[i].CatIDLv1,CatManage[i].CatIDLv2);
    for(j=0;j<posts.length;j++){
        list.push(posts[j])
    }
}
console.log(list.length)
page_numbers=0;
  res.render("vwposts/managePosts", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/reviewPost/:id",async function(req,res){
    const postID = +req.params.id || 0;
    const post = await postModel.findById(postID);
    CatNameLv1 = res.locals.lcCategories[post.CatIDLv1].CatNameLv1;
    CatNameLv2 = res.locals.lcCategories[post.CatIDLv1].CatName[post.CatIDLv2].CatNameLv2;
    //post.push({CatNameLv1: CatNameLv1,CatNameLv2: CatNameLv2})
    //console.log(post);
    res.render("vwposts/reviewPost",{
        post:post,
        CatNameLv1: CatNameLv1,
        CatNameLv2: CatNameLv2,
    })
});

router.post("/reviewPost/:id",async function(req,res){
  const postID = +req.params.id || 0;
  const postStatus = req.body.postStatus;
  const cmt = req.body.txtComments;
  await editorModel.updatePostAfterCheck(postID,cmt,postStatus);
  res.redirect("/editor/myposts")

});

router.get("/posts/add",authEditor, async function (req, res) {
  res.render("vwposts/addPost", {
  });
});

module.exports = router;