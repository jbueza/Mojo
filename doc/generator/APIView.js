var fs = require("fs");
var sys = require("sys");

var showdown = require('./showdown');
var converter = new showdown.converter();

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
  
  var publicName = self.name;
  
  if (publicName == 'index') {
    publicName = "Full API Documentation";
  } else {
    publicName = publicName + " Class";
  }
  
  var intro = [
      '<html>'
    , '<head>'
    , '<title>Blast Mojo: Structural JavaScript Framework: ', publicName, '</title>'
    , "<link href='http://fonts.googleapis.com/css?family=Permanent+Marker' rel='stylesheet' type='text/css'>"
    , '<link href="site.css" rel="stylesheet" type="text/css">'
    , '<link href="sunburst.css" rel="stylesheet" type="text/css">'
  ].join('');
  

  var outro = [
      '</body>'
    , '<script src="highlight.min.js"></script>'
    , '<script>hljs.initHighlighting();</script>'  
    , '</html>'
  ].join('');
  
  

  var html = intro + converter.makeHtml(this.content)  + outro
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
