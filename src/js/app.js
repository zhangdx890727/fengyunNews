/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp',['ionic','ngRoute','myApp.httpFactory','myApp.slideBox','myApp.tabs','myApp.news','myApp.live','myApp.topic','myApp.mine','myApp.search','myApp.newsDetails','myApp.newsMiddle']).config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function ($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
    //安卓手机的适配问题
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.navBar.alignTitle('center');
    //网页跳转
    $stateProvider.state('tabs',{
        url:'/tabs',
        abstract:true,
        templateUrl:'tabs.html',
        controller:'tabsController'
    });
    //意外跳转
    $urlRouterProvider.otherwise('/tabs/news');
}]);