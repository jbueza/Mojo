# Contributing to Blast Mojo

## Steps to get started with contributing ideas/code to Blast Mojo (jQuery with Joose Class Library) 
* Step 1: Fork the Repository on Github
* Step 2: Read the style guide
* Step 3: Discuss features on the Blast Mojo Google Groups
* Step 4: Developing features and using qunit for unit tests

### Fork the Repository on Github

The first thing we want to do is clone the repository from github. This is the same thing as doing an "svn checkout".

<code>$ git clone http://github.com/carynewfeldt/BlastMojoLite.git</code>

### Read the Style Guide

While the architecture is set out to heavily rely on Joose for Class creation, latest jQuery, and jQuery Plugins--we're primarily focusing on structure on small projects. Blast Mojo (version 1) has had issues with scaling down to small projects as the overall codebase and architecture is best suited for big deployments.

[Google Javascript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

* Indent with 2 spaces
* maximum 80 column width
* keywords followed by open-paren must be separated by a space. eg. <code>if (condition)</code> not <code>if(condition)</code>
* no space between function name and open paren e.g. <code>functionName(parameters)</code> not <code>functionName (parameters)</code>
* multi-line <code>if</code> statements must have braces.
* patches should all pass [JSLint](http://jslint.com)

