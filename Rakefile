require 'rubygems'
require 'rake/clean'
require 'launchy'

BLAST_MOJO_VERSION = "v0.1.6"
SRC = "src"
OUTPUT = "dist"
OUTPUT_FILE = "mojo.js.uncompressed.js"
OUTPUT_FILE_MINIFIED = "mojo.js"
YUICOMPRESSOR = "build/yuicompressor.jar"

desc "Compiles solution and runs unit tests"
task :default => [:clean, :version, :build, :specs]

desc "Removes the build directory"
task :clean do
  puts "Deleting ..."
  rm_rf OUTPUT
end

desc "Outputs the current version of Blast Mojo"
task :version do
  puts "The current version is #{BLAST_MOJO_VERSION}"
end

desc "Concatenates and minifies Mojo source"
task :build => :clean do
  
  mojo_classes =  [ "LICENSE", "#{SRC}/Core.js", "#{SRC}/Messaging.js", "#{SRC}/Model.js", "#{SRC}/Request.js", "#{SRC}/Controller.js", "#{SRC}/Application.js", "#{SRC}/Service.js", "#{SRC}/ServiceLocator.js" ]

  Dir.mkdir OUTPUT
  
  File.open("#{OUTPUT}/#{OUTPUT_FILE}","w+") { | f |
    f.puts mojo_classes.map{ | s | IO.read(s) } 
  }
  
  cmd = "java -jar #{YUICOMPRESSOR} #{OUTPUT}/#{OUTPUT_FILE} -o #{OUTPUT}/#{OUTPUT_FILE_MINIFIED} --charset UTF-8 --preserve-semi"
  ret = system(cmd)
  raise "Minification failed for #{OUTPUT}/#{OUTPUT_FILE_MINIFIED}" if !ret
end

desc "Runs all Jasmine specs"
task :specs do
  Launchy.open(Dir.pwd + "/test/SpecRunner.html")
  puts "Running all Jasmine specs..."
end	

desc "Generates a version of Blast Mojo using Zepto as its underlying helper library"
task :mobile do
  puts "Generating on top of Zepto"
end
