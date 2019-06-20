const express=require('express');
const path =require('path');
const expressEdge=require('express-edge');
const edge=require('edge.js');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const Post=require('./database/models/Post');
const fileUpload=require('express-fileupload');
const expressSession=require('express-session');
const connectMongo=require('connect-mongo');
const connectFlash=require('connect-flash');

const createpostcontroller=require('./controllers/createpost')
const storepostcontroller=require('./controllers/storepost')
const homepagecontroller=require('./controllers/homepage')
const getpostcontroller=require('./controllers/getpost')
const createusercontroller=require('./controllers/createuser');
const storeusercontroller=require('./controllers/storeuser')
const logincontroller=require('./controllers/login');
const loginusercontroller=require('./controllers/loginUser');
const logoutcontroller=require('./controllers/logout')
const auth=require('./middleware/auth');
const redirectifauthenticated=require('./middleware/redirectifauthenticated')
 
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://dinesh:dinesh123@ds145359.mlab.com:45359/dineshnodemongo', { useNewUrlParser: true })
.then(()=>console.log('You are now connected to mongo!'))
.catch(err=>console.log('Unable to connect to database'))
const app=new express();

const mongoStore=connectMongo(expressSession);
 
app.use(fileUpload());
app.use(express.static(__dirname+'/public'));
app.use(expressEdge);
app.set('views',__dirname+'/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSession({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
    store:new mongoStore({
        mongooseConnection:mongoose.connection
    })
}))
app.use('*',(req,res,next)=>{
    edge.global('auth',req.session.userId)
    next()
})
app.use(connectFlash());
const storepost=require('./middleware/storepost');
  

app.get('/about',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages/about.html'));
})
app.get('/contact',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages/contact.html'));
})
 
app.get('/',homepagecontroller);
app.get('/createpost',auth,createpostcontroller);
app.get('/post/:id',getpostcontroller);
app.post('/posts/store',storepost,storepostcontroller);
app.get('/auth-login',redirectifauthenticated,logincontroller)
app.post('/users/login',redirectifauthenticated,loginusercontroller);
app.get('/auth-register',redirectifauthenticated,createusercontroller);
app.post('/users/register',redirectifauthenticated,storeusercontroller);
app.get('/auth-logout',logoutcontroller);

app.listen(process.env.PORT||5000)
