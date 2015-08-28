'use strict';

angular.module('myApp.services', [])
/* SERVICE TO WRAP HTTP REQUESTS */
.factory('fetchBlogService' , ['$q', '$http', 
	function($q, $http) {
		var blogUrl = 'http://woodylewis.com/wls_send_jlist.php',
		 	blogPostUrl = 'http://woodylewis.com/wls_send_post.php?',
			homeURL = 'http://localhost:8000/app/index.html',
			postManifestURL = 'http://localhost:5000/post_manifest',
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

		var fetchPostJSON = function(jsonURL) {
			var deferred = $q.defer();

			$http.get(jsonURL)
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

		var postManifest = function(manifest) {
			var deferred = $q.defer();

			$http.post(postManifestURL, {
				transformRequest: transformRequestAsFormPost,
				data: manifest,
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
		postManifest: function(manifest) {
			return postManifest(manifest);
		},
		postPayload: function(payload) {
			return postPayload(payload);
		},
		fetchPayload: function() {
			return fetchPayload();
		},
		fetchBlog: function() {
			return fetchBlog();
		},
		fetchPostJSON: function(jsonURL) {
			return fetchPostJSON(jsonURL);
		}
	};
}]);