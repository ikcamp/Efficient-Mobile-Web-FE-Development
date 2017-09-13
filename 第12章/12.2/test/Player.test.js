describe("Player", function() {
  var Player = require('../lib/Player');
  var Song = require('../lib/Song');
  var chai = require('chai');
  var spies = require('chai-spies')
  var expect = chai.expect;
  var player;
  var song;
  chai.use(spies);
  beforeEach(function() {
    player = new Player();
    song = new Song();
  });
  it("should be able to play a Song", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).to.be.equal(song);
  });
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });
    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).to.be.false;
    });
    it("should be possible to resume", function(done) {
      player.resume();
	  setTimeout(function(){
		  expect(player.isPlaying).to.be.true;
		  done();
	  });
	  expect(player.currentlyPlayingSong).to.be.equal(song);
    });
  });
  it("tells the current song if the user has made it a favorite", function() {
    var persistFavoriteStatus = chai.spy.on(song, 'persistFavoriteStatus');
    player.play(song);
    player.makeFavorite();
    expect(persistFavoriteStatus).to.have.been.called();
  });
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);
      expect(function() {
        player.resume();
      }).to.throw("song is already playing");
    });
  });
});
