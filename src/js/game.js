/**
Game.js
Display fireworks using canvas.

Author: Rosa Durante <me@rosadurante.com>
Date: Thursday 16th Oct 2014
*/


(function () {

  window.Game = function (element) { 
    var self = this;

    window.reqAnimateFrame = (function () { 
      return (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
          window.setTimeout( callback, 1000 / 60 );
        });
    })();

    this.canvas = document.getElementById(element);
    this.ctx = canvas.getContext('2d'),
    // fullscreen dimensions
    this.wScreen = window.innerWidth,
    this.hScreen = window.innerHeight,
    // firework collection
    this.fireworks = [],
    // particles collection
    this.particles = [];

    // Canvas dimension
    this.canvas.width = this.wScreen;
    this.canvas.height = this.hScreen;

    this.loop();
  };

  Game.prototype.random = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Game.prototype.loop = function () {
    this.update();
    this.draw();

    window.reqAnimateFrame(this.loop.bind(this));
  };

  Game.prototype.update = function () {
    var particlesCollection;

    for (var i = 0; i < this.fireworks.length; i++) {
      particlesCollection = this.fireworks[i].update();

      if (particlesCollection.length) {
        this.fireworks.splice(i, 1);
        for (var count=0; count < particlesCollection.length; count++) {
          this.particles.push(new Particle(particlesCollection[count]));
        }
      }
    }

    for (var j = 0; j < this.particles.length; j++) {
      if (this.particles[j].update()) {
        this.particles.splice(j, 1);
      }
    }

    var opt1 = {
      x0: this.wScreen/2,
      y0: this.hScreen/2,
      x1: this.random(this.wScreen/2 - 200, this.wScreen/2 + 200),
      y1: this.random(0, this.hScreen/4),
      particles: 50,
      extension: 12
    };

    var opt2 = {
      x0: this.wScreen/2,
      y0: this.hScreen/2,
      x1: this.random(this.wScreen/2 - 200, this.wScreen/2 + 200),
      y1: this.random(0, this.hScreen/4),
      particles: 300,
      extension: 2
    }

    var opt3 = {
      x0: this.wScreen/2,
      y0: this.hScreen/2,
      x1: this.random(this.wScreen/2 - 200, this.wScreen/2 + 200),
      y1: this.random(0, this.hScreen/4),
      particles: 600,
      extension: 2
    }

    if (this.fireworks.length < 6) {
      this.fireworks.push( new Firework(opt1));
      this.fireworks.push( new Firework(opt2));
      this.fireworks.push( new Firework(opt3));
    }
  };

  Game.prototype.draw = function () {

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(0,0, this.wScreen, this.hScreen);
    this.ctx.globalCompositeOperation = 'lighter';

    var i = this.fireworks.length;
    while(i--) {
      this.fireworks[i].draw(this.ctx);
    }

    var j = this.particles.length;
    while(j--) {
      this.particles[j].draw(this.ctx);
    }
  };

})();