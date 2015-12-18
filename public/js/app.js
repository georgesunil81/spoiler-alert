angular.module('auth', ['ui.router'])
  .config(function($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'homeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/templates/login.html',
        controller: 'loginCtrl'
      })
      .state('logout', {
        url: '/logout',
        controller: function(userService) {
          userService.logout()
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: '/templates/register.html',
        controller: 'registerCtrl'
      })
      .state('auth', {
        abstract: true,
        template: '<ui-view></ui-view>',
        resolve: {
          user: function(userService) {
            return userService.getAuthedUser()
          }
        }
      })
      .state('auth.profile', {
        url: '/profile',
        templateUrl: '/templates/profile.html',
        controller: 'profileCtrl'
      })
      .state('auth.friends', {
        url: '/me/friends',
        templateUrl: '/templates/friends.html',
        controller: 'friendsCtrl'
      });

    $httpProvider.interceptors.push(function($q, $injector, $location) {
      return {
        // This is the responseError interceptor
        responseError: function(rejection) {
          console.log("BAD DOG", rejection);
          if (rejection.status === 401) {
            document.location = "/#/login";
          }

          /* If not a 401, do nothing with this error.
           * This is necessary to make a `responseError`
           * interceptor a no-op. */
          return $q.reject(rejection);
        }
      };
    });
  });