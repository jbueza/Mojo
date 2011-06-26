require 'rubygems'
require 'rake/clean'

BLAST_MOJO_VERSION = "0.1.6"
OUTPUT = "dist"
CONFIGURATION = 'Release'

desc "Compiles solution and runs unit tests"
task :default => [:clean, :version, :compile, :test, :publish, :package]

#Add the folders that should be cleaned as part of the clean task
CLEAN.include(OUTPUT)


desc "Runs all Jasmine specs"
task :specs do
  puts "Running all Jasmine specs..."
end	

desc "Generates a version of Blast Mojo using Zepto as its underlying helper library"
task :mobile do
  puts "Generating on top of Zepto"
end

desc "Removes the build directory"
task :clean do
  rm_rf OUTPUT
end


