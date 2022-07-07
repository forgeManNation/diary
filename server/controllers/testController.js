const asyncHandler = require('express-async-handler')
const User = require("../models/testPerson")

const getTestPerson = asyncHandler(async (req, res) => {
    const testPersons = await User.find()
    res.status(200).json(testPersons)
});

const postTestPerson = asyncHandler(async (req, res) => {
    const testPersons = await User.insertMany({text: "hahaaaaa"})
    res.status(200).json(testPersons)
});


module.exports = {getTestPerson, postTestPerson}