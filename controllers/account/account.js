var account = require("../../models/account/account");
module.exports = {
    index : async function(req,res,next){
        try{
            var user = await account.getProfile(req.user.ID);
            user.created_at = helper.tz(user.created_at,req.headers.timezone)
            helper.transformer(req,res,null,{profile:user});
            user.updated_at = helper.tz(user.updated_at,req.headers.timezone)
        }catch(err){
            helper.transformer(req,res,err);
        }
    },
    edit:{
        index : async function(req,res,next){
            knex.transaction(async function(trx){
                return await new Promise(async (resolve,reject)=>{
                    try{
                        
                        /**
                         * @description: Validate required fields for updaing profile
                         */
                        await module.exports.validate.profile(req)

                        await account.editUser(trx,req.user.ID,req);
                        /**
                         * @description: update profile pic of a user
                         */
                        if(typeof req.files.profile_pic !='undefined'){
                            var pic = {
                                path:req.files.profile_pic.path,
                                name:req.files.profile_pic.name
                            };
                            if(pic){
                                await account.updateProfilePic(trx,req.user.ID,pic);
                            }
                        }
                        await trx.commit();
                        var user = await account.getProfile(req.user.ID);
                        user.created_at = helper.tz(user.created_at,req.headers.timezone)
                        user.updated_at = helper.tz(user.updated_at,req.headers.timezone)

                        helper.transformer(req,res,null,{profile:user});
                    
                    }catch(err){
                        trx.rollback();
                        helper.transformer(req,res,err);
                    }                  
                })
            })
        },
        driver : function(req,res,next){
            knex.transaction(async function(trx){
                return await new Promise(async (resolve,reject)=>{
                    try{
                        /**
                         * @description: Validate required fields for updaing driver
                         */
                        await module.exports.validate.driver(req);
                        await account.editDriver(trx,req.user.ID,req)
                        
                        /**
                         * @description: update RC of a driver
                         */
                        if(typeof req.files.rc !='undefined'){
                            var pic = {
                                path:req.files.rc.path,
                            };
                            if(pic){
                                await account.updateRc(trx,req.user.ID,pic)
                            }
                        }
                        /**
                         * @description: update license of a driver
                         */
                        if(typeof req.files.license !='undefined'){
                            var pic = {
                                path:req.files.license.path,
                            };
                            if(pic){
                                await account.updateLicense(trx,req.user.ID,pic)
                            }
                        }
                        await trx.commit()
                        var user = await account.getProfile(req.user.ID);
                        user.created_at = helper.tz(user.created_at,req.headers.timezone)
                        user.updated_at = helper.tz(user.updated_at,req.headers.timezone)
                        helper.transformer(req,res,null,{profile:user,message:"Your profile has been updated."});
                    }catch(err){
                        trx.rollback();
                        helper.transformer(req,res,err);
                    }                  
                })
            })
            
            
        },
        vendor : function(req,res,next){
            knex.transaction(async function(trx){
                return await new Promise(async (resolve,reject)=>{
                    try{
                        /**
                         * @description: Validate required fields for updaing vendor
                         */
                        await module.exports.validate.vendor(req)
                        await account.editVendor(trx,req.user.ID,req)
                        
                        await trx.commit()
                        var user = await account.getProfile(req.user.ID)
                        console.log(1)
                        user.created_at = helper.tz(user.created_at,req.headers.timezone)
                        user.updated_at = helper.tz(user.updated_at,req.headers.timezone)
                        
                        helper.transformer(req,res,null,{profile:user,message:"Your vendor information has been updated."});
                        
                    }catch(err){
                        trx.rollback();
                        helper.transformer(req,res,err);
                    }                  
                })
            })

            async.waterfall([
                function(callback){
                    /**
                     * @description: Validate required fields for updaing vendor
                     */
                    module.exports.validate.vendor(req,function(err,response){
                        if(err){
                            callback(err)
                        }else{
                            callback()
                        }
                    })
                },function(callback){
                    account.editVendor(req.user.ID,req,function(err){
                        if(err){
                            callback(err)
                        }else{
                            callback()
                        }
                    })
                },function(callback){
                    account.getProfile(req.user.ID,function(err,user){
                        if(err){
                            callback(err);
                        }else{
                            user.created_at = helper.tz(user.created_at,req.headers.timezone)
                            user.updated_at = helper.tz(user.updated_at,req.headers.timezone)
                            callback(null,user)
                        }
                    })   
                }
            ],function(err,result){
                if(err){
                    helper.transformer(req,res,err);
                }else{
                    helper.transformer(req,res,null,{profile:result,message:"Your vendor information has been updated."});
                }
            })
            
        }
    },
    password:function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                try{
                    /**
                     * @description: Validate required fields for updaing password
                     */
                    await module.exports.validate.password(req);

                    var verification = await account.verifyPassword(req.user.ID,req.body.password);
                    console.log("verification",verification)
                    if(verification){
                        throw ({code:"samePassword",message:"New password is the same as old password, Kindly update with a new and unique password set."});
                    }
                    await account.updatePassword(trx,req.user.ID,req.body.password);
                    helper.transformer(req,res,null,{message:"Password updated successfully, You can use it when you login next time."});
                    
                }catch(err){
                    trx.rollback();
                    helper.transformer(req,res,err);
                }                  
            })
        })
    },
    phone:function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                try{
                    /**
                     * @description: Validate required fields for updaing phone
                     */
                    await module.exports.validate.phone(req);
                    var jwt = await account.decodeJwt(req.body.jwt);
                    if(jwt.provider=='phone'){
                        var user = await account.getUserByUID(jwt,req.user.type)
                        if(user){
                            if(user==req.user.ID){
                                throw ({code:"duplicateNumber",message:"This number is already using by you."})    
                            }
                            throw ({code:"duplicateNumber",message:"This number is already registered with some user."})
                        }
                    }else{
                        throw ({code:"incorrectProvider",message:"Access token provider is not accessible."})
                    }
                    await account.updatePhone(trx,req.user.ID,jwt);
                    await trx.commit();
                    helper.transformer(req,res,null,{message:"Phone number updated successfully."});
                    
                }catch(err){
                    trx.rollback();
                    helper.transformer(req,res,err);
                }                  
            })
        })
        
    },
    email:function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                try{
                    /**
                     * @description: Validate required fields for updaing phone
                     */
                    await module.exports.validate.phone(req);
                    var jwt = await account.decodeJwt(req.body.jwt);
                    if(jwt.provider=='password'){
                        var user = await account.getUserByUID(jwt,req.user.type)
                        if(user){
                            throw ({code:"duplicateEmail",message:"This email is already registered with some user."})
                        }
                    }else{
                        throw ({code:"incorrectProvider",message:"Access token provider is not accessible."})
                    }
                    await account.updateEmail(trx,req.user.ID,jwt);
                    await trx.commit();
                    helper.transformer(req,res,null,{message:"Email has been updated successfully."});
                    
                }catch(err){
                    trx.rollback();
                    helper.transformer(req,res,err);
                }                  
            })
        })
    },
    profile_pic:async function(req,res,next){
        knex.transaction(async function(trx){
            return await new Promise(async (resolve,reject)=>{
                try{
                    /**
                     * @description: update profile pic of a user
                     */
                    if(typeof req.files.profile_pic !='undefined'){
                        var pic = {
                            path:req.files.profile_pic.path,
                            name:req.files.profile_pic.name
                        };
                        if(pic){
                            await account.updateProfilePic(trx,req.user.ID,pic);
                        }
                    }else{
                        throw({code:"noimage",message:"Kindly select an image to update profile pic."})
                    }
                    await trx.commit();
                    var user = await account.getProfile(req.user.ID);
                    user.created_at = helper.tz(user.created_at,req.headers.timezone)
                    user.updated_at = helper.tz(user.updated_at,req.headers.timezone)

                    helper.transformer(req,res,null,{profile:user,message:"Profile pic has been updated successfully."});
                
                }catch(err){
                    trx.rollback();
                    helper.transformer(req,res,err);
                }                  
            })
        })
        
    },
    logout:function(req,res,next){
        knex.transaction(async function(trx){
            try{
                /**
                 * @description: Validate required fields for logout password
                 */
                await module.exports.validate.device(req)
                /**
                 * @description: removing device
                 */
                await account.removeDevice(trx,req.user.ID,req.body.device_type,req.body.device_token);
                helper.transformer(req,res,null,{message:"You're logout, thank you for using our services, You can re-login with one click access."});
            
            }catch(err){
                trx.rollback();
                helper.transformer(req,res,err);
            }        
        })
        
       
    },
    validate:{
        profile:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    firstname : Joi.string().required().regex(/[a-zA-Z-0-9' `]+$/).error(()=>"First name must contains alphabetic or numeric."),
                    lastname : Joi.string().required().regex(/[a-zA-Z-0-9' `]+$/).error(()=>"Last name must contains alphabetic or numeric."),
                    city : Joi.string().required().regex(/[a-zA-Z-0-9' `]+$/).error((e)=>"City must be in string."),
                    address : Joi.string().required().regex(/^[a-zA-Z-' `0-9 ,.]+$/).error(()=>"Address must be in string."),
                    country_id : Joi.number().required().error(()=>"Country is required and must be in numeric."),
                });
                
                var fields = {
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,
                    city : req.body.city,
                    address : req.body.address,
                    country_id : req.body.country_id,
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
        driver:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    vehical_number : Joi.string().required().error(()=>"Vehical number is required."),
                    rc_number : Joi.string().required().error(()=>"RC number is required."),
                    license_number : Joi.string().required().error(()=>"License number is required.")
                });
                
                var fields = {
                    vehical_number : req.body.vehical_number,
                    rc_number : req.body.rc_number,
                    license_number : req.body.license_number
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
        vendor:function(req,callback){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    address : Joi.string().required().regex(/^[a-zA-Z-' `0-9 ,.]+$/).error(()=>"Restaurant address must be in string"),
                    latitude : Joi.number().required().error(()=>"Location is required."),
                    longitude : Joi.number().required().error(()=>"Location is required."),
                    name : Joi.string().required().error(()=>"Restaurant name is required."),
                    opening : Joi.string().required().error(()=>"Restaurant opening time is required."),
                    closing : Joi.string().required().error(()=>"Restaurant closing time is required."),
                    gstin : Joi.string().required().length(10).error(()=>"GSTIN must be 10 digit long.")
                });
                
                var fields = {
                    address : req.body.address,
                    latitude : req.body.latitude,
                    longitude : req.body.longitude,
                    name : req.body.name,
                    opening:req.body.opening,
                    closing:req.body.closing,
                    gstin:req.body.gstin,
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
        password:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    password : Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,12}$/).required().error(()=>"Password must contain At least one upper case, one lower case, one digit, one special character and length six to twelve"),
                    confirmPassword : Joi.string().valid(Joi.ref('password')).required().error(()=>"Confirm passwod is not identical."),
                });
                
                var fields = {
                    password : req.body.password,
                    confirmPassword : req.body.confirmPassword,
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
        phone:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    jwt : Joi.string().required().error(()=>"Invalid access token."),
                });
                
                var fields = {
                    jwt : req.body.jwt,
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
        email:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    jwt : Joi.string().required().error(()=>"Invalid access token."),
                });
                
                var fields = {
                    jwt : req.body.jwt,
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
        device:function(req){
            return new Promise((resolve,reject)=>{
                const schema = Joi.object().keys({
                    device_type : Joi.string().valid(['iOS','android','web']).required().error(()=>"Device type could be iOS, android or web."),
                    device_token : Joi.string().required().error(()=>"Device token is required and must be in string."),
                });
                
                var fields = {
                    device_type : req.body.device_type,
                    device_token : req.body.device_token,
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
            
        }
    }
}