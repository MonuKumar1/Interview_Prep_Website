const mongoose = require('mongoose');
require('mongoose-type-url');

const interviewSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        data:Buffer,
        contentType:String
    },
    company:{
        type:String
    },
    shortDics:{
        type:String
    },
    docLink:{
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false
    }

})

const InterviewModel = mongoose.model('interview', interviewSchema);
module.exports = InterviewModel;