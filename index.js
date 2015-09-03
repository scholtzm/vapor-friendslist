var FriendsListManager = require('./friendslistmanager.js');

exports.name = 'vapor-friendslist';

exports.plugin = function(VaporAPI) {
    var manager = new FriendsListManager();

    var steamFriends = VaporAPI.getHandler('steamFriends');
    var Steam = VaporAPI.getSteam();
    var config = (VaporAPI.data && VaporAPI.data.config) ? VaporAPI.data.config : {};
    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();

    var FRIENDSLIST_PATH = VaporAPI.getDataFolderPath() + '/friendslist.json';

    var limit = config.limit || 100;
    var welcomeMessage = config.welcomeMessage || undefined;
    var welcomeMessageDelay = config.welcomeMessageDelay || 3000;

    /**
     * Adds friend to friends list.
     *
     * Also removes friend if necessary.
     * @param {object} steamFriends Active SteamFriends handler.
     * @param {string} user         SteamID64.
     */
    function addFriend(steamFriends, user) {
        if(manager.count() === limit) {
            var removedUser = manager.getOldestAdded();

            if(removedUser === null) {
                log.warn('There\'s no one to be removed. Friend request from %s will be ignored.', user);
                return;
            }

            steamFriends.removeFriend(removedUser);
            manager.remove(removedUser);

            log.info('My friends list was full. %s has been removed.', utils.getUserDescription(removedUser));
            VaporAPI.emitEvent('friendRemoved', removedUser);
        }

        steamFriends.addFriend(user);
        manager.add(user);

        log.info('User %s has been added to my friends list.', user);
        VaporAPI.emitEvent('friendAccepted', user);

        if(welcomeMessage && typeof welcomeMessage === 'string') {
            setTimeout(function() {
                steamFriends.sendMessage(user, welcomeMessage);
            }, welcomeMessageDelay);
        }
    }


    /**
     * Main entry point
     */
    manager.load(FRIENDSLIST_PATH);

    // Handle 'friend' event
    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'friend'
        },
        function(user, type) {
            if(type === Steam.EFriendRelationship.RequestRecipient) {
                addFriend(steamFriends, user);
            } else if(type === Steam.EFriendRelationship.None) {
                manager.remove(user);
            }

            manager.save(FRIENDSLIST_PATH);
        }
    );

    // Handle 'relationships' event
    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'relationships'
        },
        function() {
            for(var user in steamFriends.friends) {
                if(steamFriends.friends[user] === Steam.EFriendRelationship.Friend) {
                    if(!(user in manager.friends)) {
                        manager.add(user);
                    }
                } else if(steamFriends.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
                    addFriend(steamFriends, user);
                }
            }

            // 'friendsList' may still contain dead entries
            for(var friend in manager.friends) {
                if(!(friend in steamFriends.friends[friend])) {
                    manager.remove(friend);
                }
            }

            manager.save(FRIENDSLIST_PATH);

            log.info('Friends list has been synchronized.');
        }
    );
};
