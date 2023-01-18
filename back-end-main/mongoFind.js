var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://vtol_auav:KERUPUKKOPI@vtol1.pcfeymo.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ESP32");
  dbo
    .collection("plant")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
