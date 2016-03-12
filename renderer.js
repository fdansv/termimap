var Canvas = require('drawille-canvas')
var request = require('request')

function Renderer (width, height) {
  this.width = width * 2 
  this.height = height * 4 
  this.canvas = new Canvas(width, height)
}

Renderer.prototype = {
  setCenter: function (lat, lon) {

  },

  setZoom: function (zoom) {

  },

  generateMap: function (coordinates, zoom, callback) {
    var self = this
    this.coordinates = coordinates
    this.zoom = zoom
    var tilesToDownload = this._getTilesToLoad()
    tilesToDownload.forEach(function (t) {
      var url = 'https://cartocdn-ashbu.global.ssl.fastly.net/fdansv/api/v1/map/b03db5a9b69ce6d4d3ee14949ece15d8:1457562289526/0/{z}/{x}/{y}.geojson?map_key=794a3db60129527035e4c8ab66968a29cb1568be&api_key=794a3db60129527035e4c8ab66968a29cb1568be&cache_policy=persist'
        .replace('{x}', t.x)
        .replace('{y}', t.y)
        .replace('{z}', t.zoom)
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          self.drawTile(this, JSON.parse(body))
        }
      }.bind(t))
    })
  },

  drawTile: function (tilePoint, tile) {
    var self = this
    tile.features.forEach(function (f) {
      self.renderFeature(f, tilePoint)
    })
  },

  getBounds: function() {
    var totalPixelsForThisZoom = 256 * (this.zoom << 2)
    var metersPerPixel = 6378137 * 2 * Math.PI / totalPixelsForThisZoom
    return {
      n: this.coordinates[1] + this.height / 2 * metersPerPixel,
      s: this.coordinates[1] - this.height / 2 * metersPerPixel,
      e: this.coordinates[0] + this.width / 2 * metersPerPixel,
      w: this.coordinates[0] - this.width / 2 * metersPerPixel
    }
  },

  _getTilesToLoad: function () {
    var bounds = this.getBounds()
    var nwTile = this._getTileFromMetres([bounds.n,bounds.w])
    var seTile = this._getTileFromMetres([bounds.s,bounds.e])
    var tilesToLoad = []
    for (var y = nwTile.y; y <= seTile.y; y++) {
      for (var x = nwTile.x; x <= seTile.x; x++) {
        tilesToLoad.push({x: x, y: y, zoom: this.zoom})
      }
    }
    return tilesToLoad
  },

  _getTileFromMetres: function(coordinates) {
    var self = this
    var halfeq = 6378137 * Math.PI
    var sideTiles = Math.pow(2, this.zoom)
    var x = Math.floor(sideTiles * (coordinates[1] + halfeq) / (2 * halfeq))
    var y = sideTiles - Math.floor(sideTiles * (coordinates[0] + halfeq/2) / halfeq )
    
    return {x: x, y: y, zoom: this.zoom}
  },

  _wrapX : function (x, zoom) {
    var limit_x = Math.pow(2, zoom)
    var corrected_x = ((x % limit_x) + limit_x) % limit_x
    return corrected_x
  },

  _projectPoint : function(x, y) {
    var proportion = 256 / this.width
    var corrected_x = this._wrapX(tilePoint.x, tilePoint.zoom)
    var equatorLength = 6378137 * 2 * Math.PI
    var halfEquator = equatorLength / 2
    var invEarth = 1.0 / equatorLength
    var pixelScale = 256 * (1 << tilePoint.zoom)
    x = pixelScale * (x + halfEquator) * invEarth - corrected_x * 256
    y = pixelScale * (-y + halfEquator) * invEarth - tilePoint.y * 256
    return [x,y]
  },

  renderFeature: function(feature, tilePoint) {

    if (feature.geometry.type === 'GeometryCollection') return
    var first = true
    if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach(function(mp) {
        mp.forEach(function(poly) {
          poly.forEach(function(p) {
            var projected = this.projectPoint.apply(this,p)
            if(first){
              first = false
              this.canvas.moveTo.apply(c, projected)
            }
            else{
              this.canvas.lineTo.apply(c, projected)
            }
          })
          first = true
        })
      })
    } else if (feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates.forEach(function (poly) {
        poly.forEach(function (p) {
          var projected = this.projectPoint.apply(this, p)
          if (first) {
            first = false
            this.canvas.moveTo.apply(c, projected)
          } else {
            this.canvas.lineTo.apply(c, projected)
          }
        })
        first = true
      })
    }
  }  
}

module.exports = Renderer
