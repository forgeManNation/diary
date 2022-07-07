const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://hordol122:Panklistak122@cluster0.ga03v.mongodb.net/?retryWrites=true&w=majority")
        console.log(`Mongo DB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB;