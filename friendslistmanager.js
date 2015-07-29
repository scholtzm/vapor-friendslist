var fs = require('fs');

module.exports = FriendsListManager;

/**
 * Friends list management class.
 * @module
 */
function FriendsListManager() {
    this.friends = {};
}

/**
 * Loads friends list from the specified path.
 * @param  {string} path Path to friends list JSON file.
 */
FriendsListManager.prototype.load = function(path) {
    var friendsListManager = this;

    if(fs.existsSync(path))
        friendsListManager.friends = JSON.parse(fs.readFileSync(path));
};

/**
 * Saves friends list to output file.
 * @param  {string} path Path to output file.
 */
FriendsListManager.prototype.save = function(path) {
    var friends = this.friends;

    fs.writeFileSync(path, JSON.stringify(friends, null, 2));
};

/**
 * Returns oldest friend.
 * @return {string} SteamID64.
 */
FriendsListManager.prototype.getOldestAdded = function() {
    var id;
    var lowest = Number.MAX_VALUE;
    var friends = this.friends;

    for(var steamID in friends) {
        if(friends[steamID] < lowest) {
            lowest = friends[steamID];
            id = steamID;
        }
    }

    return id;
};

/**
 * Adds friend to managers internal friends list.
 * @param  {string} steamID User's SteamID64.
 */
FriendsListManager.prototype.add = function(steamID) {
    this.friends[steamID] = this._getTimeStamp();
};

/**
 * Removes friend from managers internal friends list.
 * @param  {string} steamID User's SteamID64.
 */
FriendsListManager.prototype.remove = function(steamID) {
    delete this.friends[steamID];
};

/**
 * Returns number of friends.
 * @return {Number} Number of friends.
 */
FriendsListManager.prototype.count = function() {
    var friends = this.friends;

    return Object.keys(friends).length;
};

/**
 * Returns current timestamp.
 * @return {Number} Current timestamp.
 * @private
 */
FriendsListManager.prototype._getTimeStamp = function() {
    return Math.floor(new Date() / 1000);
};
