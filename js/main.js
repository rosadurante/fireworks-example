/**
Main.js
Display fireworks using canvas.

Reference: Jack Rugile (@jackrugile)
http://thecodeplayer.com/walkthrough/canvas-fireworks-tutorial

Author: Rosa Durante <me@rosadurante.com>
Date: Thursday 16th Oct 2014
*/


(function () {

  window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
          };
  })();

  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      // fullscreen dimensions
      wScreen = window.innerWidth,
      hScreen = window.innerHeight,
      // firework collection
      fireworks = [],
      // particles collection
      particles = [],
      // starting colour (hue)
      hue = 120,

      // Helpers

      random = function (min, max) {
        return Math.random() * (max - min) + min;
      },

      calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      },

      // Objects

      Firework, Particle

  // Canvas dimension
  canvas.width = wScreen;
  canvas.height = hScreen;

  Firework = function (x0, y0, x1, y1, particles, extension) {
    // Start point
    this.x = x0;
    this.y = y0;

    this.x0 = x0;
    this.y0 = y0;
    
    // End point
    this.x1 = x1;
    this.y1 = y1;

    // Distance
    this.dist = calculateDistance(x0, y0, x1, y1);
    this.distDone = 0;

    // Coordinates
    this.coordinates = [[this.x, this.y], [this.x, this.y], [this.x, this.y]];

    this.particles = particles;
    this.extension = extension;

    this.angle = Math.atan2(y1 - y0, x1 - x0);
    this.speed = 1.5;
    this.acceleration = 1.02;
    this.friction = 0.95;
    this.brightness = random(50,70);
    this.targetRadius = 1;
  };

  Firework.prototype.update = function (index) {
    // update coordinate
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator
    if (this.targetRadius < 8) {
      this.targetRadius += 0.3;
    } else {
      this.targetRadius = 1;
    }

    // Speed up
    if (this.distDone <= this.dist * 0.75) {
      this.speed *= this.acceleration;
    } else {
      // Adding friction to the end of the distance.
      this.speed *= this.friction;
    }

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distDone = calculateDistance(this.x0, this.y0, this.x + vx, this.y + vy);

    if (this.distDone >= this.dist) {
      // Create particles
      var particleCount = this.particles;
      //var particleCount = 20;
      while(particleCount--) {
        particles.push(new Particle(this.x,this.y, this.extension));
      }

      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  };

  Firework.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%,' + this.brightness + '%)';
    ctx.stroke();
  };

  Particle = function (x, y, extension) {
    this.x = x;
    this.y = y;

    this.coordinates = [];
    this.coordinatesCount = extension;
    //this.coordinatesCount = 15;
    while(this.coordinatesCount--) {
      this.coordinates.push([this.x, this.y]);
    }

    this.angle = random(0, Math.PI *2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50,80);
    this.alpha = 1;
    this.fadeOut = random(0.015, 0.03);
  };

  Particle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    // slow down particle
    this.speed *= this.friction;
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + this.gravity;
    this.alpha -= this.fadeOut;

    if (this.alpha <= this.fadeOut) {
      particles.splice(index, 1);
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    ctx.stroke();
  };

  var loop = function () {
    requestAnimFrame(loop);

    // hue += 0.5;
    hue = random(380, 420);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0, wScreen, hScreen);
    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while(i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    var i = particles.length;
    while(i--) {
      particles[i].draw();
      particles[i].update(i);
    }

    if (fireworks.length < 6) {
      fireworks.push( new Firework(wScreen/2, hScreen/2 + 100, random(wScreen/2 - 200,  wScreen/2 + 200), random(0, hScreen/4), 50, 12));
      fireworks.push( new Firework(wScreen/2, hScreen/2 + 100, random(wScreen/2 - 200,  wScreen/2 + 200), random(0, hScreen/4), 300, 2));
    }
  }

  window.onload = loop;
})();