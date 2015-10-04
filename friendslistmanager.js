module.exports = FriendsListManager;

/**
 * Friends list management class.
 * @module
 */
function FriendsListManager(VaporAPI) {
    this._VaporAPI = VaporAPI;
    this.friends = {};
}

/**
 * Returns oldest friend.
 * Admins are skipped.
 * @return {string} SteamID64.
 */
FriendsListManager.prototype.getOldestAdded = function() {
    var id = null;
    var lowest = Number.MAX_VALUE;
    var friends = this.friends;
    var VaporAPI = this._VaporAPI;

    for(var steamID in friends) {
        if(friends[steamID] < lowest && !VaporAPI.getUtils().isAdmin(steamID)) {
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
    if(steamID === null) {
        return;
    }

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
