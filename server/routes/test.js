var express = require('express');
var router = express.Router();

const {getTestPerson, postTestPerson} = require("../controllers/testController")


router.get('/', getTestPerson);


router.post('/', postTestPerson);


module.exports = router;
