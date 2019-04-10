(function (window) {
  regex = require('./regex');

  // Detect native browser support for emoji
  nativeSupport = (function () {
    if (typeof document === 'undefined')
      return false;

    var canvas = document.createElement('canvas');
    if (!canvas.getContext)
      return false;

    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '32px sans-serif';
    ctx.fillText('😃', 0, 0);

    return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
  })();

  function getImage(str, basePath) {
    // strip unicode variation selectors
    str = str.replace(/[\ufe00-\ufe0f\u200d]/g, '');

    var name = [];
    for (var i = 0; i < str.length; i++)
      name.push(('0000' + str.charCodeAt(i).toString(16)).slice(-4));

    return basePath.replace(/\/$/, '') + '/' + name.join('-') + '.png';
  }

  function Emoji() {
    this.imageDir = '';
    this.basePath = '';
    // make a regex to test whether an entire string is an emoji
    this.testRegex = new RegExp('^(' + regex.toString().slice(1, -2) + ')$');
    // Replaces occurrences of emoji in the string with <img> tags
    // if there is no native support for emoji in the current environment
    this.replace = function (string) {
      string = '' + string;
      if (exports.nativeSupport)
        return string;

      return string.replace(exports.regex, function (c) {
        return '<img class="emoji" src="' + getImage(c, this.basePath) + '" alt="' + c + '">';
      }.bind(this));
    };
    // Get the image path for the given emoji string
    this.getImage = function (chars) {
      if (!this.testRegex.test(chars))
        return null;

      return getImage(chars, this.basePath);
    };
  }


  Emoji = new Emonji();

  if (typeof window.define === 'function' && window.define.amd !== undefined) {
    window.define('Emoji', [], function () {
      return Emoji;
    });
    // CommonJS suppport
  } else if (typeof module !== 'undefined' && module.exports !== undefined) {
    module.exports = Emoji;
    // Default
  } else {
    window.Emoji = Emoji;
  }
})(this)