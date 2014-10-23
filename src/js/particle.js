/**
Main.js
Display particles once the firework explode using canvas.

Reference: Jack Rugile (@jackrugile)
http://thecodeplayer.com/walkthrough/canvas-fireworks-tutorial

Author: Rosa Durante <me@rosadurante.com>
Date: Thursday 16th Oct 2014
*/


(function () {

  /**
   * Constructor
   * 
   * @param options: Object that contains
   * - x, y : Origin
   * - extension : Longitude of the particle
   * - friction : Friction to apply to the particle. Default: 0.95
   * - gravity : Gravity to apply to the particle. Default : 1
   * - hue : Colour applied to the particle. Default: random(380, 420);
   * - brightness : Brightness applied to the particle. Default: random(50,70)
   */

  window.Particle = function (options) {
    this.x = options.x;
    this.y = options.y;

    this.coordinates = [];
    var coordinatesCount = options.extension;
    while(coordinatesCount--) {
      this.coordinates.push([this.x, this.y]);
    }

    this.kind = options.kind;
    this.angle = this.random(0, Math.PI *2);
    this.speed = this.random(1, 10);
    this.friction = options.friction || 0.95;
    this.gravity = options.gravity || 1;
    this.hue = options.hue || this.random(20, 80);
    this.brightness = options.brightness || this.random(50,80);
    this.alpha = 1;
    this.fadeOut = this.random(0.01, 0.02);
  };

  Particle.prototype.random = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Particle.prototype.update = function () {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    // slow down particle
    this.speed *= this.friction;
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + this.gravity;
    this.alpha -= this.fadeOut;

    if (this.alpha <= this.fadeOut) {
      return true;
    } else {
      return false;
    }
  };

  Particle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    switch(this.kind) {
      case 'dot':
        ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI,false);
        ctx.fillStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
        ctx.fill();
        break;
      case 'line':
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
        ctx.stroke();
        break;
      }
  };

})();