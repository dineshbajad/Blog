const user=require('../database/models/user');
module.exports=(req,res)=>{
    user.create(req.body,(error,user)=>{
        if(error)
        {
        const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
        req.flash('registrationErrors', registrationErrors)
        return res.redirect('/auth-register');
        }
        else
        res.redirect('/');
    })

}