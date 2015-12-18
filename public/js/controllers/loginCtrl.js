angular.module('auth').controller('loginCtrl', function($scope, userService){
  $scope.login = function(){
    userService.login({
    	username: $scope.username,
    	password: $scope.password
    }).then(function(){
    	userService.getAuthedUser(); //this will load current user into cache as well as trigger event broadcast for directives
      $scope.credentials = {}
    });
  }
})