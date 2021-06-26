const express = require('express');
const multer = require('multer');

const router = express.Router();

router.get('/editor', function (req, res) {
  res.render('vwDemo/editor');
});

router.post('/editor', function (req, res) {
  console.log(req.body.content);
  res.render('vwDemo/editor');
});

router.get('/upload', function (req, res) {
  res.render('vwDemo/upload');
})

router.post('/upload', function (req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './public/imgs')
    },
    filename(req, file, cb) {
      cb(null, file.originalname)
    }
  });
  const upload = multer({
    storage
  });

  upload.array('cover', 12)(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body);
      res.render('vwDemo/upload');
    }
  })

})

module.exports = router;