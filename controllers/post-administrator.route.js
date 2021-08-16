const express = require("express");
const authAdministratorMdw = require("../middlewares/auth-administrator.mdw");
const authAdministrator = require("../middlewares/auth-administrator.mdw");
const editorModel = require("../models/editor.model");
const tagModel = require("../models/tag.model");
const userModel = require("../models/user.model");
const router = express.Router();


router.get("/",authAdministrator,function(req,res){
    res.render("vwcategories/myManagement", {
    });
});
router.get("/tags",authAdministrator, async function(req,res){
    const tags = await tagModel.all();
    console.log(tags)
    res.render("vwTags/index",{
        tags,
    })
})
router.get("/tags/add",authAdministrator, function (req, res) {
    res.render("vwTags/add");
});
router.post("/tags/add",authAdministrator, async function (req, res) {
    const tagID = await tagModel.getTotalTag();
    console.log(tagID)
    const new_tag = {
      TagID: tagID+1,
      TagName: req.body.txtTagName,
    };
    await tagModel.add(new_tag);
    res.redirect("/administrator/tags");
});

router.get("/tags/edit",authAdministrator, async function (req, res) {
    const id = req.query.id || 0;
    const tag = await tagModel.findByTagID(id);
    console.log(tag);
    if (tag === null) {
      return res.redirect("/administrator/tags/");
    }
    res.render("vwTags/edit", {
      tag,
    });
});
router.post("/tags/patch",authAdministrator, async function (req, res) {
    console.log(req.body)
    await tagModel.patch(req.body);
    res.redirect("/administrator/tags/");
});
  
router.post("/tags/del",authAdministrator, async function (req, res) {
    await tagModel.del(req.body.TagID);
    res.redirect("/administrator/tags/");
});



router.get("/users",authAdministrator, async function(req,res){
    const users = await userModel.all();
    //console.log(users)
    res.render("vwUsers/index",{
        users,
    })
})
router.get("/users/edit",authAdministrator, async function(req,res){
    const id = req.query.id || 0;
    const user = await userModel.getUserById(id);
    const catManagement = await editorModel.getCatsManage(id).first();
    console.log(catManagement)
    res.render("vwUsers/edit",{
        user,
        catManagement
    })
})

router.post("/users/patch",authAdministrator, async function(req,res){
    const info = req.body;
    const user = await userModel.getUserById(info.id);
    console.log(info)
    if(user.permission=="0"){
        await userModel.updatePremium(info.id,info.times);
    }
    else if(user.permission=="2"){
       const existUser = await editorModel.checkExistUser(info.id);
       if(typeof(existUser)=="undefined"){
           const new_user = {
               userID: info.id,
               CatIDLv1: info.CatIDLv1,
               CatIDLv2: info.CatIDLv2
           }
           await editorModel.add(new_user);
       }
       else{
           await editorModel.updateManageCatByUserID(info.id,info.CatIDLv1,info.CatIDLv2)
       }
    }
   res.redirect("/administrator/users/")
})



  
router.post("/users/del",authAdministrator, async function (req, res) {
    await userModel.del(req.body.id);
    res.redirect("/administrator/users/");
});






module.exports = router;