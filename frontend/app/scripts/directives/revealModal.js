/*jshint multistr: true */

'use strict';

angular.module('TeaLeavesApp')
  .directive('revealModal', ['$rootScope', function ($rootScope) {
		return {
			scope: {
				linkText: '@',
				title: '@'
			},
			transclude: true,
      template: '<a class="modal-link" href="#">{{ linkText }}</a>\
								<div class="reveal-modal">\
								  <h2>{{ title }}</h2>\
								  <div class="content" ng-transclude></div>\
								  <a class="close-reveal-modal">&#215;</a>\
								</div>',
      restrict: 'A',
      link: function (scope, element, attrs) {
				var link = element.find('a.modal-link'),
						modal = element.find('div.reveal-modal');

				if (attrs.linkIcon) {
					link.prepend('<i class="foundicon-' + attrs.linkIcon + '"></i>');
				}

				// This allows us to avoid having to attach id's
				link.bind('click', function (e) {
					e.preventDefault();
					modal.foundation('reveal', 'open');
				});

				$rootScope.$on('$routeChangeStart', function () {
					modal.foundation('reveal', 'close');
				});
      }
    };
  }]);
