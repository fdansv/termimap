var colors = require('colors')
var clear = require('clear')
var blessed = require('blessed');
var Renderer = require('./renderer.js')

// var screen = blessed.screen({
//   smartCSR: true
// });

var renderer = new Renderer(101, 41);

// screen.title = 'Termimap!'

// var box = blessed.box({
//   top: 'center',
//   left: 'center',
//   width: '100%',
//   height: '100%',
//   content: '',
//   tags: true,
//   border: {
//     type: 'line'
//   },
//   style: {
//     fg: 'white',
//     bg: 'magenta',
//     border: {
//       fg: '#fff000'
//     },
//   }
// });

// screen.key(['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// });

var coordinates = [0,0]
renderer.generateMap(coordinates, 3, function (text) {
  box.content = text
})
// require('fs').readFile('./testile.geojson', 'utf8', function (err, data) {
//   if (err) throw err;
//   c.stroke()
//   c.fill()
//   box.content = c.toString().yellow
//   screen.append(box);
//   screen.render();
// });


