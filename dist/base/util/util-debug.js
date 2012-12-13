define("mix/core/0.3.0/base/util/util-debug", ["mix/core/0.3.0/base/util/util-debug", "mix/core/0.3.0/base/class/class-debug", "mix/libs/underscore/1.3.3/underscore-debug"], function(require, exports, module) {

var Class = require('mix/core/0.3.0/base/class/class-debug'),
	_ = require('mix/libs/underscore/1.3.3/underscore-debug');

var Util = Class.create({
	initialize : function() {
		// TODO
	},
  
  // TODO addition 
});

Util.implement(_);
Util.singleton = new Util;

module.exports = Util;

});