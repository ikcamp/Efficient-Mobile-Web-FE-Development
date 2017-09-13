describe('index.js: ', function() {
  it('test function isPhone(s).', function() {
    expect(isPhone('15212312412')).toBe(true);
    expect(isPhone('122333')).toBe(false);
  });
});