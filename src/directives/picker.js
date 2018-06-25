import angular from 'angular';
import template from 'ngtemplate!html!./../templates/picker.html';

export default function picker() {

  'ngInject';

  return {
    scope: {
      options: '=?',
      choices: '=',
      ngModel: '=',
      limit: '<'
    },
    templateUrl: template,
    controllerAs: 'vm',
    bindToController: true,
    controller: function($scope) {

      'ngInject';

      const vm = this;
      const emptyControlData = {items: [], shown: [], selected: [], pages: [], currentPage: 1, pagesLen: 1, itemsLen: 0};
      vm.ngModel = vm.ngModel || [];
      vm.left = {};
      vm.right = {};
      vm.options = vm.options || {};
      vm.pageSize = 10;
      vm.limit = vm.limit || null;
      vm.left = angular.copy(emptyControlData);
      vm.right = angular.copy(emptyControlData);
      vm.right.items = vm.ngModel;
      vm.right.itemsLen = vm.ngModel.length;
      if (vm.choices) {
        vm.choices = vm.choices.concat(vm.ngModel);
      }

      function uniqBy(a, key) {
        var seen = {};
        return a.filter(function(item) {
          var k = key(item);
          return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
      }

      vm.filterChoices = function() {
        var selectedRight = angular.copy(vm.right.items);
        vm.ngModel = angular.copy(vm.right.items);
        vm.right.pages = [];
        vm.left.pages = [];

        var filteredChoices = [];
        angular.forEach(vm.choices, function(choice) {
          var isChoiceSelected = false;
          angular.forEach(selectedRight, function(selectedItem) {
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
        vm.left.pagesLen = vm.left.pages.length;
        if ((vm.left.currentPage > vm.left.pages.length) && vm.left.pages.length > 0) {
          vm.left.currentPage = vm.left.pages.length;
        }
        vm.left.shown = vm.left.pages[Math.min(vm.left.currentPage, vm.left.pages.length) - 1];

        if (selectedRight && selectedRight.length > 0) {
          while (selectedRight.length > 0) {
            vm.right.pages.push(selectedRight.splice(0, vm.pageSize));
          }
        }
        if ((vm.right.currentPage > vm.right.pages.length) && vm.right.pages.length > 0) {
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

        vm.choices = uniqBy(vm.choices, function(item) {
          return item.id;
        });
      };

      vm.filterShownItems = function(control) {
        var term = vm[control].filter;
        if (term) {
          vm[control].pages = [];
          var itemSet = vm[control].items;
          var filteredItems = [];
          vm[control].shown = [];
          angular.forEach(itemSet, function(item) {
            var itemLabel = item.label || vm.options.label(item);
            if (itemLabel.toLowerCase().indexOf(term.toLowerCase()) > -1) {
              filteredItems.push(item);
            }
          });
          vm[control].itemsLen = filteredItems.length;
          while (filteredItems.length > 0) {
            vm[control].pages.push(filteredItems.splice(0, vm.pageSize));
          }
          vm[control].shown = vm[control].pages[0];
          vm[control].currentPage = 1;
          vm[control].pagesLen = vm[control].pages.length;

        } else {
          vm.filterChoices();
        }
      };

      vm.clearFilter = function(control) {
        vm[control].filter = '';
        vm.filterChoices();
      };

      $scope.$watch(function() {
        return vm.choices;
      }, function() {
        vm.filterChoices();
      }, true);

      $scope.$watch(function() {
        return vm.ngModel.length;
      }, function() {
        vm.right.items = angular.copy(vm.ngModel);
        vm.filterChoices();
      });

      function canMove(from, numOfItems) {
        if (
          (
            from === 'left' &&
            numOfItems < vm.limit
          ) ||
          from === 'right' ||
          !vm.limit
        ) {
          return true;
        }
        return false;
      }

      vm.move = function(to, item) {
        if (!item) {
          return;
        }
        var from = to === 'left' ? 'right' : 'left';

        if (canMove(from, vm[to].items.length)) {
          vm[from].items = vm[from].items.filter(function(selectedItem) {
            return selectedItem.id !== item.id;
          });
          vm[to].items = vm[to].items || [];
          vm[to].items.push(item);
          vm.filterChoices();
        }
      };

      vm.nextPage = function(target) {
        vm[target].shown = vm[target].pages[vm[target].currentPage++];
      };

      vm.previousPage = function(target) {
        vm[target].currentPage--;
        vm[target].shown = vm[target].pages[vm[target].currentPage - 1];
      };

      vm.moveAll = function(to) {
        var from = to === 'left' ? 'right' : 'left';
        var itms = angular.copy(vm[from].items);
        vm[to].items = vm[to].items || [];
        angular.forEach(itms, function(item) {
          vm[from].items = vm[from].items.filter(function(selectedItem) {
            return selectedItem.id !== item.id;
          });
          vm[to].items.push(item);
        });
        vm[from].selected = [];
        vm[to].selected = [];
        vm.filterChoices();
      };

      vm.moveSelected = function(to) {
        var from = to === 'left' ? 'right' : 'left';
        var itms = vm[from].items.slice(0);
        vm[to].items = vm[to].items || [];
        angular.forEach(itms, function(item) {
          if (
            vm.isItemSelected(from, item) &&
            canMove(from, vm[to].items.length)
          ) {
            vm[from].items = vm[from].items.filter(function(selectedItem) {
              return selectedItem.id !== item.id;
            });
            vm[to].items.push(item);
          }
        });
        vm[from].selected = [];
        vm[to].selected = [];
        vm.filterChoices();
      };

      vm.toggleSelected = function(dir, item) {
        if (vm.isItemSelected(dir, item)) {
          vm[dir].selected = vm[dir].selected.filter(function(selectedItem) {
            return selectedItem.id !== item.id;
          });
        }else {
          vm[dir].selected.push(item);
        }
      };

      vm.isItemSelected = function(dir, item) {
        var selected = false;
        angular.forEach(vm[dir].selected, function(selectedItem) {
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

    }
  };
}
