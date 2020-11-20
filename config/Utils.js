const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = {
    getJsonResponse : (statusCode, errorText, data, res) => {
        res.json({
            statusCode  : statusCode,
            errorText   : errorText,
            data        : data,
        });
    },

    verifyToken : (req,res,callback)=>{
        const bearerAuth = req.headers.authorization;
        console.log("bearerAuth : "+bearerAuth);
        if(bearerAuth){
            const token = bearerAuth.split(' ')[1];
            console.log("token : "+token);
            jwt.verify(token, config.secret, (err,tokenInfo)=>{
                if(err){
                    return module.exports.getJsonResponse(403,"Token invalid", {}, res);
                }
                callback(null,tokenInfo);
                // return module.exports.getJsonResponse(200,"OK", {}, res);
            })
        }else{
            return module.exports.getJsonResponse(403,"Token empty", {}, res);
        }
    }
};
