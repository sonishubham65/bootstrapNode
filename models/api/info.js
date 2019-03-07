module.exports = {
    list:async function(meta=[]){
        return new Promise((resolve, reject) => {
            knex('settings')
            .select("*")
            .whereIn('meta_key',meta)
            .then(info=>{
                resolve(info);
            }).catch(err=>{
                reject({code:'infoList','message':err.message,'isSQL':true});
            })
        })
    },
}