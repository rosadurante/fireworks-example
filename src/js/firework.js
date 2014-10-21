/**
Main.js
Display fireworks using canvas.

Reference: Jack Rugile (@jackrugile)
http://thecodeplayer.com/walkthrough/canvas-fireworks-tutorial

Author: Rosa Durante <me@rosadurante.com>
Date: Thursday 16th Oct 2014
*/


(function () {

  window.Firework = function (x0, y0, x1, y1, particles, extension, colour) {
    // Start point
    this.x = x0;
    this.y = y0;

    this.x0 = x0;
    this.y0 = y0;
    
    // End point
    this.x1 = x1;
    this.y1 = y1;

    // Distance
    this.dist = this.calculateDistance(x0, y0, x1, y1);
    this.distDone = 0;

    // Coordinates
    this.coordinates = [[this.x, this.y], [this.x, this.y], [this.x, this.y]];

    // Num of particles to display when it explodes and longitude of them.
    this.particles = particles;
    this.extension = extension;

    this.angle = Math.atan2(y1 - y0, x1 - x0);
    this.speed = 1.5;
    this.acceleration = 1.02;
    this.friction = 0.95;
    this.brightness = this.random(50,70);

    this.hue = colour || this.random(380, 420);
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

  Firework.prototype.explode = function (collection, index, particlesCollection) {
    // create particles
    var particleCount = this.particles;
    while(particleCount--) {
      particlesCollection.push(new Particle(this.x, this.y, this.extension));
    };

    if (collection) {
      collection.splice(index, 1);
    }
  }

  Firework.prototype.update = function (collection, index, particlesCollection) {
    // update coordinate
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speedUp();

    // Speed up
    if (this.distDone <= this.dist * 0.75) {
      this.speed *= this.acceleration;
    } else {
      // Adding friction to the end of the distance.
      this.speed *= this.friction;
    }

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distDone = this.calculateDistance(this.x0, this.y0, this.x + vx, this.y + vy);

    if (this.distDone >= this.dist) {
      this.explode(collection, index, particlesCollection);
    } else {
      this.x += vx;
      this.y += vy;
    }
  };

  Firework.prototype.getX = function () {
    return this.x
  };

  Firework.prototype.getY = function () {
    return this.y;
  };

  Firework.prototype.getLastCoordenate = function (index) {
    return this.coordinates[this.coordinates.length - 1];
  };

  Firework.prototype.getColour = function () {
    return this.hue;
  };

  Firework.prototype.getBrightness = function () {
    return this.brightness;
  };

  Firework.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + this.hue + ', 100%,' + this.brightness + '%)';
    ctx.stroke();
  };

})();