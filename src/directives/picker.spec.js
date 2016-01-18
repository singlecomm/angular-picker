var module = window.module;
import angular from 'angular';
import 'angular-sanitize';

var element, scope, choicesLen, isolateScope;
describe('Directive: angular-picker', function() {
  beforeEach(module('ngSanitize'));
  beforeEach(module('angularPicker'));
  beforeEach(module('src/templates/picker.html'));
  beforeEach(inject(function($rootScope, $compile) {
    choicesLen = Math.floor(Math.random() * 100) + 1;
    element = angular.element('<picker choices="choices" ng-model="selected"></picker>');
    scope = $rootScope.$new();
    scope.choices = [];
    for (var i = 0; i < choicesLen; i++) {
      scope.choices.push({
        label: (i + 1) + ' item',
        id: i + 1
      });
    }

    $compile(element)(scope);
    scope.$digest();
    isolateScope = element.isolateScope().vm;
    isolateScope.selected = [];
  }));

  it('should have the correct amount of shown items in the left control', function() {
    var items = element.find('li');
    expect(items.length).to.equal(choicesLen < 10 ? choicesLen : 10);
  });

  it('should have the correct amount of choices available', function() {
    var scopeItems = isolateScope.left.items;
    expect(scopeItems.length).to.equal(choicesLen);
  });

  it('should have no items in the right control', function() {
    var scopeItems = isolateScope.right.items;
    expect(scopeItems.length).to.equal(0);
  });

  it('should move the first item from the left control to the right control', function() {
    var item = isolateScope.left.items[0];
    isolateScope.move('right', item);
    expect(isolateScope.left.items.length).to.equal(choicesLen - 1);
    expect(isolateScope.right.items.length).to.equal(1);
  });

  it('should move all items from the left control to the right control', function() {
    isolateScope.moveAll('right');
    expect(isolateScope.left.items.length).to.equal(0);
    expect(isolateScope.right.items.length).to.equal(choicesLen);
  });

  it('should select all items from the left control and move it to the right control', function() {
    for (var i = 0; i < choicesLen; i++) {
      var item = isolateScope.left.items[i];
      isolateScope.toggleSelected('left', item);
    }
    isolateScope.moveSelected('right');
    expect(isolateScope.left.items.length).to.equal(0);
    expect(isolateScope.right.items.length).to.equal(choicesLen);
  });

  it('should select all items from the first shown page of the left control and move it to the right control', function() {
    var shownLeftItems = isolateScope.left.shown;
    for (var i = 0; i < shownLeftItems.length; i++) {
      var item = shownLeftItems[i];
      isolateScope.toggleSelected('left', item);
    }
    isolateScope.moveSelected('right');
    expect(isolateScope.left.items.length).to.equal(choicesLen - shownLeftItems.length);
    expect(isolateScope.right.items.length).to.equal(shownLeftItems.length);
  });

  it('should find at least one item with target label in the left control', function() {
    var term = isolateScope.left.items[0].label;
    isolateScope.left.filter = term; //1 item
    isolateScope.filterShownItems('left');
    expect(isolateScope.left.shown.length).to.be.above(0);
  });
});
