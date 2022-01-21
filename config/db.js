const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config();
const mongoURI = process.env.MongoURI;  // create .env file storing yout mongoURI secrete

const InitiateMongoServer = async()=>{
    try{
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
        console.log("connected to DB");
    }
    catch(err){
        console.log(err);
        throw err;
    }
};


module.exports = InitiateMongoServer;
