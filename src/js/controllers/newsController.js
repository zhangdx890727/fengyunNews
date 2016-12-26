/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.news',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.news',{
        url:'/news',
        views:{
            'tabs-news':{
                templateUrl:'news.html',
                controller:'newsController'
            }
        }
    });
}]).controller('newsController',['$scope','$state','$location','$timeout','$ionicViewSwitcher','$ionicScrollDelegate','HttpFactory',function ($scope,$state,$location,$timeout,$ionicViewSwitcher,$ionicScrollDelegate,HttpFactory) {
    //设置导航栏内容>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var url = "http://c.m.163.com/nc/topicset/ios/subscribe/manage/listspecial.html";
        HttpFactory.getData(url).then(function (data) {
            data = data[Object.keys(data)[0]];
            $scope.nameArray = data;
        });

    var doSameNews = document.getElementsByClassName('doSameNews');
    $scope.doSomeNews  =function (index) {
        for(var i = 0;i < doSameNews.length; i++){
            if(i == index){
                doSameNews[i].style.color = 'red';
            }else{
                doSameNews[i].style.color = 'black';
            }
        }
        $ionicScrollDelegate.$getByHandle('myHandle').anchorScroll();
    };
    //设置轮播图    和   新闻列表>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $scope.news = {
        newsArray:'',
        adsArray:[],
        newsListArrary:[],
        goToNewsDetails:goToNewsDetails
    };
    var urlArray = [];
    $scope.slidBox = true;
    var loading = function () {
        var index = 0;
        var url = "http://c.m.163.com/recommend/getSubDocPic?tid=T1348647909107&from=toutiao&offset=" + index + "&size=10&fn=1&prog=LMA1&passport=&devId=eW7qcXmjWleAjCxp25EgTBBywawDoVwZiZ9SMikG4cGiOa69wsn%2FdeHaaNGRMr2hIIGNeE0nI41SFrBIaL1THA%3D%3D&lat=DJEPdRawaRYCJZwF3SQobA%3D%3D&lon=7J7OmyytD8SqP0pSV1cJJA%3D%3D";
        $scope.show();
        $scope.slidBox = false;
        HttpFactory.getData(url).then(function (result) {
            $scope.slidBox = true;
            $scope.hide();
            result = result[Object.keys(result)[0]];
            //轮播图
            var topArray = [];
            if(result[0].ads){
                for(var k = 0;k < result[0].ads.length;k++){
                    var obj = {
                        title:result[0].ads[k].title,
                        imgsrc:result[0].ads[k].imgsrc
                    };
                    topArray.push(obj);
                }
                $scope.news.adsArray  = topArray;
            }
            //新闻列表
            $scope.news.newsListArray = result.splice(0,1);
            $scope.news.newsListArray = result;
        });
    };
    loading();
    // //下拉刷新>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $scope.doRefresh = function () {
        loading();
        $scope.$broadcast('scroll.refreshComplete');
    };
    // //上拉加载>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $scope.isShowInfinite = true;
    index = 11;
    $scope.loadMore = function () {
        $timeout(function () {
            url = "http://c.m.163.com/recommend/getSubDocPic?tid=T1348647909107&from=toutiao&offset=" + index + "&size=10&fn=1&prog=LMA1&passport=&devId=eW7qcXmjWleAjCxp25EgTBBywawDoVwZiZ9SMikG4cGiOa69wsn%2FdeHaaNGRMr2hIIGNeE0nI41SFrBIaL1THA%3D%3D&lat=DJEPdRawaRYCJZwF3SQobA%3D%3D&lon=7J7OmyytD8SqP0pSV1cJJA%3D%3D";
            HttpFactory.getData(url).then(function (result) {
                index += 10;
                result = result[Object.keys(result)[0]];
                $scope.news.newsListArray = $scope.news.newsListArray.concat(result)
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        },1000);
    };

    // 下拉列表  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
    var reversalBtnDiv = document.querySelector('.reversalBtnDiv');
    $scope.reversalBtn = function () {
        reversalBtnDiv.style.height = '87%';
    };
    $scope.backUpBtn = function () {
        reversalBtnDiv.style.height = 0;
    };

    //跳转详情页>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function goToNewsDetails(index) {
        if($scope.news.newsListArray[index].skipType == 'special'){
            $location.path('/newsMiddle/'+ $scope.news.newsListArray[index].skipID);
        }else{
            $location.path('/newsDetails/'+ $scope.news.newsListArray[index].docid);
        }
        $ionicViewSwitcher.nextDirection("forward");
    }
    $scope.backTop = function () {
        $ionicScrollDelegate.$getByHandle('newsHandle').anchorScroll();
    }


}]);