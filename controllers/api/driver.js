var driver = require("../../models/api/driver");
module.exports = {
    index:function(req,res,next){
        async.waterfall([
            function(callback){
                /**
                 * @description: Validate required fields for getting a list of driver
                 */
                module.exports.validate.index(req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback()
                    }
                })
            },
            function(callback){
                /**
                 * @description: get the list of drivers
                 */
                driver.list(req.user.ID,req.body.current,req.body.filter,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,response)
                    }
                })
            }
        ],function(err,result){
            if(err){
                helper.transformer(req,res,err);
            }else{
                helper.transformer(req,res,null,result);
            }
        })
        
    },
    get:function(req,res,next){
        async.waterfall([
            function(callback){
                /**
                 * @description: Validate required fields for getting a of driver
                 */
                module.exports.validate.get(req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback()
                    }
                })
            },
            function(callback){
                /**
                 * @description: get the driver
                 */
                driver.get(req.user.ID,req.body.ID,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,response)
                    }
                })
            }
        ],function(err,result){
            if(err){
                helper.transformer(req,res,err);
            }else{
                helper.transformer(req,res,null,result);
            }
        })
        
    },
    add:function(req,res,next){
        async.waterfall([
            function(callback){
                /**
                 * @description: Validate required fields for adding a driver
                 */
                module.exports.validate.add(req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback()
                    }
                })
            },
            function(callback){
                /**
                 * @description: add a new drivers
                 */
                driver.add(req.user.ID,req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        response.message = "A new driver has been added to your restaurant.";
                        callback(null,response)
                    }
                })
            }
        ],function(err,result){
            if(err){
                helper.transformer(req,res,err);
            }else{
                helper.transformer(req,res,null,result);
            }
        })
        
    },
    edit:function(req,res,next){
        async.waterfall([
            function(callback){
                /**
                 * @description: Validate required fields for editing a driver
                 */
                module.exports.validate.edit(req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback()
                    }
                })
            },
            function(callback){
                /**
                 * @description: edit a new drivers
                 */
                
                driver.update(req.user.ID,req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,{message:"The driver has been updated successfully."});
                    }
                })
            }
        ],function(err,result){
            if(err){
                helper.transformer(req,res,err);
            }else{
                helper.transformer(req,res,null,result);
            }
        })
        
    },
    delete:function(req,res,next){
        async.waterfall([
            function(callback){
                /**
                 * @description: Validate required fields for deleting a driver
                 */
                module.exports.validate.delete(req,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        callback()
                    }
                })
            },
            function(callback){
                /**
                 * @description: edit a new drivers
                 */
                
                driver.delete(req.user.ID,req.body.ID,function(err,response){
                    if(err){
                        callback(err)
                    }else{
                        if(response){
                            callback(null,{message:"The driver has been removed successfully."});
                        }else{
                            callback({message:"It seems you are trying to remove driver that is already deleted."});
                        }
                        
                    }
                })
            }
        ],function(err,result){
            if(err){
                helper.transformer(req,res,err);
            }else{
                helper.transformer(req,res,null,result);
            }
        })
        
    },
    
    validate:{
        index:function(req,callback){

            const schema = Joi.object().keys({
                current: Joi.number().required().min(1).error(()=>"Current page must be numeric."),
                filter: Joi.object().keys({
                    name:Joi.string().allow(['']).error(()=>"Search name must be a string."),
                })
            });
            
            var fields = {
                current : req.body.current,
                filter : req.body.filter
            };
            Joi.validate(fields, schema,function (err, value) { 
                if(err){
                    callback({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    callback();
                }
            });
        },
        get:function(req,callback){

            const schema = Joi.object().keys({
                ID : Joi.number().required().error(()=>"driver ID must be numeric."),
            });
            var fields = {
                ID : req.body.ID,
            };
            Joi.validate(fields, schema,{stripUnknown:true},function (err, value) { 
                if(err){
                    callback({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    req.body.variations = value.variations
                    callback();
                }
            });
        },
        add:function(req,callback){

            const schema = Joi.object().keys({
                name : Joi.string().required().error(()=>"Name must be string."),
                phone : Joi.string().required().error(()=>"Phone number is required."),
                image : Joi.object({
                    type : Joi.string().valid(['image/jpeg','image/png','image/gif','image/jpg']).required().error(()=>"Invalid file format."),
                    path : Joi.string().required().error(()=>"Temp path not available."),
                }).required().error((e)=>"Image is required."),
            });
            var fields = {
                name : req.body.name,
                phone : req.body.phone,
                image : req.files.image,
            };
            Joi.validate(fields, schema,{stripUnknown:true},function (err, value) { 
                if(err){
                    callback({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    req.body.variations = value.variations
                    
                    callback();
                }
            });
        },
        edit:function(req,callback){

            const schema = Joi.object().keys({
                ID : Joi.number().required().error(()=>"driver ID must be numeric."),
                name : Joi.string().required().error(()=>"Name must be string."),
                category_id : Joi.number().required().error(()=>"Category ID must be numeric."),
                variations : Joi.array().items(Joi.object({
                    type:Joi.string().valid(['quarter','half','full','numeric']).required().error(()=>"Type could be quarter, half, full, numeric"),
                    amount : Joi.number().required().error(()=>"Amount must be in numeric format."),    
                })).required().min(1).error((e)=>"Prices variation is required."),
                image : Joi.object({
                    type : Joi.string().valid(['image/jpeg','image/png','image/gif','image/jpg']).required().error(()=>"Invalid file format."),
                    path : Joi.string().required().error(()=>"Temp path not available."),
                })
            });
            var fields = {
                ID:req.body.ID,
                name : req.body.name,
                category_id : req.body.category_id,
                variations : req.body.variations,
                type : req.body.type,
                image : req.files.image,
            };
            Joi.validate(fields, schema,{stripUnknown:true},function (err, value) { 
                if(err){
                    callback({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    req.body.variations = value.variations
                    callback();
                }
            });
        },
        delete:function(req,callback){
            const schema = Joi.object().keys({
                ID : Joi.number().required().error(()=>"driver ID must be numeric."),
            });
            var fields = {
                ID:req.body.ID,
            };
            Joi.validate(fields, schema,{stripUnknown:true},function (err, value) { 
                if(err){
                    callback({
                        code:"ValidationError",
                        field:err.details[0].path[0],
                        message:err.details[0].message
                    });
                }else{
                    callback();
                }
            });
        }
    }
}