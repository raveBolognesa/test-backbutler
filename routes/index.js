const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/allRooms', (req, res, next) => {
  
  res.json({"pepe": "pepe", "juan":"juan", "edu":"edu"});
});



module.exports = router;
