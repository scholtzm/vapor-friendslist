/* global describe, it */
/* jshint expr:true */

var mock = require('./vaporapimock.js');
var expect = require('chai').expect;

var adminID = mock.adminID;
var VaporAPIMock = mock.VaporAPI;

var FriendsListManager = require('../friendslistmanager.js');

describe('FriendsListManager class', function () {

    it('can be instantiated correctly', function(done) {
        var manager = new FriendsListManager(VaporAPIMock);

        expect(manager.count()).to.be.equal(0);

        return done();
    });

    it('can manage friends', function(done) {
        var manager = new FriendsListManager(VaporAPIMock);

        manager.add('76561');
        manager.add('76562');
        expect(manager.count()).to.be.equal(2);

        manager.add('76561');
        expect(manager.count()).to.be.equal(2);

        manager.remove('76561');
        expect(manager.count()).to.be.equal(1);

        manager.remove('76562');
        expect(manager.count()).to.be.equal(0);

        return done();
    });

    it('can find the oldest friend', function(done) {
        var manager = new FriendsListManager(VaporAPIMock);

        // this one is marked as admin in the API mock object
        manager.add(adminID);

        manager.add('76561');
        manager.add('76562');
        expect(manager.count()).to.be.equal(3);

        var oldest = manager.getOldestAdded();
        expect(oldest).to.be.equal('76561');
        manager.remove(oldest);
        expect(manager.count()).to.be.equal(2);

        oldest = manager.getOldestAdded();
        expect(oldest).to.be.equal('76562');
        manager.remove(oldest);
        expect(manager.count()).to.be.equal(1);

        oldest = manager.getOldestAdded();
        expect(oldest).to.be.null;
        manager.remove(oldest);
        expect(manager.count()).to.be.equal(1);

        return done();
    });

});
