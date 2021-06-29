const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/byCat/:id', async function (req, res) {
  const catId = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === catId) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }
  title=''
  ls = res.locals.lcCategories
  if(catId > 9){
    ID1  = Math.trunc(catId/10)-1
    ID2 = catId%10-1
    title = ls[ID1].CatNameLv1 + ' | '+ ls[ID1].CatName[ID2].CatNameLv2
  }
  else {
    title=ls[catId-1].CatNameLv1
  }
   
  console.log(title)
  
  // const list = await productModel.findByCatID(catId);
  // res.render('vwProducts/byCat', {
  //   products: list,
  //   empty: list.length === 0
  // });

  const limit = 6;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productModel.countByCatID(catId);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page
    });
  }

  const offset = (page - 1) * limit;
  const list = await productModel.findByCatID(catId, offset);
  res.render('vwProducts/byCat', {
    products: list,
    empty: list.length === 0,
    page_numbers,
    title
  });
});

router.get('/details/:id', async function (req, res) {
  const proId = +req.params.id || 0;

  // for (c of res.locals.lcCategories) {
  //   if (c.CatID === catId) {
  //     c.IsActive = true;
  //     break;
  //   }
  // }

  const product = await productModel.findById(proId);
  if (product === null) {
    return res.redirect('/');
  }

  res.render('vwProducts/details', {
    product: product
  });
});

module.exports = router;