var account = require("../../models/account/account");
module.exports = {
    index:async function(req,res,next){
        try{
            /**
             * @description: Validate required fields
             */
            await module.exports.validate.index(req);
            /**
             * @description: verift jsonwebtoken
             */
            var data = await helper.jwtVerify(req.body.access_token);

            if(typeof data.ID =='undefined'){
                throw ({code:'invalidJWT',message:"Invalid token"});
            }
            
            var user = await account.getUser(data.ID)
            req.user = user;
            next();
        }catch(err){
            helper.transformer(req,res,err);
        }
        
    },
    validate:{
        index:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    access_token: Joi.string().required().error(()=>"Invalid access token."),
                });
                
                var fields = {
                    access_token : req.body.access_token,
                };
                Joi.validate(fields, schema,function (err, value) { 
                    if(err){
                        reject({
                            code:"ValidationError",
                            field:err.details[0].path[0],
                            message:err.details[0].message
                        });
                    }else{
                        resolve();
                    }
                });
            })
        },
    }
}