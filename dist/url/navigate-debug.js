// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/url/navigate-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/url/router-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug"), Router = require("mix/core/0.3.0/url/router-debug"), namedRegExp = /\:(\w\w*)/g, splatRegExp = /\*(\w\w*)/g, perlRegExp = /P\<(\w\w*?)\>/g, //escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g,
    //routeRegExp = /^([^!]*?)(![^!]*?)?$/,
    win = window, doc = win.document, his = win.history, loc = win.location;
    var Navigate = Class.create({
        initialize: function(options, globalRouter) {
            var that = this;
            that._options = Object.extend({
                stateLimit: 100
            }, options || {});
            that._states = [];
            that._stateIdx = 0;
            that._move = null;
            if (globalRouter) {
                that._router = Router.singleton;
            } else {
                that._router = new Router();
            }
        },
        _convertParameters: function(route) {
            return route.replace(namedRegExp, "(P<$1>[^/][^/]*?)").replace(splatRegExp, "(P<$1>.*?)");
        },
        _extractParamKeys: function(route) {
            var matched = route.match(perlParam), keys = {};
            matched && Object.each(matched, function(key, i) {
                keys[key.replace(perlParam, "$1")] = i;
            });
            return keys;
        },
        _extractArguments: function(args) {
            var split = args.split("&");
            args = {};
            Object.each(split, function(pair) {
                if (pair) {
                    var s = pair.split("=");
                    args[s[0]] = s[1];
                }
            });
            return args;
        },
        _parseRoute: function(route) {
            route = route.replace(perlParam, "");
            return new RegExp("^(" + route + ")(![^!]*?)?$");
        },
        _isStateEqual: function(state1, state2) {},
        _pushState: function(name, fragment, params, args) {
            var that = this, options = that._options, stateLimit = options.stateLimit, states = that._states, stateIdx = that._stateIdx, stateLen = states.length, move = that._move, prev = states[stateIdx - 1], next = states[stateIdx + 1], cur = {
                name: name,
                fragment: fragment,
                params: params,
                args: args
            };
            function isEqual(state1, state2) {
                if (!state1 || !state2) return false;
                if (state1.fragment !== state2.fragment) return false;
                return true;
            }
            // TODO 当使用浏览器的前进后退时，判断forward和backward会有点小问题
            that._move = null;
            if (move == null) {
                if (prev && isEqual(prev, cur)) {
                    move = "backward";
                    stateIdx--;
                    cur = prev;
                } else if (!next || next && isEqual(next, cur)) {
                    move = "forward";
                    stateIdx++;
                    cur = next;
                }
            } else {
                if (move === "backward") {
                    if (stateIdx === 0 && stateLen > 0) {
                        states.unshift(cur);
                    } else if (stateIdx > 0) {
                        stateIdx--;
                        cur = prev;
                    }
                } else if (move === "forward") {
                    if (stateIdx === stateLimit - 1) {
                        states.shift();
                        states.push(cur);
                    } else if (stateIdx === 0 && stateLen === 0) {
                        states.push(cur);
                    } else if (isEqual(next, cur)) {
                        stateIdx++;
                        cur = next;
                    } else {
                        states.splice(stateIdx++);
                        states.push(cur);
                    }
                }
            }
            that._stateIdx = stateIdx;
            that._router.trigger("navigator:" + move, cur);
            return cur;
        },
        getState: function() {
            return this._states[this._stateIdx];
        },
        addRoute: function(name, routeText, callback, last) {
            var that = this, paramsKeys, routeReg;
            routeText = that._convertParameters(routeText);
            paramsKeys = that._extractParamKeys(routeText);
            routeReg = that._parseRoute(routeText);
            if (Object.isTypeof(callback) === "boolean") {
                last = callback;
                callback = null;
            }
            if (last == null) {
                last = true;
            }
            that._router.add(routeReg, function(fragment) {
                var matched = fragment.match(route).slice(2), args = that._extractArguments(matched.pop() || ""), params = {}, state;
                Object.each(paramsKeys, function(index, key) {
                    params[key] = matched[index];
                });
                state = that._pushState(name, fragment, params, args);
                callback && callback(state);
            }, last);
        },
        removeRoute: function(route) {
            var that = this, route = that._routeToRegExp(route);
            that._router.remove(route);
        },
        forward: function(fragment, options) {
            var that = this, states = that._states, stateIdx = that._stateIdx, cur = states[stateIdx], args = [];
            that._move = "forward";
            if (fragment) {
                if (!cur || cur.fragment !== fragment) {
                    if (options && options.args) {
                        Object.each(options.args, function(value, key) {
                            args.push(key + "=" + value);
                        });
                    }
                    that._router.navigate(fragment + (args.length ? "!" + args.join("&") : ""));
                }
            } else {
                his.forward();
            }
        },
        backward: function() {
            var that = this, stateIdx = that._stateIdx;
            if (stateIdx === 0) return;
            that._move = "backward";
            his.back();
        }
    });
    Navigate.singleton = new Navigate({}, true);
    module.exports = Navigate;
});