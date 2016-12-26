/**
 * Created by lx on 2016/12/8.
 */
angular.module('myApp.newsMiddle',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('newsMiddle',{
        url:'/newsMiddle/:skipID',
        templateUrl:'newsMiddle.html',
        controller:'newsMiddleController'
    })
}]).controller('newsMiddleController',['$scope','$stateParams','$location','$ionicViewSwitcher','$anchorScroll','$ionicScrollDelegate','$ionicLoading','HttpFactory',function ($scope,$stateParams,$location,$ionicViewSwitcher,$anchorScroll,$ionicScrollDelegate,$ionicLoading,HttpFactory) {

    $scope.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };
    $scope.show();
    var url = 'http://c.m.163.com/nc/special/'+ $stateParams.skipID +'.html';
    HttpFactory.getData(url).then(function (result) {
        $scope.hide();
        result = result[Object.keys(result)[0]];
        $scope.newsMiddle = result;
        $scope.newsMiddleArray = result.topics;
        console.log(result.topics);
        $scope.length = result.topics.length;
    });
    //详情页跳转
    $scope.goToNewsDetails = function (a,index) {
        $location.path('/newsDetails/'+ $scope.newsMiddleArray[a-1].docs[index].docid);
        $ionicViewSwitcher.nextDirection("forward");
    };

    //导航跳转
    $scope.goToTitle = function (index) {
        $location.hash('item' + index);
    };

    $scope.goToTop = function () {
        $location.hash('top');
    }




}]);