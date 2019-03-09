var account = require("./account");
module.exports = {
    welcomeEmail:async function(user_id){
        var user = await account.getUser(user_id);
        if(user.email){
            helper.sendEmail(user.email,"New account on Smart Drive","<p>Dear Customer,<br/>Thank you for registering with us.</p>");
        }
    }
}