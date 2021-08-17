const express = require("express");
const editorModel = require("../models/editor.model")
const postModel = require("../models/post.model");
const tagModel =require("../models/tag.model");
const tagPostModel =require("../models/tag_post.model");
const moment = require("moment");
const authEditor = require("../middlewares/auth-editor.mdw");
const e = require("express");
const router = express.Router();

router.get("/myposts",authEditor , async function (req, res) {
  const userID = req.user.id || 0;
  console.log(userID);
  title = "Bài viết quản lý";
  CatManage = await editorModel.getCatsManage(userID);
   const limit = 6;
   const page = req.query.page || 1;
   if (page < 1) page = 1;

  const total = await editorModel.countPostManage(CatManage[0].CatIDLv1,CatManage[0].CatIDLv2);
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
 const list = await editorModel.getPostsManage(CatManage[0].CatIDLv1,CatManage[0].CatIDLv2, offset);

// list=[]
// for(i=0;i<CatManage.length;i++){
//     const posts = await editorModel.getPostsManage(CatManage[i].CatIDLv1,CatManage[i].CatIDLv2);
//     for(j=0;j<posts.length;j++){
//         list.push(posts[j])
//     }
// }
// console.log(list.length)
// page_numbers=0;
  res.render("vwposts/managePosts", {
    posts: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/reviewPost/:id",authEditor,async function(req,res){
    const postID = +req.params.id || 0;
    const post = await postModel.findById(postID);
    CatNameLv1 = res.locals.lcCategories[post.CatIDLv1-1].CatNameLv1;
    CatNameLv2 = res.locals.lcCategories[post.CatIDLv1-1].CatName[post.CatIDLv2-1].CatNameLv2;
    const allTag = await tagModel.all();

    //post.push({CatNameLv1: CatNameLv1,CatNameLv2: CatNameLv2})
    //console.log(post);
    res.render("vwposts/reviewPost",{
        post:post,
        tags: allTag,
        CatNameLv1: CatNameLv1,
        CatNameLv2: CatNameLv2,
    })
});

router.post("/reviewPost/:id",authEditor,async function(req,res){
  const postID = +req.params.id || 0;
  let postStatus = req.body.postStatus;
  const cmt = req.body.txtComments;
  const postPremium = req.body.postPremium;
  const now =  moment().format();
  //console.log('thoi gian hien tai: '+now);
  DatePost = req.body.datePost;
  //  DatePost = moment(DatePost, "YYYY-MM-DDThh:mm:ss").format("YYYY-MM-DD hh:mm:ss");
  //console.log('thoi gian xuat ban'+DatePost)
  if(postStatus == 1 ){
    if(now<DatePost){
      postStatus=0
    }
    await editorModel.setDatePost(postID,DatePost);
  }
  await editorModel.updatePostAfterCheck(postID,cmt,postStatus,postPremium);
  await editorModel.updateCategories(postID,req.body.CatIDLv1,req.body.CatIDLv2);
  console.log("txtId "+ req.body.txtID," tagID "+req.body.TagID);
  await tagPostModel.patch(req.body.TagID, req.body.txtID)
  
 
  
  res.redirect("/editor/myposts")

});

router.get("/posts/add",authEditor, async function (req, res) {
  res.render("vwposts/addPost", {
  });
});

module.exports = router;