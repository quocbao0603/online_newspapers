const express = require("express");
const postModel = require("../models/post.model");
const tagModel = require("../models/tag.model");
const tagPostModel = require("../models/tag_post.model");
const editorModel  = require("../models/editor.model");

const moment = require("moment");
const authAdmin = require("../middlewares/auth-admin.mdw");
const router = express.Router();

router.get("/posts", authAdmin, async function(req, res) {
    const userID = req.user.id || 0;
    title = "Bài viết của bạn";

    const limit = 6;
    const page = req.query.page || 1;
    if (page < 1) page = 1;

    const total = await postModel.countAllPost(userID);
    //console.log("total");
    //console.log(total);
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
    //const list = await postModel.findByAuthor(offset);
    const list = await postModel.allPost(offset);
    //console.log(list);
    res.render("vwposts/posts-admin", {
        posts: list,
        empty: list.length === 0,
        page_numbers,
        title,
    });
});

router.get("/posts/add", authAdmin, async function(req, res) {
    const allTag = await tagModel.all();
    res.render("vwposts/addPost", {
        tags: allTag
    });
});

router.post("/posts/add", authAdmin, async function(req, res) {
    const new_post = {
        CatIDLv1: req.body.CatIDLv1,
        CatIDLv2: req.body.CatIDLv2,
        Author: req.user.id,
        PostName: req.body.txtPostName,
        Date: new Date(),
        TinyContent: req.body.txtTinyContent,
        FullContent: req.body.txtContent,
        Status: 1,
        Premium: 0,
        Views: 0,
    }
    const PostID = await postModel.add(new_post);
    await tagPostModel.add(req.body.TagID, PostID)
    res.redirect('/admin/posts');
});


router.get("/posts/edit", authAdmin, async function(req, res) {
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

router.post("/posts/edit", authAdmin, async function(req, res) {
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

    res.redirect('/admin/posts');
});


/* router.post("/posts/patch", authAdmin, async function(req, res) {
    const update_post = {

    }
    await postModel.patch(update_post);
    console.log()
    res.redirect('/admin/posts');
}); */
router.post("/posts/del", authAdmin, async function(req, res) {
    //bat buoc co await
    //k co se chay song song va sai!!!
    const test_post = await postModel.del(res.body.PostID);
    console.log(test_post);
    res.redirect('/admin/posts');
});



router.get("/reviewPost/:id",authAdmin,async function(req,res){
    const postID = +req.params.id || 0;
    const post = await postModel.findById(postID);
    CatNameLv1 = res.locals.lcCategories[post.CatIDLv1-1].CatNameLv1;
    CatNameLv2 = res.locals.lcCategories[post.CatIDLv1-1].CatName[post.CatIDLv2-1].CatNameLv2;
    const allTag = await tagModel.all();
    postStatus=1;

    //post.push({CatNameLv1: CatNameLv1,CatNameLv2: CatNameLv2})
    //console.log(post);
    res.render("vwposts/adminReviewPost",{
        post:post,
        tags: allTag,
        CatNameLv1: CatNameLv1,
        CatNameLv2: CatNameLv2,
        postStatus:postStatus
    })
});

router.post("/reviewPost/:id",authAdmin,async function(req,res){
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
  
 
  
  res.redirect("/admin/posts")

});

module.exports = router;