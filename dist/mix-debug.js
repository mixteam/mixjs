define("#mix/core/0.3.0/base/reset/reset-debug", [], function(require, exports, module) {
    var undef, toString = Object.prototype.toString;
    //
    // Object
    //
    if (!Object.keys) {
        Object.keys = function(object) {
            var keys = [];
            for (var name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }
    if (!Object.each) {
        Object.each = function(object, callback) {
            if (object == null) return;
            if (object instanceof Array || object.hasOwnProperty("length")) {
                Array.prototype.forEach.call(object, callback);
            } else if (typeof object == "object") {
                for (var name in object) {
                    if (object.hasOwnProperty(name)) {
                        callback(object[name], name, object);
                    }
                }
            }
        };
    }
    if (!Object.clone) {
        Object.clone = function(value, deeply) {
            if (value instanceof Array) {
                if (deeply) {
                    var arr = [];
                    Object.each(value, function(v) {
                        arr.push(Object.clone(v, deeply));
                    });
                    return arr;
                } else {
                    return value.slice();
                }
            } else if (typeof value === "object") {
                return Object.extend({}, value, deeply);
            } else {
                return value;
            }
        };
    }
    if (!Object.extend) {
        Object.extend = function(src, target, deeply) {
            var args = Array.make(arguments), src = args.shift();
            deeply = typeof args[args.length - 1] == "boolean" ? args.pop() : undef;
            Object.each(args, function(t) {
                Object.each(t, function(value, name) {
                    src[name] = Object.clone(value, deeply);
                });
            });
            return src;
        };
    }
    if (!Object.isTypeof) {
        var TYPE_REGEXP = /^\[object\s\s*(\w\w*)\s*\]$/i;
        Object.isTypeof = function(obj, istype) {
            var str = toString.call(obj).toLowerCase(), type = TYPE_REGEXP.exec(str);
            if (!type) return;
            if (istype) {
                return type[1].toLowerCase() === istype.toLowerCase();
            } else {
                return type[1].toLowerCase();
            }
        };
    }
    //
    // Array
    //
    if (!Array.make) {
        Array.make = function(object) {
            if (object.hasOwnProperty("length")) {
                return Array.prototype.slice.call(object);
            }
        };
    }
    if (!Array.eq) {
        Array.eq = function(a1, a2) {
            if (a1.length == a2.length) {
                a1.forEach(function(e, i) {
                    if (e !== a2[i]) {
                        return false;
                    }
                });
                return true;
            } else {
                return false;
            }
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(block, thisObject) {
            var len = this.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    block.call(thisObject, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(fun) {
            var len = this.length >>> 0;
            var res = new Array(len);
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    res[i] = fun.call(thisp, this[i], i, this);
                }
            }
            return res;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(block) {
            var values = [];
            var thisp = arguments[1];
            for (var i = 0; i < this.length; i++) {
                if (block.call(thisp, this[i])) {
                    values.push(this[i]);
                }
            }
            return values;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(fun) {
            var len = this.length >>> 0;
            var i = 0;
            // no value to return if no initial value and an empty array
            if (len === 0 && arguments.length === 1) throw new TypeError();
            if (arguments.length >= 2) {
                var rv = arguments[1];
            } else {
                do {
                    if (i in this) {
                        rv = this[i++];
                        break;
                    }
                    // if array contains no values, no initial value to return
                    if (++i >= len) throw new TypeError();
                } while (true);
            }
            for (;i < len; i++) {
                if (i in this) {
                    rv = fun.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(value) {
            var length = this.length;
            var i = arguments[1] || 0;
            if (!length) return -1;
            if (i >= length) return -1;
            if (i < 0) i += length;
            for (;i < length; i++) {
                if (!Object.prototype.hasOwnProperty.call(this, i)) {
                    continue;
                }
                if (value === this[i]) return i;
            }
            return -1;
        };
    }
    //
    // String
    //
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return String(this).replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        };
    }
    //
    // Function
    //
    if (!Function.binded) {
        var ctor = function() {}, slice = Array.prototype.slice;
        Function.binded = function(func, context) {
            var protoBind = Function.prototype.bind, args = Array.make(arguments), _args, bound;
            if (func.bind === protoBind && protoBind) return protoBind.apply(func, slice.call(arguments, 1));
            if (!Object.isTypeof(func, "function")) throw new TypeError();
            _args = args.slice(2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, _args.concat(args));
                ctor.prototype = func.prototype;
                var self = new ctor();
                var result = func.apply(self, _args.concat(args));
                if (Object(result) === result) return result;
                return self;
            };
        };
    }
});

// --------------------------------
// Thanks to:
//  - https://github.com/alipay/arale/blob/master/lib/class/docs/competitors.md
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/alipay/arale/blob/master/lib/class/src/class.js
//  - http://mootools.net/docs/core/Class/Class
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/ded/klass
//  - http://documentcloud.github.com/backbone/#Model-extend
//  - https://github.com/joyent/node/blob/master/lib/util.js
//  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js
//
// --------------------------------
// TODO: 
//  - 测试typeof和toString的性能
// The base Class implementation.
define("#mix/core/0.3.0/base/class/class-debug", [], function(require, exports, module) {
    function Class(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    }
    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;
        // The created class constructor
        function Klass() {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === Klass && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            mix(Klass, parent);
        }
        // Add instance properties to the klass.
        implement.call(Klass, properties);
        // Make klass extendable.
        return classify(Klass);
    };
    // Create a new Class that inherits from this class
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this;
        return Class.create(properties);
    };
    // Mutators define special properties.
    Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype);
            // Keep existed properties.
            mix(proto, existed);
            // Enforce the constructor to be what we expect.
            proto.constructor = this;
            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto;
            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype;
        },
        Implements: function(items) {
            isArray(items) || (items = [ items ]);
            var proto = this.prototype, item;
            while (item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };
    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}
    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ? function(proto) {
        return {
            __proto__: proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };
    function implement(properties) {
        var key, value;
        for (key in properties) {
            value = properties[key];
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    var mix = Class.mix = function(r, s) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== "prototype") {
                    r[p] = s[p];
                }
            }
        }
    };
    var toString = Object.prototype.toString;
    var isArray = Array.isArray;
    if (!isArray) {
        isArray = function(val) {
            return toString.call(val) === "[object Array]";
        };
    }
    var isFunction = function(val) {
        return toString.call(val) === "[object Function]";
    };
    module.exports = Class;
});

// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js
define("#mix/core/0.3.0/base/message/message-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), eventSplitter = /\s+/, // Regular expression used to split event strings
    atMessage = /^\@([^:]+)/, // Regular expression used to @message
    msgId = 0;
    // A module that can be mixed in to *any object* in order to provide it
    // with custom message. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Message();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Message = Class.create({
        initialize: function(name, id, defaultContext) {
            var that = this;
            that.__msgObj = {
                name: name || "anonymous",
                id: id || msgId++,
                cache: {},
                defaultContext: defaultContext || that
            };
        },
        // Bind one or more space separated events, `events`, to a `callback`
        // function. Passing `"all"` will bind the callback to all events fired.
        on: function(events, callback, context) {
            var that = this, cache = that.__msgObj.cache, event, list;
            if (!callback) return that;
            events = events.split(eventSplitter);
            while (event = events.shift()) {
                list = cache[event] || (cache[event] = []);
                list.push(callback, context);
            }
            return that;
        },
        // Remove one or many callbacks. If `context` is null, removes all callbacks
        // with that function. If `callback` is null, removes all callbacks for the
        // event. If `events` is null, removes all bound callbacks for all events.
        off: function(events, callback, context) {
            var that = this, cache = that.__msgObj.cache, event, list, i, len;
            // No events, or removing *all* events.
            if (!(events || callback || context)) {
                delete that.__msgObj.events;
                return that;
            }
            events = events ? events.split(eventSplitter) : Object.keys(cache);
            // Loop through the callback list, splicing where appropriate.
            while (event = events.shift()) {
                list = cache[event];
                if (!list) continue;
                if (!(callback || context)) {
                    delete cache[event];
                    continue;
                }
                for (i = list.length - 2; i >= 0; i -= 2) {
                    if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                        list.splice(i, 2);
                    }
                }
            }
            return that;
        },
        __getCaches: function(event) {
            var that = this, cache = that.__msgObj.cache, list, atEvent;
            if (atMessage.test(event)) {
                list = cache[event];
            } else {
                list = [];
                atEvent = new RegExp("^@[^\\:]+\\:" + event + "$");
                Object.each(cache, function(eventList, eventName) {
                    if (event === eventName || atEvent.test(eventName)) {
                        list = list.concat(eventList);
                    }
                });
            }
            return list;
        },
        has: function(event, callback, context) {
            var that = this, cache = that.__msgObj.cache, list = that.__getCaches(event), i;
            if (!list) return false;
            if (!(callback || context)) return true;
            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    return true;
                }
            }
            return false;
        },
        once: function(events, callback, context) {
            var that = this;
            function onceHandler() {
                callback.apply(this, arguments);
                that.off(events, onceHandler, context);
            }
            that.on(events, onceHandler, context);
        },
        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function(events) {
            var that = this, cache = that.__msgObj.cache, defaultContext = that.__msgObj.defaultContext, event, all, list, i, len, rest = [], args;
            events = events.split(eventSplitter);
            // Using loop is more efficient than `slice.call(arguments, 1)`
            for (i = 1, len = arguments.length; i < len; i++) {
                rest[i - 1] = arguments[i];
            }
            // For each event, walk through the list of callbacks twice, first to
            // trigger the event, then to trigger any `"all"` callbacks.
            while (event = events.shift()) {
                that.log(event + ":(" + rest.join(",") + ")");
                // Copy callback lists to prevent modification.
                if (all = cache.all) all = all.slice();
                if (list = that.__getCaches(event)) list = list.slice();
                // Execute event callbacks.
                if (list) {
                    for (i = 0, len = list.length; i < len; i += 2) {
                        list[i].apply(list[i + 1] || defaultContext, rest);
                    }
                }
                // Execute "all" callbacks.
                if (all) {
                    args = [ event ].concat(rest);
                    for (i = 0, len = all.length; i < len; i += 2) {
                        all[i].apply(all[i + 1] || defaultContext, args);
                    }
                }
            }
            return that;
        },
        log: function(msg) {
            var that = this;
            console.log("[(" + that.__msgObj.id + ")" + that.__msgObj.name + "]" + msg);
        }
    });
    // Mix `Message` to object instance or Class function.
    Message.mixTo = function(receiver) {
        receiver = receiver.prototype || receiver;
        var proto = Events.prototype;
        Object.extend(receiver, proto);
    };
    Message.spliterReg = eventSplitter;
    Message.atReg = atMessage;
    Message.singleton = new Message("global");
    module.exports = Message;
});

define("#mix/core/0.3.0/base/util/util-debug", [ "mix/core/0.3.0/base/class/class-debug" ], function(require, exports, module) {
    var Class = require("mix/core/0.3.0/base/class/class-debug");
    // List of HTML entities for escaping.
    var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;"
    };
    // Regex containing the keys listed immediately above.
    var htmlEscaper = /[&<>"'\/]/g;
    var Util = Class.create({
        initialize: function() {},
        // Escape a string for HTML interpolation.
        escape: function(string) {
            return ("" + string).replace(htmlEscaper, function(match) {
                return htmlEscapes[match];
            });
        }
    });
    Util.singleton = new Util();
    module.exports = Util;
});

/**
 * @fileOverview 统一环境检测包[Detect] Core 核心文件，在应用的最初始时加载，保持最简洁，无任何依赖
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.3.1
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//
// TODO: 
//  - 
(function(w) {
    var INFO, init, detect, key, d = w.document;
    if (typeof DETECT === "undefined") {
        DETECT = {};
    }
    if (DETECT.version) {
        return;
    }
    DETECT.version = "0.1";
    //全局DETECT信息初始化
    INFO = {
        network: {
            brandwidth: -1,
            //单位 kb/s，空值为-1
            type: "",
            grade: "",
            //grade等级标准粗略定义：
            //低：slow：1kbps - 768kbps
            //中：medium：：768kbps - 1.5mbps
            //高：fast：1.5mbps+
            online: ""
        },
        ua: {
            plat: {
                name: "",
                version: ""
            },
            device: {
                name: "",
                version: ""
            },
            browser: {
                name: "",
                version: "",
                webkitversion: ""
            }
        },
        ability: {},
        hardware: {
            resolution: [],
            performance: ""
        },
        api: {}
    };
    init = {
        beacon_url: "",
        site_domain: w.location.hostname.replace(/.*?([^.]+\.[^.]+)\.?$/, "$1").toLowerCase(),
        user_ip: ""
    };
    detect = {
        utils: {
            getCookie: function(name) {
                if (!name) {
                    return null;
                }
                name = " " + name + "=";
                var i, cookies;
                cookies = " " + d.cookie + ";";
                if ((i = cookies.indexOf(name)) >= 0) {
                    i += name.length;
                    cookies = cookies.substring(i, cookies.indexOf(";", i));
                    return cookies;
                }
                return null;
            },
            setCookie: function(name, subcookies, max_age) {
                var value = [], k, nameval, c, exp;
                if (!name) {
                    return false;
                }
                for (k in subcookies) {
                    if (subcookies.hasOwnProperty(k)) {
                        value.push(encodeURIComponent(k) + "=" + encodeURIComponent(subcookies[k]));
                    }
                }
                value = value.join("&");
                nameval = name + "=" + value;
                c = [ nameval, "path=/", "domain=" + impl.site_domain ];
                if (max_age) {
                    exp = new Date();
                    exp.setTime(exp.getTime() + max_age * 1e3);
                    exp = exp.toGMTString();
                    c.push("expires=" + exp);
                }
                if (nameval.length < 4e3) {
                    d.cookie = c.join("; ");
                    // confirm cookie was set (could be blocked by user's settings, etc.)
                    return value === this.getCookie(name);
                }
                return false;
            },
            removeCookie: function(name) {
                return this.setCookie(name, {}, 0);
            },
            print: function() {
                document.getElementById("J_DETECT").innerHTML = "DETECT.INFO：<br/>" + JSON.stringify(DETECT.INFO);
            },
            pluginConfig: function(o, config, plugin_name, properties) {
                var i, props = 0;
                if (!config || !config[plugin_name]) {
                    return false;
                }
                for (i = 0; i < properties.length; i++) {
                    if (typeof config[plugin_name][properties[i]] !== "undefined") {
                        o[properties[i]] = config[plugin_name][properties[i]];
                        props++;
                    }
                }
                return props > 0;
            }
        },
        init: function(config) {
            var k;
            if (!config) {
                config = {};
            }
            for (k in this.plugins) {
                /*
				if( config[k]
					&& ("enabled" in config[k])
					&& config[k].enabled === false
				) {
					init.disabled_plugins[k] = 1;
					continue;
				}

				else if(init.disabled_plugins[k]) {
					delete init.disabled_plugins[k];
				}
				*/
                //如果有plugin，则执行plugin的init
                if (this.plugins.hasOwnProperty(k) && typeof this.plugins[k].init === "function") {
                    this.plugins[k].init(config);
                }
            }
            return this;
        },
        info: function() {}
    };
    detect.INFO = INFO;
    for (key in detect) {
        if (detect.hasOwnProperty(key)) {
            DETECT[key] = detect[key];
        }
    }
    DETECT.plugins = DETECT.plugins || {};
})(window);

/**
 * @fileOverview 统一环境检测包[Detect] Ability能力检测
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.1.0
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//
// TODO: 
//  - 
(function(w) {
    DETECT = DETECT || {};
    DETECT.plugins = DETECT.plugins || {};
    var init = {};
    DETECT.plugins.Ability = {};
})(window);

/**
 * @fileOverview 统一环境检测包[Detect] DeviceAPI检测
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.1.0
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//
// TODO: 
//  - 
(function(w) {
    DETECT = DETECT || {};
    DETECT.plugins = DETECT.plugins || {};
    var init = {};
    DETECT.plugins.DeviceAPI = {};
})(window);

/**
 * @fileOverview 统一环境检测包[Detect] Hardware硬件环境检测
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.1.0
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//
// TODO: 
//  - 
(function(w) {
    DETECT = DETECT || {};
    DETECT.plugins = DETECT.plugins || {};
    var init = {};
    DETECT.plugins.Hardware = {};
})(window);

/**
 * @fileOverview 统一环境检测包[Detect] Network网络环境嗅探
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.3.0
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//
// 0.3.1：
//  - 优化图片：1.png换成jpg，减少内存占用、减少电量消耗。2.图片总体积压缩1倍，超时时间减少1倍。
//
// 0.3.0：
//  - 新增图片连续测速失败则退出的逻辑处理，增加离线判断逻辑，修复若干BUG
//
// TODO: 
//  - 缩小优化图片尺寸
//  - 增加webtiming
//  - 增加延迟细节测量 - 效仿facebook dopplor，先发一个0K极小图片获得DNS延迟
(function(w) {
    DETECT = DETECT || {};
    DETECT.plugins = DETECT.plugins || {};
    var IMG_TIMEOUT = 600;
    //快捷设置统一图片超时时间
    var images = [ //TODO：{ name: "image-l.gif", size: 0, timeout: 0}, //16kbps - 2k
    {
        name: "http://img04.taobaocdn.com/tps/i4/T1t._HXjxXXXbGICsI-120-120.jpg",
        size: 886,
        timeout: IMG_TIMEOUT
    }, //16kbps - 1k
    {
        name: "http://img01.taobaocdn.com/tps/i1/T1dD_GXhBgXXakeN3e-390-390.jpg",
        size: 6530,
        timeout: IMG_TIMEOUT
    }, //56kbps - 3.5k
    {
        name: "http://img02.taobaocdn.com/tps/i2/T10MfHXidcXXauBRvZ-618-618.jpg",
        size: 15870,
        timeout: IMG_TIMEOUT
    }, //128kbps - 8k
    {
        name: "http://img03.taobaocdn.com/tps/i3/T1fr2HXdBdXXbwcy7e-950-950.jpg",
        size: 47613,
        timeout: IMG_TIMEOUT
    }, //384kbps - 24k
    {
        name: "http://img04.taobaocdn.com/tps/i4/T1gYrHXjNgXXc1iuUZ-1194-1194.jpg",
        size: 64390,
        timeout: IMG_TIMEOUT
    } ];
    images.end = images.length;
    images.start = 0;
    var core = {
        //属性
        base_url: "",
        // ../src/images/
        timeout: 7e3,
        //15000
        exptime: 864e5,
        //一天
        ignore_num: 3,
        //连续几次失败则跳出
        //状态
        results: [],
        running: false,
        aborted: false,
        complete: false,
        //runs_left: 1,
        //方法
        //图片加载后的后续处理，定义result集合，写入该图片load时间，超时处理等
        prefix: function() {
            var type = this.checktype();
            DETECT.INFO.network.type = type;
            var online = this.checkonline();
            DETECT.INFO.network.online = online;
            //读取localstrage
            var info = this.getLocal("DETECT_INFO");
            //console.log(info);
            if (info && !this.exp()) {
                //本地已有数据并且没过期，记入DETECT并退出
                var bw = info.brandwidth, grade = info.grade;
                DETECT.INFO.network.brandwidth = parseInt(bw);
                DETECT.INFO.network.grade = grade;
                DETECT.utils.print();
                console.log("读取localstrage");
                return;
            }
            //如果本地没有数据，并且是离线状态，直接退出
            if (online == "offline") {
                return;
            }
            //alert(this.timeout);
            setTimeout(DETECT.plugins.network.abort, this.timeout);
            core.defer(core.iterate);
        },
        exp: function() {
            //1天=24*60*60*1000=86400000毫秒
            var now = new Date().getTime(), local = this.getLocal("DETECT_INFO").exptime;
            return now - local >= this.exptime;
        },
        getLocal: function(k) {
            var k = localStorage.getItem(k);
            return k === null || k === "undefined" ? null : JSON.parse(k);
        },
        setLocal: function(k, v) {
            v = JSON.stringify(v);
            return localStorage.setItem(k, v);
        },
        img_loaded: function(i, tstart, success) {
            //参数：当前图片序号、开始时间、剩余次数-1(5)、true
            if (this.results[i]) {
                //当前图片已测过 
                return;
            }
            /*
			// 如果超时，设置下一张图，终止
			if(success === null) { //当前超时
				this.results[i+1] = {t:null, state: null}; //设置下一张图
				return;
			}
			*/
            var result = {
                start: tstart,
                end: new Date().getTime(),
                t: null,
                state: success
            };
            // 如果成功则记录时间差
            if (success) {
                result.t = result.end - result.start;
            }
            this.results[i] = result;
            //如果1、2、3的state都是null，则跳出
            var ignore = this.ignore_num;
            if (i == ignore - 1) {
                //仅在第3张图时检查
                var l = [], hash = {};
                for (var j = 0; j < ignore; j++) {
                    //l[j] = this.results[j].state;
                    l[j] = this.results[j].state == true ? 1 : 0;
                    hash[l[j]] = l[j] == 1 ? true : false;
                }
                var n = 0;
                for (var k in hash) {
                    n++;
                }
                //console.log(n);
                //console.log(hash);
                if (n == 1 && hash[0] && hash[0] == false) {
                    console.log(l);
                    console.log("连续" + ignore + "次失败，可能已经掉线");
                    //DETECT.plugins.network.abort();
                    return false;
                }
            }
            // 图片加载超时（网速太慢），则跳到下一张
            if (i >= images.end - 1 || typeof this.results[i + 1] !== "undefined") {
                //第一次运行是一个试点来决定我们可以下载的最大图片是什么，然后后续run只下载图像就够了
                /*
				if(run === this.nruns) { //如果当前大轮训次数 === 大轮询总次数
					images.start = i; //images.start 为当前图片序号
					//alert(i);
				}
				*/
                //this.defer(this.iterate); //延迟10ms执行iterate //iterate用来初始化result中的r 并执行load_img
                this.finish();
            } else {
                this.load_img(i + 1, this.img_loaded);
            }
        },
        finish: function() {
            //计算bw
            var bw = this.calculate(), grade = this.grade(bw), type = DETECT.INFO.network.type;
            //setcookies
            //写入INFO
            DETECT.INFO.network.brandwidth = bw;
            DETECT.INFO.network.grade = grade;
            //document.body.innerHTML = ('DETECT.INFO：<br/>'+JSON.stringify(DETECT.INFO));
            DETECT.utils.print();
            //写入localstorage
            /*
			localStorage.setItem('DETECT_INFO_NETWORK', true);
			localStorage.setItem('DETECT_INFO_NETWORK_BRANDWIDTH', bw);
			localStorage.setItem('DETECT_INFO_NETWORK_GRADE', grade);
			*/
            var exptime = new Date().getTime();
            //console.log(o);
            this.setLocal("DETECT_INFO", {
                type: type,
                brandwidth: bw,
                grade: grade,
                exptime: exptime
            });
            //console.log(JSON.parse(this.getLocal('DETECT_INFO')));
            this.complete = true;
            this.running = false;
        },
        checkonline: function() {
            var online = navigator.onLine;
            if (navigator.hasOwnProperty("onLine")) {
                return online ? "online" : "offline";
            } else {
                return false;
            }
        },
        checktype: function() {
            //var isOnline = navigator.onLine;
            var connection = navigator.connection;
            if (connection) {
                //var onlinetxt = isOnline?'在线':'不在线';
                var type = "";
                switch (connection.type) {
                  case connection.UNKNOWN:
                    type = "UNKNOWN";
                    break;

                  case connection.ETHERNET:
                    //type = navigator.connection.ETHERNET + 'ETHERNET';
                    type = "ETHERNET";
                    break;

                  case connection.WIFI:
                    //type = navigator.connection.WIFI + 'WIFI';
                    type = "WIFI";
                    break;

                  case connection.CELL_2G:
                    //type = navigator.connection.CELL_2G + '2G';
                    type = "2G";
                    break;

                  case connection.CELL_3G:
                    //type = navigator.connection.CELL_3G + '3G';
                    type = "3G";
                    break;
                }
                return type;
            } else {
                return false;
            }
        },
        calculate: function() {
            //计算
            var result = -1, nimgs = 0, bw, sum = 0, bandwidths = [], r = this.results;
            for (i = r.length - 1; i >= 0; i--) {
                if (!r[i]) {
                    break;
                }
                if (r[i].t === null) {
                    continue;
                }
                nimgs++;
                bw = images[i].size * 1e3 / r[i].t;
                // 字节/秒
                bandwidths.push(bw);
            }
            var n = bandwidths.length;
            for (j = 0; j < n; j++) {
                sum += bandwidths[j];
            }
            result = Math.round(sum / n);
            console.log(nimgs + "次平均网速：" + result + "字节/秒，相当于" + result * 8 / 1e3 + "Kbps");
            return result;
        },
        grade: function(bw) {
            //网速：
            //低速（2G）：76.8kbps-
            //中速（WIFI/3G）：76.8kbps-150kbps
            //高速（WIFI/3G）：150kbps+
            var bps = bw * 8;
            if (bps > 0 && bps < 76800) {
                return "slow";
            } else if (bps >= 76800 && bps < 15e4) {
                return "medium";
            } else if (bps >= 15e4) {
                return "fast";
            }
        },
        //延迟10ms
        defer: function(func) {
            var that = this;
            return setTimeout(function() {
                func.call(that);
                that = null;
            }, 10);
        },
        load_img: function(i, callback) {
            //参数：当前图片序号、剩余次数-1(5)、img_loaded回调
            var url = this.base_url + images[i].name + "?t=" + new Date().getTime() + Math.random(), // Math.random() is slow, but we get it before we start the timer
            timer = 0, tstart = 0, img = new Image(), that = this;
            //img的onload和定时器同时触发，如果onload在timeout时间内完毕，则清楚定时器，进入正常流
            //如果超出timeout还没onload，则直接调用callback，成功参数传入null
            img.onload = function() {
                img.onload = img.onerror = null;
                img = null;
                clearTimeout(timer);
                //清除定时器
                if (callback) {
                    callback.call(that, i, tstart, true);
                }
                that = callback = null;
            };
            img.onerror = function() {
                img.onload = img.onerror = null;
                img = null;
                clearTimeout(timer);
                if (callback) {
                    callback.call(that, i, tstart, false);
                }
                that = callback = null;
            };
            timer = setTimeout(function() {
                //在当前images设定的timeout时间后，再执行一个img_loaded回调
                if (callback) {
                    callback.call(that, i, tstart, null);
                }
            }, images[i].timeout);
            tstart = new Date().getTime();
            img.src = url;
        },
        iterate: function(finish) {
            if (this.aborted) {
                return false;
            }
            if (finish) {
                //如果runs_left为0 就结束
                this.finish();
            } else {
                //this.results.push({}); //初始化一个新的r
                this.load_img(images.start, this.img_loaded);
            }
        }
    };
    DETECT.plugins.network = {
        init: function(config) {
            DETECT.utils.pluginConfig(core, config, "network");
            //core.runs_left = 1;
            //页面加载完成后
            this.run();
            return this;
        },
        run: function() {
            core.running = true;
            core.prefix();
            return this;
        },
        abort: function() {
            core.aborted = true;
            if (core.running) core.finish();
            console.log("超过预设时间：" + core.timeout);
            return this;
        }
    };
})(window);

/**
 * @fileOverview 统一环境检测包[Detect] UA检测
 * @author SMbey0nd http://github.com/SMbey0nd
 * @version 0.2.0
 * MIT Licensed.
 */
// --------------------------------
// Thanks to:
//  - boomerang http://lognormal.github.com/boomerang/doc/howtos/index.html
//  - zepto detect module
//
// 0.2.0：
//  - 增加iPod、UC、QQ
//  - 增加webkitversion字段，以应对套壳浏览器
//
// TODO: 
//  - 除错和测试，增加新设备，观察不同设备的特点
(function(w) {
    DETECT = DETECT || {};
    DETECT.plugins = DETECT.plugins || {};
    var core = {
        rule: function() {
            var ua = navigator.userAgent;
            var D = DETECT.INFO.ua;
            var webkit = ua.match(/WebKit\/([\d.]+)/), android = ua.match(/(Android)\s+([\d.]+)/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), ipod = ua.match(/(iPod.*OS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), uc_webkit = ua.match(/UC\sAppleWebKit\/([\d.]+)/), uc_proxy = ua.match(/(UCWEB)(\d.+?(?=\/))/), //TIPS: (\d.+?(?=\/)) 中的 \d是数字 .是任意 +?是懒惰模式只匹配一次 (?=\/)是零宽断言只匹配斜杠前面的部分不包含斜杠
            qq = ua.match(/(MQQBrowser)\/(\d.+?(?=\/|\sMozilla)).*AppleWebKit\/([\d.]+)/);
            //浏览器信息
            if (webkit) {
                D.browser.name = "webkit", D.browser.version = D.browser.webkitversion = webkit[1];
            }
            //TIPS：uc-webkit的检测结果会包含webkit的检测结果，因为都有webkit字样；所以webkit放在最前面。
            //TIPS：iOS下的UC的webkit模式，跟Safari的UA特征一致，无法区分
            if (uc_webkit) {
                D.browser.name = "uc-webkit", D.browser.webkitversion = uc_webkit[1];
            }
            //TIPS：uc的webkit模式，UA不带浏览器自身版本号，只带webkit版本号。而proxy模式，UA只带浏览器自身版本号。
            if (uc_proxy) {
                D.browser.name = "uc-proxy", D.browser.version = uc_proxy[2];
            }
            //TIPS：QQ同时带有自身版本号和webkit版本号
            if (qq) {
                if (qq[2].length == 2) qq[2] = qq[2].replace(/(\d)/, "$1.");
                //TIPS：iOS上qq版本号比较凌乱且中间不带. 只能手动加上
                D.browser.name = "qq", D.browser.version = qq[2], D.browser.webkitversion = qq[3];
            }
            //平台信息
            if (android) D.plat.name = "android", D.plat.version = android[2];
            if (iphone) D.plat.name = "ios", D.plat.version = iphone[2].replace(/_/g, "."), 
            D.device.name = "iphone";
            if (ipad) D.plat.name = "ios", D.plat.version = ipad[2].replace(/_/g, "."), D.device.name = "ipad";
            if (ipod) D.plat.name = "ios", D.plat.version = ipod[2].replace(/_/g, "."), D.device.name = "ipod";
            if (webos) D.plat.name = "webos", D.plat.version = webos[2];
        }
    };
    DETECT.plugins.UA = {
        init: function(config) {
            DETECT.utils.pluginConfig(core, config, "UA");
            core.rule();
        }
    };
})(window);

//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
define("#mix/core/0.3.0/dom/selector/selector-debug", [], function(require, exports, module) {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, document = window.document, elementDisplay = {}, classCache = {}, getComputedStyle = document.defaultView.getComputedStyle, cssNumber = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, // Used by `$.zepto.init` to wrap elements, text/comment nodes, document,
    // and document fragment node types.
    elementTypes = [ 1, 3, 8, 9, 11 ], adjacencyOperators = [ "after", "prepend", "before", "append" ], table = document.createElement("table"), tableRow = document.createElement("tr"), containers = {
        tr: document.createElement("tbody"),
        tbody: table,
        thead: table,
        tfoot: table,
        td: tableRow,
        th: tableRow,
        "*": document.createElement("div")
    }, readyRE = /complete|loaded|interactive/, classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]+)$/, tagSelectorRE = /^[\w-]+$/, toString = {}.toString, zepto = {}, camelize, uniq, tempParent = document.createElement("div");
    zepto.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false;
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
        if (matchesSelector) return matchesSelector.call(element, selector);
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent;
        if (temp) (parent = tempParent).appendChild(element);
        match = ~zepto.qsa(parent, selector).indexOf(element);
        temp && tempParent.removeChild(element);
        return match;
    };
    function isFunction(value) {
        return toString.call(value) == "[object Function]";
    }
    function isObject(value) {
        return value instanceof Object;
    }
    function isPlainObject(value) {
        return isObject(value) && value.__proto__ == Object.prototype;
    }
    function isArray(value) {
        return value instanceof Array;
    }
    function likeArray(obj) {
        return typeof obj.length == "number";
    }
    function compact(array) {
        return array.filter(function(item) {
            return item !== undefined && item !== null;
        });
    }
    function flatten(array) {
        return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    camelize = function(str) {
        return str.replace(/-+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : "";
        });
    };
    function dasherize(str) {
        return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    }
    uniq = function(array) {
        return array.filter(function(item, idx) {
            return array.indexOf(item) == idx;
        });
    };
    function classRE(name) {
        return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
    }
    function maybeAddPx(name, value) {
        return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
    }
    function defaultDisplay(nodeName) {
        var element, display;
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName);
            document.body.appendChild(element);
            display = getComputedStyle(element, "").getPropertyValue("display");
            element.parentNode.removeChild(element);
            display == "none" && (display = "block");
            elementDisplay[nodeName] = display;
        }
        return elementDisplay[nodeName];
    }
    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function(html, name) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = "*";
        var container = containers[name];
        container.innerHTML = "" + html;
        return $.each(slice.call(container.childNodes), function() {
            container.removeChild(this);
        });
    };
    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. Note that `__proto__` is not supported on Internet
    // Explorer. This method can be overriden in plugins.
    zepto.Z = function(dom, selector) {
        dom = dom || [];
        dom.__proto__ = arguments.callee.prototype;
        dom.selector = selector || "";
        return dom;
    };
    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overriden in plugins.
    zepto.isZ = function(object) {
        return object instanceof zepto.Z;
    };
    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overriden in plugins.
    zepto.init = function(selector, context) {
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z(); else if (isFunction(selector)) return $(document).ready(selector); else if (zepto.isZ(selector)) return selector; else {
            var dom;
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector); else if (isPlainObject(selector)) dom = [ $.extend({}, selector) ], 
            selector = null; else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window) dom = [ selector ], 
            selector = null; else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1), 
            selector = null; else if (context !== undefined) return $(context).find(selector); else dom = zepto.qsa(document, selector);
            // create a new Zepto collection from the nodes found
            return zepto.Z(dom, selector);
        }
    };
    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, whichs makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function(selector, context) {
        return zepto.init(selector, context);
    };
    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function(target) {
        slice.call(arguments, 1).forEach(function(source) {
            for (key in source) if (source[key] !== undefined) target[key] = source[key];
        });
        return target;
    };
    // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overriden in plugins.
    zepto.qsa = function(element, selector) {
        var found;
        return element === document && idSelectorRE.test(selector) ? (found = element.getElementById(RegExp.$1)) ? [ found ] : emptyArray : element.nodeType !== 1 && element.nodeType !== 9 ? emptyArray : slice.call(classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector));
    };
    function filtered(nodes, selector) {
        return selector === undefined ? $(nodes) : $(nodes).filter(selector);
    }
    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    $.isFunction = isFunction;
    $.isObject = isObject;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;
    $.inArray = function(elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i);
    };
    $.trim = function(str) {
        return str.trim();
    };
    // plugin compatibility
    $.uuid = 0;
    $.map = function(elements, callback) {
        var value, values = [], i, key;
        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value);
        } else for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value);
        }
        return flatten(values);
    };
    $.each = function(elements, callback) {
        var i, key;
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
        } else {
            for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
        }
        return elements;
    };
    if (window.JSON) $.parseJSON = JSON.parse;
    // Define methods that will be available on all
    // Zepto collections
    $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,
        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn) {
            return $.map(this, function(el, i) {
                return fn.call(el, i, el);
            });
        },
        slice: function() {
            return $(slice.apply(this, arguments));
        },
        ready: function(callback) {
            if (readyRE.test(document.readyState)) callback($); else document.addEventListener("DOMContentLoaded", function() {
                callback($);
            }, false);
            return this;
        },
        get: function(idx) {
            return idx === undefined ? slice.call(this) : this[idx];
        },
        toArray: function() {
            return this.get();
        },
        size: function() {
            return this.length;
        },
        remove: function() {
            return this.each(function() {
                if (this.parentNode != null) this.parentNode.removeChild(this);
            });
        },
        each: function(callback) {
            this.forEach(function(el, idx) {
                callback.call(el, idx, el);
            });
            return this;
        },
        filter: function(selector) {
            if (isFunction(selector)) return this.not(this.not(selector));
            return $([].filter.call(this, function(element) {
                return zepto.matches(element, selector);
            }));
        },
        add: function(selector, context) {
            return $(uniq(this.concat($(selector, context))));
        },
        is: function(selector) {
            return this.length > 0 && zepto.matches(this[0], selector);
        },
        not: function(selector) {
            var nodes = [];
            if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
                if (!selector.call(this, idx)) nodes.push(this);
            }); else {
                var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                this.forEach(function(el) {
                    if (excludes.indexOf(el) < 0) nodes.push(el);
                });
            }
            return $(nodes);
        },
        eq: function(idx) {
            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
        },
        first: function() {
            var el = this[0];
            return el && !isObject(el) ? el : $(el);
        },
        last: function() {
            var el = this[this.length - 1];
            return el && !isObject(el) ? el : $(el);
        },
        find: function(selector) {
            var result;
            if (this.length == 1) result = zepto.qsa(this[0], selector); else result = this.map(function() {
                return zepto.qsa(this, selector);
            });
            return $(result);
        },
        closest: function(selector, context) {
            var node = this[0];
            while (node && !zepto.matches(node, selector)) node = node !== context && node !== document && node.parentNode;
            return $(node);
        },
        parents: function(selector) {
            var ancestors = [], nodes = this;
            while (nodes.length > 0) nodes = $.map(nodes, function(node) {
                if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
                    ancestors.push(node);
                    return node;
                }
            });
            return filtered(ancestors, selector);
        },
        parent: function(selector) {
            return filtered(uniq(this.pluck("parentNode")), selector);
        },
        children: function(selector) {
            return filtered(this.map(function() {
                return slice.call(this.children);
            }), selector);
        },
        contents: function() {
            return $(this.map(function() {
                return slice.call(this.childNodes);
            }));
        },
        siblings: function(selector) {
            return filtered(this.map(function(i, el) {
                return slice.call(el.parentNode.children).filter(function(child) {
                    return child !== el;
                });
            }), selector);
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = "";
            });
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property) {
            return this.map(function() {
                return this[property];
            });
        },
        show: function() {
            return this.each(function() {
                this.style.display == "none" && (this.style.display = null);
                if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
            });
        },
        replaceWith: function(newContent) {
            return this.before(newContent).remove();
        },
        wrap: function(newContent) {
            return this.each(function() {
                $(this).wrapAll($(newContent)[0].cloneNode(false));
            });
        },
        wrapAll: function(newContent) {
            if (this[0]) {
                $(this[0]).before(newContent = $(newContent));
                newContent.append(this);
            }
            return this;
        },
        wrapInner: function(newContent) {
            return this.each(function() {
                var self = $(this), contents = self.contents();
                contents.length ? contents.wrapAll(newContent) : self.append(newContent);
            });
        },
        unwrap: function() {
            this.parent().each(function() {
                $(this).replaceWith($(this).children());
            });
            return this;
        },
        clone: function() {
            return $(this.map(function() {
                return this.cloneNode(true);
            }));
        },
        hide: function() {
            return this.css("display", "none");
        },
        toggle: function(setting) {
            return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide();
        },
        prev: function(selector) {
            return $(this.pluck("previousElementSibling")).filter(selector || "*");
        },
        next: function(selector) {
            return $(this.pluck("nextElementSibling")).filter(selector || "*");
        },
        html: function(html) {
            return html === undefined ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
                var originHtml = this.innerHTML;
                $(this).empty().append(funcArg(this, html, idx, originHtml));
            });
        },
        text: function(text) {
            return text === undefined ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                this.textContent = text;
            });
        },
        attr: function(name, value) {
            var result;
            return typeof name == "string" && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == "value" && this[0].nodeName == "INPUT" ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
                if (this.nodeType !== 1) return;
                if (isObject(name)) for (key in name) this.setAttribute(key, name[key]); else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
            });
        },
        removeAttr: function(name) {
            return this.each(function() {
                if (this.nodeType === 1) this.removeAttribute(name);
            });
        },
        prop: function(name, value) {
            return value === undefined ? this[0] ? this[0][name] : undefined : this.each(function(idx) {
                this[name] = funcArg(this, value, idx, this[name]);
            });
        },
        data: function(name, value) {
            var data = this.attr("data-" + dasherize(name), value);
            return data !== null ? data : undefined;
        },
        val: function(value) {
            return value === undefined ? this.length > 0 ? this[0].multiple ? $(this[0]).find("option").filter(function(o) {
                return this.selected;
            }).pluck("value") : this[0].value : undefined : this.each(function(idx) {
                this.value = funcArg(this, value, idx, this.value);
            });
        },
        offset: function() {
            if (this.length == 0) return null;
            var obj = this[0].getBoundingClientRect();
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: obj.width,
                height: obj.height
            };
        },
        css: function(property, value) {
            if (value === undefined && typeof property == "string") return this.length == 0 ? undefined : this[0].style[camelize(property)] || getComputedStyle(this[0], "").getPropertyValue(property);
            var css = "";
            for (key in property) if (typeof property[key] == "string" && property[key] == "") this.each(function() {
                this.style.removeProperty(dasherize(key));
            }); else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
            if (typeof property == "string") if (value == "") this.each(function() {
                this.style.removeProperty(dasherize(property));
            }); else css = dasherize(property) + ":" + maybeAddPx(property, value);
            return this.each(function() {
                this.style.cssText += ";" + css;
            });
        },
        index: function(element) {
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
        },
        hasClass: function(name) {
            if (this.length < 1) return false; else return classRE(name).test(this[0].className);
        },
        addClass: function(name) {
            return this.each(function(idx) {
                classList = [];
                var cls = this.className, newName = funcArg(this, name, idx, cls);
                newName.split(/\s+/g).forEach(function(klass) {
                    if (!$(this).hasClass(klass)) classList.push(klass);
                }, this);
                classList.length && (this.className += (cls ? " " : "") + classList.join(" "));
            });
        },
        removeClass: function(name) {
            return this.each(function(idx) {
                if (name === undefined) return this.className = "";
                classList = this.className;
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                    classList = classList.replace(classRE(klass), " ");
                });
                this.className = classList.trim();
            });
        },
        toggleClass: function(name, when) {
            return this.each(function(idx) {
                var newName = funcArg(this, name, idx, this.className);
                (when === undefined ? !$(this).hasClass(newName) : when) ? $(this).addClass(newName) : $(this).removeClass(newName);
            });
        }
    };
    [ "width", "height" ].forEach(function(dimension) {
        $.fn[dimension] = function(value) {
            var offset, Dimension = dimension.replace(/./, function(m) {
                return m[0].toUpperCase();
            });
            if (value === undefined) return this[0] == window ? window["inner" + Dimension] : this[0] == document ? document.documentElement["offset" + Dimension] : (offset = this.offset()) && offset[dimension]; else return this.each(function(idx) {
                var el = $(this);
                el.css(dimension, funcArg(this, value, idx, el[dimension]()));
            });
        };
    });
    function insert(operator, target, node) {
        var parent = operator % 2 ? target : target.parentNode;
        parent ? parent.insertBefore(node, !operator ? target.nextSibling : // after
        operator == 1 ? parent.firstChild : // prepend
        operator == 2 ? target : // before
        null) : // append
        $(node).remove();
    }
    function traverseNode(node, fun) {
        fun(node);
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
    }
    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(key, operator) {
        $.fn[key] = function() {
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var nodes = $.map(arguments, function(n) {
                return isObject(n) ? n : zepto.fragment(n);
            });
            if (nodes.length < 1) return this;
            var size = this.length, copyByClone = size > 1, inReverse = operator < 2;
            return this.each(function(index, target) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[inReverse ? nodes.length - i - 1 : i];
                    traverseNode(node, function(node) {
                        if (node.nodeName != null && node.nodeName.toUpperCase() === "SCRIPT" && (!node.type || node.type === "text/javascript")) window["eval"].call(window, node.innerHTML);
                    });
                    if (copyByClone && index < size - 1) node = node.cloneNode(true);
                    insert(operator, target, node);
                }
            });
        };
        $.fn[operator % 2 ? key + "To" : "insert" + (operator ? "Before" : "After")] = function(html) {
            $(html)[key](this);
            return this;
        };
    });
    zepto.Z.prototype = $.fn;
    // Export internal API functions in the `$.zepto` namespace
    zepto.camelize = camelize;
    zepto.uniq = uniq;
    $.zepto = zepto;
    module.exports = $;
});

//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
define("#mix/core/0.3.0/dom/event/event-debug", [ "mix/core/0.3.0/dom/selector/selector-debug" ], function(require, exports, module) {
    var Selector = require("mix/core/0.3.0/dom/selector/selector-debug");
    (function($) {
        var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents = {};
        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
        function zid(element) {
            return element._zid || (element._zid = _zid++);
        }
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns) var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
            });
        }
        function parse(event) {
            var parts = ("" + event).split(".");
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(" ")
            };
        }
        function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
        }
        function eachEvent(events, fn, iterator) {
            if ($.isObject(events)) $.each(events, iterator); else events.split(/\s/).forEach(function(type) {
                iterator(type, fn);
            });
        }
        function add(element, events, fn, selector, getDelegate, capture) {
            capture = !!capture;
            var id = zid(element), set = handlers[id] || (handlers[id] = []);
            eachEvent(events, fn, function(event, fn) {
                var delegate = getDelegate && getDelegate(fn, event), callback = delegate || fn;
                var proxyfn = function(event) {
                    var result = callback.apply(element, [ event ].concat(event.data));
                    if (result === false) event.preventDefault();
                    return result;
                };
                var handler = $.extend(parse(event), {
                    fn: fn,
                    proxy: proxyfn,
                    sel: selector,
                    del: delegate,
                    i: set.length
                });
                set.push(handler);
                element.addEventListener(handler.e, proxyfn, capture);
            });
        }
        function remove(element, events, fn, selector) {
            var id = zid(element);
            eachEvent(events || "", fn, function(event, fn) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    element.removeEventListener(handler.e, handler.proxy, false);
                });
            });
        }
        $.event = {
            add: add,
            remove: remove
        };
        $.proxy = function(fn, context) {
            if ($.isFunction(fn)) {
                var proxyFn = function() {
                    return fn.apply(context, arguments);
                };
                proxyFn._zid = zid(fn);
                return proxyFn;
            } else if (typeof context == "string") {
                return $.proxy(fn[context], fn);
            } else {
                throw new TypeError("expected function");
            }
        };
        $.fn.bind = function(event, callback) {
            return this.each(function() {
                add(this, event, callback);
            });
        };
        $.fn.unbind = function(event, callback) {
            return this.each(function() {
                remove(this, event, callback);
            });
        };
        $.fn.one = function(event, callback) {
            return this.each(function(i, element) {
                add(this, event, callback, null, function(fn, type) {
                    return function() {
                        var result = fn.apply(element, arguments);
                        remove(element, type, fn);
                        return result;
                    };
                });
            });
        };
        var returnTrue = function() {
            return true;
        }, returnFalse = function() {
            return false;
        }, eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        function createProxy(event) {
            var proxy = $.extend({
                originalEvent: event
            }, event);
            $.each(eventMethods, function(name, predicate) {
                proxy[name] = function() {
                    this[predicate] = returnTrue;
                    return event[name].apply(event, arguments);
                };
                proxy[predicate] = returnFalse;
            });
            return proxy;
        }
        // emulates the 'defaultPrevented' property for browsers that have none
        function fix(event) {
            if (!("defaultPrevented" in event)) {
                event.defaultPrevented = false;
                var prevent = event.preventDefault;
                event.preventDefault = function() {
                    this.defaultPrevented = true;
                    prevent.call(this);
                };
            }
        }
        $.fn.delegate = function(selector, event, callback) {
            var capture = false;
            if (event == "blur" || event == "focus") {
                if ($.iswebkit) event = event == "blur" ? "focusout" : event == "focus" ? "focusin" : event; else capture = true;
            }
            return this.each(function(i, element) {
                add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match) {
                            evt = $.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return fn.apply(match, [ evt ].concat([].slice.call(arguments, 1)));
                        }
                    };
                }, capture);
            });
        };
        $.fn.undelegate = function(selector, event, callback) {
            return this.each(function() {
                remove(this, event, callback, selector);
            });
        };
        $.fn.live = function(event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this;
        };
        $.fn.die = function(event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this;
        };
        $.fn.on = function(event, selector, callback) {
            return selector == undefined || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback);
        };
        $.fn.off = function(event, selector, callback) {
            return selector == undefined || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
        };
        $.fn.trigger = function(event, data) {
            if (typeof event == "string") event = $.Event(event);
            fix(event);
            event.data = data;
            return this.each(function() {
                // items in the collection might not be DOM elements
                // (todo: possibly support events on plain old objects)
                if ("dispatchEvent" in this) this.dispatchEvent(event);
            });
        };
        // triggers event handlers on current element just as if an event occurred,
        // doesn't trigger an actual event, doesn't bubble
        $.fn.triggerHandler = function(event, data) {
            var e, result;
            this.each(function(i, element) {
                e = createProxy(typeof event == "string" ? $.Event(event) : event);
                e.data = data;
                e.target = element;
                $.each(findHandlers(element, event.type || event), function(i, handler) {
                    result = handler.proxy(e);
                    if (e.isImmediatePropagationStopped()) return false;
                });
            });
            return result;
        };
        ("focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
                return this.bind(event, callback);
            };
        });
        [ "focus", "blur" ].forEach(function(name) {
            $.fn[name] = function(callback) {
                if (callback) this.bind(name, callback); else if (this.length) try {
                    this.get(0)[name]();
                } catch (e) {}
                return this;
            };
        });
        $.Event = function(type, props) {
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
            if (props) for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            return event;
        };
    })(Selector);
});

//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
define("#mix/core/0.3.0/dom/ajax/ajax-debug", [ "mix/core/0.3.0/dom/selector/selector-debug" ], function(require, exports, module) {
    var Selector = require("mix/core/0.3.0/dom/selector/selector-debug");
    (function($) {
        var jsonpID = 0, isObject = $.isObject, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/, specialEvents = {};
        //function fix/event/trigger borrowed from event
        // emulates the 'defaultPrevented' property for browsers that have none
        function fix(event) {
            if (!("defaultPrevented" in event)) {
                event.defaultPrevented = false;
                var prevent = event.preventDefault;
                event.preventDefault = function() {
                    this.defaultPrevented = true;
                    prevent.call(this);
                };
            }
        }
        $.Event = function(type, props) {
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
            if (props) for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            return event;
        };
        $.fn.trigger = function(event, data) {
            if (typeof event == "string") event = $.Event(event);
            fix(event);
            event.data = data;
            return this.each(function() {
                // items in the collection might not be DOM elements
                // (todo: possibly support events on plain old objects)
                if ("dispatchEvent" in this) this.dispatchEvent(event);
            });
        };
        // trigger a custom event and return false if it was cancelled
        function triggerAndReturn(context, eventName, data) {
            var event = $.Event(eventName);
            $(context).trigger(event, data);
            return !event.defaultPrevented;
        }
        // trigger an Ajax "global" event
        function triggerGlobal(settings, context, eventName, data) {
            if (settings.global) return triggerAndReturn(context || document, eventName, data);
        }
        // Number of active Ajax requests
        $.active = 0;
        function ajaxStart(settings) {
            if (settings.global && $.active++ === 0) triggerGlobal(settings, null, "ajaxStart");
        }
        function ajaxStop(settings) {
            if (settings.global && !--$.active) triggerGlobal(settings, null, "ajaxStop");
        }
        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context;
            if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [ xhr, settings ]) === false) return false;
            triggerGlobal(settings, context, "ajaxSend", [ xhr, settings ]);
        }
        function ajaxSuccess(data, xhr, settings) {
            var context = settings.context, status = "success";
            settings.success.call(context, data, status, xhr);
            triggerGlobal(settings, context, "ajaxSuccess", [ xhr, settings, data ]);
            ajaxComplete(status, xhr, settings);
        }
        // type: "timeout", "error", "abort", "parsererror"
        function ajaxError(error, type, xhr, settings) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error);
            triggerGlobal(settings, context, "ajaxError", [ xhr, settings, error ]);
            ajaxComplete(type, xhr, settings);
        }
        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status);
            triggerGlobal(settings, context, "ajaxComplete", [ xhr, settings ]);
            ajaxStop(settings);
        }
        // Empty function, used as default callback
        function empty() {}
        $.ajaxJSONP = function(options) {
            var callbackName = "jsonp" + ++jsonpID, script = document.createElement("script"), abort = function() {
                $(script).remove();
                if (callbackName in window) window[callbackName] = empty;
                ajaxComplete("abort", xhr, options);
            }, xhr = {
                abort: abort
            }, abortTimeout;
            if (options.error) script.onerror = function() {
                xhr.abort();
                options.error();
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                ajaxSuccess(data, xhr, options);
            };
            serializeData(options);
            script.src = options.url.replace(/=\?/, "=" + callbackName);
            $("head").append(script);
            if (options.timeout > 0) abortTimeout = setTimeout(function() {
                xhr.abort();
                ajaxComplete("timeout", xhr, options);
            }, options.timeout);
            return xhr;
        };
        $.ajaxSettings = {
            // Default type of request
            type: "GET",
            // Callback that is executed before request
            beforeSend: empty,
            // Callback that is executed if the request succeeds
            success: empty,
            // Callback that is executed the the server drops error
            error: empty,
            // Callback that is executed on request complete (both: error and success)
            complete: empty,
            // The context for the callbacks
            context: null,
            // Whether to trigger "global" Ajax events
            global: true,
            // Transport
            xhr: function() {
                return new window.XMLHttpRequest();
            },
            // MIME types mapping
            accepts: {
                script: "text/javascript, application/javascript",
                json: jsonType,
                xml: "application/xml, text/xml",
                html: htmlType,
                text: "text/plain"
            },
            // Whether the request is to another domain
            crossDomain: false,
            // Default timeout
            timeout: 0
        };
        function mimeToDataType(mime) {
            return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
        }
        function appendQuery(url, query) {
            return (url + "&" + query).replace(/[&?]{1,2}/, "?");
        }
        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            if (isObject(options.data)) options.data = $.param(options.data);
            if (options.data && (!options.type || options.type.toUpperCase() == "GET")) options.url = appendQuery(options.url, options.data);
        }
        $.ajax = function(options) {
            var settings = $.extend({}, options || {});
            for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
            ajaxStart(settings);
            if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
            var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
            if (dataType == "jsonp" || hasPlaceholder) {
                if (!hasPlaceholder) settings.url = appendQuery(settings.url, "callback=?");
                return $.ajaxJSONP(settings);
            }
            if (!settings.url) settings.url = window.location.toString();
            serializeData(settings);
            var mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = $.ajaxSettings.xhr(), abortTimeout;
            if (!settings.crossDomain) baseHeaders["X-Requested-With"] = "XMLHttpRequest";
            if (mime) {
                baseHeaders["Accept"] = mime;
                if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
                xhr.overrideMimeType && xhr.overrideMimeType(mime);
            }
            if (settings.contentType || settings.data && settings.type.toUpperCase() != "GET") baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded";
            settings.headers = $.extend(baseHeaders, settings.headers || {});
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    clearTimeout(abortTimeout);
                    var result, error = false;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                        dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type"));
                        result = xhr.responseText;
                        try {
                            if (dataType == "script") (1, eval)(result); else if (dataType == "xml") result = xhr.responseXML; else if (dataType == "json") result = blankRE.test(result) ? null : $.parseJSON(result);
                        } catch (e) {
                            error = e;
                        }
                        if (error) ajaxError(error, "parsererror", xhr, settings); else ajaxSuccess(result, xhr, settings);
                    } else {
                        ajaxError(null, "error", xhr, settings);
                    }
                }
            };
            var async = "async" in settings ? settings.async : true;
            xhr.open(settings.type, settings.url, async);
            for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
            if (ajaxBeforeSend(xhr, settings) === false) {
                xhr.abort();
                return false;
            }
            if (settings.timeout > 0) abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, "timeout", xhr, settings);
            }, settings.timeout);
            // avoid sending empty string (#319)
            xhr.send(settings.data ? settings.data : null);
            return xhr;
        };
        $.get = function(url, success) {
            return $.ajax({
                url: url,
                success: success
            });
        };
        $.post = function(url, data, success, dataType) {
            if ($.isFunction(data)) dataType = dataType || success, success = data, data = null;
            return $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: success,
                dataType: dataType
            });
        };
        $.getJSON = function(url, success) {
            return $.ajax({
                url: url,
                success: success,
                dataType: "json"
            });
        };
        $.fn.load = function(url, success) {
            if (!this.length) return this;
            var self = this, parts = url.split(/\s/), selector;
            if (parts.length > 1) url = parts[0], selector = parts[1];
            $.get(url, function(response) {
                self.html(selector ? $(document.createElement("div")).html(response.replace(rscript, "")).find(selector).html() : response);
                success && success.apply(self, arguments);
            });
            return this;
        };
        var escape = encodeURIComponent;
        function serialize(params, obj, traditional, scope) {
            var array = $.isArray(obj);
            $.each(obj, function(key, value) {
                if (scope) key = traditional ? scope : scope + "[" + (array ? "" : key) + "]";
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value); else if (traditional ? $.isArray(value) : isObject(value)) serialize(params, value, traditional, key); else params.add(key, value);
            });
        }
        $.param = function(obj, traditional) {
            var params = [];
            params.add = function(k, v) {
                this.push(escape(k) + "=" + escape(v));
            };
            serialize(params, obj, traditional);
            return params.join("&").replace("%20", "+");
        };
    })(Selector);
});

//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
define("#mix/core/0.3.0/dom/animation/animation-debug", [ "mix/core/0.3.0/dom/selector/selector-debug" ], function(require, exports, module) {
    var Selector = require("mix/core/0.3.0/dom/selector/selector-debug");
    (function($) {
        var prefix = "", eventPrefix, endEventName, endAnimationName, vendors = {
            Webkit: "webkit",
            Moz: "",
            O: "o",
            ms: "MS"
        }, document = window.document, testEl = document.createElement("div"), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, clearProperties = {};
        function downcase(str) {
            return str.toLowerCase();
        }
        function normalizeEvent(name) {
            return eventPrefix ? eventPrefix + name : downcase(name);
        }
        $.each(vendors, function(vendor, event) {
            if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
                prefix = "-" + downcase(vendor) + "-";
                eventPrefix = event;
                return false;
            }
        });
        clearProperties[prefix + "transition-property"] = clearProperties[prefix + "transition-duration"] = clearProperties[prefix + "transition-timing-function"] = clearProperties[prefix + "animation-name"] = clearProperties[prefix + "animation-duration"] = "";
        $.fx = {
            off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
            cssPrefix: prefix,
            transitionEnd: normalizeEvent("TransitionEnd"),
            animationEnd: normalizeEvent("AnimationEnd")
        };
        $.fn.animate = function(properties, duration, ease, callback) {
            if ($.isObject(duration)) ease = duration.easing, callback = duration.complete, 
            duration = duration.duration;
            if (duration) duration = duration / 1e3;
            return this.anim(properties, duration, ease, callback);
        };
        $.fn.anim = function(properties, duration, ease, callback) {
            var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd;
            if (duration === undefined) duration = .4;
            if ($.fx.off) duration = 0;
            if (typeof properties == "string") {
                // keyframe animation
                cssProperties[prefix + "animation-name"] = properties;
                cssProperties[prefix + "animation-duration"] = duration + "s";
                endEvent = $.fx.animationEnd;
            } else {
                // CSS transitions
                for (key in properties) if (supportedTransforms.test(key)) {
                    transforms || (transforms = []);
                    transforms.push(key + "(" + properties[key] + ")");
                } else cssProperties[key] = properties[key];
                if (transforms) cssProperties[prefix + "transform"] = transforms.join(" ");
                if (!$.fx.off && typeof properties === "object") {
                    cssProperties[prefix + "transition-property"] = Object.keys(properties).join(", ");
                    cssProperties[prefix + "transition-duration"] = duration + "s";
                    cssProperties[prefix + "transition-timing-function"] = ease || "linear";
                }
            }
            wrappedCallback = function(event) {
                if (typeof event !== "undefined") {
                    if (event.target !== event.currentTarget) return;
                    // makes sure the event didn't bubble from "below"
                    $(event.target).unbind(endEvent, arguments.callee);
                }
                $(this).css(clearProperties);
                callback && callback.call(this);
            };
            if (duration > 0) this.bind(endEvent, wrappedCallback);
            setTimeout(function() {
                that.css(cssProperties);
                if (duration <= 0) setTimeout(function() {
                    that.each(function() {
                        wrappedCallback.call(this);
                    });
                }, 0);
            }, 0);
            return this;
        };
        testEl = null;
    })(Selector);
    (function($) {
        var document = window.document, docElem = document.documentElement, origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle, speeds = {
            _default: 400,
            fast: 200,
            slow: 600
        };
        function translateSpeed(speed) {
            return typeof speed == "number" ? speed : speeds[speed] || speeds._default;
        }
        function anim(el, speed, opacity, scale, callback) {
            if (typeof speed == "function" && !callback) callback = speed, speed = undefined;
            var props = {
                opacity: opacity
            };
            if (scale) {
                props.scale = scale;
                el.css($.fx.cssPrefix + "transform-origin", "0 0");
            }
            return el.anim(props, translateSpeed(speed) / 1e3, null, callback);
        }
        function hide(el, speed, scale, callback) {
            return anim(el, speed, 0, scale, function() {
                origHide.call($(this));
                callback && callback.call(this);
            });
        }
        $.fn.show = function(speed, callback) {
            origShow.call(this);
            if (speed === undefined) speed = 0; else this.css("opacity", 0);
            return anim(this, speed, 1, "1,1", callback);
        };
        $.fn.hide = function(speed, callback) {
            if (speed === undefined) return origHide.call(this); else return hide(this, speed, "0,0", callback);
        };
        $.fn.toggle = function(speed, callback) {
            if (speed === undefined || typeof speed == "boolean") return origToggle.call(this, speed); else return this[this.css("display") == "none" ? "show" : "hide"](speed, callback);
        };
        $.fn.fadeTo = function(speed, opacity, callback) {
            return anim(this, speed, opacity, null, callback);
        };
        $.fn.fadeIn = function(speed, callback) {
            var target = this.css("opacity");
            if (target > 0) this.css("opacity", 0); else target = 1;
            return origShow.call(this).fadeTo(speed, target, callback);
        };
        $.fn.fadeOut = function(speed, callback) {
            return hide(this, speed, null, callback);
        };
        $.fn.fadeToggle = function(speed, callback) {
            var hidden = this.css("opacity") == 0 || this.css("display") == "none";
            return this[hidden ? "fadeIn" : "fadeOut"](speed, callback);
        };
        //there is a bug in raw zepto.js here.
        $.extend($.fn, {
            speeds: speeds
        });
    })(Selector);
});

define("#mix/core/0.3.0/ui/template/template-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/libs/handlebars/1.0.5/handlebars-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Handlebars = require("mix/libs/handlebars/1.0.5/handlebars-debug"), undef = undefined, win = window, doc = win.document;
    /**
 * @class Template
 */
    var Template = Class.create({
        /**
	 * the constructor for Template
	 * @constructor
	 * @param {string=} name
	 * @param {Template=} root
	 */
        initialize: function(name, type, root) {
            var that = this;
            that._id = Template.id();
            that._name = name || "template" + that._id;
            that._type = type || "template";
            that._root = root || "root";
            that._helpers = {};
            that._partials = {};
            that._chunks = {};
            that._html = "";
            that._nodeList = [];
        },
        _init: function() {
            var that = this;
            that._helpers = Object.extend(that._helpers, Handlebars.helpers);
            that._partials = Object.extend(that._partials, Handlebars.partials);
            // init helpers/partials/chunks
            Template.helpers(that);
            Template.partials(that);
            Template.chunks(that);
        },
        /**
	 * add a helper for template
	 * @param {string} name
	 * @param {Function} helper
	 */
        addHelper: function(name, helper) {
            var that = this;
            if (arguments.length === 1) {
                Object.each(arguments[0], function(helper, name) {
                    that.addHelper(name, helper);
                });
                return;
            }
            that._helpers[name] = helper;
        },
        /**
	 * add a partial for template
	 * @param {string} name
	 * @param {string} partial
	 */
        addPartial: function(name, partial) {
            var that = this;
            if (arguments.length === 1) {
                Object.each(arguments[0], function(partial, name) {
                    that.addHelper(name, partial);
                });
                return;
            }
            that._partials[name] = partial;
        },
        /**
	 * add a chunk for template
	 * @param {string} name
	 * @param {Template} chunk
	 */
        addChunk: function(name, chunk) {
            var that = this;
            that._chunks[name] = chunk;
        },
        /**
	 * compile the template string
	 * @param {string} tmplstr
	 */
        compile: function(tmplstr) {
            var that = this;
            if (tmplstr) {
                that._init();
                // compile and parse chunks
                that._template = Template.compile(that, tmplstr);
            }
        },
        getHtml: function() {
            var that = this;
            return that._html;
        },
        getNodeList: function() {
            var that = this;
            return that._nodeList.slice(0);
        },
        _wrap: function(html) {
            var that = this, name = that._name, id = that._id, value = name + "/" + id, type = that._type, template = doc.createElement("template"), beginNode, endNode;
            template.innerHTML = html;
            beginNode = template.firstElementChild;
            endNode = template.lastElementChild;
            if (!beginNode) {
                beginNode = doc.createElement("template");
                if (template.firstChild) {
                    template.insertBefore(beginNode, template.firstChild);
                } else {
                    template.appendChild(beginNode);
                }
            }
            if (!endNode) {
                endNode = doc.createElement("template");
                template.appendChild(endNode);
            }
            beginNode.setAttribute(type + "-begin", value);
            endNode.setAttribute(type + "-end", value);
            that._html = template.innerHTML;
            that._nodeList = [];
            Object.each(template.childNodes, function(node) {
                that._nodeList.push(node);
            });
        },
        /**
	 * parse the template with data
	 * @param {object} data
	 * @return the parsed string
	 */
        all: function(data) {
            var that = this, root = that._root, helpers = that._helpers, name = that._name, data = data || that._data, html;
            that._data = data;
            if (root instanceof Template) {
                helpers = Object.extend({}, root._helpers, helpers);
            }
            html = that._template(data, {
                helpers: helpers
            });
            that._template2 = Handlebars.compile(html);
            html = that._template2({}, {
                partials: that._partials
            });
            that._wrap(html);
            return that._html;
        },
        _replace: function() {
            var that = this, name = that._name, id = that._id, type = that._type, nodes = that._nodeList, fragment = doc.createDocumentFragment(), beginNode, endNode, nextNode, parentNode;
            beginNode = doc.querySelector("*[" + type + '-begin="' + name + "/" + id + '"]');
            endNode = doc.querySelector("*[" + type + '-end="' + name + "/" + id + '"]');
            parentNode = beginNode.parentNode || endNode.parentNode;
            while (beginNode !== endNode) {
                nextNode = beginNode.nextElementSibling;
                parentNode.removeChild(beginNode);
                beginNode = nextNode;
            }
            Object.each(nodes, function(node) {
                fragment.appendChild(node);
            });
            parentNode.insertBefore(fragment, endNode);
            parentNode.removeChild(endNode);
        },
        /**
	 * update the chunk with data
	 * @param {string} path, for special chunk
	 * @param {object} data
	 * @return the updated string
	 */
        update: function(path, chunkData) {
            var that = this, template = doc.createElement("template"), split, chunk, chunkName, data, last;
            split = typeof path === "string" ? path.split(/[.\/]/g) : path;
            if (split.length) {
                chunkName = split[0];
                chunk = that._chunks[chunkName];
                if (chunk) {
                    // 更新的是某个chunk
                    that._partials[chunkName] = chunk.update(split.slice(1), chunkData);
                    that._html = that._template2({}, {
                        partials: that._partials
                    });
                } else {
                    // 更新的是某个chunk中的部分数据
                    data = that._data;
                    last = split.pop();
                    Object.each(split, function(key) {
                        data = data[key];
                    });
                    data[last] = chunkData;
                    that.all();
                    that._replace();
                }
            } else {
                // 没有path的情况下，会更新整个模版
                data = that._data;
                if (Object.keys(data).length !== Object.keys(chunkData).length) {
                    chunkData = Object.extend({}, data, chunkData);
                }
                that.all(chunkData);
                that._replace();
            }
            return that._html;
        },
        /**
	 * destroy the template
	 */
        destroy: function() {
            var that = this, chunks = that._chunks;
            Object.each(chunks, function(chunk) {
                chunk.destroy();
            });
            delete that._template;
            delete that._template2;
            delete that._data;
            delete that._chunks;
        }
    }), CHUNK_TAG = /(\{\{#chunk\s+[^}\s]+\s*[^}]*\}\})|(\{\{\/chunk\}\})/g, CHUNK_OPEN_TAG = /\{\{#chunk\s+([^}\s]+)\s*\}\}/, CHUNK_CLOSE_TAG = /\{\{\/chunk\}\}/, TemplateId = 1;
    Template.id = function() {
        return TemplateId++;
    };
    Template.helpers = function(tmpl) {
        tmpl.addHelper("chunk", function(name) {
            var chunk;
            chunk = tmpl._chunks[name];
            tmpl._partials[name] = chunk.all(this);
            return new Handlebars.SafeString("{{> " + name + "}}");
        });
    };
    Template.partials = function(tmpl) {};
    Template.chunks = function(tmpl) {};
    Template.compile = function(rootTmpl, text) {
        var tagMatchs, openStack = [], subtmplStack = [];
        tagMatchs = text.match(CHUNK_TAG);
        tagMatchs && tagMatchs.forEach(function(tag) {
            var openMatch, closeMatch, openTag, closeTag, openIdx, closeIdx, subtmpl, parentTmpl, lText, rText, name, chunk;
            // find closeTag
            closeMatch = tag.match(CHUNK_CLOSE_TAG);
            if (closeMatch) {
                // pop open stack
                openMatch = openStack.pop();
                subtmpl = subtmplStack.pop();
                parentTmpl = subtmplStack.length ? subtmplStack[subtmplStack.length - 1] : rootTmpl;
                // get tag and name
                openTag = openMatch[0];
                closeTag = closeMatch[0];
                name = openMatch[1];
                // index of open/close tag
                openIdx = text.indexOf(openTag);
                closeIdx = text.indexOf(closeTag);
                // fetch the chunk text and update the text
                lText = text.substring(0, openIdx);
                chunk = text.substring(openIdx + openTag.length, closeIdx);
                rText = text.substring(closeIdx + closeTag.length);
                text = lText + "{{#with " + name + '}}{{chunk "' + name + '"}}{{/with}}' + rText;
                // compile subtmpl
                subtmpl._name = name;
                subtmpl._root = parentTmpl;
                subtmpl._type = "chunk";
                subtmpl._template = Handlebars.compile(chunk);
                parentTmpl.addChunk(name, subtmpl);
            } else {
                // push open stack
                openMatch = tag.match(CHUNK_OPEN_TAG);
                openStack.push(openMatch);
                parentTmpl = new Template();
                parentTmpl._init();
                subtmplStack.push(parentTmpl);
            }
        });
        return Handlebars.compile(text);
    };
    module.exports = Template;
});

define("#mix/core/0.3.0/ui/module/module-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/message/message-debug", "mix/core/0.3.0/dom/selector/selector-debug", "mix/core/0.3.0/dom/event/event-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Message = require("mix/core/0.3.0/base/message/message-debug"), $ = require("mix/core/0.3.0/dom/selector/selector-debug");
    require("mix/core/0.3.0/dom/event/event-debug");
    var win = window, doc = win.document, undef = undefined, OPTIONS = {
        debug: true
    }, DEPOS = {};
    /**
 * @class module
 */
    var Module = Class.create({
        /**
	 * the constructor for Module
	 * @constructor
	 * @param {string} the name of module
	 */
        initialize: function(name, type) {
            var that = this;
            that.__name = name;
            that.__type = type;
            that.__evObj = new Message(type + "." + name);
            that.__domObj = undef;
        },
        _initOptions: function(options) {
            var that = this;
            that.__options = Object.extend({}, OPTIONS, options);
        },
        _initAttrs: function(attrs) {
            var that = this, constructor = that.constructor;
            Object.each(attrs, function(value, name) {
                that["_" + name] = Object.clone(value, true);
            });
        },
        _initEvents: function(events) {
            var that = this;
            that.__events = [].concat(events);
        },
        _initAttach: function(attach) {
            var that = this;
            that.__attach = Object.extend({}, attach);
        },
        /**
	 * the name of the component
	 * @return {*}
	 */
        getName: function() {
            var that = this;
            return that.__name;
        },
        /**
	 * the option of the module
	 * @return {*}
	 */
        getOpt: function(name) {
            var that = this;
            return that.__options[name];
        },
        /**
	 * set the option of the module
	 * @param {string|object} name
	 * @param {*=} value
	 */
        setOpt: function(name, value) {
            var that = this, options = that.__options, opt;
            if (arguments.length === 1 && Object.isTypeof(opt = name, "object")) {
                Object.extend(options, opt || {});
            } else {
                options[name] = value;
            }
        },
        /**
	 * the dom of the module
	 * @return {dom}
	 */
        getDom: function() {
            var that = this;
            if (that.__domObj) {
                return that.__domObj;
            }
        },
        /**
	 * the zepto $
	 * @return {object}
	 */
        getDollars: function() {
            return $;
        },
        _attach: function(element) {
            var that = this, attach = that.__attach, evObj = that.__evObj;
            Object.each(attach, function(events, selector) {
                Object.each(events, function(handler, name) {
                    var objType = Object.isTypeof(handler), callback;
                    if (objType == "string") {
                        callback = function(e) {
                            evObj.trigger(handler, e, that);
                        };
                    } else if (objType == "function") {
                        callback = function(e) {
                            handler.call(this, e, that);
                        };
                    }
                    if (selector === "&") {
                        element.on(name, callback);
                    } else {
                        element.on(name, selector, callback);
                    }
                });
            });
        },
        _disattach: function(element) {
            var that = this, attach = that.__attach;
            /*
		Object.each(attach, function(events, selector) {
			Object.each(events, function(handler, name) {
				element.off(name);
			});
		});
		*/
            element.off();
        },
        /**
	 * render the module
	 */
        render: function(selector) {
            var that = this, dom;
            if (selector) {
                dom = that.__domObj = $(Object.isTypeof(selector, "string") ? doc.querySelector(selector) : selector);
                that._attach(dom);
            }
        },
        /**
	 * destroy the module
	 */
        destroy: function() {
            var that = this, dom = that.__domObj;
            dom && that._disattach(dom);
            delete that.__options;
            delete that.__evObj;
            delete that.__domObj;
            delete that.__attach;
            delete that.__events;
        },
        /**
	 * find the element in the module
	 * @param {string} selector
     * @return {dom} 
	 */
        find: function(selector) {
            var that = this;
            if (that.__domObj) {
                return that.__domObj.find(selector);
            } else {
                throw new Error('call "render" before "find"');
            }
        },
        /**
	 * bind event 
	 * @param {string} eventName
     * @param {Function} delegate
	 */
        on: function(eventName, delegate) {
            var that = this;
            if (that.__evObj && that.__events.indexOf(eventName) > -1) {
                that.__evObj.on(eventName, delegate);
            } else {
                throw new Error('"' + eventName + '" is illegal');
            }
            return that;
        },
        /**
	 * unbind event 
	 * @param {string} eventName
     * @param {Function=} delegate
	 */
        off: function(eventName, delegate) {
            var that = this;
            if (that.__evObj && that.__events.indexOf(eventName) > -1) {
                delegate ? that.__evObj.off(eventName, delegate) : that.__evObj.off(eventName);
            } else {
                throw new Error('"' + eventName + '" is illegal');
            }
            return that;
        },
        /**
	 * trigger event 
	 * @param {string} eventName
	 */
        trigger: function(eventName) {
            var that = this;
            if (that.__evObj && that.__events.indexOf(eventName) > -1) {
                that.__evObj.trigger.apply(that.__evObj, arguments);
            } else {
                throw new Error('"' + eventName + '" is illegal');
            }
            return that;
        }
    });
    /**
 * register a module
 * @param {string} the name of the module
 * @param {object} the options for the module
 */
    Module.register = function(name, module) {
        if (DEPOS[name]) return;
        var child = Module.extend({
            initialize: function() {
                var that = this;
                child.superclass.initialize.call(that, name, "module");
                that._initOptions(module.OPTIONS || {});
                that._initAttrs(module.ATTRS || {});
                that._initEvents(module.EVENTS || []);
                that._initAttach(module.ATTACH || {});
                module.CONSTRUCTOR.apply(that, arguments);
            }
        });
        child.implement(module.METHOD);
        Object.extend(child, module.CONST || {});
        return DEPOS[name] = child;
    };
    Module.depos = function(name) {
        if (!DEPOS[name]) throw new Error('Module "' + name + '" has not defined');
        return DEPOS[name];
    };
    /**
 * set the global options
 * @param {object} options
 */
    Module.options = function(options) {
        OPTIONS = Object.extend(OPTIONS, options);
    };
    module.exports = Module;
});

define("#mix/core/0.3.0/ui/component/component-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/message/message-debug", "mix/core/0.3.0/ui/template/template-debug", "mix/core/0.3.0/ui/module/module-debug", "mix/core/0.3.0/dom/selector/selector-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Message = require("mix/core/0.3.0/base/message/message-debug"), Template = require("mix/core/0.3.0/ui/template/template-debug"), Module = require("mix/core/0.3.0/ui/module/module-debug"), $ = require("mix/core/0.3.0/dom/selector/selector-debug");
    var win = window, doc = win.document, head = doc.getElementsByTagName("head")[0], undef = undefined, OPTIONS = {
        debug: true
    }, DEPOS = {};
    /**
 * @class component
 */
    var Component = Module.extend({
        /**
	 * the constructor for Component
	 * @constructor
	 * @param {string} the name of component
	 */
        initialize: function(name, type) {
            var that = this;
            Component.superclass.initialize.call(that, name, type);
            that.__dataChanged = undef;
        },
        _initData: function(data) {
            var that = this;
            that.__data = Object.extend({}, data, true);
        },
        _initTemplate: function(tmplText, tmplHelper, tmplPartial) {
            var that = this, tmpl;
            tmpl = that.__tmpl = new Template(that.__name, "component");
            tmplHelper && tmpl.addHelper(tmplHelper);
            tmplPartial && tmpl.addPartial(tmplPartial);
            that.__tmpl.compile(tmplText);
        },
        _findDataPath: function(data, path) {
            Object.each(path, function(name) {
                if (data.hasOwnProperty(name)) {
                    data = data[name];
                } else {
                    return undef;
                }
            });
            return data;
        },
        /**
	 * the data of the component
	 * @return {*}
	 */
        getData: function(path) {
            var that = this, data = that.__data, last;
            if (typeof path == "string") {
                path = path.split(".");
            }
            last = path.pop();
            data = that._findDataPath(data, path);
            if (data) {
                return data[last];
            }
        },
        /**
	 * set data of the component
	 * @param {string|Array} path
     * @param {*} value
	 */
        setData: function(path, value, slient) {
            var that = this, data = that.__data, dataChanged, last, obj;
            if (Object.isTypeof(obj = path, "object") && !(obj instanceof Array)) {
                slient = value;
                Object.each(obj, function(value, path) {
                    that.setData(path, value, slient);
                });
                return;
            }
            if (value == undef) return;
            if (typeof path == "string") {
                path = path.split(".");
            }
            last = path.pop();
            data = that._findDataPath(data, path);
            if (data) {
                data[last] = Object.clone(value, true);
                if (!slient) {
                    path.push(last);
                    dataChanged = that.__dataChanged || (that.__dataChanged = {});
                    dataChanged[path.join(".")] = data[last];
                }
            }
        },
        /**
	 * render the component
	 * @param {Object=} data
	 */
        render: function(data) {
            var that = this, data = data || that.__data, tmpl = that.__tmpl, dom, id, name;
            tmpl.all(data);
            dom = that.__domObj = $(tmpl.getNodeList());
            id = that.__domId = that.__domId || dom.attr("id") || that.__name + "-" + new Date().getTime();
            name = that.__domName = that.__domName || dom.attr("name") || that.__name;
            dom.attr("id", id);
            dom.attr("name", name);
            Component.superclass.render.call(that, dom);
            return dom;
        },
        /**
	 * update the component
	 * @param {string=} path
	 * @param {Object=} data
	 */
        update: function(path, data) {
            var that = this, dataChanged = that.__dataChanged, tmpl = that.__tmpl, dom = that.__domObj;
            if (path && data) {
                dataChanged = {};
                dataChanged[path] = data;
            }
            that._disattach(dom);
            if (dataChanged) {
                Object.each(dataChanged, function(data, path) {
                    tmpl.update(path, data);
                });
            } else {
                tmpl.update("", that.__data);
            }
            dom = that.__domObj = $(tmpl.getNodeList());
            dom.attr("id", that.__domId);
            dom.attr("name", that.__domName);
            that._attach(dom);
            delete that.__dataChanged;
        },
        /**
	 * destroy the component
	 */
        destroy: function() {
            var that = this, tmpl = that.__tmpl, dom = that.getDom();
            dom.remove();
            tmpl.destroy();
            Component.superclass.destroy.call(that);
            delete that.__data;
            delete that.__dataChanged;
        }
    });
    function addStylesheet(name, css) {
        var styleTag = doc.createElement("style");
        styleTag.setAttribute("type", "text/css");
        styleTag.setAttribute("rel", "stylesheet");
        styleTag.setAttribute("id", "stylesheet-component-" + name);
        styleTag.innerText = css;
        head.appendChild(styleTag);
    }
    function removeStylesheet(name) {
        var id = "stylesheet-component-" + name, styleTag = doc.getElemenetById(id);
        head.removeChild(styleTag);
    }
    /**
 * register a component
 * @param {string} the name of the component
 * @param {object} the options for the component
 * @param {string} the template for the component
 * @param {string=} the css style for the component
 */
    Component.register = function(name, component, tmpl, css) {
        if (DEPOS[name]) return;
        addStylesheet(name, css);
        var child = Component.extend({
            initialize: function(domId, domName, data, options) {
                var that = this;
                child.superclass.initialize.call(that, name, "component");
                that.__domId = domId;
                that.__domName = domName;
                that._initOptions(component.OPTIONS || {});
                that._initAttrs(component.ATTRS || {});
                that._initData(component.DATA || {});
                that._initEvents(component.EVENTS || []);
                that._initAttach(component.ATTACH || {});
                that._initTemplate(tmpl, component.TMPL_HELPER, component.TMPL_PARTIAL);
                component.CONSTRUCTOR.call(that, data, options);
            }
        });
        child.implement(component.METHOD);
        Object.extend(child, component.CONST || {});
        return DEPOS[name] = child;
    };
    Component.depos = function(name) {
        if (!DEPOS[name]) throw new Error('Component "' + name + '" has not defined');
        return DEPOS[name];
    };
    /**
 * set the global options
 * @param {object} options
 */
    Component.options = function(options) {
        OPTIONS = Object.extend(OPTIONS, options);
    };
    module.exports = Component;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/url/history/history-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/message/message-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Message = require("mix/core/0.3.0/base/message/message-debug"), routeStripper = /^[#\/]/, win = window, doc = win.document, loc = win.location, his = win.history;
    var History = Class.create({
        Implements: Message,
        initialize: function() {
            var that = this;
            Message.prototype.initialize.call(that, "history");
            that._handlers = [];
            that._matchs = [];
            // bind function
            that._changeHanlder = Function.binded(that._changeHanlder, that);
        },
        _getHash: function() {
            return loc.hash.slice(1) || "";
        },
        _updateHash: function(fragment, replace) {
            if (replace) {
                loc.replace(loc.toString().replace(/(javascript:|#).*$/, "") + "#" + fragment);
            } else {
                loc.hash = fragment;
            }
        },
        _getFragment: function(fragment, forcePushState) {
            var that = this;
            if (fragment == null) {
                if (that._hasPushState || forcePushState) {
                    fragment = loc.pathname;
                    var search = loc.search;
                    if (search) fragment += search;
                } else {
                    fragment = that._getHash();
                }
            }
            if (!fragment.indexOf(that._options.root)) fragment = fragment.substr(that._options.root.length);
            return fragment.replace(routeStripper, "");
        },
        _resetMatchs: function() {
            var that = this, handlers = that._handlers;
            handlers.forEach(function(handler) {
                handler.matched = false;
            });
        },
        _changeHanlder: function(events) {
            var that = this;
            that._resetMatchs();
            that.match();
        },
        start: function(options) {
            var that = this, fragment;
            if (History.started) throw new Error("history has already been started");
            History.started = true;
            that._options = Object.extend({}, {
                root: "/"
            }, options || {});
            that._wantsHashChange = that._options.hashChange !== false;
            //默认为true
            that._wantsPushState = !!that._options.pushState;
            //默认为false
            that._hasPushState = !!(that._options.pushState && his && his.pushState);
            //不支持pushState永远为false
            if (that._hasPushState) {
                win.addEventListener("popstate", that._changeHanlder, false);
            } else if (that._wantsHashChange && "onhashchange" in win) {
                win.addEventListener("hashchange", that._changeHanlder, false);
            }
            var atRoot = loc.pathname == that._options.root;
            if (that._wantsHashChange && that._wantsPushState && !that._hasPushState && !atRoot) {
                fragment = that._getFragment(null, true);
                loc.replace(that._options.root + "#" + that._fragment);
                return true;
            } else if (that._wantsPushState && that._hasPushState && atRoot && loc.hash) {
                fragment = that._getFragment();
                his.replaceState({}, doc.title, loc.protocol + "//" + loc.host + that._options.root + that._fragment);
            }
            if (!that._options.silent) {
                return that.match(fragment);
            }
        },
        stop: function() {
            var that = this;
            if (!History.started) return;
            win.removeEventListener("popstate", that._changeHanlder, false);
            win.removeEventListener("hashchange", that._changeHanlder, false);
            History.started = false;
        },
        match: function(fragment) {
            var that = this, fragment, handlers = that._handlers;
            if (!History.started) return;
            that._fragment = fragment = fragment || that._getFragment();
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if (!handler.matched && handler.route.test(fragment)) {
                    handler.matched = true;
                    handler.callback(fragment);
                    if (handler.last) {
                        return;
                    }
                }
            }
        },
        route: function(route, callback, last) {
            var that = this, handlers = that._handlers;
            handlers.push({
                route: route,
                callback: callback,
                matched: false,
                last: !!last
            });
        },
        remove: function(route, callback) {
            var that = this, handlers = that._handlers;
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if (handler.route.source === route.source && (!callback || handler.callback === callback)) {
                    return handlers.splice(i, 1);
                }
            }
        },
        navigate: function(fragment, options) {
            var that = this, fragment;
            if (!History.started) return false;
            if (!options || options === true) options = {
                trigger: options
            };
            fragment = (fragment || "").replace(routeStripper, "");
            if (that._fragment == fragment) return;
            if (that._hasPushState) {
                if (fragment.indexOf(that._options.root) != 0) fragment = that._options.root + fragment;
                his[options.replace ? "replaceState" : "pushState"]({}, doc.title, fragment);
            } else if (that._wantsHashChange) {
                that._updateHash(fragment, options.replace);
            } else {
                loc.assign(that._options.root + fragment);
            }
            if (options.trigger) that.match(fragment);
        }
    });
    History.started = false;
    History.singleton = new History();
    module.exports = History;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/url/router/router-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/url/history/history-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), history = require("mix/core/0.3.0/url/history/history-debug").singleton, namedParam = /\:(\w\w*)/g, splatParam = /\*(\w\w*)/g, perlParam = /P\<(\w\w*?)\>/g, escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g, appRegExp = /^[^#\/\!]*/, win = window, doc = win.document, his = win.history, head = doc.getElementsByTagName("head")[0], loc = win.location, Router = Class.create({
        initialize: function(options) {
            var that = this;
            that._options = Object.extend({
                root: location.pathname.replace(/[^\/]+\.[^\/]+$/, ""),
                appPath: "apps/",
                defaultApp: "index",
                maxStateLen: 100
            }, options || {});
            that._started = false;
            that._states = [];
            that._stateIdx = -1;
            that._move = null;
        },
        _routeToRegExp: function(route) {
            route = route.replace(namedParam, "([^/][^/]*?)").replace(splatParam, "(.*?)").replace(perlParam, "");
            return new RegExp("^" + route + "(!.*?)?$");
        },
        _extractParamKeys: function(route) {
            var matched = route.replace(namedParam, "(P<$1>[^/][^/]*?)").replace(splatParam, "(P<$1>.*?)").match(perlParam), keys = {};
            matched && Object.each(matched, function(key, i) {
                keys[key.replace(perlParam, "$1")] = i;
            });
            return keys;
        },
        _extractParameters: function(route, fragment) {
            var matched;
            if (matched = route.exec(fragment)) {
                return matched.slice(1);
            }
        },
        _extractArguments: function(fragment) {
            var split = fragment.split("&"), args = {};
            if (split.length) {
                Object.each(split, function(pair) {
                    var sp = pair.split("=");
                    args[sp[0]] = sp[1];
                });
            }
            return args;
        },
        _pushState: function(appname, args, fragment) {
            var that = this, options = that._options, root = options.root, appPath = options.appPath, maxStateLen = options.maxStateLen, states = that._states, stateIdx = that._stateIdx, prev = states[stateIdx - 1], last = states[stateIdx], next = states[stateIdx + 1], cur, move = that._move;
            // TODO 当使用浏览器的前进后退时，判断forward和backward会有点小问题
            that._move = null;
            if (move && move === "backward" || !move && prev && prev.fragment === fragment) {
                move = "backward";
                if (stateIdx == 0) {
                    states.pop();
                } else {
                    stateIdx--;
                }
                if (prev) {
                    cur = prev;
                } else {
                    cur = {
                        appname: appname,
                        params: [],
                        args: args,
                        fragment: fragment
                    };
                    states.push(cur);
                }
            } else if (move && move === "forward" || !move && !next || next.fragment === fragment) {
                move = "forward";
                if (stateIdx == maxStateLen - 1) {
                    states.shift();
                } else {
                    stateIdx++;
                }
                if (next) {
                    cur = next;
                } else {
                    cur = {
                        appname: appname,
                        params: [],
                        args: args,
                        fragment: fragment
                    };
                    states.push(cur);
                }
            }
            that._stateIdx = stateIdx;
            if (!last || last.appname != cur.appname) {
                cur.appentry = [ root, appPath, appname, "entry.js" ].join("/").replace(/\/{2,}/g, "/");
                console.log(cur.appentry);
                history.trigger("navigator:" + move, cur.appname, cur.appentry);
            }
        },
        _replaceState: function(name, params, paramKeys) {
            var that = this, states = this._states, stateIdx = this._stateIdx, cur = this._states[stateIdx];
            cur.params = params || [];
            cur.paramKeys = cur.paramKeys || paramKeys || {};
            history.trigger("navigator:route", cur.appname, name);
        },
        getState: function() {
            var that = this, states = this._states, stateIdx = this._stateIdx;
            return this._states[stateIdx];
        },
        addRoute: function(route, name) {
            var that = this, paramKeys = that._extractParamKeys(route), route = that._routeToRegExp(route);
            history.route(route, function(fragment) {
                var split = fragment.split("!"), params = that._extractParameters(route, split[0]);
                params && that._replaceState(name, params, paramKeys);
            }, true);
        },
        removeRoute: function(route) {
            var that = this, route = that._routeToRegExp(route);
            history.remove(route);
        },
        forward: function(fragment, argsObj) {
            var that = this, states = that._states, stateIdx = that._stateIdx, cur = states[stateIdx], args = [];
            that._move = "forward";
            if (fragment) {
                if (!cur || argsObj || cur.fragment !== fragment) {
                    if (argsObj) {
                        Object.each(argsObj, function(value, key) {
                            args.push(key + "=" + value);
                        });
                    }
                    states.splice(stateIdx + 1);
                    history.navigate(fragment + (args.length ? "!" + args.join("&") : ""));
                }
            } else {
                his.forward();
            }
        },
        backward: function() {
            var that = this, stateIdx = that._stateIdx;
            if (stateIdx < 1) return;
            that._move = "backward";
            his.back();
        },
        start: function(config) {
            var that = this, options = Object.extend(that._options, config || {}), root = options.root, defaultApp = options.defaultApp;
            if (that._started) return;
            if (root.charAt(root.length - 1) !== "/") {
                options.root = root = root + "/";
            }
            history.route(appRegExp, function(fragment) {
                var split = fragment.split("!"), appname = appRegExp.exec(split[0])[0] || defaultApp, args = that._extractArguments(split[1] || "");
                that._pushState(appname, args, split[0]);
            });
            that._started = history.start({
                root: root,
                hashChange: true
            });
        }
    });
    Router.singleton = new Router();
    module.exports = Router;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/mvc/controller/controller-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/message/message-debug", "mix/core/0.3.0/url/history/history-debug", "mix/core/0.3.0/url/router/router-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Message = require("mix/core/0.3.0/base/message/message-debug"), history = require("mix/core/0.3.0/url/history/history-debug").singleton, router = require("mix/core/0.3.0/url/router/router-debug").singleton, undef = undefined, spliterReg = Message.spliterReg, atReg = Message.atReg;
    var Controller = Class.create({
        Implements: Message,
        initialize: function(name, options) {
            var that = this, opt = that._options = Object.extend({
                routes: {},
                historyEvents: {
                    "navigator:route": that._routeHandler
                },
                controllerEvents: {
                    destroy: that.destroy
                }
            }, options || {});
            Message.prototype.initialize.call(that, "controller." + name);
            that._appname = name;
            that._routename = undef;
            that._views = {};
            that.on("install", function() {
                that._bindRoutes(opt.routes);
                that._bindHistoryEvents(opt.historyEvents);
                that._bindControllerEvents(opt.controllerEvents);
                history.match();
            });
        },
        _bindRoutes: function(routes) {
            var that = this, appname = that._appname;
            Object.each(routes, function(name, route) {
                router.addRoute(appname + "/" + route, name);
            });
        },
        _unbindRoutes: function(routes) {
            var that = this, appname = that._appname;
            Object.each(routes, function(name, route) {
                router.removeRoute(appname + "/" + route);
            });
        },
        _bindHistoryEvents: function(events) {
            var that = this;
            Object.each(events, function(handler, event) {
                history.on(event, handler, that);
            });
        },
        _unbindHistoryEvents: function(events) {
            var that = this;
            Object.each(events, function(handler, event) {
                history.off(event, handler);
            });
        },
        _bindControllerEvents: function(events) {
            var that = this;
            Object.each(events, function(handler, event) {
                that.on(event, handler, that);
            });
        },
        _routeHandler: function(appname, routename) {
            var that = this, state = router.getState(), params = state.params.slice(0);
            if (that._appname !== appname) return;
            that._routename = routename;
            params.unshift("route:" + routename);
            that.trigger.apply(that, params);
        },
        /**
	 * @deprecated Since version v0.3. You should now use getAppName
	 */
        getName: function() {
            var that = this;
            return that._appname;
        },
        getAppName: function() {
            var that = this;
            return that._appname;
        },
        getRouteName: function() {
            var that = this;
            return that._routename;
        },
        getViewport: function() {
            var that = this, name = that._appname;
            return "viewport-" + name;
        },
        addView: function(view, viewport) {
            var that = this, View, name;
            if (view.superclass && view.superclass instanceof Class) {
                View = view;
                view = new View(undef, that, viewport);
            }
            name = view.getName();
            that._views[name] = view;
            return name;
        },
        getView: function(name) {
            var that = this;
            return that._views[name];
        },
        getParameter: function(name) {
            var that = this, state = router.getState(), params = state.params, paramKeys = state.paramKeys, index = Object.isTypeof(name, "number") ? name : paramKeys[name];
            if (index != undef) {
                return params[index];
            }
        },
        getArgument: function(name) {
            var that = this, state = router.getState(), args = state.args;
            return args[name];
        },
        trigger: function(events) {
            var that = this, args = Array.make(arguments), at = (atReg.exec(events) || [])[1];
            if (at) {
                args[0] = events.replace(spliterReg, " @" + at + ":");
            }
            Message.prototype.trigger.apply(that, args);
        },
        destroy: function() {
            var that = this, opt = that._options, routes = opt.routes, events = opt.historyEvents;
            that._unbindRoutes(routes);
            that._unbindHistoryEvents(events);
        }
    });
    module.exports = Controller;
});

define("#mix/core/0.3.0/mvc/navigator/navigator-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/mvc/controller/controller-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Controller = require("mix/core/0.3.0/mvc/controller/controller-debug"), win = window, doc = win.document, head = doc.head, undef = undefined, scriptCache = {};
    var Navigator = Controller.extend({
        initialize: function() {
            var that = this, options = {
                historyEvents: {
                    "navigator:forward": waitReady(that._forwardHandler),
                    "navigator:backward": waitReady(that._backwardHandler)
                }
            };
            Navigator.superclass.initialize.call(that, "navigatorController", options);
            that._queue = [];
            that._limit = 6;
            that._index = -1;
            that._controllers = {};
            that._viewName = undef;
        },
        _forwardHandler: function(appname, url) {
            var that = this, controllers = that._controllers, queue = that._queue, limit = that._limit, index = that._index, last = queue[index], next, remove;
            if (index === limit - 1) {
                remove = queue.shift();
                queue.push(!!0);
            } else {
                index++;
            }
            next = queue[index];
            if (next !== appname) {
                queue[index] = appname;
                queue.splice(index + 1);
            }
            if (remove && queue.indexOf(remove) < 0) {
                that.removeController(remove);
            }
            that._index = index;
            that.trigger("forward", appname);
            if (!controllers[appname]) {
                that.addController(appname, url);
            } else {
                that.activeController(appname);
            }
            if (controllers[last]) {
                that.suspendController(last);
            }
        },
        _backwardHandler: function(appname, url) {
            var that = this, controllers = that._controllers, queue = that._queue, limit = that._limit, index = that._index, last = queue[index], pre, remove;
            if (index === 0) {
                remove = queue.pop();
                queue.unshift(!!0);
            } else {
                index--;
            }
            pre = queue[index];
            if (pre !== appname) {
                queue[index] = appname;
                for (var i = 0; i < index; i++) {
                    queue[i] = !!0;
                }
            }
            if (remove && queue.indexOf(remove) < 0) {
                that.removeController(remove);
            }
            that._index = index;
            that.trigger("backward", appname);
            if (!controllers[appname]) {
                that.addController(appname, url);
            } else {
                that.activeController(appname);
            }
            if (controllers[last]) {
                that.suspendController(last);
            }
        },
        addController: function(name, url, callback) {
            var that = this, controllers = that._controllers, controller = controllers[name];
            if (!controller) {
                that._controllers[name] = "loading";
                loadScript(name, url, callback);
            }
        },
        depositController: function(name, routes, viewList) {
            var that = this, controllers = that._controllers, controller, viewList = Array.make(arguments).slice(2);
            controller = new Controller(name, {
                routes: routes
            });
            Object.each(viewList, function(view) {
                controller.addView(view);
            });
            controllers[name] = controller;
            //controller.trigger('install');
            return controller;
        },
        activeController: function(name) {
            var that = this, controllers = that._controllers, controller = controllers[name];
            if (controller && controller.trigger) {
                controller.trigger("active");
            }
        },
        suspendController: function(name) {
            var that = this, controllers = that._controllers, controller = controllers[name];
            if (controller && controller.trigger) {
                controller.trigger("suspend");
            }
        },
        removeController: function(controller) {
            var that = this, controllers = that._controllers, name = Object.isTypeof(controller, "string") ? controller : controller.getName(), controller = controllers[name];
            if (controller) {
                unloadScript(name);
                controller.trigger && controller.trigger("destroy");
                controllers[name] = null;
                delete controllers[name];
            }
        },
        getController: function(name) {
            var that = this;
            return that._controllers[name];
        },
        setView: function(view) {
            var that = this;
            isReady = false;
            that._viewName = Navigator.superclass.addView.call(that, view);
            that.getView().once("ready", viewReady);
        },
        getView: function() {
            var that = this;
            return Navigator.superclass.getView.call(that, that._viewName);
        }
    });
    function loadScript(appname, url, callback) {
        var id = "controller-js-" + appname;
        if (!scriptCache[id]) {
            script = doc.createElement("script");
            script.id = id;
            script.type = "text/javascript";
            script.async = true;
            script.onload = script.onreadystatechange = function() {
                if (!scriptCache[id]) {
                    scriptCache[id] = script;
                    callback && callback();
                }
            };
            script.src = url;
            head.appendChild(script);
        }
        return id;
    }
    function unloadScript(appname, callback) {
        var id = "controller-js-" + appname, script = scriptCache[id];
        if (script) {
            head.removeChild(scriptCache[id]);
            delete scriptCache[id];
            callback && callback();
        }
        return id;
    }
    var isReady = true, readyWaited = [];
    function waitReady(handler) {
        if (handler) {
            return function() {
                var that = this, args = arguments;
                if (!isReady) {
                    readyWaited.push(function() {
                        handler.apply(that, args);
                    });
                } else {
                    handler.apply(that, args);
                }
            };
        }
    }
    function viewReady() {
        if (!isReady) {
            while (readyWaited.length) {
                handler = readyWaited.shift();
                handler();
            }
            isReady = true;
        }
    }
    Navigator.singleton = new Navigator();
    module.exports = Navigator;
});

define("#mix/core/0.3.0/mvc/view/view-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/message/message-debug", "mix/core/0.3.0/ui/template/template-debug", "mix/core/0.3.0/ui/component/component-debug", "mix/core/0.3.0/dom/selector/selector-debug", "mix/core/0.3.0/dom/event/event-debug", "mix/core/0.3.0/dom/ajax/ajax-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Message = require("mix/core/0.3.0/base/message/message-debug"), Template = require("mix/core/0.3.0/ui/template/template-debug"), Component = require("mix/core/0.3.0/ui/component/component-debug"), $ = require("mix/core/0.3.0/dom/selector/selector-debug"), atReg = Message.atReg;
    require("mix/core/0.3.0/dom/event/event-debug");
    require("mix/core/0.3.0/dom/ajax/ajax-debug");
    var win = window;
    doc = win.document, head = doc.getElementsByTagName("head")[0], undef = undefined, 
    COMP_OPEN_REGEXP = /\<h5\:(\w\w*?)\s([^>]*?)\>/g, COMP_CLOSE_REGEXP = /\<\/h5\:(\w\w*?)\s*\>/g, 
    COMP_SELF_CLOSE_REGEXP = /<component\s([^>]*?)\/>/g;
    var View = Class.create({
        initialize: function(name, controller, viewport) {
            var that = this, loading = false, configs, events, routes, attach, data;
            // extend things
            configs = Object.extend({
                loadTmpl: false,
                loadStyle: false
            }, that.CONFIGS || {});
            events = Object.extend({
                install: "install",
                render: "render",
                parse: "parse",
                update: "update",
                suspend: "suspend",
                active: "active",
                destroy: "destroy"
            }, that.EVENTS || {});
            attrs = Object.extend({}, that.ATTRS || {});
            routes = Object.extend({}, that.ROUTES || {});
            attach = Object.extend({}, that.ATTACH || {});
            data = Object.extend({}, that.DATA || {});
            compdata = Object.extend({}, that.COMPDATA || {});
            helper = Object.extend({}, that.TMPL_HELPER || {});
            partial = Object.extend({}, that.TMPL_PARTIAL || {});
            // attrs
            that._name = name || configs.name;
            that._controller = controller || configs.controller;
            that._viewport = viewport || configs.viewport;
            that._src = {
                tmpl: configs.tmpl,
                style: configs.style,
                loadTmpl: configs.loadTmpl,
                loadStyle: configs.loadStyle
            };
            that._attrs = attrs;
            that._attach = attach;
            that._data = data;
            that._dataChanged = undef;
            that._compdata = compdata;
            that._components = {};
            that._templates = [];
            that._tmplHelper = helper;
            that._tmplPartial = partial;
            that._isInstalling = false;
            that._isCompiled = false;
            that._isReady = false;
            that._isActive = false;
            // bind events		
            that._bindEvents(events);
            // bind routes
            that._bindRoutes(routes);
            delete that.CONFIGS;
            delete that.EVENTS;
            delete that.ATTRS;
            delete that.ROUTES;
            delete that.ATTACH;
            delete that.DATA;
            delete that.COMPDATA;
            delete that.TMPL_HELPERS;
            delete that.TMPL_PARTIAL;
        },
        _bindEvents: function(events) {
            var that = this, len = 0;
            // bind events		
            Object.each(events, function(handlers, event) {
                if (!Object.isTypeof(handlers, "Array")) {
                    handlers = [ handlers ];
                }
                Object.each(handlers, function(handler) {
                    if (Object.isTypeof(handler, "string")) {
                        handler = that[handler];
                    }
                    len++;
                    that.on(event, handler);
                });
            });
            that.log("binded " + len + " events");
        },
        _bindRoutes: function(routes) {
            var that = this, len = 0;
            // bind routes		
            Object.each(routes, function(handlers, event) {
                if (!Object.isTypeof(handlers, "Array")) {
                    handlers = [ handlers ];
                }
                Object.each(handlers, function(handler) {
                    len++;
                    that._route(event, handler);
                });
            });
            that.log("binded " + len + " routes");
        },
        _route: function(name, handler) {
            var that = this;
            if (Object.isTypeof(handler, "string")) {
                handler = that[handler];
            }
            handler && that.on("route:" + name, View.ready(handler));
        },
        _bindAttach: function() {
            var that = this, attach = that._attach, len = 0;
            Object.each(attach, function(events, selector) {
                Object.each(events, function(handler, name) {
                    len++;
                    that.attach(name, selector, handler);
                });
            });
            that.log("binded " + len + " attachs");
        },
        _unbindAttach: function() {
            var that = this;
            that.disattach();
        },
        install: function() {
            var that = this, src = that._src, viewport = that.getViewport(), needCheck = false;
            if (that._isInstalling || that._isReady) return;
            that._isInstalling = true;
            // load tmpl & style
            if (src.loadTmpl !== false) {
                needCheck = true;
                that._loadTmpl(src.loadTmpl);
            } else if (src.tmpl) {
                that._compileTmpl();
            }
            if (src.loadStyle !== false) {
                needCheck = true;
                that._loadStyle(src.loadStyle);
            } else if (src.style) {
                that._compileStyle();
            }
            if (!needCheck) {
                that._compiled();
            } else {
                that._checkCompiled();
            }
        },
        _checkCompiled: function() {
            var that = this, src = that._src, viewport = that.getViewport(), id;
            viewport.addClass("compiling");
            id = setInterval(function() {
                var tmpl = src.tmpl, style = src.style, isCompiled = that._isCompiled;
                if (!isCompiled && tmpl && tmpl instanceof Template && style && style.nodeName && style.nodeName.toLowerCase() == "style") {
                    clearInterval(id);
                    viewport.removeClass("compiling");
                    that._compiled();
                }
            }, 100);
        },
        _loadTmpl: function(url) {
            var that = this, src = that._src;
            $.get(url, function(text) {
                src.tmpl = text;
                that._compileTmpl();
            });
        },
        _loadStyle: function(url) {
            var that = this, src = that._src;
            $.get(url, function(text) {
                src.style = text;
                that._compileStyle();
            });
        },
        _replaceComponentTag: function(tmplStr) {
            var that = this;
            return tmplStr.replace(COMP_OPEN_REGEXP, '<component cid="$1" $2>').replace(COMP_CLOSE_REGEXP, "</component>").replace(COMP_SELF_CLOSE_REGEXP, "<component $1></component>");
        },
        _compileTmpl: function() {
            var that = this, name = that._name, components = that._components, templates = that._templates, src = that._src, tmpl = src.tmpl, tmplHelper = that._tmplHelper, tmplPartial = that._tmplPartial, tmplStr;
            if (Object.isTypeof(tmpl, "string")) {
                tmplStr = that._replaceComponentTag(tmpl);
                tmpl = new Template("template-" + name);
                tmpl.addHelper(tmplHelper);
                tmpl.addPartial(tmplPartial);
                tmpl.compile(tmplStr);
                src.tmpl = tmpl;
            }
            templates.push(tmpl);
        },
        _compileStyle: function() {
            var that = this, name = that._name, src = that._src, style = src.style, cssText;
            hasLess = !!win["less"];
            if (Object.isTypeof(style, "string")) {
                cssText = style;
                style = doc.createElement("style");
                style.setAttribute("type", hasLess ? "text/less" : "text/css");
                style.setAttribute("rel", "stylesheet");
                style.setAttribute("id", "stylesheet-view-" + name);
                style.innerHTML = cssText;
            }
            !style.parentNode && head.appendChild(style);
            hasLess && less.refresh(less.env === "development");
            src.style = style;
        },
        _compiled: function() {
            var that = this;
            that._isInstalling = false;
            that._isCompiled = true;
            that._bindAttach();
            that.render();
            that.parse();
            that.ready("ready");
        },
        getName: function() {
            var that = this;
            return that._name;
        },
        getController: function() {
            var that = this;
            return that._controller;
        },
        getViewport: function() {
            var that = this, viewport = that._viewport, controller = that._controller;
            return $(viewport || "#" + controller.getViewport());
        },
        getAttr: function(name) {
            var that = this, attrs = that._attrs;
            return attrs[name];
        },
        setAttr: function(name, value) {
            var that = this, attrs = that._attrs, obj;
            if (arguments.length === 1 && Object.isTypeof(obj = name, "object")) {
                Object.each(obj, function(value, name) {
                    that.setAttr(name, value);
                });
                return;
            }
            if (attrs.hasOwnProperty(name)) {
                attrs[name] = value;
            }
        },
        _findDataPath: function(data, path) {
            Object.each(path, function(name) {
                if (data.hasOwnProperty(name)) {
                    data = data[name];
                } else {
                    return undef;
                }
            });
            return data;
        },
        _getData: function(data, path) {
            var that = this, last;
            if (typeof path == "string") {
                path = path.split(".");
            }
            last = path.pop();
            data = that._findDataPath(data, path);
            if (data) {
                return data[last];
            }
        },
        _setData: function(data, path, value, slient) {
            var that = this, last, obj;
            if (Object.isTypeof(obj = path, "object") && !(obj instanceof Array)) {
                slient = value;
                Object.each(obj, function(value, path) {
                    that.setData(path, value, slient);
                });
                return;
            }
            if (value == undef) return;
            if (typeof path == "string") {
                path = path.split(".");
            }
            last = path.pop();
            data = that._findDataPath(data, path);
            if (data) {
                data[last] = Object.clone(value, true);
                if (!slient) {
                    path.push(last);
                    dataChanged = that._dataChanged || (that._dataChanged = {});
                    dataChanged[path.join(".")] = data[last];
                }
            }
        },
        getData: function(path) {
            var that = this;
            return that._getData(that._data, path);
        },
        setData: function(path, value, slient) {
            var that = this;
            that._setData(that._data, path, value, slient);
        },
        getCompData: function(path) {
            var that = this;
            return that._getData(that._compdata, path);
        },
        setCompData: function(path, value) {
            var that = this;
            if (arguments.length === 1) {
                return that._setData(that._compdata, path, true);
            } else {
                return that._setData(that._compdata, path, value, true);
            }
        },
        getComponent: function(id) {
            var that = this, components = that._components;
            return components[id];
        },
        newComponent: function(CompClass, id, name, data) {
            var that = this, components = that._components, component;
            if (Object.isTypeof(CompClass, "string")) {
                CompClass = Component.depos(CompClass);
            }
            if (arguments.length === 3) {
                data = name;
                name = null;
            }
            if (CompClass) {
                component = new CompClass(id, name, data);
                components[id] = component;
            }
            return component;
        },
        newTmpl: function(tmplStr, tmplHelper, tmplPartial) {
            var that = this, templates = that._templates, tmplHelper = Object.extend(that._tmplHelper, tmplHelper || {}), tmplPartial = Object.extend(that._tmplPartial, tmplPartial || {}), tmpl;
            if (tmplStr) {
                tmplStr = that._replaceComponentTag(tmplStr);
                tmpl = new Template("template-runtime-" + Date.now());
                tmpl.addHelper(tmplHelper);
                tmpl.addPartial(tmplPartial);
                tmpl.compile(tmplStr);
                templates.push(tmpl);
                return tmpl;
            }
        },
        render: function(data) {
            this.trigger("beforeRender");
            var that = this, data = data || that._data, src = that._src, tmpl = src.tmpl, viewport, fragment;
            tmpl.all(data);
            viewport = that.getViewport();
            viewport.html("");
            viewport.append(tmpl.getNodeList());
            that.log("renderd");
        },
        parse: function(compdata) {
            this.trigger("beforeParse");
            var that = this, compdata = compdata || that._compdata, components = that._components, viewport = that.getViewport(), tags = viewport.find("component");
            Object.each(tags, function(tag) {
                var el = $(tag), cid = el.attr("cid"), id = el.attr("id"), name = el.attr("name"), dataBind = el.attr("data-bind"), data = that._getData(compdata, dataBind), CompClass, component;
                CompClass = Component.depos(cid);
                if (CompClass) {
                    component = new CompClass(id, name, data);
                    component.render();
                    components[id] = component;
                    el.replaceWith(component.getDom());
                }
            });
            that.log("parsed");
        },
        update: function(path, chunkData) {
            this.trigger("beforeUpdate");
            var that = this, dataChanged = that._dataChanged, src = that._src, tmpl = src.tmpl;
            if (path && chunkData) {
                dataChanged = {};
                dataChanged[path] = chunkData;
            }
            if (dataChanged) {
                Object.each(dataChanged, function(data, path) {
                    tmpl.update(path, data);
                });
            }
            delete that._dataChanged;
            that.log("updated");
        },
        active: function() {
            this.trigger("beforeActive");
            var that = this, data = data || that._data, src = that._src, tmpl = src.tmpl, viewport, fragment;
            viewport = that.getViewport();
            if (viewport.html() === "") {
                that._bindAttach();
                that.render();
                that.parse();
            }
            that.ready("actived");
        },
        suspend: function() {
            this.trigger("beforeSuspend");
            var that = this;
            that._isActive = false;
            that.trigger("suspended");
        },
        ready: function(state) {
            var that = this;
            that._isActive = true;
            that._isReady = true;
            that.trigger(state || "ready");
        },
        destroy: function() {
            this.trigger("beforeDestroy");
            var that = this, src = that._src, style = src.style, components = that._components, templates = that._templates;
            that._unbindAttach();
            style && head.removeChild(style);
            templates && Object.each(templates, function(tmpl) {
                tmpl.destroy();
            });
            components && Object.each(components, function(component) {
                component.destroy();
            });
            delete that._compdata;
            delete that._data;
            delete that._attach;
            delete that._src;
            delete that._components;
            that.trigger("destroyed");
        },
        attach: function(name, selector, handler) {
            var that = this, viewport = that.getViewport(), argLen = arguments.length, callback;
            if (Object.isTypeof(handler, "string")) {
                handler = that[handler];
            }
            callback = function(e) {
                handler.call(this, e, that);
            };
            if (handler) {
                if (argLen === 3) {
                    viewport.on(name, selector, callback);
                } else if (argLen === 2) {
                    handler = selector;
                    viewport.on(name, callback);
                }
            }
        },
        disattach: function(name, selector, handler) {
            var that = this, viewport = that.getViewport(), argLen = arguments.length;
            if (handler) {
                if (argLen === 3) {
                    if (Object.isTypeof(handler, "string")) {
                        handler = that[handler];
                    }
                    viewport.off(name, selector, handler);
                } else if (argLen === 2) {
                    if (Object.isTypeof(selector, "string")) {
                        selector = that[selector] || selector;
                    }
                    viewport.off(name, selector);
                } else if (argLen === 1) {
                    viewport.off(name);
                } else if (argLen === 0) {
                    viewport.off();
                }
            }
        },
        has: function(event, callback) {
            var that = this, name = that._name, controller = that._controller;
            controller.has("@" + name + ":" + event, callback, that);
            return that;
        },
        once: function(event, callback) {
            var that = this, name = that._name, controller = that._controller;
            controller.once("@" + name + ":" + event, callback, that);
            return that;
        },
        on: function(event, callback) {
            var that = this, name = that._name, controller = that._controller;
            controller.on("@" + name + ":" + event, callback, that);
            return that;
        },
        off: function(event, callback) {
            var that = this, name = that._name, controller = that._controller;
            controller.off("@" + name + ":" + event, callback, that);
            return that;
        },
        trigger: function(events) {
            var that = this, name = that._name, controller = that.getController(), args = Array.make(arguments);
            if (!atReg.test(events)) {
                args[0] = "@" + name + ":" + args[0];
            }
            controller.trigger.apply(controller, args);
        },
        log: function(msg) {
            var that = this, name = that._name, controller = that._controller;
            controller.log("@" + name + ":" + msg);
            return that;
        }
    });
    View.ready = function(handler) {
        return function readyHandler() {
            var context = this, isReady = context._isReady, args = arguments;
            if (!isReady) {
                context.once("ready", function() {
                    handler.apply(context, args);
                });
            } else {
                handler.apply(context, args);
            }
        };
    };
    module.exports = View;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/mvc/model/model-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/base/util/util-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), util = require("mix/core/0.3.0/base/util/util-debug").singleton;
    /**
 * @class Model
 */
    var Model = Class.create({
        /**
	 * @constructor
	 * @param {Object=} attrs
	 * @param {Object=} defaults
	 * @param {Object=} options
	 */
        initialize: function(attrs, defaults, options) {
            attrs || (attrs = {});
            if (options && options.parse) attrs = this.parse(attrs);
            if (defaults) {
                attrs = Object.extend({}, defaults, attrs);
            }
            this._attributes = {};
            this._escapedAttributes = {};
            this.set(attrs);
        },
        /**
	 * get json data
	 * @return {Object} the json data
	 */
        toJSON: function() {
            return Object.clone(this._attributes);
        },
        /**
     * get the value of an attribute
     * @param {string} attr
     * @return {*} the attr's value
     */
        get: function(attr) {
            return this._attributes[attr];
        },
        /**
     * get the HTML-escaped value of an attribute
     * @param {string} attr
     * @return {*} the attr's value
     */
        escape: function(attr) {
            var html;
            if (html = this._escapedAttributes[attr]) return html;
            var val = this.get(attr);
            return this._escapedAttributes[attr] = util.escape(val == null ? "" : "" + val);
        },
        /**
     * Returns `true` if the attribute contains a value that is not null or undefined.
     * @param {string} attr
     * @return {boolean}
     */
        has: function(attr) {
            return this.get(attr) != null;
        },
        /**
     * set a hash of model attributes on the object.
     * @param {string} key
     * @param {*} value
     */
        set: function(key, value) {
            var attrs;
            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (Object.isTypeof(key) == "object") {
                attrs = key;
            } else {
                attrs = {};
                attrs[key] = value;
            }
            // Run validation.
            //if (!this._validate(attrs)) return false;
            var now = this._attributes;
            var escaped = this._escapedAttributes;
            Object.each(attrs, function(value, key) {
                if (now[key] !== value) {
                    delete escaped[key];
                    now[key] = value;
                }
            });
        },
        /**
     * create a new model with attributes to this one.
     * @return {Model}
     */
        clone: function() {
            return new this.constructor(this._attributes);
        }
    });
    module.exports = Model;
});

define("#mix/core/0.3.0/mvc/orm/orm-debug", [ "mix/core/0.3.0/base/reset/reset-debug", "mix/core/0.3.0/base/class/class-debug", "mix/core/0.3.0/mvc/model/model-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset/reset-debug");
    var Class = require("mix/core/0.3.0/base/class/class-debug"), Model = require("mix/core/0.3.0/mvc/model/model-debug");
    ORM = Model.extend({
        test: function() {
            console.log(this.init());
        },
        init: function() {
            this.records = {};
            this.attributes = [];
        },
        find: function(id) {
            var record = this.records[id];
            if (!record) throw "Unknown record";
            return record.dup();
        },
        exists: function(id) {
            try {
                return this.find(id);
            } catch (e) {
                return false;
            }
        },
        populate: function(values) {
            // Reset model & records
            this.records = {};
            for (var i = 0, il = values.length; i < il; i++) {
                var record = this.inst(values[i]);
                record.newRecord = false;
                this.records[record.id] = record;
            }
        },
        select: function(callback) {
            var result = [];
            for (var key in this.records) if (callback(this.records[key])) result.push(this.records[key]);
            return this.dupArray(result);
        },
        findByAttribute: function(name, value) {
            for (var key in this.records) if (this.records[key][name] == value) return this.records[key].dup();
        },
        findAllByAttribute: function(name, value) {
            return this.select(function(item) {
                return item[name] == value;
            });
        },
        each: function(callback) {
            for (var key in this.records) {
                callback(this.records[key]);
            }
        },
        all: function() {
            return this.dupArray(this.recordsValues());
        },
        first: function() {
            var record = this.recordsValues()[0];
            return record && record.dup();
        },
        last: function() {
            var values = this.recordsValues();
            var record = values[values.length - 1];
            return record && record.dup();
        },
        count: function() {
            return this.recordsValues().length;
        },
        deleteAll: function() {
            for (var key in this.records) delete this.records[key];
        },
        destroyAll: function() {
            for (var key in this.records) this.records[key].destroy();
        },
        update: function(id, atts) {
            this.find(id).updateAttributes(atts);
        },
        create: function(atts) {
            var record = this.inst(atts);
            record.save();
            return record;
        },
        destroy: function(id) {
            this.find(id).destroy();
        },
        // Private
        recordsValues: function() {
            var result = [];
            for (var key in this.records) result.push(this.records[key]);
            return result;
        },
        dupArray: function(array) {
            return array.map(function(item) {
                return item.dup();
            });
        }
    });
    /*
ORM = Model.include({
  xxx:function(){alert(1);}
});
*/
    ORM.singleton = new ORM();
    ORM.Model = Model;
    module.exports = ORM;
});