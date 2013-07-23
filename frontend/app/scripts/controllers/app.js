/* global _, store, moment */

'use strict';

angular.module('TeaLeavesApp')
	.controller('AppCtrl', ['$scope', '$routeParams', 'brew', 'utils', function ($scope, $routeParams, brew, utils) {
		$scope.appLoaded = false;
		$scope.hasLeafs = false;
		$scope.filterUnread = false;
		$scope.daysToFilter = 0;

		$scope.selectLeaf = function(id) {
			var theLeaf = _.find($scope.app.leafs, { id: id });

			store.set($scope.app.id + '-selectedLeafId', theLeaf.id);

			if (theLeaf.unread) {
				$scope.setViewState(theLeaf, 'read');
			}

			$scope.selectedLeaf = theLeaf;
		};

		$scope.toggleViewState = function (theLeaf) {
			// invert the viewState
			var viewState = (!theLeaf.unread)? 'unread' : 'read';
			$scope.setViewState(theLeaf, viewState);
		};

		$scope.setViewState = function (theLeaf, viewState) {
			theLeaf.unread = (viewState === 'read')? false : true;
			brew.leaf.touch(theLeaf.id, viewState);

			// recache?
			brew.app.clearCache($routeParams.id);
		};

		$scope.formatTime = function (timestamp) {
			return utils.formatTime(timestamp);
		};

		$scope.toggleUnreadFilter = function () {
			$scope.filterUnread = !$scope.filterUnread;
		};

		$scope.unreadLeafs = function () {
			return function (item) {
				if (!$scope.filterUnread) {
					return true;
				}

				return item.unread;
			};
		};

		$scope.setDaysToFilter = function (days) {
			if ($scope.daysToFilter === days) {
				// second click - toggle off
				$scope.daysToFilter = 0;
			} else {
				$scope.daysToFilter = days;
			}
		};

		$scope.leafsByDays = function () {
			var sinceThen = moment().subtract('days', $scope.daysToFilter).unix();

			return function (item) {
				if ($scope.daysToFilter === 0) {
					// filter off return everything
					return true;
				}

				return item.created_at > sinceThen;
			};
		}

		$scope.init = function () {
			// fetch the app from the server
			brew.app.get($routeParams.id, function (data) {
				$scope.app = data.app;

				if ($scope.app.leafs.length > 0) {
					// try to load the id of the last selected leaf
					var selectedLeafId = store.get($scope.app.id + '-selectedLeafId');

					// or just grab the first one
					if (typeof selectedLeafId === 'undefined') {
						selectedLeafId = data.app.leafs[0].id;
					}

					$scope.selectLeaf(selectedLeafId);
				}

				$scope.appLoaded = true;
				$scope.hasLeafs = ($scope.app.leafs.length > 0)? true : false;
			});
		};

	}]);