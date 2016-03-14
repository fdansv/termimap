var colors = require('colors')
var clear = require('clear')
var blessed = require('blessed');
var Renderer = require('./renderer.js')

var screen = blessed.screen({
  smartCSR: true
});

var renderer = new Renderer(screen.width, screen.height);

screen.title = 'Termimap!'

var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  content: '',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#fff000'
    },
  }
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

var coordinates = [30,-75]
renderer.generateMap(coordinates, 2, function (text) {
  box.content = text.white
  screen.append(box);
  screen.render();
})


