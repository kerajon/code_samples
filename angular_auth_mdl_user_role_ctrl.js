(function (window, angular) {
  'use strict';

  var Auth = angular.module('Auth', ['Debug']);
  //  roles of users
  Auth.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    demo: 'demo',
    trial: 'trial',
    payed: 'payed',
    normal: 'normal'
  });
  //  routes that doesnt need authentication
  Auth.constant('NOAUTH_ROUTES', [
    '/', '/create', '/remind'
  ]);

  Auth.service('UserSession', function ($location) {
    var UserSession = {};

    UserSession.userId = null;
    UserSession.userRole = null;
    UserSession.firstname = null;
    UserSession.lastname = null;

    //  create user session
    UserSession.create = function (userId, userRole, details) {
      UserSession.userId = userId;
      UserSession.userRole = userRole;
      UserSession.firstname = details.firstname;
      UserSession.lastname = details.lastname;
      $location.path("/app/dashboard"); //  where to go after authentication
    };

    //  destroy user session
    UserSession.destroy = function () {
      UserSession.userId = null;
      UserSession.userRole = null;
      UserSession.firstname = null;
      UserSession.lastname = null;
      $location.path('/');
    };

    return UserSession;
  });

  Auth.factory('Auth', function (UserSession, Api) {
    var Auth = {};
  
    Auth.login = function (credentials) {
      Api
      .simulate_login(credentials)
      .then(function (res) {
        UserSession.create(res.userId, res.userRole, res.userDetails);
      }, function () {
        //  nothing yet
      });
    };
  
    Auth.isAuthenticated = function () {
      return !!UserSession.userId;
    };
  
    Auth.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(UserSession.userRole) !== -1);
    };
  
    return Auth;
  });

  Auth.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {

      $stateProvider.state('login', {
        url: "/",
        templateUrl: "../partials/login.html",
        controller: "LoginCtrl",
        data: {
          authRoles: [USER_ROLES.all]
        }
      });

      $stateProvider.state('createAccount', {
        url: "/create",
        templateUrl: "../partials/create-account.html",
        controller: "CreateAccountCtrl",
        data: {
          authRoles: [USER_ROLES.all]
        }
      });

      $stateProvider.state('forgot', {
        url: "/remind",
        templateUrl: "../partials/forgot.html",
        controller: "ForgotCtrl",
        data: {
          authRoles: [USER_ROLES.all]
        }
      });

  });

  //  access controller
  Auth.run(function ($rootScope, Auth, UserSession, $location, debug, $state, NOAUTH_ROUTES, USER_ROLES) {

    $rootScope.$on('$stateChangeStart', function (e, next) {
      debug.log('Auth', 'URL: '+ next.url);
      var noAuthRoute = NOAUTH_ROUTES.indexOf(next.url) !== -1;
      //  check if authenticated or special routes
      if (noAuthRoute || Auth.isAuthenticated()) {
        debug.log('Auth', 'Authenticated: '+ Auth.isAuthenticated() +' \nNoAuthRoute: '+ noAuthRoute);
        //  check if not all users in data stateProvider
        if (next.data.authRoles.indexOf(USER_ROLES.all) === -1) {
          //  check if user role not authorized for route
          if (next.data.authRoles.indexOf(UserSession.userRole) === -1) {
            debug.log('Auth', 'User Role: '+ UserSession.userRole +' Not Authorized for this route');
            e.preventDefault();
            return;
          } else {
            debug.log('Auth', 'User Role: '+ UserSession.userRole +' Authorized go to route');
            return;
          }
          
        } else {
          debug.log('Auth', 'User Roles: All');
          return;
        }

      } else {
        //  not authorized
        e.preventDefault();
        $state.go('login');
        return;
      }

    });

  });

  Auth.controller('ForgotCtrl', function ($scope) {
    
  });

  Auth.controller('CreateAccountCtrl', function ($scope) {
    
    $scope.account = {
      firstname: '',
      lastname: '',
      company: '',
      email: '',
      password: '',
      password_confirmation: ''
    };

    $scope.createAccount = function () {
      
    };

  });

  Auth.controller('LoginCtrl', function ($scope, $location, Api, Auth) {

    $scope.login = {
      email: '',
      password: ''
    };

    $scope.signIn = function () {
      Auth.login({
        email: $scope.login.email,
        password: $scope.login.password
      });
    };

    $scope.createAccount = function () {

    };

    $scope.forgotPass = function () {

    };

  });


})(window, angular);
