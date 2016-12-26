/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.live',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.live',{
        url:'/live',
        views:{
            'tabs-live':{
                templateUrl:'live.html',
                controller:'liveController'
            }
        }
    });
}]).controller('liveController',['$scope','$timeout','$ionicScrollDelegate','HttpFactory',function ($scope,$timeout,$ionicScrollDelegate,HttpFactory) {
    $scope.news = {
        adsArray:[],
        counter:'',
        pTitles:[],
        sublives:[],
        liveReviews:[]
    };
    var loading = function () {
        var url = 'http://data.live.126.net/livechannel/previewlist.json';
        $scope.show();
        HttpFactory.getData(url).then(function (result) {
            $scope.hide();
            var topArray = [];
            if(result.top.length){
                for(var i = 0;i < result.top.length;i++){
                    var obj = {
                        title:result.top[i].roomName,
                        imgsrc:result.top[i].image
                    };
                    topArray.push(obj);
                }
                $scope.news.adsArray = topArray;
            }
            $scope.news.counter = result.future.length;
            $scope.news.pTitles = result.future;
            $scope.news.sublives = result.sublives;
            $scope.news.liveReviews = result.live_review;
        })
    };
    //从下到上的标签轮播
    var carousel = function () {
        var pContent = document.querySelector('.pContent');
        var index = 0;
        var a = 0;
        var timed;
        function changeP() {
            clearInterval(timed);
            timed = setInterval(function () {
                index += -10;
                if(index % 300 == 0){
                    clearInterval(timed);
                    if(index / 300 < -$scope.news.counter + 1){
                        index = 0;
                    }
                }
                pContent.style.top = index/100 + 'rem';
            },20)
        }
        function autoPlay() {
            a++;
            if(a % 240 == 0){
                changeP();
            }
            timer = requestAnimationFrame(autoPlay);
        }
        var timer = requestAnimationFrame(autoPlay);
    };
    loading();
    //下拉刷新
    $scope.doRefresh = function () {
        loading();
        $scope.$broadcast('scroll.refreshComplete');
    };
    carousel();
    $scope.isShowInfinite = true;
    var num = 2;
    $scope.loadingMore = function () {
        $timeout(function () {
            url = "http://data.live.126.net/livechannel/previewlist/" + num + ".json";
            HttpFactory.getData(url).then(function (result) {
                num += 1;
                result  = result.live_review;
                $scope.news.liveReviews = $scope.news.liveReviews.concat(result);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        },1000);
    };

    $scope.backTop = function () {
        $ionicScrollDelegate.$getByHandle('liveHandle').anchorScroll();
    }


}]);