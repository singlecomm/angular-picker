Angular-Picker
==============
[![Build Status](https://snap-ci.com/singlecomm/angular-picker/branch/master/build_image)](https://snap-ci.com/singlecomm/angular-picker/branch/master)
![ScreenShot](https://cloud.githubusercontent.com/assets/3917887/12099721/4425c070-b2f8-11e5-95f3-1626b489d1e2.png)

----------

Requirements
----------
 * angular
 * angular-sanitize
 * bootstrap
 * font-awesome

Installation
----------
 * Install with Bower `bower install -S angular-picker`

Usage
----------
Load the script file angular-picker.js and the css file angular-picker.css in your application :

  ```
  <script type="text/javascript" src="dist/angular-picker.min.js"></script>
  <link rel="stylesheet" type="text/css" dist/angular-picker.min.css">
  ```

Add the angular-picker module as a dependency to your application module:

  ```
  var app = angular.module('app', ['angularPicker'])
  ```

Define the data source in your controller:
  ```
  app.controller('ctrl',function($scope) {
    $scope.choices = [
      {id: 1, label: 'item #1'}
    ];
  ```

Apply the directive:

  ```
  <picker choices="choices" ng-model="selected"></picker>
  ```



Development and Testing
----------

clone and repository and then

    npm install && npm start

And now you can write your code in src/ directory.

Have fun!

LICENSE
-------

> MIT license
>
> Copyright (c) 2015 SingleComm http://singlecomm.com
>
