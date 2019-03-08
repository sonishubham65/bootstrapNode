var account = require("../../models/account/account");
var email = require("../../models/account/email");
module.exports = {
    index:async function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                
                try{
                    /**
                     * @description: Validate required fields for adding a user
                     */
                    await module.exports.validate(req);
                    /**
                     * @description: decode JWT
                     */
                    var jwt = await account.decodeJwt(req.body.jwt);
                    
                    /**
                     * @description: Get user by UID and check if it is already registered or not with type
                     */
                    var user_id = await account.getUserByUID(jwt,req.body.type);
                    if(user_id==null){
                        var referrer = null;
                        if(req.body.referral){
                            /**
                             * @description: Get user by code for referral
                             */
                            referrer = await account.getUserByCode(req.body.referral);
                            
                        }
                        /**
                         * @description: add a user and Send an email as welcome email.
                         */
                    
                        var user_id = await account.addUser(trx,jwt,req.body.type,referrer);
                        if(typeof jwt.picture !='undefined'){
                            var pic = {
                                path:jwt.picture
                            }
                            await account.updateProfilePic(trx,user_id,pic)
                        }
                        await trx.commit();
                        email.welcomeEmail(user_id);
                    }
                    
                    var user = await account.getProfile(user_id);
                    user.created_at = helper.tz(user.created_at,req.headers.timezone);
                    user.updated_at = helper.tz(user.updated_at,req.headers.timezone);
                    user.access_token = helper.jwt({ID:user.ID});
                    /**
                     * @description: JWT encoding
                     */
                    var access_token = await helper.jwt({ID:user.ID})
                    
                    helper.transformer(req,res,null,{profile:user,access_token:access_token,message:"You are registered successfully."});
                    
                }catch(err){
                    trx.rollback();
                    helper.transformer(req,res,err);
                }        
            })
        })
    },
    validate:async function(req,callback){
        return new Promise((resolve,reject)=>{
            var keys = {
                jwt : Joi.string().required().error(()=>"Invalid access token."),
                type : Joi.number().valid(['customer','driver','vendor']).required().error(()=>"Type could be customer,driver or vendor.")
            };
            
            
            var fields = {
                jwt : req.body.jwt||null,
                type : req.body.type||null,
            };
            const schema = Joi.object().keys(keys);
            Joi.validate(fields, schema,{stripUnknown:true},function (err, value) { 
                if(err){
                    throw ({
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