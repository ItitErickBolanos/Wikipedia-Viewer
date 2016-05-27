var app = angular.module("wikiViewer", ['ngMaterial']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('indigo')
    .warnPalette('yellow');
});

app.factory("wikiAPI", ['$http', function($http){
  var wikiObj = {};

  wikiObj.getWikiEntries = function(){
    //TODO: Add the wikipedia API URL
    var api = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=",
        title = $("#search").val(),
        cb = '&callback=JSON_CALLBACK';

    return $http.jsonp(api + title + cb);
  }

  return wikiObj;
}]);

app.controller("wikiController", ['$scope', 'wikiAPI', '$mdDialog', '$interval', function($scope, wikiAPI, $mdDialog, $interval){

  var self = this,  j= 0, counter = 0;
      self.modes = [ ];
      self.activated = true;
      $scope.loading = false;
      $scope.showResults = false;
      $scope.pages = {};

  $scope.goToRandom = function(){
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  }

  $scope.searchEntries = function(){
    if ($("#search").val() != "") {
      // Iterate every 100ms, non-stop
      $scope.loading = true;
      $scope.showResults = false;
      $interval(function() {
        // Increment the Determinate loader
        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars
        if ( (j < 5) && !self.modes[j] && self.activated ) {
          self.modes[j] = 'indeterminate';
        }
        if ( counter++ % 4 == 0 ) j++;
      }, 100, 0, true);
      wikiAPI.getWikiEntries()
      .success(function(resp){
        $scope.pages = resp.query.pages;
        j = counter = 0;
        $scope.loading = false;
        $scope.showResults = true;
      })
      .error(function(error){
        console.log(error);
      });
    } else {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('.container')))
          .clickOutsideToClose(false)
          .title('Warning')
          .textContent('Please fill the input to search for an article.')
          .ok('Ok')
      );
    }
  };

  $scope.openArticle = function(pageid){
    window.open('https://en.wikipedia.org/?curid='+ pageid);
  };
}]);
