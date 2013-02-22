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
    }, isNumber = /^[-+]?\d\d*\.?\d\d*/;
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
        str2val: function(str) {
            if (str == null || str == undefined || str == NaN) {
                return str;
            }
            str += "";
            if (str === "true" || str === "false") {
                return str === "true" ? true : false;
            } else if (isNumber.test(str)) {
                return parseFloat(str);
            } else {
                return str;
            }
        }
    });
    Util.singleton = new Util();
    module.exports = Util;
});