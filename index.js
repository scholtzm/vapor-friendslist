var fs = require('fs');
var FriendsListManager = require('./friendslistmanager.js');

/**
 * Exported function.
 * @param  {object} VaporAPI VaporAPI instance.
 */
module.exports = function(VaporAPI) {
    var manager = new FriendsListManager();

    var client = VaporAPI.getClient();
    var Steam = VaporAPI.getSteam();
    var config = VaporAPI.getConfig();
    var log = VaporAPI.getLogger();

    var FRIENDSLIST_PATH = VaporAPI.getDataFolderPath() + '/friendslist.json';

    var limit = config.limit || 100;
    var welcomeMessage = config.welcomeMessage || undefined;

    /**
     * Adds friend to friends list.
     *
     * Also removes friend if necessary.
     * @param {object} client Active Steam client.
     * @param {string} user   SteamID64.
     */
    function addFriend(client, user) {
        if(manager.count() === limit) {
            var removedUser = manager.getOldestAdded();
            client.removeFriend(removedUser);
            manager.remove(removedUser);

            log.info("My friends list was full. " + client.users[removedUser].playerName + " (" + removedUser + ") has been removed.");
        }

        client.addFriend(user);
        manager.add(user);

        log.info("User " + user + " has been added to my friends list.");

        if(welcomeMessage && typeof welcomeMessage === 'string') {
            client.sendMessage(user, config.welcomeMessage);
        }
    }


    /**
     * Main entry point
     */
    manager.load(FRIENDSLIST_PATH);

    // Handle 'friend' event
    VaporAPI.registerHandler({
            emitter: 'steam',
            event: 'friend'
        },
        function(user, type) {
            if(type === Steam.EFriendRelationship.RequestRecipient) {
                addFriend(client, user);
            } else if(type === Steam.EFriendRelationship.None) {
                manager.remove(user);
            }

            manager.save(FRIENDSLIST_PATH);
        }
    );

    // Handle 'relationships' event
    VaporAPI.registerHandler({
            emitter: 'steam',
            event: 'relationships'
        },
        function() {
            for(var user in client.friends) {
                if(client.friends[user] === Steam.EFriendRelationship.Friend) {
                    if(!manager.friends.hasOwnProperty(user)) {
                        manager.add(user);
                    }
                } else if(client.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
                    addFriend(client, user);
                }
            }

            // 'friendsList' may still contain dead entries
            for(var friend in manager.friends) {
                if(client.friends[friend] === undefined) {
                    manager.remove(friend);
                }
            }

            manager.save(FRIENDSLIST_PATH);

            log.info("Friends list has been synchronized.");
        }
    );
};
