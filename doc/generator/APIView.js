var fs = require("fs");
var sys = require("sys");

var textile = require("./textile");

APIView = function(name, content_file, path, encoding) {
    encoding = encoding || "utf8";
    
    this.name = name;
    this.buildDirectory = path;
    this.content_file = content_file;

    var file_content = "";    
    try {
        file_content = fs.readFileSync(content_file, encoding);
    } catch (e) {
        throw new Error("Cannot read Textile-File at " + content_file);
    }
    
    this.content = file_content;
};

APIView.prototype.save = function() {    
  var self = this;
  var html = textile.convert(this.content)    
    , buildTo = self.buildDirectory + '/' + self.name
    , fileName = buildTo + '.html';
    
  fs.writeFile(fileName, html, function(err) {
    if(err) {
        sys.puts(err);
    } else {
        sys.puts(fileName + '' + " was generated!");
    }
  });

};
