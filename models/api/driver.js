var Promise = require('bluebird');
module.exports = {
    list:function(user_id,current=1,filter={},callback){
        var limit = 10;
        var offset = (current-1)*limit;
        knex('drivers')
        .select(knex.raw('SQL_CALC_FOUND_ROWS drivers.driver_id'))
        .select(["drivers.name","drivers.phone","drivers.created_at","drivers.updated_at","drivers.status"])
        .select("d1.filepath as image__doc")
        .leftJoin("documents as d1","d1.ID", "drivers.image__doc")
        .where({
            "drivers.vendor_id":user_id,
        })
        .limit(limit)
        .offset(offset)
        .then(drivers=>{
            knex.select(knex.raw('found_rows() as count')).first().then(rows=>{
                drivers = _.map(drivers,function(driver){
                    if(driver.image__doc){
                        driver.image__doc = helper.publicUrl(driver.image__doc,"driver",['thumb'])
                    }
                    return driver;
                })
                callback(null,{
                    "drivers":drivers,
                    "count":rows.count,
                    "current":current
                });
            });
            
        }).catch(err=>{
            console.log(err)
        })

    },
    get:function(user_id,driver_id,callback){
        knex('drivers')
        .select(["drivers.name","drivers.phone","drivers.created_at","drivers.updated_at","drivers.status"])
        .select("d1.filepath as image__doc")
        .leftJoin("documents as d1","d1.ID", "drivers.image__doc")
        .where({
            "drivers.driver_id":driver_id,
            "drivers.user_id":user_id,
        })
        .first()
        .then(driver=>{
            if(driver){
                if(driver.image__doc){
                    driver.image__doc = helper.publicUrl(driver.image__doc,"driver",['thumb'])
                }
                
                callback(null,driver)
            }else{
                callback({code:"nodriver","message":"It seems you are trying to get non existing driver."});
            }
        }).catch(err=>{
            console.log(err)
        })
    },
    add:function(user_id,req,callback){
        async.waterfall([function(callback){
            module.exports.uploaddriverImage(user_id,{path:req.files.image.path},function(err,document_id){
                callback(null,document_id)
            })
        },function(document_id,callback){
            knex.transaction(function(trx,caches) {
                return trx
                .insert({
                    vendor_id : user_id,
                    name : req.body.name,
                    phone : req.body.phone,
                    image__doc:document_id,
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                    status:"active"
                }, 'ID')
                .into('drivers')
                .then(function(driver) {
                    ID = driver[0];
                    return ID;
                }).then(function(response){
                    trx.commit;
                    return ID;
                }).catch(function(err){
                    trx.rollback;
                    throw new Error(err.message);
                })
            }).then(function(ID) {
                callback(null,{driver_id:ID});
            })
            .catch(function(err){
                callback({code:"adddriver",message:err.message})
            })
        }],function(err,result){
            if(err){
                callback(err);
            }else{
                callback(null,result);
            }
        })
    },
    update:function(user_id,req,callback){
        async.waterfall([function(callback){
            if(req.files.image){
                module.exports.uploaddriverImage(user_id,{path:req.files.image.path},function(err,document_id){
                    callback(null,document_id)
                })
            }else{
                callback(null,null);
            }
            
        },function(document_id,callback){
            knex.transaction(function(trx,caches) {
                return trx.table("drivers")
                .where({
                    ID:req.body.ID,
                    user_id:user_id
                })
                .update({
                    vendor_id : user_id,
                    name : req.body.name,
                    phone : req.body.phone,
                    image__doc : document_id,
                    updated_at : moment().format('YYYY-MM-DD HH:mm:ss'),
                    status:"active"
                }, 'ID')
                .then(function(response){
                    trx.commit;
                    return;
                }).catch(function(err){
                    trx.rollback;
                    throw new Error(err.message);
                })
            }).then(function() {
                callback();
            })
            .catch(function(err){
                callback({code:"editdriver",message:err.message})
            })
        }],function(err,result){
            if(err){
                callback(err);
            }else{
                callback(null,result);
            }
        })
    },
    delete:function(user_id,driver_id,callback){
        knex.table("drivers")
        .where({ID:driver_id})
        .del()
        .then(function(response) {
            callback(response);
        })
        .catch(function(err){
            callback({code:"deletedriver",message:err.message})
        })
    },
    uploadDriverImage:function(user_id,pic,callback){
        return new Promise(async (resolve,reject)=>{
            try{
                /**
                 * validate driver image and upload
                 */
                var validation = await helper.validateUpload(pic);
                if(validation){
                    throw ({code:'ValidationError',field:"profile_pic","message":validation});
                }
                pic.uploadDir = "driver/";
                var path = await helper.doUpload(pic,['tiny','thumb']);
                /**
                 * @description : Add a document
                 */
                knex
                .transacting(trx)
                .insert({
                    user_id:user_id,
                    filepath:path,
                    type:'driver',
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }, 'ID')
                .into('documents')
                .then(function(ID) {
                    document_id = ID[0];
                    resolve();
                })
                .catch(function(err){
                    reject ({code:"updateProfilePic",message:err.message})
                })
            }catch(err){
                reject(err);
            }
        })
        async.waterfall([function(callback){
            /**
             * validate driver image and upload
             */
            helper.validateUpload(pic,function(err){
                pic.uploadDir = "driver/";
                if(err){
                    callback({code:'ValidationError',field:"image","message":err});
                }else{
                    helper.doUpload(pic,['thumb','medium'],function(err,path){
                        if(err){
                            callback({code:'Jimp',field:"image","message":err});
                        }else{
                            callback(null,path);
                        }
                    })
                }
            });
        },function(image,callback){
            
            knex.transaction(function(trx) {
                /**
                 * @description : Add a document
                 */
                return trx
                .insert({
                    user_id:user_id,
                    filepath:image,
                    type:'driver',
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }, 'ID')
                .into('documents')
                .then(function(ID) {
                    document_id = ID[0];
                    return document_id;
                })
                /**
                 * @description : Commit or rollback previous record
                 */
                .then(function(document_id){
                    trx.commit;
                    return document_id;
                })
                .catch(function(err){
                    trx.rollback;
                    throw new Error(err.message);
                });
            }).then(function(response) {
                callback(null,response);
            })
            .catch(function(err){
                callback({code:"uploaddriverImage",message:err.message})
            })
        }],function(err,result){
            if(err){
                callback(err);
            }else{
                callback(null,result)
            }
        })
        
    },
}