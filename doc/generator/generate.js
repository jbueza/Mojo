var path   = require('path'),
    sys    = require('sys'),
    fs     = require('fs'),
    events = require('events');
    
    require("./APIView");

var target = path.join(__dirname, '..', 'api')
  , build = path.join(__dirname, '..', 'site');

fs.readdir(target, function(err, files) {  
  if (err) throw new Error("Unable to read directory.");
  files.forEach(function(file, index) {
    fs.stat(path.join(target, file), function (stat_error, stat) {
      if (stat_error) console.log("ERROR: " + file + ", " + stat_error);
      if (stat.isFile()) {
        var doc = path.join(target, file);
        
        fs.readFile(doc, 'ascii', function (read_error, content) {
          if (read_error) console.log("ERROR: Can't read " + doc + ". " + read_error);
          var view = new APIView(file.split(".")[0], doc, build);
          view.save();
        });
      }
    });
  });
});