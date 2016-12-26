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