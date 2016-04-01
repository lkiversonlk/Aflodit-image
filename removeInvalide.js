/**
 * Created by jerry on 4/1/16.
 */
var path = require("path");
var client = require("mongodb").MongoClient;
var readline = require("readline");
var fs = require("fs");

var imageFile = process.argv[2];
var imageFolder = process.argv[3];

var imageFilePath = path.resolve(imageFile);
var imageFolderPath = path.resolve(imageFolder);

console.log("parsing " + imageFilePath);


client.connect("mongodb://localhost/aflodit", function(err, db){
    var collection = db.collection("images");
    if(err){
        console.log("error : " + err);
        process.exit(-1);
    }
    console.log("connected");

    var reader = readline.createInterface({
        input : fs.createReadStream(imageFilePath)
    });

    reader.on("line", function(line){
        var info = line.split(",");
        if(info.length == 3){
            console.log("processing line " + line);
            var imageId = info[0];
            collection.deleteOne({file_id : imageId}, function(err, result){
                if(err){
                    console.log("error : " + err);
                }else{
                    if(result.result.n != 1){
                        console.log("id " + imageId + " has " + result.result.n + " records");
                    }else{
                        console.log("delete id " + imageId);
                    }
                    //delete file
                    var imageFilePath = path.join(imageFolderPath, imageId.substr(0, 2), imageId);
                    console.log("delete file " + imageFilePath);
                    try{
                        fs.unlinkSync(imageFilePath);
                    }catch (error){
                        console.log("error :" + error);
                    }

                }
            });
        }else{
            console.log("unrecognized line "  + line);
        }
    });

});

function wait(){
    setTimeout(wait, 10000);
}

wait();