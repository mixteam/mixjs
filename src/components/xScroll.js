define(function(require, exports, module) {

require('reset');
var win = window,
	doc = win.document,

	Class = require('class'),
	navigate = require('navigate').singleton,
	Scroll = require('../modules/scroll'),
	xBase = require('./xBase'),

	xName = 'x-scroll',
	className = xName,
	xScroll = xBase.create(xName, className, {
		init : function() {
			var that = this,
				module = that._module
				;

			that._scroller = new Scroll(module);
		},

		enable : function() {
			var that = this,
				scroller = that._scroller
				;

			scroller.enable();
		},

		disable : function() {
			var that = this,
				scroller = that._scroller
				;

			scroller.disable();
		},

		refresh : function() {
			var that = this,
				scroller = that._scroller
				;

			scroller.refresh();
		},

		getViewport : function() {
			return this._module;
		}
	});

	return xScroll;
});