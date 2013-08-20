// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/mvc/model-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/base/util-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug"), util = require("mix/core/0.3.0/base/util-debug").singleton;
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