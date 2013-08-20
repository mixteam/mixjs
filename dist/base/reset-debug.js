define("#mix/core/0.3.0/base/reset-debug", [], function(require, exports, module) {
    var undef, toString = Object.prototype.toString, hasOwnProperty = Object.prototype.hasOwnProperty, slice = Array.prototype.slice;
    //
    // Object
    //
    if (!Object.keys) {
        Object.keys = function(object) {
            var keys = [], i = 0;
            for (var name in object) {
                if (hasOwnProperty.call(object, name)) {
                    keys[i++] = name;
                }
            }
            return keys;
        };
    }
    if (!Object.each) {
        Object.each = function(object, callback, context) {
            if (object == null) return;
            if (hasOwnProperty.call(object, "length")) {
                Array.prototype.forEach.call(object, callback, context);
            } else if (typeof object === "object") {
                for (var name in object) {
                    if (hasOwnProperty.call(object, name)) {
                        callback.call(context, object[name], name, object);
                    }
                }
            }
        };
    }
    if (!Object.clone) {
        Object.clone = function(value, deeply) {
            if (Object.isTypeof(value, "array")) {
                if (deeply) {
                    return arr.map(function(v) {
                        return Object.clone(v, deeply);
                    });
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
            var args = Array.make(arguments), src = args.shift(), deeply = args.pop();
            if (!Object.isTypeof(deeply, "boolean")) {
                args.push(deeply);
                deeply = undef;
            }
            Object.each(args, function(target) {
                Object.each(target, function(value, name) {
                    src[name] = deeply ? Object.clone(value) : value;
                });
            });
            return src;
        };
    }
    if (!Object.isTypeof) {
        var TYPE_REGEXP = /^\[object\s\s*(\w\w*)\s*\]$/;
        Object.isTypeof = function(value, istype) {
            var str = toString.call(value).toLowerCase(), matched = TYPE_REGEXP.exec(str), type;
            if (!matched) return;
            type = matched[1];
            if (istype) {
                return type === istype.toLowerCase();
            } else {
                return type;
            }
        };
    }
    //
    // Array
    //
    if (!Array.make && !Array.from) {
        Array.from = Array.make = function(object) {
            if (hasOwnProperty.call(object, "length")) {
                return slice.call(object);
            }
        };
    }
    if (!Array.equal) {
        Array.equal = function(a1, a2) {
            if (a1.length == a2.length) {
                for (var i = 0; i < a1.length; i++) {
                    if (a1[i] !== a2[i]) return false;
                }
                return true;
            } else {
                return false;
            }
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, context) {
            var arr = this, len = arr.length;
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    callback.call(context, arr[i], i, arr);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, context) {
            var arr = this, len = arr.length, newArr = new Array(len);
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    newArr[i] = callback.call(context, arr[i], i, arr);
                }
            }
            return newArr;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(callback, context) {
            var arr = this, len = arr.length, newArr = [], value;
            for (var i = 0; i < len; i++) {
                value = arr[i];
                if (callback.call(context, value, i, arr)) {
                    newArr.push(value);
                }
            }
            return newArr;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(value, fromIndex) {
            var arr = this, len = arr.length, i = fromIndex || 0;
            if (!len || i >= len) return -1;
            if (i < 0) i += len;
            for (;i < length; i++) {
                if (hasOwnProperty.call(arr, i)) {
                    if (value === arr[i]) return i;
                }
            }
            return -1;
        };
    }
    //
    // String
    //
    if (!String.prototype.trim) {
        var LEFT_TRIM = /^\s\s*/, RIGHT_TRIM = /\s\s*$/;
        String.prototype.trim = function() {
            return this.replace(LEFT_TRIM, "").replace(RIGHT_TRIM, "");
        };
    }
    //
    // Function
    //
    if (!Function.prototype.bind) {
        var ctor = function() {};
        Function.prototype.bind = function(context) {
            var func = this, //protoBind = Function.prototype.bind,
            args = Array.make(arguments), bound;
            // if (func.bind === protoBind && protoBind) 
            //     return protoBind.apply(func, slice.call(arguments, 1));
            if (!Object.isTypeof(func, "function")) throw new TypeError();
            args = args.slice(1);
            return bound = function() {
                var _args = Array.make(arguments);
                if (!(this instanceof bound)) return func.apply(context, args.concat(_args));
                ctor.prototype = func.prototype;
                var self = new ctor();
                var result = func.apply(self, args.concat(_args));
                if (Object(result) === result) return result;
                return self;
            };
        };
    }
});