/**
 * Created by jerry on 4/1/16.
 */
var easyimg = require("easyimage");
var fs = require("fs");
var path = require("path");
var log = require("./logger");

function ImageProcessor(imagePath){
    this.path = imagePath;
    this.imageId = path.basename(imagePath);
}

ImageProcessor.prototype.info = function(callback){
    var self = this;
    return easyimg.info(self.path);
};

ImageProcessor.prototype.process = function(){
    var self = this;
    var ext = path.extname(self.path);

    var info = self.info();

    if(ext.length > 0){
        //fs.unlinkSync(self.path);
        return info;
    }else{
        return info
            .then(function(info){
                // type: 'jpeg',
                // depth: 8,
                //  width: 700,
                // height: 1050,
                // size: 146000,
                // density: { x: 72, y: 72 },
                var wDh = info.width / info.height;
                if(wDh > 1) {
                    log(self.imageId, "size", wDh);
                }
                return "ok";
            });
    }
};

module.exports = ImageProcessor;