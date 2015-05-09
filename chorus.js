process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

var SpotifyWebHelper = require("./spotify-web-helper")
var sp = new SpotifyWebHelper.SpotifyWebHelper()

sp.getStatus(function (err, res) {
  if (err)
    console.log("getStatus error", err)
  else
    console.log(res)
})