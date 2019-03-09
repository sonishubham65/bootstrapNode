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
const Sequelize = require('sequelize');
const sequelize = new Sequelize('pick', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


const User = sequelize.define('users', {
    ID : {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    }
},{
    timestamps:false
});
const Vendor = sequelize.define('vendors', {
    vendor_id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    user_id : {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING
    },
    gstin: {
        type: Sequelize.STRING
    }
},{
    timestamps:false
});

User.hasOne(Vendor,{ foreignKey: 'user_id', as : 'vendor' })

const Device = sequelize.define('user_devices', {
    ID:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    user_id : {
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.STRING
    }    
},{
    timestamps:false
});
User.hasMany(Device,{ foreignKey: 'user_id', as : 'device' })


const Country = sequelize.define('countries', {
    ID:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM,
        values:['active','inactive']
    }    
},{
    timestamps:false
});
User.belongsTo(Country,{ foreignKey: 'country_id', as : 'country' });


const Hobby = sequelize.define('hobbies', {
    ID:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    }
},{
    timestamps:false
});

const UserHobby = sequelize.define('user_hobbies', {
    user_id:{
        type: Sequelize.INTEGER
    },
    hobby_id: {
        type: Sequelize.INTEGER
    }
},{
    timestamps:false
});
User.belongsToMany(Hobby,{ through:UserHobby,foreignKey: 'user_id',otherKey:'hobby_id', as : 'hobby' });
User.findOne({
    include:[{
        association:'vendor',
        where:{
            gstin:'GSTIN12346'
        }
    },{
        association:'device',
        where:{
            type:'iOS'
        }
    },{
        association:'country',
        where:{
            status:'active'
        }
    },{
        association:'hobby',
    }],
    where: {
        ID: 12
    }
}).then(users => {
    console.log(JSON.parse(JSON.stringify(users)));
})
