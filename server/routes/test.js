var express = require('express');
var router = express.Router();

const {getTestPerson, postTextPerson} = require("../controllers/testController")


router.get('/', function(req, res, next) {

  console.log(getTestPerson, "logging get test person");
  res.send(getTestPerson);
});


router.post('/', function(req, res, next) {
 
  
  console.log("ok so i succesfully got a post request I AM HAPPY :)");
  res.send({'message': ("Your post request was succesfully added to database" + JSON.stringify(req.body))});
});


module.exports = router;
