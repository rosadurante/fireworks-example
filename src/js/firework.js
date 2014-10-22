/**
Main.js
Display fireworks using canvas.

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
   * - x0, y0 : Origin
   * - x1, y1 : Dest
   * - particles : Num of particles to display when it explode
   * - extension : Longitude of each particle
   * - speed : Speed to apply to get to the destiny. Default: 1.5
   * - acceleration : Acceleration to apply to the speed. Default: 1.02
   * - friction : Friction to apply when is closing to the destiny. Default: 0.95
   * - percentageFriction : Moment to apply friction instead of acceleration. Default: 0.75
   * - brightness : Brightness applied to the firework. Default: random(50,70)
   * - hue : Colour applied to the firework. Default: random(380, 420);
   */

  window.Firework = function (options) {
    // Start point
    this.x = options.x0;
    this.y = options.y0;

    this.x0 = options.x0;
    this.y0 = options.y0;
    
    // End point
    this.x1 = options.x1;
    this.y1 = options.y1;

    // Distance
    this.dist = this.calculateDistance(this.x0, this.y0, this.x1, this.y1);
    this.distDone = 0;

    // Coordinates
    this.coordinates = [];
    var coordinatesCount = 3;
    while(coordinatesCount--) {
      this.coordinates.push([this.x, this.y]);
    }

    // Num of particles to display when it explodes and longitude of them.
    this.particles = options.particles;
    this.extension = options.extension;

    this.angle = Math.atan2(this.y1 - this.y0, this.x1 - this.x0);
    this.speed = options.speed || 1.5;
    this.acceleration = options.aceleration || 1.02;
    this.friction = options.friction || 0.95;
    this.percentageFriction = options.percentageFriction || 0.75;
    this.brightness = options.brightness || this.random(50,70);

    this.hue = options.colour || this.random(20, 80);
  };

  Firework.prototype.calculateDistance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  };

  Firework.prototype.random = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Firework.prototype.speedUp = function () {
    // Speed up
    if (this.distDone <= this.dist * 0.75) {
      this.speed *= this.acceleration;
    } else {
      // Adding friction to the end of the distance.
      this.speed *= this.friction;
    }
  };

  Firework.prototype.explode = function () {
    // create particles
    var particlesCollection = [],
        particleCount = this.particles;

    while(particleCount--) {
      particlesCollection.push({x: this.x, y: this.y, extension: this.extension});
    };

    return particlesCollection;
  };

  Firework.prototype.update = function () {
    // update coordinate
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speedUp();

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed,
        particles = [];

    this.distDone = this.calculateDistance(this.x0, this.y0, this.x + vx, this.y + vy);

    if (this.distDone >= this.dist) {
      particles = this.explode();
    } else {
      this.x += vx;
      this.y += vy;
    }

    return particles;
  };

  Firework.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + this.hue + ', 100%,' + this.brightness + '%)';
    ctx.stroke();
  };

})();