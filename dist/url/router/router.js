define("#mix/core/0.3.0/url/router/router",["mix/core/0.3.0/base/reset/reset","mix/core/0.3.0/base/class/class","mix/core/0.3.0/url/history/history"],function(a,b,c){a("mix/core/0.3.0/base/reset/reset");var d=a("mix/core/0.3.0/base/class/class"),e=a("mix/core/0.3.0/url/history/history").singleton,f=/\:(\w\w*)/g,g=/\*(\w\w*)/g,h=/P\<(\w\w*?)\>/g,j=/^[^#\/\!]*/,k=window,l=k.document,m=k.history,p=(l.getElementsByTagName("head")[0],k.location,d.create({initialize:function(a){var b=this;b._options=Object.extend({root:location.pathname.replace(/[^\/]+\.[^\/]+$/,""),appPath:"apps/",defaultApp:"index",maxStateLen:100},a||{}),b._started=!1,b._states=[],b._stateIdx=-1,b._move=null},_routeToRegExp:function(a){return a=a.replace(f,"([^/][^/]*?)").replace(g,"(.*?)").replace(h,""),RegExp("^"+a+"(!.*?)?$")},_extractParamKeys:function(a){var b=a.replace(f,"(P<$1>[^/][^/]*?)").replace(g,"(P<$1>.*?)").match(h),c={};return b&&Object.each(b,function(a,b){c[a.replace(h,"$1")]=b}),c},_extractParameters:function(a,b){var c;return(c=a.exec(b))?c.slice(1):void 0},_extractArguments:function(a){var b=a.split("&"),c={};return b.length&&Object.each(b,function(a){var b=a.split("=");c[b[0]]=b[1]}),c},_pushState:function(a,b,c){var o,d=this,f=d._options,g=f.root,h=f.appPath,i=f.maxStateLen,j=d._states,k=d._stateIdx,l=j[k-1],m=j[k],n=j[k+1],p=d._move;d._move=null,p&&"backward"===p||!p&&l&&l.fragment===c?(p="backward",0==k?j.pop():k--,l?o=l:(o={appname:a,params:[],args:b,fragment:c},j.push(o))):(p&&"forward"===p||!p&&!n||n.fragment===c)&&(p="forward",k==i-1?j.shift():k++,n?o=n:(o={appname:a,params:[],args:b,fragment:c},j.push(o))),d._stateIdx=k,m&&m.appname==o.appname||(o.appentry=[g,h,a,"entry.js"].join("/").replace(/\/{2,}/g,"/"),console.log(o.appentry),e.trigger("navigator:"+p,o.appname,o.appentry))},_replaceState:function(a,b,c){var g=(this._states,this._stateIdx),h=this._states[g];h.params=b||[],h.paramKeys=h.paramKeys||c||{},e.trigger("navigator:route",h.appname,a)},getState:function(){var c=(this._states,this._stateIdx);return this._states[c]},addRoute:function(a,b){var c=this,d=c._extractParamKeys(a),a=c._routeToRegExp(a);e.route(a,function(e){var f=e.split("!"),g=c._extractParameters(a,f[0]);g&&c._replaceState(b,g,d)},!0)},removeRoute:function(a){var b=this,a=b._routeToRegExp(a);e.remove(a)},forward:function(a,b){var c=this,d=c._states,f=c._stateIdx,g=d[f],h=[];c._move="forward",a?(!g||b||g.fragment!==a)&&(b&&Object.each(b,function(a,b){h.push(b+"="+a)}),d.splice(f+1),e.navigate(a+(h.length?"!"+h.join("&"):""))):m.forward()},backward:function(){var a=this,b=a._stateIdx;1>b||(a._move="backward",m.back())},start:function(a){var b=this,c=Object.extend(b._options,a||{}),d=c.root,f=c.defaultApp;b._started||("/"!==d.charAt(d.length-1)&&(c.root=d+="/"),e.route(j,function(a){var c=a.split("!"),d=j.exec(c[0])[0]||f,e=b._extractArguments(c[1]||"");b._pushState(d,e,c[0])}),b._started=e.start({root:d,hashChange:!0}))}}));p.singleton=new p,c.exports=p});