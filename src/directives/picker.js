import angular from 'angular';
import template from 'ngtemplate!html!./../templates/picker.html';

export default function picker() {

  'ngInject';

  return {
    scope: {
      options: '=?',
      choices: '=',
      ngModel: '='
    },
    templateUrl: template,
    controllerAs: 'vm',
    bindToController: true,
    controller: function($scope, $timeout, $q) {

      'ngInject';

      const vm = this;
      const emptyControlData = {items: [], shown: [], selected: [], pages: [], currentPage: 1, pagesLen: 1, itemsLen: 0};
      const pagesBeingLoaded = [];
      vm.nextChoicePage = true;
      vm.options = vm.options || {};
      vm.isBackendPaginationApplied = angular.isFunction(vm.options.choicesCallback);
      vm.ngModel = vm.ngModel || [];
      vm.left = {};
      vm.right = {};
      vm.options = vm.options || {};
      vm.pageSize = vm.options.pageSize || 10;
      vm.left = angular.copy(emptyControlData);
      vm.right = angular.copy(emptyControlData);
      vm.right.items = vm.ngModel;
      vm.right.itemsLen = vm.ngModel.length;
      var filterTimeout = null;
      if (vm.choices) {
        if (vm.options.totalItems) {
          for (var t = 0; t < vm.options.totalItems; t++) {
            vm.choices.push(null);
          }
        }
        vm.choices = vm.choices.concat(vm.ngModel);
      }
      vm.cleanChoices = function() {
        var cleanChoices = [];
        angular.forEach(vm.choices, function(choice) {
          var isCleanChoice = true;
          angular.forEach(vm.right.items, function(selectedItem) {
            if (choice && (selectedItem.id === choice.id)) {
              isCleanChoice = false;
            }
          });
          if (isCleanChoice) {
            if (choice) {
              var choiceAlreadyThere = false;
              angular.forEach(cleanChoices, function(recChoice) {
                if (recChoice && choice && recChoice.id === choice.id) {
                  choiceAlreadyThere = true;
                }
              });
              if (!choiceAlreadyThere) {
                cleanChoices.push(choice);
              }
            } else {
              cleanChoices.push(choice);
            }
          }
        });
        vm.choices = cleanChoices;
      };

      vm.areAllPageItemsLoaded = function(pageId) {
        var allLoaded = true;
        angular.forEach(vm.left.pages[pageId], function(item) {
          if (!item) {
            allLoaded = false;
          }
        });
        return allLoaded;
      };

      vm.loadChoices = function() {
        var deferred = $q.defer();
        if (vm.isBackendPaginationApplied && !vm.left.filter) {
          if (pagesBeingLoaded.indexOf(vm.left.currentPage) === -1) {
            pagesBeingLoaded.push(vm.left.currentPage);
            if (!vm.left.pages[vm.left.currentPage - 1] || (vm.left.pages[vm.left.currentPage - 1] && !vm.areAllPageItemsLoaded(vm.left.currentPage - 1))) {
              var promise = vm.options.choicesCallback(vm.left.currentPage);
              vm.left.loading = true;
              promise.then(function(response) {
                var index = pagesBeingLoaded.indexOf(vm.left.currentPage);
                pagesBeingLoaded.splice(index, 1);
                var data = response.data;
                if (data && data.length > 0) {
                  vm.left.pages[vm.left.currentPage - 1] = data;
                  var fromIndex = (vm.left.currentPage - 1) * vm.pageSize;
                  var toIndex = (vm.left.currentPage * vm.pageSize);
                  var resIndex = 0;
                  var pageEmpty = false;
                  for (var choicesIndex = fromIndex; choicesIndex < toIndex; choicesIndex++) {
                    var responseItem = data[resIndex++];
                    var alreadySelected = false;
                    for (var selectedIndex = 0; selectedIndex < vm.right.items.length; selectedIndex++) {
                      var item = vm.right.items[selectedIndex];
                      if (item && responseItem && (item.id === responseItem.id)) {
                        pageEmpty = true;
                        alreadySelected = true;
                        data = data.splice(resIndex - 1, 1);
                      }
                    }
                    if (!alreadySelected) {
                      vm.choices[choicesIndex] = responseItem;
                    } else {
                      vm.choices[choicesIndex] = null;
                    }
                  }
                  if (pageEmpty) {
                    //vm.nextPage('left');
                  }
                  if (vm.options.totalItems && vm.left.pagesLen === vm.left.currentPage) {
                    vm.nextChoicePage = false;
                  }
                  vm.cleanChoices();
                  vm.filterChoices();
                } else {
                  vm.nextChoicePage = false;
                }
                vm.left.loading = false;
                deferred.resolve(vm.left.currentPage);
              });
            } else {
              vm.filterChoices();
              var index = pagesBeingLoaded.indexOf(vm.left.currentPage);
              pagesBeingLoaded.splice(index, 1);
              deferred.resolve(vm.left.currentPage);
            }
          }
        } else {
          vm.left.shown = vm.left.pages[vm.left.currentPage - 1];
          deferred.resolve(vm.left.currentPage);
        }
        return deferred.promise;
      };

      vm.getUnloadedChoiceCount = function() {
        return vm.getUnloadedChoicePages().length * vm.pageSize;
      };

      vm.getUnloadedChoicePages = function() {
        var unloadedPages = [];
        var pagesLen = vm.left.pagesLen;
        for (var i = 0; i < pagesLen; i++) {
          if (!vm.left.pages[i] || !vm.areAllPageItemsLoaded(i)) {
            unloadedPages.push(i + 1);
          }
        }
        return unloadedPages;
      };

      vm.loadAllChoicePages = function() {
        var promises = [];
        var toBeLoaded = vm.getUnloadedChoicePages();
        angular.forEach(toBeLoaded, function(pageId) {
          vm.left.currentPage = pageId;
          promises.push(vm.loadChoices());
        });
        return $q.all(promises);
      };

      vm.filterChoices = function() {
        var selectedRight = angular.copy(vm.ngModel);
        vm.right.pages = [];
        vm.left.pages = [];
        var filteredChoices = [];
        var allchoices = vm.choices.slice(0);
        angular.forEach(allchoices, function(choice) {
          var isChoiceSelected = false;
          angular.forEach(selectedRight, function(selectedItem) {
            if (selectedItem && choice && (choice.id === selectedItem.id)) {
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
        vm.left.shown = vm.left.pages[vm.left.currentPage - 1];
        if (vm.options.totalItems) {
          if (vm.left.items.length >= (vm.options.totalItems - vm.getUnloadedChoiceCount())) {
            vm.options.totalItems = vm.left.items.length;
          }
          vm.left.pagesLen = Math.ceil(vm.options.totalItems / vm.pageSize);
        } else {
          vm.left.pagesLen = Math.ceil(vm.left.items.length / vm.pageSize);
        }
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
      };

      vm.updateShownItems = function(control, filteredItems) {
        vm[control].itemsLen = filteredItems.length;
        while (filteredItems.length > 0) {
          vm[control].pages.push(filteredItems.splice(0, vm.pageSize));
        }
        vm[control].shown = vm[control].pages[0];
        vm[control].currentPage = 1;
        vm[control].pagesLen = vm[control].pages.length;
        filterTimeout = null;
      };

      vm.filterShownItems = function(control) {
        var promise = control === 'left' && angular.isFunction(vm.options.choicesFilterCallback) ? vm.options.choicesFilterCallback(vm.left.filter) : null;
        var isBackendPagination = control === 'left' && promise && angular.isFunction(promise.then);
        var timeoutDelay = isBackendPagination ? 800 : 0;
        if (filterTimeout) {
          $timeout.cancel(filterTimeout);
        }
        filterTimeout = $timeout(function() {
          var term = vm[control].filter;
          if (term) {
            var filteredItems = [];
            if (isBackendPagination) {
              vm.left.loading = true;
              promise.then(function(response) {
                vm[control].pages = [];
                vm[control].shown = [];
                filteredItems = response.data.filter(function(responseItem) {
                  var isSelectedItem = true;
                  angular.forEach(vm.ngModel, function(selectedItem) {
                    if (selectedItem && responseItem && (responseItem.id === selectedItem.id)) {
                      isSelectedItem = false;
                    }
                  });
                  return isSelectedItem;
                });
                vm.updateShownItems(control, filteredItems);
                vm.left.loading = false;
              });
            } else {
              vm[control].pages = [];
              vm[control].shown = [];
              var itemSet = vm[control].items;
              angular.forEach(itemSet, function(item) {
                var itemLabel = item.label || vm.options.label(item);
                if (itemLabel.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                  filteredItems.push(item);
                }
              });
              vm.updateShownItems(control, filteredItems);
            }
          } else {
            vm.filterChoices();
          }
        }, timeoutDelay);
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
        return vm.ngModel;
      }, function() {
        vm.cleanChoices();
        vm.filterChoices();
      }, true);

      vm.nextPage = function(target) {
        if ((vm[target].currentPage + 1) <= vm[target].pagesLen || vm.isBackendPaginationApplied) {
          vm[target].currentPage++;
          if (target === 'left' && vm.isBackendPaginationApplied) {
            vm.loadChoices();
          } else {
            vm[target].shown = vm[target].pages[vm[target].currentPage - 1];
          }
        }
      };

      vm.previousPage = function(target) {
        vm.nextChoicePage = true;
        if (vm[target].currentPage > 1) {
          if (vm[target].currentPage > vm[target].pagesLen) {
            vm[target].currentPage = vm[target].pagesLen + 1;
          }
          vm[target].currentPage--;
          vm[target].shown = vm[target].pages[vm[target].currentPage - 1];
        }
        vm.loadChoices();
      };

      vm.move = function(to, item) {
        if (!item) {
          return;
        }
        var from = to === 'left' ? 'right' : 'left';
        vm[from].items = vm[from].items.filter(function(selectedItem) {
          return selectedItem && item && (selectedItem.id !== item.id);
        });
        vm[to].items = vm[to].items || [];
        vm[to].items.push(item);
        vm.ngModel = angular.copy(vm.right.items);
        if (to === 'left') {
          vm.choices = vm.choices.concat(item);
          vm.cleanChoices();
          vm.loadChoices();
        } else {
          vm.filterChoices();
        }
      };

      vm.moveAll = function(to) {
        var from = to === 'left' ? 'right' : 'left';
        var itms = angular.copy(vm[from].items);
        vm[to].items = vm[to].items || [];
        angular.forEach(itms, function(item) {
          vm[from].items = vm[from].items.filter(function(selectedItem) {
            return selectedItem && item && (selectedItem.id !== item.id);
          });
          vm[to].items.push(item);
        });
        vm[from].selected = [];
        vm[to].selected = [];
        vm[from].currentPage = 1;
        vm.ngModel = angular.copy(vm.right.items);
        if (to === 'left') {
          vm.choices = vm.choices.concat(itms);
          vm.cleanChoices();
          vm.loadChoices();
        } else {
          vm.filterChoices();
        }
      };

      vm.moveSelected = function(to) {
        var from = to === 'left' ? 'right' : 'left';
        var itms = vm[from].items.slice(0);
        vm[to].items = vm[to].items || [];
        angular.forEach(itms, function(item) {
          if (vm.isItemSelected(from, item)) {
            vm[from].items = vm[from].items.filter(function(selectedItem) {
              return selectedItem && item && (selectedItem.id !== item.id);
            });
            vm[to].items.push(item);
          }
        });
        vm[from].selected = [];
        vm[to].selected = [];
        vm.ngModel = angular.copy(vm.right.items);
        if (to === 'left') {
          vm.choices = vm.choices.concat(itms);
          vm.cleanChoices();
          vm.loadChoices();
        } else {
          vm.filterChoices();
        }
      };

      vm.toggleSelected = function(dir, item) {
        if (vm.isItemSelected(dir, item)) {
          vm[dir].selected = vm[dir].selected.filter(function(selectedItem) {
            return selectedItem && item && (selectedItem.id !== item.id);
          });
        }else {
          vm[dir].selected.push(item);
        }
      };

      vm.isItemSelected = function(dir, item) {
        var selected = false;
        angular.forEach(vm[dir].selected, function(selectedItem) {
          if (selectedItem && item && (item.id === selectedItem.id)) {
            selected = true;
          }
        });
        return selected;
      };

      $timeout(function() {
        if (vm.isBackendPaginationApplied) {
          vm.loadChoices();
        }
      });
    }
  };
}
