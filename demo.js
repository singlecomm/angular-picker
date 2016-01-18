import angular from 'angular';
import 'angular-mocks';
import picker from './src/module';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'angular-sanitize';
angular
  .module('demo', [picker, 'ngMockE2E', 'ngSanitize'])
  .controller('DemoCtrl', /*@ngInject*/ function($scope, $timeout, $http) {
    $scope.data = {
      selectedItems: [],
      choices: [],
      options: {
        totalItems: 50,
        choicesCallback: function(currentPage) {
          currentPage = currentPage || 1;
          return $http({
            method: 'GET',
            url: '/choices',
            data: {
              page: currentPage
            }
          });
        },
        choicesFilterCallback: function(term) {
          return $http({
            method: 'GET',
            url: '/filter/choices',
            data: {
              term: term
            }
          });
        }
      }
    };
    /*
    $timeout(function() {
      for (var i = 0; i < 50; i++) {
        $scope.data.choices.push({
          label: 'item #' + (i + 1),
          id: i + 1
        });
      }
      for (var j = 50; j < 100; j++) {
        $scope.data.selectedItems.push({
          label: 'item #' + (j + 1),
          id: j + 1
        });
      }
    }, 3000);
    */
  }).config(/*@ngInject*/function($provide) {
    var delay = 100;
    $provide.decorator('$httpBackend', /*@ngInject*/ function($delegate) {
      function proxy(method, url, data, callback, headers) {
        function interceptor() {
          var that = this;
          var args = arguments;
          setTimeout(function() {
            callback.apply(that, args);
          }, delay);
        }
        return $delegate.call(this, method, url, data, interceptor, headers);
      }
      for (var key in $delegate) {
        proxy[key] = $delegate[key];
      }
      return proxy;
    });
  })
  .run(/*@ngInject*/function($httpBackend) {

    var remoteChoices = [];
    for (var j = 0; j < 50; j++) {
      var pageNo = parseInt(j / 10);
      remoteChoices[pageNo] = remoteChoices[pageNo] || [];
      remoteChoices[pageNo].push({
        label: 'item #' + (j + 1),
        id: j + 1
      });
    }

    $httpBackend.whenGET('/choices').respond(function(method, url, data) {
      console.info('XHR finished loading: GET "http://localhost:8000/choices".');
      data = JSON.parse(data);
      return [200, remoteChoices[data.page - 1], {}];
    });

    $httpBackend.whenGET('/filter/choices').respond(function(method, url, data) {
      console.info('XHR finished loading: GET "http://localhost:8000/filter/choices".');
      data = JSON.parse(data);
      var filteredResultset = [];
      angular.forEach(remoteChoices, function(choicesPage) {
        angular.forEach(choicesPage, function(choice) {
          if (choice.label.toLowerCase().indexOf(data.term.toLowerCase()) > -1) {
            filteredResultset.push(choice);
          }
        });
      });
      return [200, filteredResultset, {}];
    });

  });
