const mongoose = require('mongoose');
require('mongoose-type-url');


const questionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'topic',
        
    },

    link:{
        type:mongoose.SchemaTypes.Url,
        required:true,
    },

    approved:{
        type:Boolean,
        default:false
    }

});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;
