var config = require('./config.json');

module.exports = function(Vapor) {
    var client = Vapor.client;
    var Steam = Vapor.Steam;

    Vapor.extension.registerHandler('steam', 'friend', function(user, type) {
        if(type === Steam.EFriendRelationship.RequestRecipient) {
            client.addFriend(user);
            client.sendMessage(user, config.welcomeMessage);
        } else if(type === Steam.EFriendRelationship.None) {
            // don't do anything    
        }
    });

};
