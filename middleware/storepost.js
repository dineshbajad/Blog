module.exports=(req,res,next)=>{
     if(!req.body.username||!req.body.title||!req.body.description||!req.body.content)
    return res.redirect('/createpost');
next()
}