// Global control variables
var speed_min = 0.5;
var speed_max = 5;
var symbol_size = 13;
var n_symbol_min = 5;
var n_symbol_max = 30;
var switch_interval_min = 1;
var switch_interval_max = 10;
var first_white_chance = 4; // inverted proportion like in 1/first_white_chance

// Colors variable =D
var colors = {
  symbol: {
    r: 0,
    g: 255,
    b: 70,
  },
  first_symbol: {
    r: 180,
    g: 255,
    b: 180,
  },
  f_s_stroke: {
    r: 255,
    g: 255,
    b: 255,
    alpha: 80,
  },
};

//Internal working global variables
var streams = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(60);
  background(0);

  var x = 0;
  var y = random(-500, 0);

  for (var i = 0; i <= width / symbol_size; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, y);
    streams.push(stream);
    x += symbol_size;
  }

  textSize(symbol_size);
}

function draw() {
  background(0, 255);
  streams.forEach(function (stream) {
    stream.render();
  });
}

function Symbol_(x, y, speed, first) {
  this.x = x;
  this.y = y;
  this.value;
  this.speed = speed;
  this.switchInterval = round(random(switch_interval_min, switch_interval_max));
  this.first = first;

  this.setToRandomSymbol = function () {
    if (frameCount % this.switchInterval == 0) {
      //Getting the katakana symbols from unicode table
      this.value = String.fromCharCode(0x30a1 + round(random(0, 96)));
    }
  };

  this.rain = function () {
    this.y = this.y >= height ? 0 : (this.y += speed);
  };
}

function Stream() {
  this.symbols = [];
  this.total_symbols = round(random(n_symbol_min, n_symbol_max));
  this.speed = random(speed_min, speed_max);

  this.generateSymbols = function (x, y) {
    var first = round(random(0, first_white_chance)) == 1;
    for (var i = 0; i <= this.total_symbols; i++) {
      symbol = new Symbol_(x, y, this.speed, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbol_size;
      first = false;
    }

    this.render = function () {
      this.symbols.forEach(function (symbol) {
        if (symbol.first) {
          fill(
            colors.first_symbol.r,
            colors.first_symbol.g,
            colors.first_symbol.b
          );
          stroke(
            colors.f_s_stroke.r,
            colors.f_s_stroke.g,
            colors.f_s_stroke.b,
            colors.f_s_stroke.alpha
          );
        } else {
          noStroke();
          fill(colors.symbol.r, colors.symbol.g, colors.symbol.b);
        }
        text(symbol.value, symbol.x, symbol.y);
        symbol.rain();
        symbol.setToRandomSymbol();
      });
    };
  };
}
