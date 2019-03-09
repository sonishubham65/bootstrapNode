module.exports = function(config){
    return require('knex')({
        client: 'mysql2',
        connection: {
            host : config.database[config.env].host,
            user : config.database[config.env].user,
            password : config.database[config.env].password,
            database : config.database[config.env].db,
            timezone : config.database[config.env].timezone
        },
        //debug:true,
        pool: { min: 0, max: 7 },
        
    });
}

