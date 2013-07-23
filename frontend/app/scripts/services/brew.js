/* global $, store */

'use strict';

angular.module('TeaLeavesApp')
	.factory('brew', ['$http', '$rootScope', 'utils', function ($http, $rootScope, utils) {
		// Service logic

		var oneMinute = 60 * 1000;
		//		fiveMinutes = 5 * 60 * 1000,
		//		tenMinutes = 10 * 60 * 1000;

		var cacheLength = oneMinute;

		var cache = {
			store: function (key, value, expires) {
				store.set(key, {
					val  : value,
					exp  : expires,
					time : new Date().getTime()
				});
			},
			fetch: function (key) {
				var data = store.get(key);

				if (!data) {
					return null;
				}

				if (new Date().getTime() - data.time > data.exp)
				{
					store.remove(key);
					return null;
				}

        return data.val;
			},
			clear: function (key) {
				store.remove(key);
			}
		};

		var config = {
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		};

		// Public API here
		return {
			app: {
				list: function (callback) {
					var cached = cache.fetch('brew/apps');

					if (cached) {
						callback(cached);
						return null; // exit the function
					}

					$rootScope.$broadcast('brew:start');

					$http.get('brew/apps.json')
						.success(function (data) {
							$rootScope.$broadcast('brew:done');

							cache.store('brew/apps', data, cacheLength);

							callback(data);
						})
						.error(function (data) {
							$rootScope.$broadcast('brew:done');

							// do something better here
							utils.log('brew failure: brew/apps', data, 'error');
						});
				},
				get: function (id, callback) {
					var cached = cache.fetch('brew/apps/' + id);

					if (cached) {
						callback(cached);
						return null; // exit the function
					}

					$rootScope.$broadcast('brew:start');

					$http.get('brew/apps/' + id + '.json')
						.success(function (data) {
							$rootScope.$broadcast('brew:done');
							cache.store('brew/apps/' + id, data, cacheLength);
							callback(data);
						})
						.error(function (data) {
							$rootScope.$broadcast('brew:done');

							// do something better here
							utils.log('brew failure: brew/apps/' + id, data, 'error');
						});
				},
				create: function (app, callback) {
					$rootScope.$broadcast('brew:start');

					$http.post('brew/apps.json', $.param({ app : app }), config)
						.success(function (data) {
							$rootScope.$broadcast('brew:done');

							cache.clear('brew/apps');

							callback(data);
						})
						.error(function (data) {
							$rootScope.$broadcast('brew:done');

							// do something better here
							utils.log('brew failure: brew/apps', data, 'error');
						});
				},
				// update: function (id, app) {},
				// destroy: function (id) {},
				clearCache: function (id) {
					cache.clear('brew/apps/' + id);
				}
			},
			leaf: {
				get: function (id, callback){

					var cached = cache.fetch('brew/leafs/' + id);

					if (cached) {
						callback(cached);
						return null; //exit the function
					}

					$rootScope.$broadcast('brew:start');

					$http.get('brew/leafs/' + id + '.json')
						.success(function (data) {
							$rootScope.$broadcast('brew:done');
							cache.store('brew/leafs/' + id, data, cacheLength);
							callback(data);
						})
						.error(function (data) {
							$rootScope.$broadcast('brew:done');

							// do something better here
							utils.log('brew failure: brew/leafs/' + id, data, 'error');
						});
				},
				touch: function (id, viewState) {
					//$rootScope.$broadcast('brew:start');

					$http.put('brew/leafs/touch/' + id + '.json', $.param({ 'view_state' : viewState }), config)
						.success(function (data) {
							//$rootScope.$broadcast('brew:done');
							cache.clear('brew/leafs/' + id);

							if(data.status && data.status === 'error') {
								// do error handling
							}
						})
						.error(function (data) {
							//$rootScope.$broadcast('brew:done');

							// do something better here
							utils.log('brew failure: brew/leafs/touch/' + id, data, 'error');
						});
				}
			}
		};
	}]);