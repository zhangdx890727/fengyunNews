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