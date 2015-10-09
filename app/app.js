'use strict';

angular.module('myApp', [
  'myApp.services',
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
        "state" : { templateUrl: "index.html" }
      }
    })
    .state('about', {
      url: "/about",
      views: {
        "state" : { templateUrl: "partials/about.html" }
      }
    })

    .state('words', {
      url: "/words",
      views: {
        "state" : { templateUrl: "partials/words.html" }
      }
    })
    .state('list', {
      url: "/list",
      views: {
        "state" : { templateUrl: "partials/blog_list.html" }
      }
    })
    //---- OLD LINKS WITH NO HASHTAG BEFORE "/content" GET REWRITTEN BY THE S3 BUCKET -----
    .state('content', {
      url: "/content/:contentId",
      views: {
        "state" : { 
          templateUrl: "partials/blog_post.html",
          controller: function ($scope, $filter, $stateParams) {
              var filterStr = 'content/' + $stateParams.contentId,
                  filtered = $filter('filter')($scope.posts, {url: filterStr});
              $scope.fetchPost(filtered[0].url, filtered[0].date, filtered[0].title);
            }
        }
      }
    })
    .state('post', {
      url: "/post",
      views: {
        "state" : { 
          templateUrl: "partials/blog_post.html" ,
          controller: function ($scope, $sce, $anchorScroll, $location) {
            $scope.markup = $sce.trustAsHtml($scope.$parent.currentPost);
            $location.url($scope.$parent.currentURL);
            $location.hash('top');
            $anchorScroll();
            console.log('IN CONTROLLER');
          }
      }
    }
  });
}])
.controller('PostCtrl', ['$scope', '$sce', '$anchorScroll', '$location', function($scope, $sce, $anchorScroll, $location) {
  //------  STRICT CONTEXTUAL ESCAPING OF CONTENT FROM REMOTE DOMAIN -----
  $scope.markup = $sce.trustAsHtml($scope.$parent.currentPost);
  //----- CHANGE THE URL TO SOMETHING MEANINGFUL
  $location.url($scope.$parent.currentURL);
  //----- OLDER POSTS FURTHER DOWN THE LIST NEED TO BE SCROLLED TO THEIR TOP LINE
  $location.hash('top');
  $anchorScroll();
}])
.controller('ServiceCtrl', ['$scope', '$state', 'fetchBlogService', function($scope, $state, fetchBlogService) {
  fetchBlogService.fetchManifest()
  .then(function (posts) {
    $scope.posts = posts;
  }), function(error){
      console.log('get posts error', error);
  };

  $scope.fetchManifest = function() {
    fetchBlogService.fetchBlog()
    .then(function (manifest) {
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

  $scope.fetchPost= function(url, date, title) {
    $scope.currentTitle = title;
    var dir = 'json/',
        filetype = '.json',
        titlePos = url.indexOf('content'),
        title = dir + url.substr(titlePos + 8) + filetype;

    fetchBlogService.fetchPostJSON(title)
    .then(function(data) {
      $scope.date = date;
      $scope.currentPost = data.body;
      $scope.currentURL = url;    
      $state.go('post');
    }), function(error){
        console.log('get posts error', error);
    };

  };

}]);