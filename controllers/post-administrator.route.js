const express = require("express");
const authAdministratorMdw = require("../middlewares/auth-administrator.mdw");
const authAdministrator = require("../middlewares/auth-administrator.mdw");
const tagModel = require("../models/tag.model");
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
    const new_tag = {
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



module.exports = router;