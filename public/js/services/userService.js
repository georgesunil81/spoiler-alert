angular.module('auth').service('userService', function($http, $q, $rootScope){
  var user;

  this.addUser = function(newUser){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: newUser
    });
  };

  this.login = function(credentials){
    var dfd = $q.defer()
    $http({
      method: 'POST',
      url: '/api/auth/local',
      data: credentials
    }).then(function(res){
      console.log('Result from user login', res)
      dfd.resolve(res.data);
    })
    return dfd.promise
  }

  this.logout = function(){
    return $http({
      method: 'GET',
      url: '/api/auth/logout'
    }).then(function(){
      $rootScope.$emit('user-change', null);
      //return $state.go('login')
    })
  }

  this.getAuthedUser = function(){
    var dfd = $q.defer()
    if(user){
      dfd.resolve(user);
    } else {
      $http({
        method: 'GET',
        url: '/api/users/currentUser'
      }).then(function(res){
        user = res.data;
        $rootScope.$emit('user-change', null);
        console.log('Result getting the logged in user', res);
        dfd.resolve(res.data);
      })
    }
    return dfd.promise;
  };

  this.checkRole = function(role) {
    if (!user || !user.roles || user.roles.indexOf(role) < 0) {
      return false;
    }
    return true;
  }
})