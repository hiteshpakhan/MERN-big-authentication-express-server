const mongoose = require("mongoose");
require("dotenv").config();


const connectDb = async() => { 
    try{
        await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        // useUnifiedTechnology: true
        }).then(() => console.log("database has been connected successfully"));
    }catch(error){
        console.log(error);
    }
}
module.exports = connectDb;