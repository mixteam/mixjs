// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("mix/core/util/router/0.2.0/router-debug", ["mix/core/base/reset/1.0.0/reset-debug", "mix/core/base/class/1.0.0/class-debug", "mix/core/util/history/0.2.0/history-debug", "mix/core/base/message/1.0.0/message-debug"], function(require, exports, module) {

require('mix/core/base/reset/1.0.0/reset-debug');

var Class = require('mix/core/base/class/1.0.0/class-debug'),
	history = require('mix/core/util/history/0.2.0/history-debug').singleton,
	namedParam    = /\:\w+/g,
	splatParam    = /\*\w+/g,
	escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g,
	appRegExp = /^[^#\/\!]*/

	win = window,
	doc = win.document,
	his = win.history,
	head = doc.getElementsByTagName('head')[0],
	loc = win.location,
	
	Router = Class.create({
		initialize : function(options){
			var that = this
				;

			that._options = Object.extend({
				root : location.pathname.replace(/[^\/]+\.[^\/]+$/, ''),
				appPath : 'apps/',
				defaultApp : 'index',
				stateLimit : 100
			}, options || {});

			that._started = false;
			that._states = [];
			that._stateIdx = 0;
			that._move = null;
		},

		_routeToRegExp : function(route) {
			route = route.replace(namedParam, '([^\/][^\/]*?)')
				.replace(splatParam, '(.*?)');
			return new RegExp('^' + route + '(!.*?)?$');
		},

		_extractParamKeys : function(route) {
			var matched = route.match(namedParam),
				keys = {}
				;

			matched && Object.each(matched, function(key, i) {
				keys[key.substring(1)] = i;
			});

			return keys;
		},

		_extractParameters : function(route, fragment) {
			var matched;
			if ((matched = route.exec(fragment))) {
				return matched.slice(1);
			}
		},

		_extractArguments : function(fragment) {
			var split = fragment.split('&'),
				args = {}
				;

			if (split.length) {
				Object.each(split, function(pair) {
					var sp = pair.split('=')
						;

					sp[0] && (args[sp[0]] = sp[1]);
				});
			}

			return args;
		},

		_pushState : function(appname, args, fragment) {
			var that = this,
				options = that._options,
				root = options.root,
				appPath = options.appPath,
				move = that._move,
				states = that._states,
				stateLimit = options.stateLimit,
				stateLen = states.length,
				stateIdx = that._stateIdx,

				prev = states[stateIdx - 1],
				last = states[stateIdx],
				next = states[stateIdx + 1],
				cur = {
					appname : appname,
					fragment : fragment,
					args : args,
					params : []
				}
				;

			// TODO 当使用浏览器的前进后退时，判断forward和backward会有点小问题
			if (move == null) {
				if (Object.keys(args).length === 0 && 
						prev && prev.fragment === cur.fragment) {
					move = 'backward';
				} else {
					move = 'forward';
				}
			}

			if (move === 'backward') {
				if (stateIdx === 0 && stateLen > 0) {
					states.unshift(cur);
				} else if (stateIdx > 0) {
					stateIdx--;
					cur = prev;
				}
			} else if (move === 'forward') {
				if (stateIdx === stateLimit - 1) {
					states.shift();
					states.push(cur);
				} else if (stateIdx === 0 && stateLen === 0) {
					states.push(cur);
				} else if (Object.keys(args).length === 0 && 
								next && next.fragment === cur.fragment){
					stateIdx++;
					cur = next;
				} else {
					stateIdx++;
					states.splice(stateIdx);
					states.push(cur);
				}
			}

			that._move = null;
			that._stateIdx = stateIdx;

			if (!last || last.appname != cur.appname) {
				cur.appentry = [root, appPath, appname, 'entry.js']
							.join('/').replace(/\/{2,}/g, '/');

				history.trigger('navigator:' + move, cur.appname, cur.appentry);				
			}
		},

		_replaceState : function(name, params, paramKeys) {
			var that = this,
				states = this._states,
				stateIdx = this._stateIdx,
				cur = this._states[stateIdx]
				;

			cur.params = params || [];
			cur.paramKeys = cur.paramKeys || paramKeys || {};

			history.trigger('navigator:route', cur.appname, name);
		},

		getState : function() {
			var that = this,
				states = this._states,
				stateIdx = this._stateIdx
				;

			return this._states[stateIdx];
		},

		addRoute : function(route, name) {
			var that = this,
				paramKeys = that._extractParamKeys(route),
				route = that._routeToRegExp(route)
				;

			history.route(route, function (fragment) {
				var split = fragment.split('!'),
					params = that._extractParameters(route, split[0])
					;

				params && that._replaceState(name, params, paramKeys);
			}, true);
		},

		removeRoute : function(route) {
			var that = this,
				route = that._routeToRegExp(route)
				;

			history.remove(route);
		},

		forward : function(fragment, argsObj) {
			var that = this,
				states = that._states,
				stateIdx = that._stateIdx,
				cur = states[stateIdx] || {},
				args = []
				;

			that._move = 'forward';

			if (fragment) {
				if (argsObj || cur.fragment !== fragment) {
					if (argsObj) {
						Object.each(argsObj, function(value, key) {
							args.push(key + '=' + value)
						});
					}

					//states.splice(stateIdx + 1);

					history.navigate(fragment + (args.length ? '!' + args.join('&') : ''));
				}
			} else {
				his.forward();
			}
		},

		backward : function() {
			var that = this,
				stateIdx = that._stateIdx
				;

			if (stateIdx === 0) return;

			that._move = 'backward';
			his.back();
		},

		start : function(config) {
			var that = this,
				options = Object.extend(that._options, config || {}),
				root = options.root,
				defaultApp = options.defaultApp
				;

			if (that._started) return;

			if (root.charAt(root.length - 1) !== '/') {
				options.root = root = root + '/';
			}			

			history.route(appRegExp, function(fragment) {
				var split = fragment.split('!'),
					appname = appRegExp.exec(split[0])[0] || defaultApp,
					args = that._extractArguments(split[1] || '')
					;

				that._pushState(appname, args, split[0]);
			});

			that._started = history.start({
				root : root,
				hashChange : true
			});
		}
	})
	;

Router.singleton = new Router;

module.exports = Router;

});
