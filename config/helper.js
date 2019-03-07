// knex.transaction(async function(trx){
//     return await new Promise(async (resolve,reject)=>{
//         try{
//             trx.commit()
//                 helper.transformer(req,res,null,{profile:user});
//             
//         }catch(err){
//             trx.rollback();
//             helper.transformer(req,res,err);
//         }                  
//     })
// })



// try{
//     await module.exports.validate.index(req);
//      helper.transformer(req,res,null,{profile:user});
    
// }catch(err){
//     helper.transformer(req,res,err);   
// }
var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.mail.user,
      pass: config.mail.pass // generated ethereal password
    }
  });
module.exports = {
    tz:function(date,to){
        if(to){
            date = moment.tz(date,config.timezone).tz(to);
        }else{
            date = moment(date);
        }
        
        return {
            dateTime : date.format("YYYY-MM-DD HH:mm:ss"),
            human : date.format("ddd DD MMM YY hh:mm a"),
            date : date.format("YYYY-MM-DD"),
            time : date.format("HH:mm:ss"),
        }
    },
    transformer:function(req,res,err,result){
        if(err){
            
            if(typeof err.code =='undefined'){
                var err = {
                    code : 'unknown',
                    message : err.message,
                }
            }
            if(typeof err.isSQL=='boolean' && config.env=='production'){
                err.message = "We are working on it, Hope we will resolve it shortly.";
            }
            res.status(200).json({success:0,status:"error",data:err})
        }else{
            res.status(200).json({success:1,status:"success",data:result})
        }
    },
    jwt:function(data){
        return new Promise((resolve,reject)=>{
            data.iat = Math.floor(Date.now() / 1000) - 30;
            var token = jwt.sign(data, config.jwt.privateKey,{ expiresIn: config.jwt.expiresIn }, function(err, token) {
                if(err){
                    reject({code:"jwtValidation",message:err})
                }else{
                    resolve(token)
                }
                
            });;
        })
        
    },
    jwtVerify:function(access_token,callback){
        return new Promise((resolve,reject)=>{
            var token = jwt.verify(access_token, config.jwt.privateKey, function(err, data) {
                if(err){
                    reject({code:'unauth',message:err.message});
                }else{
                    resolve(data);
                }
            });
        })
        
    },
    randDir:function(data){
        return config.uploadDir+data+"{{type}}/"+Date.now()+uniqid();
    },
    uploadDir:function(path,type){
        return path.replace("{{type}}",type)
    },
    doUpload:function(pic,sizes,callback){
        /**
         * Upload an image
         */
        
        Jimp.read(pic.path, (err, lenna) => {
            if(err){
                callback(err);
            }else{
                var uploadDir = module.exports.randDir(pic.uploadDir)+"."+lenna.getExtension(); 
                lenna.write(helper.uploadDir(uploadDir,''))

                /**
                 * Resize pic in given sizes thumb, medium, medium
                 */
                if(sizes){
                    var uploadSizes = config.uploadSizes;
                    async.forEachOf(sizes,function(value,key,next){
                        if(typeof uploadSizes[value] !='undefined'){
                            var size = uploadSizes[value];
                            Jimp.read(pic.path, (err, lenna) => {
                                if(err){
                                    callback(err);
                                }else{
                                    lenna
                                    .contain(size[0], size[1])
                                    .quality(100)
                                    .background(Jimp.rgbaToInt(255,255,255,1))
                                    .write(helper.uploadDir(uploadDir,value));
                                    next();
                                }
                            });
                        }
                        
                    
                    },function(err){
                        if(err){
                            console.log(err);
                        }
                        
                    })
                }

                var filename = uploadDir.split("/").pop(-1)
                callback(null,filename);
            }
        });
        
    },
    validateUpload:function(pic,callback){
        const schema = Joi.image()
        .minDimensions(100, 100)
        .maxDimensions(2000,2000)
        .allowTypes(['jpg','jpeg','png','gif','bmp','heic','heif'])
        .error(()=>"Profile pic must be in correct format and dimensions.");
        
        var parse = urlUtil.parse(pic.path,true ,true)
        
        switch(parse.protocol){
            case 'http:':
            case 'https:':{
                file = request(pic.path,function(res){
                    return res;
                })
                
            }break;
            default:{
                file = fs
                .createReadStream(pic.path)
            }
        }
        file.pipe(concat(image=>{
            try{
                Joi.validate(image, schema, (err, value) => {
                    if(err){
                        callback(err.details[0].message);
                    }else{
                        callback();
                    }
                        
                })
            }catch(err){
                callback(err.message);
            }
        }))
    },
    publicUrl:function(path,folder,sizes=[]){
        if(config.uploadSizes){
            var sets = {};
            if(sizes){
                sizes.forEach(function(value, key) {
                    sets[value] = config.baseUri[config.env]+folder+"/"+value+"/"+path;
                })
            }
            
            sets['default'] = config.baseUri[config.env]+folder+"/"+path;
            return sets;
        }else{
            return {};
        }
        
    },
    sendSMS:function(countryCode,Phone,sms){
        console.error("SMS SENT",sms);
    },
    sendEmail:async function(to,subject,message,from="Uber Eats <info@uber.com>",attachment){
        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: message,
            html: message
        };
        var info = await transporter.sendMail(mailOptions)
    },

}