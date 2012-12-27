define("#mix/core/0.3.0/url/history/history",["mix/core/0.3.0/base/reset/reset","mix/core/0.3.0/base/class/class","mix/core/0.3.0/base/message/message"],function(a,b,c){a("mix/core/0.3.0/base/reset/reset");var d=a("mix/core/0.3.0/base/class/class"),e=a("mix/core/0.3.0/base/message/message"),f=/^[#\/]/,g=window,h=g.document,i=g.location,j=g.history,k=d.create({Implements:e,initialize:function(){var a=this;e.prototype.initialize.call(a,"history"),a._handlers=[],a._matchs=[],a._changeHanlder=Function.binded(a._changeHanlder,a)},_getHash:function(){return i.hash.slice(1)||""},_updateHash:function(a,b){b?i.replace((""+i).replace(/(javascript:|#).*$/,"")+"#"+a):i.hash=a},_getFragment:function(a,b){var c=this;if(null==a)if(c._hasPushState||b){a=i.pathname;var d=i.search;d&&(a+=d)}else a=c._getHash();return a.indexOf(c._options.root)||(a=a.substr(c._options.root.length)),a.replace(f,"")},_resetMatchs:function(){var a=this,b=a._handlers;b.forEach(function(a){a.matched=!1})},_changeHanlder:function(){var b=this;b._resetMatchs(),b.match()},start:function(a){var c,b=this;if(k.started)throw Error("history has already been started");k.started=!0,b._options=Object.extend({},{root:"/"},a||{}),b._wantsHashChange=b._options.hashChange!==!1,b._wantsPushState=!!b._options.pushState,b._hasPushState=!!(b._options.pushState&&j&&j.pushState),b._hasPushState?g.addEventListener("popstate",b._changeHanlder,!1):b._wantsHashChange&&"onhashchange"in g&&g.addEventListener("hashchange",b._changeHanlder,!1);var d=i.pathname==b._options.root;return b._wantsHashChange&&b._wantsPushState&&!b._hasPushState&&!d?(c=b._getFragment(null,!0),i.replace(b._options.root+"#"+b._fragment),!0):(b._wantsPushState&&b._hasPushState&&d&&i.hash&&(c=b._getFragment(),j.replaceState({},h.title,i.protocol+"//"+i.host+b._options.root+b._fragment)),b._options.silent?void 0:b.match(c))},stop:function(){var a=this;k.started&&(g.removeEventListener("popstate",a._changeHanlder,!1),g.removeEventListener("hashchange",a._changeHanlder,!1),k.started=!1)},match:function(a){var a,b=this,c=b._handlers;if(k.started){b._fragment=a=a||b._getFragment();for(var d=0;c.length>d;d++){var e=c[d];if(!e.matched&&e.route.test(a)&&(e.matched=!0,e.callback(a),e.last))return}}},route:function(a,b,c){var d=this,e=d._handlers;e.push({route:a,callback:b,matched:!1,last:!!c})},remove:function(a,b){for(var c=this,d=c._handlers,e=0;d.length>e;e++){var f=d[e];if(f.route.source===a.source&&(!b||f.callback===b))return d.splice(e,1)}},navigate:function(a,b){var a,c=this;return k.started?(b&&b!==!0||(b={trigger:b}),a=(a||"").replace(f,""),c._fragment!=a&&(c._hasPushState?(0!=a.indexOf(c._options.root)&&(a=c._options.root+a),j[b.replace?"replaceState":"pushState"]({},h.title,a)):c._wantsHashChange?c._updateHash(a,b.replace):i.assign(c._options.root+a),b.trigger&&c.match(a)),void 0):!1}});k.started=!1,k.singleton=new k,c.exports=k});