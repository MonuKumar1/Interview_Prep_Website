const mongoose = require('mongoose');
const mongoURI = '';

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
