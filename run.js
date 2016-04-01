/**
 * Created by jerry on 4/1/16.
 */

var ImageProcessor = require("./processImage");
var args = process.argv;

function usage(){
    console.log("==========usage=============");
    console.log("node run.js <folder>");
};

if(args.length != 3){
    usage();
    process.exit(-1);
}

var path = require("path");
var fs = require("fs");

function processFile(path){
    //console.log("processing file " + path);
    new ImageProcessor(path).process();
    /*
        .then(function(result){
            console.log(result);
        }, function(error){
            console.log(error);
        });
        */
};

function processDir(dirPath){
    var files = fs.readdirSync(dirPath);
    files.forEach(function(file){
        var filePath = path.join(dirPath, file);
        var stat = fs.lstatSync(filePath);
        if(stat.isDirectory()){
            processDir(filePath);
        }else if(stat.isFile()){
            processFile(filePath);
        }
    })
}

var imageFolderPath = path.resolve(args[2]);

//console.log("processing folder " + imageFolderPath);

processDir(imageFolderPath);

function wait(){
    setTimeout(wait, 10000);
}

wait();