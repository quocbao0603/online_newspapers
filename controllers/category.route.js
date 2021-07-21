const express = require("express");
const categoryModel = require("../models/category.model");

const router = express.Router();

router.get("/", async function (req, res) {
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

router.get("/add", function (req, res) {
  res.render("vwCategories/add");
});

router.post("/add", async function (req, res) {
  const new_category = {
    // CatID: -1,
    CatName: req.body.txtCatName,
  };

  // const rs = await categoryModel.add(new_category);
  // console.log(rs);
  await categoryModel.add(new_category);
  res.render("vwCategories/add");
});

router.get("/edit", async function (req, res) {
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

router.get("/indexLv2", async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.allCatLv2ByCatLv1(id);
  console.log(category)
  if (category === null) {
    return res.redirect("/admin/categories");
  }

  res.render("vwCategories/indexLv2", {
    categories: category,
    empty: category.length === 0,
  });
});


router.get("/editCatLv2", async function (req, res) {
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

router.post("/patch", async function (req, res) {
  await categoryModel.patch(req.body);
  res.redirect("/admin/categories");
});

router.post("/del", async function (req, res) {
  await categoryModel.del(req.body.CatID);
  res.redirect("/admin/categories");
});

module.exports = router;
