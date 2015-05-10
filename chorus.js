process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

var Firebase         = require("firebase")
var SpotifyWebHelper = require("./spotify-web-helper")

var fb = new Firebase(process.env["FIREBASE_URL"])
var sp = new SpotifyWebHelper.SpotifyWebHelper()

if (process.argv[2] == "lead")
  setStatus()
else
  getStatus()


// leader publishes status to Firebase every 2 seconds
function setStatus() {
  console.log("setStatus")
  setInterval(function() {
    sp.getStatus(function (err, res) {
      if (err) {
        console.log("sp.getStatus error", err)
        return
      }

      res["playlist"] = process.argv[3]
      fb.set(res)
      console.log(res)
    })

  }, 2000)
}

// follower plays song in playlist based on leader status
function getStatus() {
  var playlist = null
  var track    = null

  fb.child("playlist").on("value", function(snapshot) {
    playlist = snapshot.val()
    console.log("playlist=" + playlist)
  })

  fb.child("track/track_resource/uri").on("value", function(snapshot) {
    track = snapshot.val()
    console.log("track=" + track)
  })

  fb.child("playing_position").on("value", function(snapshot) {
    playing_position = snapshot.val()
    console.log("position=" + playing_position)

    if (playlist && track && playing_position <= 5) {
      console.log("play track=" + track)
      sp.play(track, playlist, function(err, res) {
        console.log(err, res)
      })
    }
  })
}