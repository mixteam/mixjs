define("#mix/core/0.3.0/url/navigate",["mix/core/0.3.0/base/reset","mix/core/0.3.0/base/class","mix/core/0.3.0/base/message","mix/core/0.3.0/url/router"],function(a,b,c){a("mix/core/0.3.0/base/reset");var d=a("mix/core/0.3.0/base/class"),e=a("mix/core/0.3.0/base/message"),f=a("mix/core/0.3.0/url/router"),g=/\:(\w\w*)/g,h=/\*(\w\w*)/g,i=/P\<(\w\w*?)\>/g,j="!",k=window,m=(k.document,k.history);k.location;var o=d.create({Implements:e,initialize:function(a){var b=this;e.prototype.initialize.call(b,"navigate"),b._move=null,b._datas=null,b._routes={},b._states=[],b._stateIdx=0,b._stateLimit=a.stateLimit||100,b._router=a.useRouter},_convertParams:function(a){return a.replace(g,"(P<$1>[^\\/]*?)").replace(h,"(P<$1>.*?)")},_extractNames:function(a){var b=a.match(i),c={};return b&&Object.each(b,function(a,b){c[a.replace(i,"$1")]=b}),c},_extractArgs:function(a){var b=a.split("&");return a={},Object.each(b,function(b){if(b){var c=b.split("=");a[c[0]]=c[1]}}),a},_parseRoute:function(a){return a=a.replace(i,""),new RegExp("^("+a+")("+j+".*?)?$")},_stateEquals:function(a,b){return a&&b?a.name!==b.name||a.fragment!==b.fragment?!1:!0:!1},_pushState:function(a,b,c,d){var e=this,f=e._states,g=e._stateIdx,h=e._stateLimit,i=f.length,j=e._move,k=e._transition,l=e._datas,m=f[g-1],n=f[g+1],o={name:a,fragment:b,params:c||{},args:d||{}};return null==j&&(k=j=!l&&e._stateEquals(m,o)?"backward":"forward"),"backward"===j?0===g&&i>0?f.unshift(o):g>0&&(g--,o=m):"forward"===j&&(g===h-1?(f.shift(),f.push(o)):0===g&&0===i?f.push(o):!l&&e._stateEquals(n,o)?(g++,o=n):(g++,f.splice(g),f.push(o))),o.move=j,o.transition=k,o.datas=l||{},e._move=null,e._datas=null,e._stateIdx=g,e.trigger(j,o),o},getState:function(){var a=this;return a._states[a._stateIdx]},getStateIndex:function(){var a=this;return a._stateIdx},addRoute:function(a,b,c){var f,g,d=this;1===arguments.length&&(c=arguments[0],a=null,b=null),c||(c={}),c["default"]?d._router.on("unmatched",function(b){var e=d._pushState(a,b);c.callback&&c.callback(e)}):a&&b&&(b=d._convertParams(b),f=d._extractNames(b),g=d._parseRoute(b),d._routes[a]=g,d._router.add(g,function(b){var j,e=b.match(g).slice(2),h=d._extractArgs(e.pop()||""),i={};Object.each(f,function(a,b){i[b]=e[a]}),j=d._pushState(a,b,i,h),c.callback&&c.callback(j)},c.last))},removeRoute:function(a){var b=this,c=b._routes[a];c&&b._router.remove(c)},forward:function(a,b){var c=this,d=c._states,e=c._stateIdx,f=d[e]||{},g=[];c._move="forward",c._transition="forward",b||(b={}),a?(b.datas||f.fragment!==a)&&(b.args&&Object.each(b.args,function(a,b){g.push(b+"="+a)}),b.datas&&(c._datas=Object.clone(b.datas)),"backward"===b.transition&&(c._transition="backward"),c._router.navigate(a+(g.length?j+g.join("&"):""))):m.forward()},backward:function(a){var b=this,c=b._stateIdx;0!==c&&(b._move="backward",b._transition="backward",a||(a={}),"forward"===a.transition&&(b._transition="forward"),m.back())}});o.singleton=new o({useRouter:f.singleton}),c.exports=o});