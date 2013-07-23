/* global moment */

'use strict';

angular.module('TeaLeavesApp')
  .factory('utils', ['$window', function ($window) {
    // Service logic

    // Public API here
    return {
			charLimiter : function(str, len) {
				if (typeof str !== 'string') {
					return '';
				}

				if (str.length > len) {
					return str.substr(0, len) + '…';
				} else {
					return str;
				}
			},
			formatTime: function(timestamp) {
				return moment.unix(timestamp).format('MM/DD/YYYY HH:mm:ss');
			},
			log : function(msg, data, type) {
				if (!type){ type = 'log'; }

				if ($window.console) {
					switch (type) {
					case 'error':
						$window.console.error('ngLogger: ' + msg);
						if(data){ $window.console.error(data); }
						break;

					case 'warn':
						$window.console.warn('ngLogger: ' + msg);
						if(data){ $window.console.warn(data); }
						break;

					default:
						$window.console.log('ngLogger: ' + msg);
						if(data){ $window.console.log(data); }
					}
				}
			},
			uid : function() {
				// This DOES NOT generate a true unique id,
				// but it should be good enough to for
				// minor uses

				var date = new Date();
				var components = [
					date.getYear(),
					date.getMonth(),
					date.getDate(),
					date.getHours(),
					date.getMinutes(),
					date.getSeconds(),
					date.getMilliseconds()
				];

				return components.join('');
			}
    };
  }]);