/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.mine',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.mine',{
        url:'/mine',
        views:{
            'tabs-mine':{
                templateUrl:'mine.html',
                controller:'mineController'
            }
        }
    });
}]).controller('mineController',['$scope',function ($scope) {

}]);