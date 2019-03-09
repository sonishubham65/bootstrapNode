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
        var timezone = config.database[config.env].timezone;
        if(to){
            date = moment.tz(date,timezone).tz(to);
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
                    code : 'systemFailure',
                    message : err.message,
                }
            }
            if(typeof err.isSQL=='boolean' && config.env=='production'){
                err.message = "We are working on it, Hope we will resolve it shortly.";
            }
            if(typeof err.message=='undefined'){
                err.message = "Unknown response, We are working on it, Hope we will resolve it shortly.";
            }
            res.status(200).json({success:0,status:"error",data:err})
        }else{
            res.status(200).json({success:1,status:"success",data:result})
        }
    },
    jwt:function(data){
        return new Promise((resolve,reject)=>{
            try{
                data.iat = Math.floor(Date.now() / 1000) - 30;
                var token = jwt.sign(data, config.jwt.privateKey,{ expiresIn: config.jwt.expiresIn }, function(err, token) {
                    if(err){
                        reject({code:"jwtValidation",message:err})
                    }else{
                        resolve(token)
                    }
                    
                });;
            }catch(err){
                reject({code:"jwtValidation",message:err.message})
            }
        })
    },
    jwtVerify:function(access_token){
        return new Promise((resolve,reject)=>{
            try{
                var token = jwt.verify(access_token, config.jwt.privateKey, function(err, data) {
                    if(err){
                        reject({code:'unauth',message:err.message});
                    }else{
                        resolve(data);
                    }
                });
            }catch(err){
                reject({code:'unauth',message:err.message});
            }
        })
    },
    randDir:function(data){
        return config.uploadDir+data+"{{type}}/"+Date.now()+uniqid();
    },
    uploadDir:function(path,type){
        return path.replace("{{type}}",type)
    },
    doUpload:function(pic,sizes){
        return new Promise((resolve,reject)=>{
            /**
             * Upload an image
             */
            Jimp.read(pic.path, (err, lenna) => {
                if(err){
                    reject(err);
                }else{
                    var uploadDir = module.exports.randDir(pic.uploadDir)+"."+lenna.getExtension(); 
                    lenna.write(helper.uploadDir(uploadDir,''));

                    /**
                     * Resize pic in given sizes tiny,thumb,cover,medium,large
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
                                        .cover(size[0], size[1])
                                        .quality(100)
                                        .background(Jimp.rgbaToInt(255,255,255,1))
                                        .write(helper.uploadDir(uploadDir,value));
                                        console.log('--->',size)
                                        next();
                                    }
                                });
                            }
                            
                        
                        },function(err){
                            if(err){
                                reject(err);
                            }else{
                                var filename = uploadDir.split("/").pop(-1)
                                resolve(filename);
                            }
                            
                        })
                    }
                }
            });
            
        })
        
    },
    validateUpload:function(pic,option={}){
        var temp = {
            minSize:[100,100],
            maxSize:[2000,1500],
            format:['jpg','jpeg','png','gif','bmp','heic','heif'],
            message:'Image must be in correct format and allowed dimensions under 100*100 - 2000*1500.'
        };
        return new Promise((resolve,reject)=>{
            try{
                var keys = Object.keys(temp);
                for(i=0;i<keys.length;i++){
                    var key = keys[i];
                    if(typeof option[key] =='undefined'){
                        option[key] = temp[key] ;
                    }
                }
                
                const schema = Joi.image()
                .minDimensions(option.minSize[0], option.minSize[1])
                .maxDimensions(option.maxSize[0],option.maxSize[1])
                .allowTypes(option.format)
                .error(()=>option.message);
                
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
                                resolve(err.details[0].message);
                            }else{
                                resolve();
                            }
                                
                        })
                    }catch(err){
                        resolve(err.message);
                    }
                }))
            }catch(err){
                console.log(err)
                resolve(err);
            }
            
        })
        
    },
    publicUrl:function(path,folder,sizes=[]){
        try{
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
            
        }catch(err){
            throw err;
        }
        
    },
    sendSMS:function(countryCode,Phone,sms){
        console.error("SMS SENT",sms);
    },
    sendEmail:async function(to,subject,message,from="VScode <info@vscode.com>",attachment){
        try{
            var format = `
            <div style="width:100%; background:#eee;font-family: inherit;font-size: 14px;">
            <div style="width:600px; padding:15px 0 30px 0;margin:15px auto;">
                <div style="width:100%;">
                    <strong style="font-size:19px"><img style="height: 26px; margin:15px 0" src="`+config.baseUri[config.env]+`images/logo.png"/></strong>
                </div>
                <div style="width: 100%;background: #fff;padding: 24px;font-family: sans-serif;letter-spacing: 0.3px;">
                    <div style="width:100%;">
                        `+message+`
                    </div>
                    <div style="width:100%">
                    <p>If you have any feedback for VScode or about your ordering experience, we’d love to hear from you – simply reply to this email and we’ll be in touch.</p>
                    </div>
                    <div style="width:100%;">
                        <p>Please do not share your VScode password, Paytm passcode, OTP, Credit/Debit card number and CVV or any other confidential information with anyone even if he/she claims to be from Paytm. We advise our customers to completely ignore such communications.</p>
                    </div>
                </div>
            </div>
            </div>
            `;
            let mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: message,
                html: format
            };
            var info = await transporter.sendMail(mailOptions)
        }catch(err){
            console.log(err.message);
        }
        
    },

}