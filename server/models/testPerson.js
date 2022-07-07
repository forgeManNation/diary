const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
    text: String
}   
)

module.exports = mongoose.model("User", testSchema)