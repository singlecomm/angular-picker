(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular")) : factory(root["angular"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _directivesPicker = __webpack_require__(2);

	var _directivesPicker2 = _interopRequireDefault(_directivesPicker);

	var _filtersHighlight = __webpack_require__(4);

	var _filtersHighlight2 = _interopRequireDefault(_filtersHighlight);

	__webpack_require__(5);

	exports['default'] = _angular2['default'].module('angularPicker', []).directive('picker', _directivesPicker2['default']).filter('highlight', _filtersHighlight2['default']).name;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = picker;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _ngtemplateHtmlTemplatesPickerHtml = __webpack_require__(3);

	var _ngtemplateHtmlTemplatesPickerHtml2 = _interopRequireDefault(_ngtemplateHtmlTemplatesPickerHtml);

	function picker() {

	  'ngInject';

	  return {
	    scope: {
	      options: '=?',
	      choices: '=',
	      ngModel: '='
	    },
	    templateUrl: _ngtemplateHtmlTemplatesPickerHtml2['default'],
	    controllerAs: 'vm',
	    bindToController: true,
	    controller: ["$scope", "$timeout", function controller($scope, $timeout) {

	      'ngInject';

	      var vm = this;
	      var emptyControlData = { items: [], shown: [], selected: [], pages: [], currentPage: 1, pagesLen: 1, itemsLen: 0 };
	      var pagesBeingLoaded = [];
	      vm.nextChoicePage = true;
	      vm.options = vm.options || {};
	      vm.isBackendPaginationApplied = _angular2['default'].isFunction(vm.options.choicesCallback);
	      vm.ngModel = vm.ngModel || [];
	      vm.left = {};
	      vm.right = {};
	      vm.options = vm.options || {};
	      vm.options.backendPagination = vm.options.backendPagination || {};
	      vm.pageSize = vm.options.pageSize || 10;
	      vm.left = _angular2['default'].copy(emptyControlData);
	      vm.right = _angular2['default'].copy(emptyControlData);
	      vm.right.items = vm.ngModel;
	      vm.right.itemsLen = vm.ngModel.length;
	      var filterTimeout = null;
	      if (vm.choices) {
	        vm.choices = vm.choices.concat(vm.ngModel);
	      }

	      vm.isChoicesNextDisabled = function () {
	        return vm.left.currentPage === vm.left.pagesLen;
	      };

	      vm.loadChoices = function () {
	        if (vm.isBackendPaginationApplied && !vm.left.filter) {
	          var currentChoicesPageNo = _angular2['default'].copy(vm.left.currentPage);
	          vm.left.currentPage--;
	          if (pagesBeingLoaded.indexOf(currentChoicesPageNo) === -1) {
	            pagesBeingLoaded.push(currentChoicesPageNo);
	            if (!vm.left.pages[currentChoicesPageNo]) {
	              var promise = vm.options.choicesCallback(currentChoicesPageNo);
	              vm.left.loading = true;
	              promise.then(function (response) {
	                var index = pagesBeingLoaded.indexOf(currentChoicesPageNo);
	                pagesBeingLoaded.splice(index, 1);
	                if (response.data && response.data.length > 0) {
	                  vm.left.pages[currentChoicesPageNo] = response.data;
	                  vm.choices = vm.choices.concat(response.data);
	                  vm.filterChoices();
	                  if (vm.options.totalItems && vm.left.pagesLen === vm.left.currentPage) {
	                    vm.nextChoicePage = false;
	                  }
	                } else {
	                  vm.nextChoicePage = false;
	                  vm.left.currentPage--;
	                }
	                vm.left.loading = false;
	                vm.left.currentPage++;
	              });
	            } else {
	              var index = pagesBeingLoaded.indexOf(currentChoicesPageNo);
	              pagesBeingLoaded.splice(index, 1);
	              vm.left.currentPage++;
	              vm.left.shown = vm.left.pages[vm.left.currentPage - 1];
	            }
	          }
	        } else {
	          vm.left.shown = vm.left.pages[vm.left.currentPage - 1];
	        }
	      };
	      vm.filterChoices = function () {
	        var selectedRight = _angular2['default'].copy(vm.right.items);
	        vm.ngModel = _angular2['default'].copy(vm.right.items);
	        vm.right.pages = [];
	        vm.left.pages = [];

	        var filteredChoices = [];
	        _angular2['default'].forEach(vm.choices, function (choice) {
	          var isChoiceSelected = false;
	          _angular2['default'].forEach(selectedRight, function (selectedItem) {
	            if (choice.id === selectedItem.id) {
	              isChoiceSelected = true;
	            }
	          });
	          if (!isChoiceSelected) {
	            filteredChoices.push(choice);
	          }
	        });

	        vm.left.items = filteredChoices.slice(0);
	        vm.left.itemsLen = filteredChoices.length;
	        if (filteredChoices && filteredChoices.length > 0) {
	          while (filteredChoices.length > 0) {
	            vm.left.pages.push(filteredChoices.splice(0, vm.pageSize));
	          }
	        }
	        if (vm.options.totalItems) {
	          // @TODO update totalItems after being moved to the right control
	          vm.left.pagesLen = parseInt(vm.options.totalItems / vm.pageSize);
	        } else {
	          vm.left.pagesLen = vm.left.pages.length;
	        }

	        if (vm.left.currentPage > vm.left.pages.length && vm.left.pages.length > 0) {
	          vm.left.currentPage = vm.left.pages.length;
	        }
	        vm.left.shown = vm.left.pages[Math.min(vm.left.currentPage, vm.left.pages.length) - 1];

	        if (selectedRight && selectedRight.length > 0) {
	          while (selectedRight.length > 0) {
	            vm.right.pages.push(selectedRight.splice(0, vm.pageSize));
	          }
	        }
	        if (vm.right.currentPage > vm.right.pages.length && vm.right.pages.length > 0) {
	          vm.right.currentPage = vm.right.pages.length;
	        }
	        vm.right.pagesLen = vm.right.pages.length;
	        vm.right.itemsLen = vm.ngModel.length;
	        vm.right.shown = vm.right.pages[Math.min(vm.right.currentPage, vm.right.pages.length) - 1];

	        if (vm.right.filter) {
	          vm.filterShownItems('right');
	        }
	        if (vm.left.filter) {
	          vm.filterShownItems('left');
	        }
	      };

	      vm.magicMaker = function (control, filteredItems) {
	        vm[control].itemsLen = filteredItems.length;
	        while (filteredItems.length > 0) {
	          vm[control].pages.push(filteredItems.splice(0, vm.pageSize));
	        }
	        vm[control].shown = vm[control].pages[0];
	        vm[control].currentPage = 1;
	        vm[control].pagesLen = vm[control].pages.length;
	        filterTimeout = null;
	      };
	      vm.filterShownItems = function (control) {
	        var promise = control === 'left' && _angular2['default'].isFunction(vm.options.choicesFilterCallback) ? vm.options.choicesFilterCallback(vm.left.filter) : null;
	        var isBackendPagination = control === 'left' && promise && _angular2['default'].isFunction(promise.then);
	        var timeoutDelay = isBackendPagination ? 800 : 0;
	        if (filterTimeout) {
	          $timeout.cancel(filterTimeout);
	        }
	        filterTimeout = $timeout(function () {
	          var term = vm[control].filter;
	          if (term) {
	            var filteredItems = [];
	            if (isBackendPagination) {
	              vm.left.loading = true;
	              promise.then(function (response) {
	                vm[control].pages = [];
	                vm[control].shown = [];
	                filteredItems = response.data.filter(function (responseItem) {
	                  var isSelectedItem = true;
	                  _angular2['default'].forEach(vm.ngModel, function (selectedItem) {
	                    if (responseItem.id === selectedItem.id) {
	                      isSelectedItem = false;
	                    }
	                  });
	                  return isSelectedItem;
	                });
	                vm.magicMaker(control, filteredItems);
	                vm.left.loading = false;
	              });
	            } else {
	              vm[control].pages = [];
	              vm[control].shown = [];
	              var itemSet = vm[control].items;
	              _angular2['default'].forEach(itemSet, function (item) {
	                var itemLabel = item.label || vm.options.label(item);
	                if (itemLabel.toLowerCase().indexOf(term.toLowerCase()) > -1) {
	                  filteredItems.push(item);
	                }
	              });
	              vm.magicMaker(control, filteredItems);
	            }
	          } else {
	            vm.filterChoices();
	          }
	        }, timeoutDelay);
	      };

	      vm.clearFilter = function (control) {
	        vm[control].filter = '';
	        vm.filterChoices();
	      };

	      $scope.$watch(function () {
	        return vm.choices;
	      }, function () {
	        vm.filterChoices();
	      }, true);

	      $scope.$watch(function () {
	        return vm.ngModel.length;
	      }, function () {
	        vm.right.items = _angular2['default'].copy(vm.ngModel);
	        vm.filterChoices();
	      });

	      vm.move = function (to, item) {
	        if (!item) {
	          return;
	        }
	        var from = to === 'left' ? 'right' : 'left';
	        vm[from].items = vm[from].items.filter(function (selectedItem) {
	          return selectedItem.id !== item.id;
	        });
	        vm[to].items = vm[to].items || [];
	        vm[to].items.push(item);
	        vm.filterChoices();
	      };

	      vm.nextPage = function (target) {
	        if (vm[target].currentPage + 1 <= vm[target].pagesLen || vm.isBackendPaginationApplied) {
	          vm[target].currentPage++;
	          if (target === 'left' && vm.isBackendPaginationApplied) {
	            vm.loadChoices();
	          } else {
	            vm[target].shown = vm[target].pages[vm[target].currentPage - 1];
	          }
	        }
	      };

	      vm.previousPage = function (target) {
	        vm.nextChoicePage = true;
	        if (vm[target].currentPage > 1) {
	          vm[target].currentPage--;
	          vm[target].shown = vm[target].pages[vm[target].currentPage - 1];
	        }
	      };

	      vm.moveAll = function (to) {
	        var from = to === 'left' ? 'right' : 'left';
	        var itms = _angular2['default'].copy(vm[from].items);
	        vm[to].items = vm[to].items || [];
	        _angular2['default'].forEach(itms, function (item) {
	          vm[from].items = vm[from].items.filter(function (selectedItem) {
	            return selectedItem.id !== item.id;
	          });
	          vm[to].items.push(item);
	        });
	        vm[from].selected = [];
	        vm[to].selected = [];
	        vm.filterChoices();
	      };

	      vm.moveSelected = function (to) {
	        var from = to === 'left' ? 'right' : 'left';
	        var itms = vm[from].items.slice(0);
	        vm[to].items = vm[to].items || [];
	        _angular2['default'].forEach(itms, function (item) {
	          if (vm.isItemSelected(from, item)) {
	            vm[from].items = vm[from].items.filter(function (selectedItem) {
	              return selectedItem.id !== item.id;
	            });
	            vm[to].items.push(item);
	          }
	        });
	        vm[from].selected = [];
	        vm[to].selected = [];
	        vm.filterChoices();
	      };

	      vm.toggleSelected = function (dir, item) {
	        if (vm.isItemSelected(dir, item)) {
	          vm[dir].selected = vm[dir].selected.filter(function (selectedItem) {
	            return selectedItem.id !== item.id;
	          });
	        } else {
	          vm[dir].selected.push(item);
	        }
	      };

	      vm.isItemSelected = function (dir, item) {
	        var selected = false;
	        _angular2['default'].forEach(vm[dir].selected, function (selectedItem) {
	          if (item.id === selectedItem.id) {
	            selected = true;
	          }
	        });
	        return selected;
	      };

	      vm.sortableOptions = {
	        placeholder: 'item',
	        connectWith: '.item-container'
	      };

	      vm.loadChoices();
	    }]
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	var path = '/Users/aymanjitan/Applications/angular-picker/src/templates/picker.html';
	var html = "<div class=\"picker row\">\n  <div class=\"col-xs-6 left-control\">\n    <label>Available</label>\n    <span class=\"fa fa-times clear-filter\" ng-if=\"vm.left.filter\" ng-click=\"vm.clearFilter('left')\"></span>\n    <input ng-model=\"vm.left.filter\" type=\"search\" class=\"form-control\" placeholder=\"Filter\" ng-change=\"vm.filterShownItems('left')\" />\n    <div class=\"buttons\">\n      <button ng-click=\"vm.moveAll('right')\" class=\"all\" type=\"button\"><i class=\"fa fa-angle-double-right\"></i></button>\n      <button ng-click=\"vm.moveSelected('right')\" class=\"single\" type=\"button\"><i class=\"fa fa-angle-right\"></i></button>\n    </div>\n    <div class=\"item-container-wrapper\">\n      <ul class=\"item-container\">\n        <span class=\"picker-message\" ng-if=\"!vm.left.shown.length || vm.left.loading\">\n          <span ng-if=\"vm.left.filter && !vm.left.loading\">No items found</span>\n          <span ng-if=\"!vm.left.filter && !vm.left.loading\">No items available</span>\n          <span ng-if=\"vm.left.loading\">Loading ...</span>\n        </span>\n        <li ng-dblclick=\"vm.move('right', item)\" ng-class=\"{ active: vm.isItemSelected('left', item) }\" class=\"item lock\" ng-click=\"vm.toggleSelected('left', item)\" ng-repeat=\"item in vm.left.shown\" ng-if=\"!vm.left.loading\">\n          <span ng-bind-html=\"(vm.options.label ? vm.options.label(item) : item.label) | highlight:vm.left.filter\"></span>\n        </li>\n      </ul>\n    </div>\n    <p class=\"clearfix\">\n      <span class=\"pull-left\">{{ vm.left.selected.length }} selected. Showing {{ vm.left.shown.length }} of {{ vm.left.itemsLen }}.</span>\n      <span class=\"pull-right\" ng-if=\"vm.left.pagesLen>1 || vm.isBackendPaginationApplied\">\n        <button ng-disabled=\"vm.left.currentPage == '1'\" class=\"btn btn-xs btn-default\" ng-click=\"vm.previousPage('left')\"><span class=\"fa fa-chevron-left\"></span></button>\n        <span>PAGE {{vm.left.currentPage}} OF {{vm.left.pagesLen}}</span>\n        <button ng-disabled=\"vm.isChoicesNextDisabled()\" class=\"btn btn-xs btn-default\" ng-click=\"vm.nextPage('left')\"><span class=\"fa fa-chevron-right\"></span></button>\n      </span>\n    </p>\n  </div>\n  <div class=\"col-xs-6 right-control\">\n    <label>Selected</label>\n    <span class=\"fa fa-times clear-filter\" ng-if=\"vm.right.filter\" ng-click=\"vm.clearFilter('right')\"></span>\n    <input ng-model=\"vm.right.filter\" type=\"search\" class=\"form-control\" placeholder=\"Filter\" ng-change=\"vm.filterShownItems('right')\" />\n    <div class=\"buttons\">\n      <button ng-click=\"vm.moveSelected('left')\" class=\"single\" type=\"button\"><i class=\"fa fa-angle-left\"></i></button>\n      <button ng-click=\"vm.moveAll('left')\" class=\"all\" type=\"button\"><i class=\"fa fa-angle-double-left\"></i></button>\n    </div>\n    <div class=\"item-container-wrapper\">\n      <ul class=\"item-container\">\n        <span class=\"picker-message\" ng-if=\"!vm.right.shown.length\">\n          No items\n          <span ng-if=\"vm.right.filter\">found</span>\n          <span ng-if=\"!vm.right.filter\">selected</span>\n        </span>\n        <li ng-dblclick=\"vm.move('left', item)\" ng-class=\"{ active: vm.isItemSelected('right', item) }\" class=\"item\" ng-click=\"vm.toggleSelected('right', item)\" ng-repeat=\"item in vm.right.shown\">\n          <span ng-bind-html=\"vm.options.label ? vm.options.label(item) : item.label | highlight:vm.right.filter\"></span>\n        </li>\n      </ul>\n    </div>\n    <p class=\"clearfix\">\n      <span class=\"pull-left\">{{ vm.right.selected.length }} selected. Showing {{ vm.right.shown.length }} of {{ vm.right.itemsLen }}.</span>\n      <span class=\"pull-right\" ng-if=\"vm.right.pagesLen>1\">\n        <button ng-disabled=\"vm.right.currentPage == '1'\" class=\"btn btn-xs btn-default\" ng-click=\"vm.previousPage('right')\"><span class=\"fa fa-chevron-left\"></span></button>\n        <span>PAGE {{vm.right.currentPage}} OF {{vm.right.pagesLen}}</span>\n        <button ng-disabled=\"vm.right.currentPage == vm.right.pagesLen\" class=\"btn btn-xs btn-default\" ng-click=\"vm.nextPage('right')\"><span class=\"fa fa-chevron-right\"></span></button>\n      </span>\n    </p>\n  </div>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = highlight;

	function highlight() {
	  function escapeRegexp(queryToEscape) {
	    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	  }

	  return function (item, query) {
	    if (query && item) {
	      return item.toString().replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="filter-highlight">$&</span>');
	    }
	    return item;
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;