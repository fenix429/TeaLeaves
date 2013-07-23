/*jshint multistr: true */

'use strict';

angular.module('TeaLeavesApp')
  .directive('leafBox', ['utils', function (utils) {

		var limit = function (text) {
			return utils.charLimiter(text, 230);
		};

		var formatTime = function (timestamp) {
			return utils.formatTime(timestamp);
		};

    return {
			scope: {
				leaf: '='
			},
      template: '<div class="panel selected-leaf">\
									<span class="description">{{ leaf.description }}</span>\
									<span class="where">File: {{ leaf.file }} / Line Number: {{ leaf.line_number }}</span>\
									<span class="time">{{ formatTime(leaf.created_at) }}</span>\
									<code class="details"><pre>{{ limit(leaf.details) }}</pre></code>\
									<a class="view-more" ng-href="#/leaf/{{ leaf.id }}">View More &rarr;</a>\
								</div>',
      restrict: 'A',
      link: function (scope, element) {
        scope.limit = limit;
				scope.formatTime = formatTime;
				element.sticky({topSpacing:10});
      }
    };
  }]);