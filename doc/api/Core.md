# Mojo Core

Provides helper methods for managing your Mojo applications (namespacing, requiring, and creation).

## Properties

### controllers

List of Mojo Controllers available to applications.

## API

### require(path, callback)

Fetches a resource. Currently piggybacks off of jQuery's require() and blocks.

### define(controllerName, implementation)

Namespaces, provides, and creates a Mojo controller.

### create(options) 

Returns a new Mojo application instance.

