/*jshint multistr: true */

'use strict';

angular.module('TeaLeavesApp')
  .directive('infoPane', function () {

		return {
      template: '<div class="info-pane">\
									<div class="info-pane-title">{{ title }}</div>\
									<div class="info-pane-content" style="display:none">\
									<code><pre>{{ content }}</pre></code>\
								</div>',
      restrict: 'A',
			scope: {
				title: '@',
				content: '@'
			},
			link: function(scope, element) {
				// passing a class to find only works if jQuery is present
				var titleEl = element.find('.info-pane-title'),
						contentEl = element.find('.info-pane-content');

				titleEl.bind('click', function(){
					contentEl.slideToggle();
				});
			}
		};
  });
