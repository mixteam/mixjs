define("#mix/core/0.3.0/mvc/model/model",["mix/core/0.3.0/base/reset/reset","mix/core/0.3.0/base/class/class","mix/core/0.3.0/base/util/util"],function(a,b,c){a("mix/core/0.3.0/base/reset/reset");var d=a("mix/core/0.3.0/base/class/class"),e=a("mix/core/0.3.0/base/util/util").singleton,f=d.create({initialize:function(a,b,c){a||(a={}),c&&c.parse&&(a=this.parse(a)),b&&(a=Object.extend({},b,a)),this._attributes={},this._escapedAttributes={},this.set(a)},toJSON:function(){return Object.clone(this._attributes)},get:function(a){return this._attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;var c=this.get(a);return this._escapedAttributes[a]=e.escape(null==c?"":""+c)},has:function(a){return null!=this.get(a)},set:function(a,b){var c;"object"==Object.isTypeof(a)?c=a:(c={},c[a]=b);var d=this._attributes,e=this._escapedAttributes;Object.each(c,function(a,b){d[b]!==a&&(delete e[b],d[b]=a)})},clone:function(){return new this.constructor(this._attributes)}});c.exports=f});