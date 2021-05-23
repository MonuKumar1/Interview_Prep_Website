const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please enter user name'],

    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        lowercase:true,
        unique:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required: [true, 'Please enter password'],
        minlength:[6,'minimum length of password is 6 character']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);

    next();
})

userSchema.statics.login = async function(email, password){
    if(email.length>0){
        const user = await this.findOne({ email });
        if (user) {
            if(password.length>0){
                const auth = await bcrypt.compare(password, user.password);
                if (auth) {
                    return user;
                }
                throw Error('incorrect password')
            }else{
                throw Error('Please enter password')
            }
        }
        throw Error('incorrect email')
    }else{
        throw Error('Please enter email')
    }
}


const User = mongoose.model('user', userSchema);
module.exports = User;