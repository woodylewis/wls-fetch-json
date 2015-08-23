'use strict';

angular.module('myApp.services', [])
/* SERVICE TO WRAP HTTP REQUESTS */
.factory('fetchBlogService' , ['$q', '$http', 
	function($q, $http) {
		var blogUrl = 'http://woodylewis.com/wls_send_jlist.php',
		 	blogPostUrl = 'http://woodylewis.com/wls_send_post.php?',
			sampleURL = 'json/news-not-lap-dance.json',
			homeURL = 'http://localhost:8000/app/index.html',
			fetchURL = 'http://localhost:5000/test_put',
			postURL = 'http://localhost:5000/post_json',
			manifestUrl = 'manifest.json';

		var fetchManifest = function() {
			var deferred = $q.defer();

			$http.get(manifestUrl)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var fetchBlog = function() {
			var deferred = $q.defer();

			$http.get(blogUrl)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var fetchBlogPost = function(nid) {
			var deferred = $q.defer();

			$http.get(blogPostUrl + nid)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var fetchSample = function() {
			var deferred = $q.defer();

			$http.get(sampleURL)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var fetchHome = function() {
			var deferred = $q.defer();

			$http.get(homeURL)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var fetchPayload = function() {
			var deferred = $q.defer();

			$http.post(fetchURL)
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

		var transformRequestAsFormPost = function(obj) {
	        var str = [];
	        for(var p in obj)
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        	return str.join("&");
		}

		var postPayload = function(payload) {
			var deferred = $q.defer();

			$http.post(postURL, {
				transformRequest: transformRequestAsFormPost,
				data: payload,
 				headers: {'Content-Type':'application/json'}
 				//headers: {'Content-Type':'application/x-www-form-urlencoded'}
			})
			.success( function(data) {
				deferred.resolve(data);
			})
			.error(function(reason) {
				deferred.reject(reason);
			})
			return deferred.promise;
		}

	return {
		fetchManifest: function() {
			return fetchManifest();
		},
		postPayload: function(payload) {
			return postPayload(payload);
		},
		fetchPayload: function() {
			return fetchPayload();
		},
		fetchHome: function() {
			return fetchHome();
		},
		fetchSample: function() {
			return fetchSample();
		},
		fetchBlog: function() {
			return fetchBlog();
		},
		fetchBlogPost: function(nid) {
			return fetchBlogPost(nid);
		}
	};
}]);