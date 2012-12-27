define("#mix/core/0.3.0/dom/ajax/ajax",["mix/core/0.3.0/dom/selector/selector"],function(a){var d=a("mix/core/0.3.0/dom/selector/selector");(function(a){function n(a){if(!("defaultPrevented"in a)){a.defaultPrevented=!1;var b=a.preventDefault;a.preventDefault=function(){this.defaultPrevented=!0,b.call(this)}}}function o(b,c,d){var e=a.Event(c);return a(b).trigger(e,d),!e.defaultPrevented}function p(a,b,c,e){return a.global?o(b||d,c,e):void 0}function q(b){b.global&&0===a.active++&&p(b,null,"ajaxStart")}function r(b){b.global&&!--a.active&&p(b,null,"ajaxStop")}function s(a,b){var c=b.context;return b.beforeSend.call(c,a,b)===!1||p(b,c,"ajaxBeforeSend",[a,b])===!1?!1:(p(b,c,"ajaxSend",[a,b]),void 0)}function t(a,b,c){var d=c.context,e="success";c.success.call(d,a,e,b),p(c,d,"ajaxSuccess",[b,c,a]),v(e,b,c)}function u(a,b,c,d){var e=d.context;d.error.call(e,c,b,a),p(d,e,"ajaxError",[c,d,a]),v(b,c,d)}function v(a,b,c){var d=c.context;c.complete.call(d,b,a),p(c,d,"ajaxComplete",[b,c]),r(c)}function w(){}function x(a){return a&&(a==k?"html":a==j?"json":h.test(a)?"script":i.test(a)&&"xml")||"text"}function y(a,b){return(a+"&"+b).replace(/[&?]{1,2}/,"?")}function z(b){c(b.data)&&(b.data=a.param(b.data)),!b.data||b.type&&"GET"!=b.type.toUpperCase()||(b.url=y(b.url,b.data))}function B(b,d,e,f){var g=a.isArray(d);a.each(d,function(d,h){f&&(d=e?f:f+"["+(g?"":d)+"]"),!f&&g?b.add(h.name,h.value):(e?a.isArray(h):c(h))?B(b,h,e,d):b.add(d,h)})}var e,f,b=0,c=a.isObject,d=window.document,g=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,h=/^(?:text|application)\/javascript/i,i=/^(?:text|application)\/xml/i,j="application/json",k="text/html",l=/^\s*$/,m={};a.Event=function(a,b){var c=d.createEvent(m[a]||"Events"),e=!0;if(b)for(var f in b)"bubbles"==f?e=!!b[f]:c[f]=b[f];return c.initEvent(a,e,!0,null,null,null,null,null,null,null,null,null,null,null,null),c},a.fn.trigger=function(b,c){return"string"==typeof b&&(b=a.Event(b)),n(b),b.data=c,this.each(function(){"dispatchEvent"in this&&this.dispatchEvent(b)})},a.active=0,a.ajaxJSONP=function(c){var i,e="jsonp"+ ++b,f=d.createElement("script"),g=function(){a(f).remove(),e in window&&(window[e]=w),v("abort",h,c)},h={abort:g};return c.error&&(f.onerror=function(){h.abort(),c.error()}),window[e]=function(b){clearTimeout(i),a(f).remove(),delete window[e],t(b,h,c)},z(c),f.src=c.url.replace(/=\?/,"="+e),a("head").append(f),c.timeout>0&&(i=setTimeout(function(){h.abort(),v("timeout",h,c)},c.timeout)),h},a.ajaxSettings={type:"GET",beforeSend:w,success:w,error:w,complete:w,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript",json:j,xml:"application/xml, text/xml",html:k,text:"text/plain"},crossDomain:!1,timeout:0},a.ajax=function(b){var c=a.extend({},b||{});for(e in a.ajaxSettings)void 0===c[e]&&(c[e]=a.ajaxSettings[e]);q(c),c.crossDomain||(c.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(c.url)&&RegExp.$2!=window.location.host);var d=c.dataType,g=/=\?/.test(c.url);if("jsonp"==d||g)return g||(c.url=y(c.url,"callback=?")),a.ajaxJSONP(c);c.url||(c.url=""+window.location),z(c);var m,h=c.accepts[d],i={},j=/^([\w-]+:)\/\//.test(c.url)?RegExp.$1:window.location.protocol,k=a.ajaxSettings.xhr();c.crossDomain||(i["X-Requested-With"]="XMLHttpRequest"),h&&(i.Accept=h,h.indexOf(",")>-1&&(h=h.split(",",2)[0]),k.overrideMimeType&&k.overrideMimeType(h)),(c.contentType||c.data&&"GET"!=c.type.toUpperCase())&&(i["Content-Type"]=c.contentType||"application/x-www-form-urlencoded"),c.headers=a.extend(i,c.headers||{}),k.onreadystatechange=function(){if(4==k.readyState){clearTimeout(m);var b,e=!1;if(k.status>=200&&300>k.status||304==k.status||0==k.status&&"file:"==j){d=d||x(k.getResponseHeader("content-type")),b=k.responseText;try{"script"==d?(1,eval)(b):"xml"==d?b=k.responseXML:"json"==d&&(b=l.test(b)?null:a.parseJSON(b))}catch(f){e=f}e?u(e,"parsererror",k,c):t(b,k,c)}else u(null,"error",k,c)}};var n="async"in c?c.async:!0;k.open(c.type,c.url,n);for(f in c.headers)k.setRequestHeader(f,c.headers[f]);return s(k,c)===!1?(k.abort(),!1):(c.timeout>0&&(m=setTimeout(function(){k.onreadystatechange=w,k.abort(),u(null,"timeout",k,c)},c.timeout)),k.send(c.data?c.data:null),k)},a.get=function(b,c){return a.ajax({url:b,success:c})},a.post=function(b,c,d,e){return a.isFunction(c)&&(e=e||d,d=c,c=null),a.ajax({type:"POST",url:b,data:c,success:d,dataType:e})},a.getJSON=function(b,c){return a.ajax({url:b,success:c,dataType:"json"})},a.fn.load=function(b,c){if(!this.length)return this;var h,e=this,f=b.split(/\s/);return f.length>1&&(b=f[0],h=f[1]),a.get(b,function(b){e.html(h?a(d.createElement("div")).html(b.replace(g,"")).find(h).html():b),c&&c.apply(e,arguments)}),this};var A=encodeURIComponent;a.param=function(a,b){var c=[];return c.add=function(a,b){this.push(A(a)+"="+A(b))},B(c,a,b),c.join("&").replace("%20","+")}})(d)});