const fs = require('fs');
const path = require('path');
const multer = require('multer');
const InterviewModel = require('../model/InterviewExperience');
const Admin = require('../model/admin');
const userEmail = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads');
    },
    filename:(req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({storage:storage});
module.exports.upload = upload;



let name_
module.exports.interview_post = (req, res)=>{
    const{c_name} = req.body;
    name_ = c_name;
}

const cmpFun = async(n)=>{
    let data = await InterviewModel.find({ company: n});
    return data;
}

module.exports.experience_get = (req, res)=>{
    const abc = cmpFun(name_);
    abc.then((data)=>{
        items = data;
        
        res.render('experience', { items });
    })
    
     
}

module.exports.home_get = (req, res) => {
    const abc = cmpFun('Google');
    abc.then((data) => {
        items = data;
        res.render('index',{items})
    })

}







module.exports.experience_post = async (req, res)=>{
    
    console.log(req.body.name, req.body.company, req.body.docLink, req.body.shortDics);
    let obj;


    if (req.file == undefined) {

        obj = {
            name: req.body.name,
            company: req.body.company,
            shortDics: req.body.shortDics,
            docLink: req.body.docLink,
            



            image: {
                data: fs.readFileSync(path.join('D:/#Learn/MNS_29/CodingClub_Project/interview_tracker/dkumar_ver-29/' + '/uploads/' + 'image-1611309382627-441408951')),
                contentType: 'image/png'
            }
        };


        
    } 
    else {
        obj = {
            name: req.body.name,
            company: req.body.company,
            shortDics: req.body.shortDics,
            docLink: req.body.docLink,
            

            image: {
                data: fs.readFileSync(path.join('D:/#Learn/MNS_29/CodingClub_Project/interview_tracker/dkumar_ver-29/' + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        };

        let path_
        path_ = path.join('D:/#Learn/MNS_29/CodingClub_Project/interview_tracker/dkumar_ver-29/' + '/uploads/' + req.file.filename);
        fs.unlink(path_, (err) => {
            if (err) { console.log(err) }
            else {
                console.log("file deleted sucessfully");
            }
        })


    }
    InterviewModel.create(obj, (err, item)=>{
        if(err){
            console.log(err);
        }else{
            item.save;
            console.log("saved");
            res.status(200).json({ done: "saved" });
        }
    })

}