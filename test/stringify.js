var expect = require('expect.js');
var VirtualNode = require('vtree/vnode');
var VirtualText = require('vtree/vtext');
var svg = require('virtual-hyperscript/svg');
var stringify = require('..');

describe('stringify()', function() {
  it('returns string', function() {
    var vnode = new VirtualNode('div');
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div></div>');
  });

  it('serializes valid vnode.properties', function() {
    var vnode = new VirtualNode('div', {
      'id': "test",
      'class': "testClass",
      'invalid': "test"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div id="test" class="testClass"></div>');
  });

  it('outputs "class" for "class" property', function() {
    var vnode = new VirtualNode('div', {
      'class': "small"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="small"></div>');
  });

  it('outputs "class" for "className" property', function() {
    var vnode = new VirtualNode('div', {
      className: "small"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div class="small"></div>');
  });

  it('outputs "accept-charset" for "acceptCharset" property', function() {
    var vnode = new VirtualNode('div', {
      acceptCharset: "utf-8"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div accept-charset="utf-8"></div>');
  });

  it('outputs "http-equiv" for "httpEquiv" property', function() {
    var vnode = new VirtualNode('div', {
      httpEquiv: "refresh"
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div http-equiv="refresh"></div>');
  });

  it('serializes CSS for style attribute', function() {
    var vnode = new VirtualNode('div', {
      style: {
        'background': 'red',
        'font-weight': 'bold'
      }
    });
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div style="background: red; font-weight: bold;"></div>');
  });

  it('recurses children', function() {
    var vnode = new VirtualNode('div', null, [
      new VirtualNode('div', { id: 2 }, [
        new VirtualNode('div', null, [new VirtualText('Test')])
      ]),
      new VirtualNode('div', { id: 3 })
    ]);
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div><div id="2"><div>Test</div></div><div id="3"></div></div>');
  });

  it('serializes self closing tags', function () {
    var vnode = new VirtualNode('br');
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<br />');
  });

  it('does not encode script tag contents', function() {
    var vnode = new VirtualNode('div', null, [
      new VirtualNode('script', null, [new VirtualText('console.log("foobar");')])
    ]);
    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<div><script>console.log("foobar");</script></div>');
  });

  it('serializes svg attributes', function() {
    var vnode = svg('svg', {
      viewBox: '0 0 24 24',
      style: {
        'pointer-events': 'none',
        width: '24px',
        height: '24px',
        display: 'block'
      }
    }, [
      svg('path', {
        d: 'M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z'
      })
    ]);

    var html = stringify(vnode);
    expect(html).to.be.a('string');
    expect(html).to.equal('<svg viewBox="0 0 24 24" style="pointer-events: none; width: 24px; height: 24px; display: block;"><path d="M3,18h18v-2H3V18z M3,13h18v-2H3V13z M3,6v2h18V6H3z"></path></svg>');
  });

  describe('options.invalidAttributes', function () {
    it('outputs invalid attributes', function () {
      var vnode = new VirtualNode('div', { 'testAttribute': 'test' }, []);
      var html = stringify(vnode, {
        invalidAttributes: true
      });
      expect(html).to.be.a('string');
      expect(html).to.equal('<div testAttribute="test"></div>');
    });
  });

  describe('options.validAttributes', function () {
    it('dictates which attributes are valid', function () {
      var vnode = new VirtualNode('div', { 'testAttribute': 'test' }, []);
      var html = stringify(vnode, {
        validAttributes: {
          'testAttribute': 'test-attribute'
        }
      });
      expect(html).to.be.a('string');
      expect(html).to.equal('<div test-attribute="test"></div>');
    });
  });

  describe('options.selfClosingTags', function () {
    it('dictates which tags should be self-closing', function () {
      var vnode = new VirtualNode('div', null, []);
      var html = stringify(vnode, {
        selfClosingTags: ['div']
      });
      expect(html).to.be.a('string');
      expect(html).to.equal('<div />');
    });
  });
});
