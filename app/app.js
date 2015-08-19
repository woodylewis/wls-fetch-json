'use strict';

angular.module('myApp', [
  'myApp.services',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
  'ui.router'
])
.config(['$stateProvider', '$urlRouterProvider', 
        function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
  .otherwise('/index');

  $stateProvider
    .state('index', {
      url: "/index",
      views: {
        "state" : { templateUrl: "partials/blog_list.html" },
      }
    })
    .state('list', {
      url: "/list",
      views: {
        "state" : { templateUrl: "partials/blog_list.html" },
        }
    })
    .state('sample', {
      url: "/sample",
      views: {
        "state" : { templateUrl: "partials/sample.html" },
                    controller: "SampleCtrl"
        }
    })
    .state('post', {
      url: "/post",
      views: {
        "state" : { 
                    templateUrl: "partials/blog_post.html" },
                    controller: "PostCtrl"
      }
    })
}])
.controller('PostCtrl', ['$scope', '$sce', '$anchorScroll', '$location', function($scope, $sce, $anchorScroll, $location) {
  //------  STRICT CONTEXTUAL ESCAPING OF CONTENT FROM REMOTE DOMAIN -----
  $scope.markup = $sce.trustAsHtml($scope.$parent.currentPost);
  //----- OLDER POSTS FURTHER DOWN THE LIST NEED TO BE SCROLLED TO THEIR TOP LINE
  $location.hash('top');
  $anchorScroll();
}])
.controller('SampleCtrl', ['$scope', '$sce', '$anchorScroll', '$location', function($scope, $sce, $anchorScroll, $location) {
  //------  STRICT CONTEXTUAL ESCAPING OF CONTENT FROM REMOTE DOMAIN -----
  $scope.sample = $sce.trustAsHtml($scope.$parent.sample);
}])
.controller('ServiceCtrl', ['$scope', '$state', 'fetchBlogService', function($scope, $state, fetchBlogService) {
  
  fetchBlogService.fetchManifest()
  .then(function (posts) {
    $scope.posts = posts;
    return $scope.posts[0];
  })
  .then(function (post) {
    var payload;
    fetchBlogService.fetchBlogPost(post['nid'])
      .then(function(body) {
        payload = JSON.stringify({
          nid: post['nid'],
          title: post['title'],
          url: post['url'], 
          body: body
        });
        return payload;
      })
      .then(function (payload) {
        //console.log(payload);  
        fetchBlogService.postPayload(payload)
        .then(function(response) {
            console.log(response);  
          }), function(error) {
            console.log('postPayload error ', error);
          };
      }), function(error){
        console.log('get posts error', error);
      };
    });

  $scope.showCurrentPost= function(nid) {
    var jpost;
    fetchBlogService.fetchBlogPost(nid)
    .then(function(data) {
      $scope.currentPost = addRemoteDomain(data); 
      jpost = JSON.stringify({ body: $scope.currentPost});
      var postState = 'post';
      $state.go(postState);
    })
    .then(function() {
      fetchBlogService.postPayload(jpost)
      .then( function(response) {
          console.log(response);
      }), function(error) {
          console.log('postPayload error ', error);
      };
    })
    , function(error){
        console.log('get posts error', error);
    };

  };
}]);