var app = angular.module('app',[]);
app.controller("mainCtrl",function($scope,$http) {

    $scope.auth = function (user) {
        $http.post('/login', user).then(
            function (result) {
                console.log(result.data);
            },
            function (err) {
                console.log(err.data);
            });
    }
});
