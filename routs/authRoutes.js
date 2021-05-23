const {Router} = require('express');
const authController = require('../controllers/authController');
const expController = require('../controllers/experienceController');
const {requireAuth, checkUser, checkAdmin} = require('../middleware/authMiddleware')

const router = Router();

router.get('*', checkUser,checkAdmin);
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//index page
router.get('/index', requireAuth, authController.index_get);

router.get('/index/:topic',authController.question_get);
router.post('/index', authController.index_post);

router.post('/addq',authController.addq_post);

router.get('/interview',(req,res)=>{res.render('interview-boots')});
router.post('/interview', expController.interview_post);
// router.get('/service-page',(req,res)=>{ res.redirect(301,'/'); })
router.get('/interview/:company', expController.experience_get);
router.post('/interview/add-exp', expController.upload.single('image'), expController.experience_post); //,expController.upload.single('image')
module.exports = router;
