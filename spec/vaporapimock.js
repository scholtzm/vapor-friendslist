var adminID = '7656123';

var utils = {
    isAdmin: function(steamID) {
        if(steamID === adminID) {
            return true;
        } else {
            return false;
        }
    }
};

exports.adminID = adminID;

exports.VaporAPI = {
    getUtils: function() {
        return utils;
    }
};
