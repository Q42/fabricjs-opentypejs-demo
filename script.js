// keep a list of fonts and their opentype variants
var fonts = {};

$(document).ready(function() {

  // we override the fabricjs fillText function to get the vectors and draw those
  CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
    var width = this.measureText(text).width;
    var offsetFactor = {
      left: 0,
      center: 0.5,
      right: 1
    };
    var font = fonts[this.getFontFamily()];
    var path = font.getPath(text, x - width * offsetFactor[this.textAlign], y, this.getFontSize());
    path.draw(this);
  }

  // helper functions to render the opentype path of a text
  CanvasRenderingContext2D.prototype.getFontSize = function() {
    // this.font is for example `68px AstaSansLightA1` or `68.12333px AstaSansLightA1`
    return 1 * this.font.match(/\d+/)[0];
  }
  CanvasRenderingContext2D.prototype.getFontFamily = function() {
    return this.font.match(/^[\d\.]+px (.*)/)[1];
  }
  CanvasRenderingContext2D.prototype.measureText = function(text) {
    var width;
    var font = fonts[this.getFontFamily()];
    if (!font) {
      console.error('Cannot find font', this.getFontFamily(), fonts);
      return;
    }
    font.forEachGlyph(text + " ", 0, 0, this.getFontSize(), {}, function(glyph, x, y) {
      width = x;
    });
    return {
      width: width
    };
  }

  // load the fonts we're going to use, OTF & TTF in this case
  function loadFont(name, path) {
    opentype.load(path, function (err, font) {
      if (err) {
        console.error('Error loading font ' + name + ' at ' + path, err);
      } else {
        fonts[name] = font;
      }
    });
  }
  loadFont('sourceSansPro', 'fonts/SourceSansPro-Regular.otf');
  loadFont('AutumnA1', 'fonts/AutumnA1.ttf');
  loadFont('AstaSansLightA1', 'fonts/AstaSansLightA1.ttf');

  // set editor size
  var canvasWidth = $(window).width() - 20;
  var canvasHeight = $(window).height() - 20;
  $("#editor").attr("width", canvasWidth).attr("height", canvasHeight);

  // set target canvas
  var canvas = window.canvas = new fabric.Canvas('editor');
  canvas.enableRetinaScaling = false;
  canvas.setBackgroundColor('white');

  // when you add a textbox, randomize size, position & font
  var i = 0;
  $('#addTextbox').click(function(event) {
    var text = new fabric.Textbox("Ojoo here's some text", {
      id: i += 1,
      left: Math.random() * canvasWidth * 0.9,
      top: Math.random() * canvasHeight * 0.9,
      width: 300,
      fontFamily: Object.keys(fonts)[i % Object.keys(fonts).length],
      fontSize: Math.random() * 50 + 20
    });
    canvas.add(text);
  });

  $('#viewJson').click(function(event) {
    var w = window.open();
    w.document.write("<xmp>" + JSON.stringify(canvas));
  });

});
