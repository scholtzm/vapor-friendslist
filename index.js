var fs = require('fs');

/**
 * Exported function.
 * @param  {object} VaporAPI VaporAPI instance.
 */
module.exports = function(VaporAPI) {
    var client = VaporAPI.getClient();
    var Steam = VaporAPI.getSteam();
    var config = VaporAPI.getConfig();

    var friendsList = {};
    var FRIENDSLIST_PATH = VaporAPI.getDataFolderPath() + '/friendslist.json';


    if(config === undefined)
        throw new Error('Missing config options.');


    function loadFriendsList(path) {
        if(fs.existsSync(path))
            return JSON.parse(fs.readFileSync(path));

        return {};
    }


    function saveFriendsList(path, friendsList) {
        fs.writeFileSync(path, JSON.stringify(friendsList));
    }


    function getOldestActive(friendsList) {
        var id;
        var lowest = Number.MAX_VALUE;

        for(var steamID in friendsList) {
            if(friendsList[steamID] < lowest) {
                lowest = friendsList[steamID];
                id = steamID;
            }
        }

        return steamID;
    }


    function addToFriendsList(friendsList, steamID) {
        friendsList[steamID] = getTimeStamp();
    }


    function removeFromFriendsList(friendsList, steamID) {
        delete friendsList[steamID];
    }


    function countFriendsList(friendsList) {
        return Object.keys(friendsList).length;
    }


    function addFriend(client, user, friendsList) {
        if(countFriendsList(friendsList) === config.limit) {
            var friend = getOldestActive(friendsList);
            client.removeFriend(friend);
            removeFromFriendsList(friendsList, friend);
        }

        client.addFriend(user);
        addToFriendsList(friendsList, user);

        if(config.welcomeMessage &&
           typeof config.welcomeMessage == 'string' &&
           config.welcomeMessage !== '') {
            client.sendMessage(user, config.welcomeMessage);
        }
    }


    function getTimeStamp() {
        return Math.floor(new Date() / 1000);
    }

    /**
     * Main entry point
     */
    friendsList = loadFriendsList(FRIENDSLIST_PATH);

    // Handle 'friend' event
    VaporAPI.registerHandler({
            emitter: 'steam',
            event: 'friend'
        },
        function(user, type) {
            if(type === Steam.EFriendRelationship.RequestRecipient) {
                addFriend(client, user, friendsList);
            } else if(type === Steam.EFriendRelationship.None) {
                removeFromFriendsList(friendsList, user);
            }

            saveFriendsList(FRIENDSLIST_PATH, friendsList);
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
                    if(!friendsList.hasOwnProperty(user)) {
                        addToFriendsList(friendsList, user);
                    }
                } else if(client.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
                    addFriend(client, user, friendsList);
                }
            }

            saveFriendsList(FRIENDSLIST_PATH, friendsList);
        }
    );
};
