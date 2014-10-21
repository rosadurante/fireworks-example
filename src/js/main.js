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

      // Helper

      random = function (min, max) {
        return Math.random() * (max - min) + min;
      };


  // Canvas dimension
  canvas.width = wScreen;
  canvas.height = hScreen;

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
      fireworks[i].draw(ctx);
      fireworks[i].update(fireworks, i, particles);
    }

    var j = particles.length;
    while(j--) {
      particles[j].draw(ctx);
      particles[j].update(particles, j);
    }

    if (fireworks.length < 6) {
      fireworks.push( new Firework(wScreen/2, hScreen/2 + 100, random(wScreen/2 - 200,  wScreen/2 + 200), random(0, hScreen/4), 50, 12));
      fireworks.push( new Firework(wScreen/2, hScreen/2 + 100, random(wScreen/2 - 200,  wScreen/2 + 200), random(0, hScreen/4), 300, 2));
    }
  }

  window.onload = loop;
})();