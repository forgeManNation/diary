const asyncHandler = require('express-async-handler')
const User = require("../models/testPerson")

const getTestPerson = asyncHandler(async (req, res) => {
    const testPersons = await User.find()
    res.status(200).json(testPersons)
});

const postTestPerson = asyncHandler(async (req, res) => {

    console.warn(req.body.text, ";|)GOOD");

    let whatToSend = "hahaaaaa"

    whatToSend =  req.body.text ? req.body.text : whatToSend; 

    const testPersons = await User.create({text: whatToSend})
     res.status(200);
});


module.exports = {getTestPerson, postTestPerson}