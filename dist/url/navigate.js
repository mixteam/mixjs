define("#mix/core/0.3.0/url/navigate",["mix/core/0.3.0/base/reset","mix/core/0.3.0/base/class","mix/core/0.3.0/url/router"],function(a,b,c){a("mix/core/0.3.0/base/reset");var d=a("mix/core/0.3.0/base/class"),e=a("mix/core/0.3.0/url/router"),f=/\:(\w\w*)/g,g=/\*(\w\w*)/g,i=window,k=(i.document,i.history);i.location;var m=d.create({initialize:function(a,b){var c=this;c._options=Object.extend({stateLimit:100},a||{}),c._states=[],c._stateIdx=0,c._move=null,c._router=b?e.singleton:new e},_convertParameters:function(a){return a.replace(f,"(P<$1>[^/][^/]*?)").replace(g,"(P<$1>.*?)")},_extractParamKeys:function(a){var b=a.match(perlParam),c={};return b&&Object.each(b,function(a,b){c[a.replace(perlParam,"$1")]=b}),c},_extractArguments:function(a){var b=a.split("&");return a={},Object.each(b,function(b){if(b){var c=b.split("=");a[c[0]]=c[1]}}),a},_parseRoute:function(a){return a=a.replace(perlParam,""),new RegExp("^("+a+")(![^!]*?)?$")},_isStateEqual:function(){},_pushState:function(a,b,c,d){function o(a,b){return a&&b?a.fragment!==b.fragment?!1:!0:!1}var e=this,f=e._options,g=f.stateLimit,h=e._states,i=e._stateIdx,j=h.length,k=e._move,l=h[i-1],m=h[i+1],n={name:a,fragment:b,params:c,args:d};return e._move=null,null==k?l&&o(l,n)?(k="backward",i--,n=l):(!m||m&&o(m,n))&&(k="forward",i++,n=m):"backward"===k?0===i&&j>0?h.unshift(n):i>0&&(i--,n=l):"forward"===k&&(i===g-1?(h.shift(),h.push(n)):0===i&&0===j?h.push(n):o(m,n)?(i++,n=m):(h.splice(i++),h.push(n))),e._stateIdx=i,e._router.trigger("navigator:"+k,n),n},getState:function(){return this._states[this._stateIdx]},addRoute:function(a,b,c,d){var f,g,e=this;b=e._convertParameters(b),f=e._extractParamKeys(b),g=e._parseRoute(b),"boolean"===Object.isTypeof(c)&&(d=c,c=null),null==d&&(d=!0),e._router.add(g,function(b){var i,d=b.match(route).slice(2),g=e._extractArguments(d.pop()||""),h={};Object.each(f,function(a,b){h[b]=d[a]}),i=e._pushState(a,b,h,g),c&&c(i)},d)},removeRoute:function(a){var b=this,a=b._routeToRegExp(a);b._router.remove(a)},forward:function(a,b){var c=this,d=c._states,e=c._stateIdx,f=d[e],g=[];c._move="forward",a?f&&f.fragment===a||(b&&b.args&&Object.each(b.args,function(a,b){g.push(b+"="+a)}),c._router.navigate(a+(g.length?"!"+g.join("&"):""))):k.forward()},backward:function(){var a=this,b=a._stateIdx;0!==b&&(a._move="backward",k.back())}});m.singleton=new m({},!0),c.exports=m});