var info = require("../../models/api/info");
module.exports = {
    get:async function(req,res,next){
        try{
            var data = await info.list(['contact_address','contact_email','contact_phone'])
            helper.transformer(req,res,null,data);
        }catch(err){
            helper.transformer(req,res,err);
        }
    }
}