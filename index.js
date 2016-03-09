var Canvas = require('drawille-canvas')
var colors = require('colors')

var width = process.stdout.columns * 2
console.log(width)
var proportion = 256 / width
require('fs').readFile('./testile.geojson', 'utf8', function (err, data) {
  c = new Canvas(width, width)
  if (err) throw err; // we'll not consider error handling for now
  var obj = JSON.parse(data);

  obj.features.forEach(function(f){
    renderFeature(f)
  })
  c.stroke()
  c.fill()
  console.log(c.toString().yellow)
});

wrapX = function (x, zoom) {
  var limit_x = Math.pow(2, zoom)
  var corrected_x = ((x % limit_x) + limit_x) % limit_x
  return corrected_x
}

projectPoint = function(x, y){
  var tilePoint = {
    x: 8,
    y: 6,
    zoom: 4
  }
  var corrected_x = wrapX(tilePoint.x, tilePoint.zoom)
  var earthRadius = 6378137 * 2 * Math.PI
  var earthRadius2 = earthRadius / 2
  var invEarth = 1.0 / earthRadius
  var pixelScale = 256 * (1 << tilePoint.zoom)
  x = (pixelScale * (x + earthRadius2) * invEarth - corrected_x * 256)/proportion
  y = (pixelScale * (-y + earthRadius2) * invEarth - tilePoint.y * 256)/proportion
  return [x,y]
}

renderFeature = function(feature) {
  if(feature.geometry.type === 'GeometryCollection') return
  var first = true
  if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach(function(mp) {
      mp.forEach(function(poly) {
        poly.forEach(function(p) {
          var projected = projectPoint.apply(this,p)
          if(first){
            first = false
            c.moveTo.apply(c, projected)
          }
          else{
            c.lineTo.apply(c, projected)
          }
        })
        first = true
      })
    })
  } else if (feature.geometry.type === 'Polygon') {
    feature.geometry.coordinates.forEach(function(poly) {
      poly.forEach(function(p) {
        var projected = projectPoint.apply(this,p)
        if(first){
          first = false
          c.moveTo.apply(c, projected)
        }
        else{
          c.lineTo.apply(c, projected)
        }
      })
      first = true
    })
  }
}


