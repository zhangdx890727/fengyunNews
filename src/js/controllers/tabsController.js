/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.tabs',[]).controller('tabsController',['$scope','$ionicLoading',function ($scope,$ionicLoading) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };
}]);