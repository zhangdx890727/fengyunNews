/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.search',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('search',{
        url:'/search',
        templateUrl:'search.html',
        controller:'searchController'
    });
}]).controller('searchController',['$scope','$ionicHistory','HttpFactory',function ($scope,$ionicHistory,HttpFactory) {

    var url = 'http://c.m.163.com/nc/search/hotWord.html';
    HttpFactory.getData(url).then(function (result) {
        result = result[Object.keys(result)[0]];
        // result = JSON.parse(result);
        $scope.searchArray = result;
        console.log($scope.searchArray);
    });
    // // $scope.history = window.history(-1);
    // // $ionicHistory
    // console.log($ionicHistory.viewHistory());
    // console.log(window.history)


    var searchInput = document.getElementById('searchInput');
    $scope.doSame = function () {
        // console.log(this.searcher.hotWord);
        searchInput.value = this.searcher.hotWord;
    }


}]);