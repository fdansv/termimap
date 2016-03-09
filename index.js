// require('fs').readFile('./testile.geojson', 'utf8', function (err, data) {
//     if (err) throw err; // we'll not consider error handling for now
//     var obj = JSON.parse(data);
    

// });

var Canvas = require('drawille-canvas')
wrapX = function (x, zoom) {
  var limit_x = Math.pow(2, zoom)
  var corrected_x = ((x % limit_x) + limit_x) % limit_x
  return corrected_x
}

projectPoint = function(x, y){
  var corrected_x = wrapX(tilePoint.x, tilePoint.zoom)
  var earthRadius = 6378137 * 2 * Math.PI
  var earthRadius2 = earthRadius / 2
  var invEarth = 1.0 / earthRadius
  var pixelScale = 256 * (1 << tilePoint.zoom)
  x = pixelScale * (x + earthRadius2) * invEarth - corrected_x * 256
  y = pixelScale * (-y + earthRadius2) * invEarth - tilePoint.y * 256
  return [x,y]
}

var c = new Canvas(256, 256)
var spain = {"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[1223803.06717985,3995282.32962424],[1209486.26746892,3980378.92529474],[1194025.10339264,4012811.47509231],[1223803.06717985,3995282.32962424]]],[[[1231719.21880913,4115139.84735001],[1228410.58090379,4112020.70480234],[1220185.29504856,4117132.24482446],[1231719.21880913,4115139.84735001]]],[[[1239789.65925267,4119839.81500541],[1250210.6107443,4139596.66092373],[1258157.48655305,4137186.35600964],[1239789.65925267,4119839.81500541]]],[[[1203209.07270258,4455768.00578797],[1201353.59943003,4456738.45657033],[1203889.34611081,4456582.92156026],[1203209.07270258,4455768.00578797]]],[[[1095967.88277402,4458548.3599],[1141302.96803855,4465118.53286708],[1155712.60820481,4400612.12358259],[1232059.41117301,4446271.476386],[1163876.00042313,4317604.54866612],[1238862.03393588,4195976.13404922],[1113844.23452254,4051239.94244268],[1150146.74498463,3988626.5339942],[1229925.75049297,3977482.07491009],[1243562.27679565,3923321.80504963],[1283077.46776203,3918041.3651214],[1287688.0984317,3821499.22537482],[1145168.31471737,3723231.51342457],[1136973.86436108,3597841.54159008],[1061666.56279791,3533714.21290996],[1008028.82463204,3776444.08807816],[929363.014031642,3833524.28549665],[834061.173449126,4013705.60709871],[918571.145996682,4115666.32874883],[910995.409370244,4372987.02853281],[959799.989204327,4430937.39057162],[1076737.66337847,4486332.07227576],[1095967.88277402,4458548.3599]]],[[[992722.283328495,4510550.55500144],[990310.546560454,4512656.78156504],[995721.787007911,4514372.44754152],[992722.283328495,4510550.55500144]]]]},"properties":{"cartodb_id":201,"fips":"TS","iso2":"TN","iso3":"TUN","un":788,"name":"Tunisia","area":15536,"pop2005":10104685,"region":2,"subregion":15,"lon":9.596,"lat":35.383,"created_at":"2014-08-28","updated_at":"2014-08-28"}}
    var tilePoint = {
      x: 8,
      y: 6,
      zoom: 4
    }
    var first = true
    spain.geometry.coordinates.forEach(function(mp) {
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
      })
    })
    c.stroke()
    console.log(c.toString())

