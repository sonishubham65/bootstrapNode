var wallet = require("./wallet");
var admin = require("firebase-admin");
var serviceAccount = require("../../rkcl-61038-firebase-adminsdk-qjwur-54434440bd.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rkcl-61038.firebaseio.com"
});

module.exports = {
    decodeJwt:function(jwt){
        return new Promise((resolve,reject)=>{
            admin.auth().verifyIdToken(jwt)
            .then(function(decodedToken) {
                var data = {
                    provider : decodedToken.firebase.sign_in_provider,
                    uid : decodedToken.uid,
                    
                }


                if(typeof decodedToken.email !='undefined'){
                    data.email = decodedToken.email;
                    data.email_verified = decodedToken.email_verified;
                }
                if(typeof decodedToken.picture !='undefined'){
                    data.picture = decodedToken.picture;
                }
                if(typeof decodedToken.phone_number !='undefined'){
                    data.phone_number = decodedToken.phone_number;
                }
                if(typeof decodedToken.name !='undefined'){
                    data.name = decodedToken.name;
                }
                resolve(data)
            }).catch(function(error) {
                switch(error.code){
                    case 'auth/id-token-expired':{
                        reject({code:"JWTExpire",message:"JWT token has expired."})
                    }break;
                }
                reject({code:error.code,message:error.message})
            });
        })
        
    },
    addUser:async function(trx,jwt,type,referrer){
        return new Promise((resolve,reject)=>{
            const shortid = require('shortid');
            var ID;
            /**
             * @description : Add a user with common required fields
             */
            var user = {
                referrer:referrer,
                firstname : jwt.name,
                email : jwt.email,
                type : type,
                phone : jwt.phone,
                email_verified : jwt.email_verified?"yes":"no",
                referral:shortid.generate(),
                created_at : moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at : moment().format('YYYY-MM-DD HH:mm:ss'),
                status:'active'
            };
            /**
             * @description : Make status as active and inactive as per user type
             */
            switch(type){
                case 'driver':{
                    user.status = "inactive"
                }break;
            }
            knex
            .insert(user, 'id')
            .into('users')
            .transacting(trx)
            .then(async function(user) {
                ID = user[0];
                /**
                 * @description : Check user type and create respective record.
                 */
                switch(type){
                    case 'driver':{
                        return knex
                        .transacting(trx)
                        .insert({
                            user_id:ID,
                            is_verified:"no",
                        }).into('drivers')
                        .then(id=>{
                            return;
                        }).catch(err=>{
                            reject ({code:'driverInsert',message:err.message,isSQL:true})
                        })
                    }break;
                    case 'vendor':{
                        return knex
                        .transacting(trx)
                        .insert({
                            user_id:ID
                        }).into('vendors')
                        .then(id=>{
                            return;
                        }).catch(err=>{
                            reject ({code:'vendorInsert',message:err.message,isSQL:true})
                        })
                    }break;
                }
                return;
                
            })
            .then(function(){
                return knex.transacting(trx).insert({
                    user_id : ID,
                    provider : jwt.provider,
                    uid	: jwt.uid
                }).into('firebase');            
            }).then(function(){
                /**
                 * @description : Create a wallet and update balance as zero.
                 */
                return knex.transacting(trx).insert({
                    user_id:ID,
                    balance:0,
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }).into('wallets');       
            }).then(function(){
                /**
                 * @description : Set referrer amount and referee amount
                 */
                var referral = config.referral[type];
                if(typeof referral !='undefined' && referral.isActive){
                    var transactions = [];
                    var debitAmount = 0;
                    if(referral.referrer.isActive){
                        debitAmount += referral.referrer.amount;
                        transactions.push({
                            wallet_id:(knex.raw(`(select ID from wallets where user_id = ?)`,[referrer])),
                            amount:referral.referrer.amount,
                            type:"credit",
                            description:"referrer amount",
                            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                        })
                    }
                    if(referral.referee.isActive){
                        debitAmount += referral.referee.amount;
                        transactions.push({
                            wallet_id:(knex.raw(`(select ID from wallets where user_id = ?)`,[ID])),
                            amount:referral.referee.amount,
                            type:"credit",
                            description:"referee amount",
                            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                        })
                    }
                    if(debitAmount){
                        transactions.push({
                            wallet_id:(knex.raw(`(select ID from wallets where user_id = ?)`,[config.admin.ID])),
                            amount:debitAmount,
                            type:"debit",
                            description:"Referral amount",
                            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                        })
                    }
                    return knex.batchInsert('wallet_transactions', transactions).transacting(trx);
                }else{
                    return;
                }
            })
            /**update balance */
            .then(async function(){
                await wallet.updateBalance(trx,ID,function(err){})
                await wallet.updateBalance(trx,referrer,function(err){})
                await wallet.updateBalance(trx,config.admin.ID,function(err){})
                resolve(ID);
            })
            .catch(function(err){
                reject ({code:"addUser",message:err.message})
            });
        })
    },
    editUser:function(trx,user_id,req){
        return new Promise((resolve,reject)=>{
            knex('users')
            .where({
                ID:user_id
            })
            .update({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                city : req.body.city,
                address : req.body.address,
                country_id : req.body.country_id
            }).then(response=>{
                resolve();
            }).catch(err=>{
                reject({code:"editUser",message:err.message,isSQL:true});
            })
        })
        
    },
    getUser:function(user_id){
        return new Promise((resolve,reject)=>{
            knex('users')
            .select(["users.ID","firstname","lastname","email","phone","email_verified","city","address","referral","users.type","rating","users.created_at","users.updated_at","users.status"])
            .select(["countries.name as country","countrycode"])
            .select("d1.filepath as profile_pic__doc")
            .leftJoin("countries","countries.ID", "users.country_id")
            .leftJoin("documents as d1","d1.ID", "users.profile_pic__doc")
            .where({"users.ID":user_id})
            .first()
            .then(function(user){
                if(user){
                    resolve(user)
                    
                }else{
                    reject({code:"nouser",message:"No user found."})    
                }
            }).catch(err=>{
                reject ({code:"getUser",message:err.message,isSQL:true});
            })
        })
        
    },
    getUserByEmail:function(email,type){

    },
    getUserByPhone:function(phone,type){
        return new Promise((resolve,reject)=>{
            knex('users')
            .select(["ID"])
            .where({"phone":phone,"type":type})
            .first()
            .then(function(user){
                if(user){
                    resolve(user.ID);
                }else{
                    resolve();
                }
            }).catch(err=>{
                reject({code:"getUserByPhone",message:err.message});
            })
        })
        
    },
    getUserByUID : function(jwt,type){
        return new Promise((resolve,reject)=>{
            knex('firebase')
            .select(["ID"])
            .innerJoin("users","users.ID", "firebase.user_id")
            .where({"uid":jwt.uid,"type":type}) //"provider":jwt.provider
            .first()
            .then(function(user){
                if(user){
                    resolve(user.ID);
                }else{
                    resolve(null);
                }
            }).catch(err=>{
                reject({code:"getUserByUID",message:err.message});
            })
        })
        
    },
    
    getUserByCode:function(code){
        return new Promise((resolve,reject)=>{
            knex('users')
            .select(["ID"])
            .where({"referral":code})
            .first()
            .then(function(user){
                if(user){
                    resolve(user.ID);
                }else{
                    resolve(null);
                }
            }).catch(err=>{
                reject ({code:"getUserByCode",message:err.message});
            })
        })
        
    },
    getUserByToken:function(token){

    },
    getProfile:async function(user_id){
        console.log("getting profile..")
        return new Promise(async (resolve,reject)=>{
            try{
                var user = await module.exports.getUser(user_id)
                switch(user.status){
                    case 'active':{
                        if(user.profile_pic__doc){
                            user.profile_pic__doc = helper.publicUrl(user.profile_pic__doc,"profile",['tiny','thumb','cover','medium','large'])
                        }
                    }break;
                    case 'inactive':{
                        reject({code:"inactiveUser",message:"User is inactive, Kindly contact to support."})  
                    }break;
                    
                    case 'discard':{
                        reject({code:"discardUser",message:"User is discared by admin."})  
                    }break;
                    
                }
                
                /**
                 * @description: Get driver
                 */
                
                switch(user.type){
                    case 'driver':{
                        /**
                         * @description: Get driver
                         */
                        user.driver = await module.exports.getDriver(user.ID);
                    }break;
                    case 'vendor':{
                        /**
                         * @description: Get vendor
                         */
                        
                        user.vendor = await module.exports.getVendor(user.ID)
                    }break;
                }
                
                resolve(user);
            }catch(err){
                reject(err)
            }
            
        })
        
    },
    updateProfilePic:function(trx,user_id,pic){
        return new Promise(async (resolve,reject)=>{
            try{
                /**
                 * validate profile image and upload
                 */
                var validation = await helper.validateUpload(pic,{
                    minSize:[100,100],
                    maxSize:[2000,1500],
                    format:['jpg','jpeg','png','gif','bmp','heic','heif'],
                    message:'Profile pic must be in correct format and allowed dimensions under 100*100 - 2000*1500.'
                });
                if(validation){
                    throw ({code:'ValidationError',field:"profile_pic","message":validation});
                }
                pic.uploadDir = "profile/";
                var path = await helper.doUpload(pic,['tiny','thumb','cover','medium','large']);
                console.log(path)
                /**
                 * @description : Add a document
                 */
                knex
                .transacting(trx)
                .insert({
                    user_id:user_id,
                    filepath:path,
                    type:'profile_pic',
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }, 'ID')
                .into('documents')
                .then(function(ID) {
                    document_id = ID[0];
                    /**
                     * @description : update profile_pic__doc of a user
                     */
                    
                    return knex.transacting(trx).table("users").update({
                        profile_pic__doc:document_id,
                        updated_at:moment().format('YYYY-MM-DD HH:mm:ss')
                    }).where({'ID':user_id})
                    .then(id=>{
                        resolve();
                    })
                })
                .catch(function(err){
                    reject({code:"updateProfilePic",message:err.message})
                })
            }catch(err){
                reject(err);
            }
        })
    },
    verifyPassword:function(user_id,password){
        return new Promise((resolve,reject)=>{
            knex('users')
            .select(['ID'])
            .where({
                password : password?md5(password):"",
                ID : user_id
            })
            .first()
            .then(response=>{
                if(response){
                    resolve(1)
                }else{
                    resolve(null)
                }
                
            }).catch(err=>{
                reject({code:"verifyPassword",message:err.message});
            })
        })
        
    },
    updatePassword:function(trx,user_id,password){
        return new Promise((resolve,reject)=>{
            knex('users')
            .where({
                ID : user_id
            })
            .update({
                password : md5(password)
            }).then(response=>{
                resolve()
            }).catch(err=>{
                reject({code:"updatePassword",message:err.message});
            })
        })
        
    },
    upsertDevice:function(trx,user_id,type,token){
        return new Promise((resolve,reject)=>{
            if(type && token){
                
                var time = moment().format('YYYY-MM-DD HH:mm:ss');
                knex.raw("INSERT INTO `user_devices` (user_id,type,token,created_at) values (?,?,?,?) on DUPLICATE KEY update token=VALUES(token),type=VALUES(type),created_at=VALUES(created_at)",[user_id,type,token,time,])
                .transacting(trx)
                .then(response=>{
                    resolve()
                }).catch(err=>{
                    reject({code:"upsertDevice",message:err.message,isSQL:true})
                })
            }else{
                resolve();
            }     
        }) 
    },
    removeDevice:function(trx,user_id,type,token){
        
        return new Promise((resolve,reject)=>{
            
            if(type && token){
                var time = moment().format('YYYY-MM-DD HH:mm:ss');
                knex.raw("delete from `user_devices` where user_id=? && type=? && token =?",[user_id,type,token])
                .transacting(trx)
                .then(response=>{
                    resolve()
                }).catch(err=>{
                    reject({code:"removeDevice",message:err.message,isSQL:true})
                })
            }else{
                resolve();
            }      
        })
        
    },
    loginWithPhone:function(phone,password){
        return new Promise((resolve,reject)=>{
            if(phone && password){
                knex('users')
                .select(['ID'])
                .where({
                    password : md5(password),
                    phone : phone
                })
                .first()
                .then(response=>{
                    if(response){
                        resolve(response.ID)
                    }else{
                        resolve(false)
                    }
                    
                }).catch(err=>{
                    reject({code:"loginWithPhone",message:err.message});
                })    
            }else{
                reject({code:"loginWithPhone",message:"Phone and password are required."});
            }
        })
        
    },
    loginWithEmail:function(email,password){
        return new Promise((resolve,reject)=>{
            if(email && password){
                knex('users')
                .select(['ID'])
                .where({
                    email : email,
                    password : md5(password)
                })
                .first()
                .then(response=>{
                    if(response){
                        resolve(response.ID)
                    }else{
                        resolve(false)
                    }
                    
                }).catch(err=>{
                    reject({code:"loginWithPhone",message:err.message});
                })    
            }else{
                reject({code:"loginWithPhone",message:"Email and password are required."});
            }
        })
    },
    //Extras
    updateResidence:function(user_id,pic){
        async.waterfall([function(callback){
            /**
             * validate Residence image and upload
             */
            helper.validateUpload(pic,function(err){
                pic.uploadDir = "residence/";
                if(err){
                    callback({code:'ValidationError',field:"residence","message":err});
                }else{
                    helper.doUpload(pic,['thumb'],function(err,path){
                        if(err){
                            callback({code:'Jimp',field:"residence","message":err});
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
                    type:'residence',
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }, 'ID')
                .into('documents')
                .then(function(ID) {
                    document_id = ID[0];
                    /**
                     * @description : update residence__doc of a user
                     */
                    
                    return trx.table("drivers").update({
                        residence__doc:document_id,
                        is_verified:"no",
                    }).where({'user_id':user_id})
                    .then(id=>{
                        return 1;
                    })
                })
                .then(function(response){
                    return response;
                })
                .catch(function(err){
                    reject ({code:"driverUpdate","message":err.message});
                });
            }).then(function(response) {
                callback();
            })
            .catch(function(err){
                callback({code:"updateResidence",message:err.message})
            })
        }],function(err){
            if(err){
                callback(err);
            }else{
                callback()
            }
        })
        
    },
    updateLicense:function(user_id,pic){
        async.waterfall([function(callback){
            /**
             * validate license image and upload
             */
            helper.validateUpload(pic,function(err){
                pic.uploadDir = "license/";
                if(err){
                    callback({code:'ValidationError',field:"license","message":err});
                }else{
                    helper.doUpload(pic,['thumb'],function(err,path){
                        if(err){
                            callback({code:'Jimp',field:"license","message":err});
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
                    type:'license',
                    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
                }, 'ID')
                .into('documents')
                .then(function(ID) {
                    document_id = ID[0];
                    /**
                     * @description : update license__doc of a user
                     */
                    
                    return trx.table("drivers").update({
                        license__doc:document_id,
                        is_verified:"no",
                    }).where({'user_id':user_id})
                    .then(id=>{
                        return 1;
                    })
                })
            }).then(function(response) {
                resolve();
            })
            .catch(function(err){
                reject({code:"updateLicense",message:err.message})
            })
        }],function(err){
            if(err){
                callback(err);
            }else{
                callback()
            }
        })
        
    }, 
    updatePhone:function(trx,user_id,jwt){
        return new Promise((resolve,reject)=>{
            /**
             * @description : Add firebase for phone
             */
            var time = moment().format('YYYY-MM-DD HH:mm:ss');
            return knex
            .raw("INSERT INTO `firebase` (user_id,provider,uid,created_at,updated_at) values (?,?,?,?,?) on DUPLICATE KEY update uid=VALUES(uid),provider=VALUES(provider),updated_at=VALUES(updated_at)",[user_id,jwt.provider,jwt.uid,time,time])
            .transacting(trx)
            .then(function(response) {
                return 1;
            })
            .then(function(response){
                return trx.table("users")
                .transacting(trx)
                .update({
                    phone : jwt.phone_number,
                    updated_at:moment().format('YYYY-MM-DD HH:mm:ss')
                }).where({'ID':user_id})
                .then(id=>{
                    return 1;
                })
            })
            .then(function(response){
                resolve();
            })
            .catch(function(err){
                reject({code:'updatePhone',message:err.message,isSQL:true});
            });
        
        })
        
    },
    updateEmail:function(trx,user_id,jwt){
        return new Promise((resolve,reject)=>{
            /**
             * @description : Add firebase for email
             */
            var time = moment().format('YYYY-MM-DD HH:mm:ss');
            return knex
            .raw("INSERT INTO `firebase` (user_id,provider,uid,created_at,updated_at) values (?,?,?,?,?) on DUPLICATE KEY update uid=VALUES(uid),provider=VALUES(provider),updated_at=VALUES(updated_at)",[user_id,jwt.provider,jwt.uid,time,time])
            .transacting(trx)
            .then(function(response) {
                return 1;
            })
            .then(function(response){
                return knex.table("users")
                .transacting(trx)
                .update({
                    email : jwt.email,
                    email_verified:jwt.email_verified?"yes":"no",
                    updated_at:moment().format('YYYY-MM-DD HH:mm:ss')
                }).where({'ID':user_id})
                .then(id=>{
                    return 1;
                })
             })
            .then(function(response){
                resolve(1);
            })
            .catch(function(err){
                reject ({code:"updateEmail",message:err.message,isSQL:true});
            });
        })
            
    },


    getDriver:async function(user_id){
        return new Promise((resolve,reject)=>{
            knex('drivers')
            .select(["drivers.is_verified","license_number"])
            .select("d1.filepath as license__doc")
            .select("d2.filepath as residence__doc")
            .leftJoin("documents as d1","d1.ID", "drivers.license__doc")
            .leftJoin("documents as d2","d2.ID", "drivers.residence__doc")
            .where({"drivers.user_id":user_id})
            .first()
            .then(function(driver){
                
                if(driver.residence__doc){
                    driver.residence__doc = helper.publicUrl(driver.residence__doc,"residence",['thumb'])
                }
                if(driver.license__doc){
                    driver.license__doc = helper.publicUrl(driver.license__doc,"license",['thumb'])
                }
                resolve(driver)
            }).catch(err=>{
                
                reject({code:"getDriver",message:err.message});    
            })           
        })
        
    },
    getVendor:function(user_id){
        return new Promise((resolve,reject)=>{
            knex('vendors')
            .select(["name","opening","closing","address","latitude","longitude","is_verified","is_closed","gstin"])
            .where({"vendors.user_id":user_id})
            .first()
            .then(function(restaurant){
                resolve(restaurant)
            }).catch(err=>{
                reject({code:"getVendor",message:err.message});    
            })       
        })
        
    },
    editDriver:function(trx,user_id,req){
        return new Promise((resolve,reject)=>{
            knex('drivers')
            .where({
                user_id:user_id
            })
            .update({
                license_number : req.body.license_number,
                is_verified:"no",
            }).then(response=>{
                resolve();
            }).catch(err=>{
                reject({code:"editDriver",message:err.message});
            })
        })
    },
    editVendor:function(trx,user_id,req){
        return new Promise((resolve,reject)=>{
            knex('vendors')
            .where({
                user_id:user_id
            })
            .update({
                name:req.body.name,
                address:req.body.address,
                latitude:req.body.latitude,
                longitude:req.body.longitude,
                opening:moment(moment(req.body.opening,"mm:ss")).format("mm:ss"),
                closing:moment(moment(req.body.closing,"mm:ss")).format("mm:ss"),
                gstin:req.body.gstin
            }).then(response=>{
                resolve();
            }).catch(err=>{
                reject({code:"editVendor",message:err.message});
            })
        })
        
    },
}