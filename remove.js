/**
 * Created by jerry on 4/2/16.
 */
var client = require("mongodb").MongoClient;
var path = require("path");
var fs = require("fs");


var config = require(path.join(process.env.HOME, ".aflodit.json"));
var imageFolder = config.folder;
var mongoUrl = "mongodb://" + config.mongo.mongourl + "/" + config.mongo.db;

var readline = require("readline");

console.log("remvoe invalid in " + imageFolder + " with mongo " + mongoUrl);

var remains = 0;
var finished = false;

client.connect(mongoUrl, function(err, db){
    if(err){
        console.log("error : " + err);
        process.exit(-1);
    }
    var reader = readline.createInterface({
        input : require("fs").createReadStream(path.resolve(process.argv[2]))
    });

    reader.on("line", function(line){
        remains ++;
        var info = line.split(",");
        var fild_id = info[0];
        db.collection('images').remove({file_id : fild_id}, function(err, result){
            if(err){
                console.log("error: " + err);
            }else{
                console.log(Date.now() + "delete " + result.result.n);
                try{
                    var filePath = path.join(imageFolder, fild_id.substr(0,2), fild_id);
                    console.log("delete file " + filePath);
                    fs.unlinkSync(filePath);
                }catch (error){
                    console.log("error: " + error);
                }

            }
            remains --;

            if(remains == 0 && finished){
                reader.close();
                db.close();
            }
        });
    });

    reader.on("close", function(){
        finished = true;
    });
});