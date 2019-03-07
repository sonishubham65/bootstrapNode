var account = require("./account");
module.exports = {
    welcomeEmail:async function(user_id){
        var user = await account.getUser(user_id);
        helper.sendEmail(user.email,subject,message);
    }
}