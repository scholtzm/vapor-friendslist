var config = require('./config.json');

module.exports = function(Vapor) {
    var client = Vapor.client;

    Vapor.extension.addHandler('steam', 'friend', function(user, type) {
        if(type === Steam.EFriendRelationship.PendingInvitee) {
            client.addFriend(user);
            client.sendMessage(user, config.welcomeMessage);
        } else if(type === Steam.EFriendRelationship.None) {
            // don't do anything    
        }
    });

};
