const jwt = require('jsonwebtoken');

exports.requireSignIn = (req, res, next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.JWT_KEY,function (err, decode){
            if(err){
                return res.status(400).json({status: "Error", message: "Token Expired Login Again", Error: err})
            }else{
                req.user = decode;
            }
        })
    }else{
        res.status(400).json({status:'Fail', messege: "Authorization Required."});
    }
    next();
}