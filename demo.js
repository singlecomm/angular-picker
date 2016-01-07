import angular from 'angular';
import picker from './src/module';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

angular
  .module('demo', [picker])
  .controller('DemoCtrl', /*@ngInject*/ function($scope) {
    $scope.data = {
      selectedItems: [],
      choices: []
    };
    for (var i = 0; i < 50; i++) {
      $scope.data.choices.push({
        label: (i + 1) + ' item',
        id: i + 1
      });
    }
    for (var j = 50; j < 150; j++) {
      $scope.data.selectedItems.push({
        label: (j + 1) + ' item',
        id: j + 1
      });
    }
  });
