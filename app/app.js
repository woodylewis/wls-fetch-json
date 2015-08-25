'use strict';

angular.module('myApp', [
  'myApp.services',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
  'ui.router'
])
.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('index', {
      url: "/index",
      views: {
        "state" : { templateUrl: "index.html" }
      }
    })
    .state('list', {
      url: "/list",
      views: {
        "state" : { templateUrl: "partials/blog_list.html" }
      }
    })
    .state('content', {
      url: "/content",
      views: {
        "state" : { templateUrl: 'partials/content.html' }
      }
    })
    .state('content2', {
      url: "/content/:contentId",
      views: {
        "state" : { templateUrl: 'partials/content2.html',
          controller: function ($scope, $filter, $stateParams) {
              console.log($stateParams.contentId);
              //console.log($scope.posts);
              var filterStr = 'content/' + $stateParams.contentId;
              $scope.filtered = $filter('filter')($scope.posts, {url: filterStr});
              console.log($scope.filtered);
            }
        }
      }
    })
    .state('post', {
      url: "/post",
      views: {
        "state" : { 
          templateUrl: "partials/blog_post.html" },
          controller: "PostCtrl"
      }
    });

  $urlRouterProvider
  .otherwise('/index');

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
    //$state.go('list');
  }), function(error){
      console.log('get posts error', error);
  };

  $scope.fetchManifest = function() {
    fetchBlogService.fetchBlog()
    .then(function (manifest) {
      //console.log('MANIFEST', manifest);
      return manifest
    })
    .then(function (manifest) {
      fetchBlogService.postManifest(manifest)
      .then(function(response) {
        console.log(response);  
      }), function(error){
        console.log('post manifest error', error);
      };
    }), function(error){
      console.log('get posts error', error);
    };
  };

  $scope.fetchAndRetrievePosts = function() {
    fetchBlogService.fetchManifest()
    .then(function (posts) {
      $scope.posts = posts;
    })
    angular.forEach($scope.posts, function (post, key) {
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
          fetchBlogService.postPayload(payload)
          .then(function(response) {
              console.log(response);  
            }), function(error) {
              console.log('postPayload error ', error);
            };
        }), function(error){
          console.log('get posts error', error);
        };
      }), function(error){
          console.log('angular forEach error', error);
      };
  };

  $scope.fetchPost= function(url, date) {
    var dir = 'json/',
        filetype = '.json',
        titlePos = url.indexOf('content'),
        title = dir + url.substr(titlePos + 8) + filetype;
        
    fetchBlogService.fetchPostJSON(title)
    .then(function(data) {
      console.log(date);
      console.log(data);
      $scope.date = date;
      $scope.currentPost = data.body;
      $state.go('post');
    }), function(error){
        console.log('get posts error', error);
    };

  };

}]);