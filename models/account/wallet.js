module.exports = {
    updateBalance:function(trx,user_id,callback){
        return new Promise((resolve,reject)=>{
            knex('wallets')
            .transacting(trx)
            .where({
                user_id:user_id
            })
            .innerJoin(knex.raw(`(select sum(CASE WHEN type='credit' then amount ELSE -1*amount END) amount,wallet_id from wallets INNER JOIN wallet_transactions wtx on wtx.wallet_id = wallets.ID where wallets.user_Id=?) as wtx`,[user_id]),"wtx.wallet_id", "wallets.ID")
            .update({
                balance : knex.raw(`??`,[`amount`]),
            }).then(response=>{
                resolve(response)
            }).catch(err=>{
                reject(err)
            })
        })
    },
}