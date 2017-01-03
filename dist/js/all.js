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
/**
 * Created by lx on 2016/12/6.
 */
angular.module('myApp.newsDetails',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('newsDetails',{
        url:'/newsDetails/:docid',
        templateUrl:'newsDetails.html',
        controller:'newsDetailsController'
    });
}]).controller('newsDetailsController',['$scope','$stateParams','$sce','$location','$ionicLoading','$ionicScrollDelegate','HttpFactory',function ($scope,$stateParams,$sce,$location,$ionicLoading,$ionicScrollDelegate,HttpFactory) {

    $scope.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };



    $scope.newsDetails = {
        detail:'',
        body:'',
        docid:''
    };
    $scope.newsDetails.docid = $stateParams.docid[0];
    // console.log($stateParams.docid);
    $scope.docid1 = false;
    $scope.docid2 = false;
    $scope.docid3 = false;
    var url;
    $scope.show();
    if($scope.newsDetails.docid == 'C' || $scope.newsDetails.docid == 'B' || $scope.newsDetails.docid == '9'){
        $scope.docid1 = true;
        url = 'http://c.m.163.com/nc/article/'+ $stateParams.docid +'/full.html';
        HttpFactory.getData(url).then(function (result) {
            $scope.hide();
            result = result[Object.keys(result)[0]];
            $scope.newsDetails.detail = result;
            console.log(result);
            // console.log('1111');
            var newsObj = $scope.newsDetails.detail;
            // console.log(newsObj);
            if (newsObj.img && newsObj.img.length){
                for(var i = 0;i < newsObj.img.length;i++){
                    var imgWidth = newsObj.img[i].pixel.split('*')[0];

                    if(imgWidth >= document.body.offsetWidth - 30){
                        imgWidth = document.body.offsetWidth - 30;
                        // console.log(imgWidth);
                    }
                    var imgStyle = 'width:' + imgWidth + "px";
                    var imgStr = "<img class='newsImg'" + " style='" + imgStyle + "'" + " src=" + newsObj.img[i].src + '>';
                    newsObj.body = newsObj.body.replace(newsObj.img[i].ref,imgStr);
                }
            }
            $scope.newsDetails.body = $sce.trustAsHtml(newsObj.body);
        });
    }else if($scope.newsDetails.docid == 'V'){//视频
        $scope.docid2 = true;
        url = 'http://c.m.163.com/nc/video/detail/'+ $stateParams.docid +'.html';
        HttpFactory.getData(url).then(function (result) {
            $scope.hide();
            console.log(result)
        })
    }else{//直播
        $scope.docid3 = true;
            $scope.hide();
    }
    $scope.goBack  =function () {
        window.history.go(-1);
    };
    $scope.backTop = function () {
        $ionicScrollDelegate.$getByHandle('myHandle').anchorScroll();
    }
}]);
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
/**
 * Created by lx on 2016/12/3.
 */
angular.module('myApp.tabs',[]).controller('tabsController',['$scope','$ionicLoading',function ($scope,$ionicLoading) {
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if(clientWidth>=800){
                    docEl.style.fontSize = '30px';
                }else{
                    docEl.style.fontSize = 10 * (clientWidth / 375) + 'px';
                }
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);

    $scope.show = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

}]);
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
/**
 * Created by lx on 2016/12/5.
 */
angular.module('myApp.httpFactory',[]).factory('HttpFactory',['$http','$q',function ($http,$q) {
    return {
        getData:function (url,type) {
            if (url){
                var promise = $q.defer();
                // url = "http://192.168.0.100:3000/?myUrl=" + encodeURIComponent(url);
                url = "http://59.110.139.104:3000/wy?myUrl=" + encodeURIComponent(url);
                type = type ? type:"GET";
                $http({
                    url:url,
                    method:type,
                    timeout:20000
                }).then(function (result) {
                    result = result.data;
                    // result = JSON.parse(result);
                    // result = result[Object.keys(result)[0]];
                    promise.resolve(result);
                },function (err) {
                    promise.reject(err);
                });
                return promise.promise;
            }
        }
    };
}]);
/**
 * Created by qingyun on 16/12/2.
 */
angular.module('myApp.slideBox',[]).directive('mgSlideBox',[function () {
    return{
        restrict:"E",
        scope:{sourceArray:'='},
        templateUrl:'slideBox.html',
        controller:['$scope','$ionicSlideBoxDelegate','$element',function ($scope,$ionicSlideBoxDelegate,$element) {
            $scope.goToDetailView = function (index) {
                console.log('进入详情页' + index);
            };
            var lastSpan = $element[0].lastElementChild;

            $scope.$watch('sourceArray',function (newVal,oldVal) {
                if (newVal && newVal.length){
                    $scope.isShowSlideBox = true;
                    // $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').update();
                    // $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').loop(true);
                    lastSpan.innerText = ($scope.sourceArray[0]).title;
                    $scope.slideHasChanged = function (index) {
                        lastSpan.innerText = $scope.sourceArray[index].title;
                    }
                }
            });
            $scope.slideHasChanged = function (index) {
                lastSpan.innerText = $scope.sourceArray[index].title;
            };
            //页面刚加载出来的时候禁止滑动
            $ionicSlideBoxDelegate.$getByHandle('mainSlideBox').enableSlide(false);
            //拖拽轮播图的时候也要禁止底层的slideBox滑动
            $scope.drag = function (event) {
                $ionicSlideBoxDelegate.$getByHandle('mainSlideBox').enableSlide(false);
                //阻止事件冒泡
                event.stopPropagation();
            };

        }],
        replace:true,
        link:function (scope,tElement,tAtts) {
        }
    };
}]);
