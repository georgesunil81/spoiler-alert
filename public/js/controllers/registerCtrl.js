angular.module('auth').controller('registerCtrl', function($scope, userService){
  $scope.register = function(){
    userService.addUser({
    	username: $scope.username,
    	password: $scope.password
    }).then(function(res){
    	console.log("registered");
    });
  }
})