const jwt= require('jsonwebtoken');
const User = require('../model/User');
const Topic = require('../model/topic');
const Admin = require('../model/admin');


// check authentication in rout
const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'secrete string', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                // console.log(decodedToken);
                next();
            }
        })

    }else{
        res.redirect('/login')
    }

};




//check current user
let userEmail;
const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'secrete string', async (err, decodedToken)=>{
            if(err){
               
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedToken.id);
                userEmail = user.email;
                res.locals.user = user;
                next();
            }
        })

    }else{
        res.locals.user = null;
        next()
    }
};

const checkAdmin = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'secrete string', async(err,decodedToken)=>{
            if(err){
                res.locals.role = "User";
                next();
            }
            else{
                
                let role = await Admin.find({email:userEmail});
                
                if(role.length>=1){
                    res.locals.role = "Admin";
                    next();
                }else{
                    res.locals.role = "User";
                    next();
                }
            }
        });
    }
    else{
        res.locals.role = "User";
        next();
    }
};

//is admin

const isAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'secrete string', async (err, decodedToken) => {
            if (err) {
                console.log("This route is only allowed to Admins");
                res.redirect('/index');
            }
            else {

                let role = await Admin.find({ email: userEmail });

                if (role.length >= 1) {
                    next();
                } else {
                    console.log("This route is only allowed to Admins");
                    res.redirect('/index');
                }
            }
        });
    }
    else {
        res.redirect('/index');
        
    }
};



    
    





module.exports = { requireAuth, checkUser, checkAdmin, isAdmin, userEmail};