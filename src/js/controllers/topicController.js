/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.topic',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.topic',{
        url:'/topic',
        views:{
            'tabs-topic':{
                templateUrl:'topic.html',
                controller:'topicController'
            }
        }
    });
}]).controller('topicController',['$scope','$ionicScrollDelegate','$timeout','HttpFactory',function ($scope,$ionicScrollDelegate,$timeout,HttpFactory) {

    var iconChange = document.getElementById('iconChange');
    var iconTransfrom = document.getElementById('iconTransfrom');
    var a = 0;
    $scope.iconChange = function () {
        a++;
        if(a % 2 == 1){
            iconChange.style.height = '70vw';
            iconTransfrom.style.transform = 'rotate(180deg)';
        }else{
            iconChange.style.height = '24vw';
            iconTransfrom.style.transform = 'rotate(0deg)';
        }

    };
    $scope.doConcern = function (index) {
        $scope.topic.topicListArray[index].state = !$scope.topic.topicListArray[index].state;
    };

    $scope.topic  ={
        topArray:[],
        topicListArray:[]
    };
    var loading = function () {
        var url = 'http://c.m.163.com/newstopic/list/classification.html';
        HttpFactory.getData(url).then(function (result) {
            $scope.topic.topArray = result.data;
        });
        url = 'http://c.m.163.com/newstopic/list/expert/5YyX5Lqs/0-10.html';
        HttpFactory.getData(url).then(function (result) {
            $scope.topic.topicListArray =  result.data.expertList;
        });
    };
   loading();
    //下拉刷新
    $scope.doRefresh = function () {
        loading();
        $scope.$broadcast('scroll.refreshComplete');
    };
    //上拉加载
    $scope.isShowInfinite = true;
    index = 10;
    $scope.loadMore = function () {
        $timeout(function () {
            var url = "http://c.m.163.com/newstopic/list/expert/5YyX5Lqs/" + index + "-10.html";
            HttpFactory.getData(url).then(function (result) {
                index += 10;
                $scope.topic.topicListArray = $scope.topic.topicListArray.concat(result.data.expertList);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        },1000);
    };

    $scope.backTop = function () {
        $ionicScrollDelegate.$getByHandle('topicHandle').anchorScroll();
    }

}]);