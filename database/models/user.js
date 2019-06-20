const bcrypt=require('bcrypt');
const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
userschema.pre('save',function(next){
    const user=this
    bcrypt.hash(user.password,10,function(err,encrypted){
        user.password=encrypted
        next();
    })
})
module.exports=mongoose.model('blog-users',userschema);