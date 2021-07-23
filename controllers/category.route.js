const express = require("express");
const authAdministrator = require("../middlewares/auth-administrator.mdw");
const categoryModel = require("../models/category.model");

const router = express.Router();

router.get("/",authAdministrator, async function (req, res) {
  const list = await categoryModel.allCatLv1();
  res.render("vwCategories/index", {
    categories: list,
    empty: list.length === 0,
  });

  // categoryModel.all().then(function (list) {
  //   res.render('vwCategories/index', {
  //     categories: list,
  //     empty: list.length === 0
  //   });
  // })
});

router.get("/addCatLv1",authAdministrator, function (req, res) {
  res.render("vwCategories/add");
});

router.post("/addCatLv1",authAdministrator, async function (req, res) {
  const new_category = {
    // CatID: -1,
    CatNameLv1: req.body.txtCatName,
  };

  // const rs = await categoryModel.add(new_category);
  // console.log(rs);
  await categoryModel.addCatLv1(new_category);
  res.redirect("/admin/categories");
});

router.get("/edit",authAdministrator, async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.findByIdCatLv1(id);
  if (category === null) {
    return res.redirect("/admin/categories");
  }
  console.log(category)
  res.render("vwCategories/edit", {
    category,
  });
});

router.get("/indexLv2",authAdministrator, async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.allCatLv2ByCatLv1(id);
  console.log(category)
  // if (category === null) {
  //   return res.redirect("/admin/categories");
  // }

  res.render("vwCategories/indexLv2", {
    categories: category,
    idlv1:id,
    //empty: category.length === 0,
  });
});


router.get("/editCatLv2",authAdministrator, async function (req, res) {
  const idlv1 = req.query.idlv1 || 0;
  const idlv2 = req.query.idlv2 || 0;
  //const category = await categoryModel.findCatLv2ByCatLv1AndCatLv2(idlv1,idlv2);
  const category = await categoryModel.findCatLv2ByCatLv1AndCatLv2(idlv1,idlv2)
  const catLv1 = await categoryModel.findByIdCatLv1(idlv1);
  if (category === null) {
    return res.redirect("/admin/categories");
  }
  console.log("editlv2")
  console.log(category)
  console.log(catLv1)
  res.render("vwCategories/editCatLv2", {
    category,
    catLv1,
  });
});

router.post("/patchCatLv1",authAdministrator, async function (req, res) {
  await categoryModel.patch(req.body);
  res.redirect("/admin/categories");
});

router.post("/delCatLv1",authAdministrator, async function (req, res) {
  await categoryModel.del(req.body.CatIDLv1);
  res.redirect("/admin/categories");
});


router.get("/addCatLv2",authAdministrator, function (req, res) {
  const idlv1 = req.query.idlv1 || 0;
  res.render("vwCategories/addCatLv2", {
    idlv1});
});

router.post("/addCatLv2",authAdministrator, async function (req, res) {
  const CatIDLv1 = req.body.CatIDLv1;
  const lastCatIDLv2 = await categoryModel.getPosCatLv2(CatIDLv1);
  CatIDLv2 =0;
  if(typeof(lastCatIDLv2)=="undefined"){
    CatIDLv2=0;
  }
  else {
    CatIDLv2 = +lastCatIDLv2.CatIDLv2+1;
  }
  
  console.log(typeof(CatIDLv2));
  const new_category = {
    // CatID: -1,
    CatNameLv2: req.body.txtCatName,
    CatIDLv1:CatIDLv1,
    CatIDLv2:CatIDLv2
  };
  await categoryModel.addCatLv2(new_category);
  res.redirect("/admin/categories/indexLv2?id="+CatIDLv1);
});

router.post("/patchCatLv2",authAdministrator, async function (req, res) {
  await categoryModel.patchCatLv2(req.body);
  res.redirect("/admin/categories/indexLv2?id="+req.body.CatIDLv1);
});

router.post("/delCatLv2",authAdministrator, async function (req, res) {
  await categoryModel.delCatLv2(req.body.CatIDLv1,req.body.CatIDLv2);
  res.redirect("/admin/categories/indexLv2?id="+req.body.CatIDLv1);
});







module.exports = router;
