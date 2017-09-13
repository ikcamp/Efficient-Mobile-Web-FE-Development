describe("Player", function() {
  var Player = require('../../lib/sinon_examples/Player');
  var Song = require('../../lib/sinon_examples/Song');
  var sinon = require('sinon');
  var player;
  var song;
  beforeEach(function(){
    player = new Player();
    song = new Song(); 
  });
  it("spies", function() {
    var spy = sinon.spy(player, "play");
    player.play(song);
    expect(player.isPlaying).toBeTruthy();
    expect(spy.called).toBeTruthy();
    expect(spy.calledOn(player)).toBeTruthy();
    expect(spy.calledWith(song)).toBeTruthy();
  });
  it("stub", function() {
    var stub = sinon.stub(player, "play");
    player.play(song);
    expect(player.isPlaying).toBeFalsy();
    expect(stub.called).toBeTruthy();
    expect(stub.calledOn(player)).toBeTruthy();
    expect(stub.calledWith(song)).toBeTruthy();
    stub.restore();
    player.play(song);
    expect(player.isPlaying).toBeTruthy();
  });
  it('mock', function() {
    var mock = sinon.mock(player);
    mock.expects('play').once();
    player.play(song);
    expect(player.isPlaying).toBeFalsy();
    mock.verify();
  });
  it('fake timer', function () {
      clock = sinon.useFakeTimers(); 
      player.play(song);
      player.pause();
      expect(player.isPlaying).toBeTruthy();
      clock.tick(99);
      expect(player.isPlaying).toBeTruthy();
      clock.tick(1);
      expect(player.isPlaying).toBeFalsy();
      clock.restore();
  });
  // it("auto restore", sinon.test(function() {
  //   var stub = this.stub(player, "play");
  //   player.play(song);
  //   expect(player.isPlaying).toBeFalsy();
  //   expect(stub.called).toBeTruthy();
  //   expect(stub.calledOn(player)).toBeTruthy();
  //   expect(stub.calledWith(song)).toBeTruthy();
  // }));
  // it("restore test", function() {
  //   player.play(song);
  //   expect(player.isPlaying).toBeTruthy();
  // });
  // it('calls the original function only once', function () {
  //   var callback = sinon.spy();
  //   var proxy = once(callback);
  //   proxy();
  //   proxy();
  //   expect(callback.calledOnce).toBeTruthy();
  // });
  // it('calls original function with right this and args', function () {
  //   var callback = sinon.spy();
  //   var proxy = once(callback);
  //   var obj = {};
  //   proxy.call(obj, 1, 2, 3);
  //   expect(callback.calledOn(obj)).toBeTruthy();
  //   expect(callback.calledWith(1, 2, 3)).toBeTruthy();
  // });
  // it("returns the return value from the original function", function () {
  //   var callback = sinon.stub().returns(42);
  //   var proxy = once(callback);
  //   expect(proxy()).toEqual(42);
  // });
  // describe('saveUser', function() {
  //   var clock;
  //   var throttle = util.throttle;
  //   beforeEach(function () { 
  //     clock = sinon.useFakeTimers(); 
  //   });
  //   afterEach(function () { 
  //     clock.restore(); 
  //   });
  //   it('calls callback after 100ms', function () {
  //       var callback = sinon.spy();
  //       var throttled = throttle(callback);
  //       throttled();
  //       clock.tick(99);
  //       expect(callback.notCalled).toBeTruthy();
  //       clock.tick(1);
  //       expect(callback.calledOnce).toBeTruthy();
  //   });
  // });
});
