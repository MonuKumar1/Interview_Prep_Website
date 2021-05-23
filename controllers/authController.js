const User = require('../model/User');
const Topic = require('../model/topic');
const Questions = require('../model/questions');
const Admin = require('../model/admin');
const {userEmail} = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');


const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = {name:'',email:'', password:''};

    if (err.message ==="Please enter email"){
        errors.email = "Please enter email";
    }
    if (err.message === "Please enter password") {
        errors.password = "Please enter password";
    }
    if (err.message === "incorrect email"){
        errors.email = "that email is not registered";
    }

    if (err.message === "incorrect password") {
        errors.password = "incorrect password";
    }

    if(err.code === 11000){
        errors.email = "that email is already registered";
        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors
}


const maxAge = 3*60*60;

const createToken = (id)=>{
    return jwt.sign( {id}, 'secrete string', {expiresIn:maxAge} );
}






module.exports.signup_get = (req, res)=>{
    res.render('signup');
}

module.exports.login_get = (req, res)=>{
    res.render('login');
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports.signup_post = async(req, res)=>{
    const {name,email,password} = req.body;
    try {
        const user = await User.create({name,email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true ,maxAge: maxAge*1000})
        res.status(201).json({user: user._id});
    } 
    catch (err) {
        const errors =  handleErrors(err);
        res.status(400).json({errors});
    }
    // res.send('new signup');
}

module.exports.login_post = async(req, res)=>{
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id})
        
    } 
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
    
}

//index page
let topics=[];
const topicFun = async () => {
    topics = await Topic.find({}, (err) => {  });
    return topics;
};

module.exports.index_get = (req, res)=>{
    const abc = topicFun();
    abc.then((data) => {
        topics = data;
        res.render('programming', { topics });
    });
};



let questions;
let topiC;
let ALERT 
module.exports.index_post = async(req,res) =>{
    const { topic} = req.body;
    topiC = topic;
 
};




module.exports.addq_post = async(req, res)=>{
    const {addQ_title, addQ_topic, addQ_link} = req.body;
    let addQ_approved;
    let role = await Admin.find({ email: userEmail });
    if (role.length >= 1) {
        addQ_approved = true;
        
    } else {
        
        addQ_approved = false;
    }
   
    let addQ_topicData = await Topic.find({ topicTitle: addQ_topic });
    const name = addQ_title; 
    const topic2 = addQ_topicData[0]._id;
    const link = addQ_link;
    const approved = addQ_approved;

    
    
    let addQ_model = new Questions({ name, topic:topic2, link, approved });
    addQ_model.save()
        .then(() => {
            
            ALERT = "data saved sucessfully";
            console.log(ALERT);
            res.status(201).json({ alert_: ALERT })
        })
        .catch(err => {
            ALERT = "unable to save data";
            console.log(ALERT);
            res.status(400).json({ alert_: ALERT })
        });
    
}


const quesFun = async (topic_) => {
    let topicID = await Topic.find({ topicTitle: topic_ })
    // console.log(topicID.length);
    let question
    if(topicID.length >= 1){
        question = await Questions.find({ topic: topicID[0]._id, approved: true });
    }else{
        question = [];
    }
    
    // console.log(question);
    return question;
}

module.exports.question_get = async (req, res) => {
    
    const ques = quesFun(topiC);
    ques.then((data) => {
        questions = data;
        // console.log('final',questions);
        res.locals.topiC = topiC;
        res.locals.questions = questions;

        const abc = topicFun();
        abc.then((data) => {
            topics = data;
        });

        res.locals.topics = topics;
       
        res.render('question');
    })
}