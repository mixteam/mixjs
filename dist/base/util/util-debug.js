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