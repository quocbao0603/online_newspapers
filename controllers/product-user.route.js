const express = require("express");
const productModel = require("../models/product.model");

const router = express.Router();

router.get("/byCat/:id", async function (req, res) {
  const catId = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === catId) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }
  ls = res.locals.lcCategories
 
  title=ls[catId-1].CatNameLv1
  
   
  //console.log(title)
  
  // const list = await productModel.findByCatID(catId);
  // res.render('vwProducts/byCat', {
  //   products: list,
  //   empty: list.length === 0
  // });

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productModel.countByCatIDLv1(catId);
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
  const list = await productModel.findByCatIDLv1(catId, offset);
  res.render("vwProducts/byCat", {
    products: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/byCat/:idLv1/:idLv2", async function (req, res) {
  const catIdLv1 = +req.params.idLv1 || 0;
  const catIdLv2 = +req.params.idLv2 || 0;
  for (c of res.locals.lcCategories) {
    if (c.CatID === catIdLv1) {
      c.IsActive = true;
      break;
    }
  }

  ls = res.locals.lcCategories;
  title =
    ls[catIdLv1 - 1].CatNameLv1 +
    " | " +
    ls[catIdLv1 - 1].CatName[catIdLv2 - 1].CatNameLv2;

  // const list = await productModel.findByCatIDLv1(catId);
  // res.render('vwProducts/byCat', {
  //   products: list,
  //   empty: list.length === 0
  // });

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productModel.countByCatIDLv2(catIdLv1, catIdLv2);
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
  const list = await productModel.findByCatIDLv2(catIdLv1, catIdLv2, offset);
  res.render("vwProducts/byCat", {
    products: list,
    empty: list.length === 0,
    page_numbers,
    title,
  });
});

router.get("/details/:id", async function (req, res) {
  const proId = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === catId) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }

  const product = await productModel.findById(proId);
  if (product === null) {
    return res.redirect("/");
  }

  res.render("vwProducts/details", {
    product: product,
  });
});

module.exports = router;
