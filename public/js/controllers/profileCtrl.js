angular.module('auth').controller('profileCtrl', function($scope, user, userService){
  $scope.user = user;

	$scope.is_admin = userService.checkRole('admin');
	$scope.is_moderator = userService.checkRole('moderator');
	$scope.is_normal = userService.checkRole('normal');
})