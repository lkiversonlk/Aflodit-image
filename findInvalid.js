/**
 * Created by jerry on 4/1/16.
 */
var easyimg = require("easyimage");
var path = require("path");
var fs = require("fs");
var config = require(path.join(process.env.HOME, ".aflodit.json"));

var imageFolder = config.folder;
var mongoUrl = config.mongo + "/" + config.database;

console.log("find invalid in " + imageFolder);
//var mongoose = require("mongoose");
//mongoose.connect(mongoUrl);

/**
 * process the list sequentially
 * @param list
 * @param iterator
 */
function sequentialList(list, iterator, callback){
    _sequentialList(list, 0, iterator, callback);
};

function _sequentialList(list, i, iterator, callback){
    if(i >= list.length){
        return callback();
    }

    iterator(list[i], function(error){
        if(error){
            console.log("error: " + error);
            return callback(error);
        }else{
            _sequentialList(list, i+1, iterator, callback);
        }
    });
};


function _process(file, callback){
    var stat = fs.lstatSync(file);
    if(stat.isDirectory()){
        processDir(file, callback);
    }else if(stat.isFile()){
        processFile(file, callback);
    }
};

function processFile(file, callback){
    //console.log("process file " + path);
    easyimg.info(file)
        .then(
            function(result){
                var wDh = result.width / result.height;
                if(wDh > 1){
                    console.log(path.basename(file)+ ",size");
                }
                callback();
            },
            function(error){
                console.log(path.basename(file)+ ",unknown");
                callback();
            }
        )
};

function processDir(dirPath, callback){
    var files = fs.readdirSync(dirPath);

    sequentialList(
        files.map(function(file){
            return path.join(dirPath, file);
        })
        , _process
        , callback
    );
};

var end = false;
_process(imageFolder, function(error, result){
    end = true;
});

function wait(){
    if(end){
        return ;
    }else{
        setTimeout(wait, 10000);
    }
}

//wait();