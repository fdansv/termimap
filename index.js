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

var coordinates = [0,0]
renderer.generateMap(coordinates, 3, function (text) {
  console.log(text)
  box.content = text
  screen.append(box);
  screen.render();
})


