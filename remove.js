/**
 * Created by jerry on 4/2/16.
 */
var client = require("mongodb").MongoClient;
var path = require("path");
var config = require(path.join(process.env.HOME, ".aflodit.json"));

var imageFolder = config.folder;
var mongoUrl = "mongodb://" + config.mongo.mongourl + "/" + config.mongo.db;

var readline = require("readline");

console.log("use mongo " + mongoUrl);

client.connect(mongoUrl, function(err, db){
    if(err){
        console.log("error : " + err);
        process.exit(-1);
    }
    var reader = readline.createInterface({
        input : require("fs").createReadStream(path.resolve(process.argv[2]))
    });

    reader.on("line", function(line){
        var info = line.split(",");
        var fild_id = info[0];
        db.collection('images').remove({file_id : fild_id}, function(err, result){
            if(err){
                console.log("error: " + err);
            }else{
                console.log(Date.now() + "delete " + result.result.n);
            }
        });
    });

});