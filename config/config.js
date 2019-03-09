module.exports = function(path){
    return {
        env:"development",//production
        baseUri:{
            development:"http://192.168.43.74:3001/",
            production:"http://192.168.43.74:3001/"
        },
        port:{
            development:3001,
            production:3001
        },
        database : {
            development:{
                db:"pick",
                host:"localhost",
                user:"root",
                password:"",
                timezone:'Asia/Calcutta', //same as mysql timezone
            },
            production:{
                db:"---",
                host:"---",
                user:"---",
                password:"---",
                timezone:'----', //same as mysql timezone
            },
        },
        admin:{
            ID:1
        },
        
        jwt:{
            expiresIn:60*60*30*10000,
            privateKey:"JWTEndive"
        },
        //uploadDir:"D:/nodejs/bootstrapNode/public/uploads/",
        uploadDir:__dirname+"/../public/uploads/",
        uploadSizes : {
            'tiny':[50,50],
            'thumb':[100,100],
            'cover':[300,150],
            'medium':[500,400],
            'large':[800,500]
        },
        referral:{
            customer:{
                isActive:1,
                referrer:{
                    isActive:1,
                    amount:10
                },
                referee:{
                    isActive:1,
                    amount:20
                },
            }
        },
        google:{
            maps:{
                key:"Az---"
            },
            firebase:{
                project:"",
                id:""
            }
        },
        mail:{
            host:'smtp.gmail.com',
            port:'465',
            user:'endivewebtest@gmail.com',
            pass:'P@ss@123'
        }
    }

}