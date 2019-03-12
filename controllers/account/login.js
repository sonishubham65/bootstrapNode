var account = require("../../models/account/account");
module.exports = {
    index:async function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                try{
                    /**
                     * @description: Validate required fields for login
                     */
                    await module.exports.validate(req);
                    /**
                     * @description: If JWT is given then try to login with JWT first
                     */
                    var user_id;
                    if(req.body.jwt){
                        /**
                         * @description: decode JWT
                         */
                        let jwt = await account.decodeJwt(req.body.jwt)
                        /**
                         * Login with Phone & OTP or Social Login
                         */
                        user_id = await account.getUserByUID(jwt,req.body.type)
                        
                    }else{
                        if(req.body.email){
                            /**
                             * Login with Email and Password
                             */
                            user_id = await account.loginWithEmail(req.body.email,req.body.password);
                            if(!user_id){
                                throw ({code:"wrongPassword",message:"It seems, You have entered a wrong email and password combination, please make sure it or try forgot password."});
                            }
                        }else{
                            /**
                             * Login with Phone and Password
                             */
                            user_id = await account.loginWithPhone(req.body.phone,req.body.password);
                            if(!user){
                                throw ({code:"wrongPassword",message:"It seems, You have entered a wrong phone and password combination, please make sure it or try forgot password."});
                            }
                        }
                        
                    }
                    /**
                     * @description: Insert devices
                     */
                    await account.upsertDevice(trx,user_id,req.body.device_type,req.body.device_token);
                    await trx.commit();
                    /**
                     * @description: Get complete profile
                     */
                    var user = await account.getProfile(user_id);
                    user.created_at = helper.tz(user.created_at,req.headers.timezone)
                    user.updated_at = helper.tz(user.updated_at,req.headers.timezone)
    
    
                    /**
                     * @description: JWT encoding
                     */
                    var access_token = await helper.jwt({ID:user.ID})
                    helper.transformer(req,res,null,{profile:user,access_token:access_token,message:"You have been logged in successfully."});
                
                }catch(err){
                    trx.rollback()
                    helper.transformer(req,res,err);
                }
            })
            
        })
    },
    validate:async function(req){
        return new Promise((resolve,reject)=>{
            const schema = Joi.object().keys({
                email: Joi.string().allow([null]).email().error((e)=>"Email format is not valid."),
                phone: Joi.string().allow([null]).min(8).max(15).error(()=>"Phone number must be 8-15 Char long."),
                type: Joi.number().valid(['customer','driver','vendor']).required().error(()=>"Type could be customer,driver or vendor."), 
                password : Joi.string().allow([null]).error(()=>"Password is required."),
                jwt : Joi.string().allow([null]).error(()=>"JWT is required."),
                device_type : Joi.string().valid(['android','iOS','web','']).error(()=>"Device type could be android,iOS,web."),
                device_token : Joi.string().allow([null]).error((err)=>"Device token must be a string."),
            });
            
            var fields = {
                email : req.body.email||null,
                phone : req.body.phone||null,
                password :  req.body.password||null,
                type : req.body.type||null,
                jwt : req.body.jwt||null,
                device_type : req.body.device_type||null,
                device_token : req.body.device_token||null
            };
            
            Joi.validate(fields, schema,function (err, value) { 
                if(err){
                    throw({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    resolve();
                }
            });
        })
        
    }
}