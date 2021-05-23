const express = require('express');
const InitiateMongoServer = require('./config/db');
const authRoutes = require('./routs/authRoutes');
const cookieParser = require('cookie-parser')
const {requireAuth,checkUser, isAdmin,checkAdmin} = require('./middleware/authMiddleware')
const routerAdminBro = require('./adminPanel/adminBro')
const expController = require('./controllers/experienceController');

const app = express();

app.use(express.static('public'));
app.use(express.json());
// app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(authRoutes);

const PORT = process.env.PORT || 80;

InitiateMongoServer()
    .then(() => {
        app.listen(PORT, (req, res) => {
            console.log('server is started');
            console.log('Ready!!');
        });
        app.use('/admin', requireAuth, isAdmin,routerAdminBro);

    });



app.get('*', checkUser);
app.get('/', expController.home_get );
app.get('/robotics',(req,res)=>{res.render('others')});

