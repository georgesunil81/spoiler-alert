angular.module('auth').controller('loginCtrl', function($scope, userService){
  $scope.login = function(){
    userService.login({
    	username: $scope.username,
    	password: $scope.password
    }).then(function(){
    	console.log("WORKED?");
      $scope.credentials = {}
    });
  }
})