define("#mix/core/0.3.0/base/util-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug");
    // List of HTML entities for escaping.
    var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;"
    }, ctor = function() {}, funcBind = Function.prototype.bind;
    // Regex containing the keys listed immediately above.
    var htmlEscaper = /[&<>"'\/]/g;
    var Util = Class.create({
        initialize: function() {},
        // Escape a string for HTML interpolation.
        escape: function(string) {
            return ("" + string).replace(htmlEscaper, function(match) {
                return htmlEscapes[match];
            });
        },
        // Bind context to a function
        bind: function(func, context) {
            var args = Array.make(arguments), _args, bound;
            if (!Object.isTypeof(func, "function")) throw new TypeError();
            if (func.bind === funcBind && funcBind) return funcBind.apply(func, slice.call(arguments, 1));
            _args = args.slice(2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, _args.concat(args));
                ctor.prototype = func.prototype;
                var self = new ctor();
                var result = func.apply(self, _args.concat(args));
                if (Object(result) === result) return result;
                return self;
            };
        }
    });
    Util.singleton = new Util();
    module.exports = Util;
});