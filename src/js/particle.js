/**
Main.js
Display particles once the firework explode using canvas.

Reference: Jack Rugile (@jackrugile)
http://thecodeplayer.com/walkthrough/canvas-fireworks-tutorial

Author: Rosa Durante <me@rosadurante.com>
Date: Thursday 16th Oct 2014
*/


(function () {

  window.Particle = function (x, y, extension) {
    this.x = x;
    this.y = y;

    this.coordinates = [];
    var coordinatesCount = extension;
    while(coordinatesCount--) {
      this.coordinates.push([this.x, this.y]);
    }

    this.angle = this.random(0, Math.PI *2);
    this.speed = this.random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = this.random(380, 420);
    this.brightness = this.random(50,80);
    this.alpha = 1;
    this.fadeOut = this.random(0.015, 0.03);
  };

  Particle.prototype.random = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Particle.prototype.update = function (collection, index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    // slow down particle
    this.speed *= this.friction;
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + this.gravity;
    this.alpha -= this.fadeOut;

    if (this.alpha <= this.fadeOut) {
      collection.splice(index, 1);
    }
  };

  Particle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    ctx.stroke();
  };

})();