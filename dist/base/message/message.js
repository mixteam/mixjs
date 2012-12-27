define("#mix/core/0.3.0/base/message/message",["mix/core/0.3.0/base/reset/reset","mix/core/0.3.0/base/class/class"],function(a,b,c){a("mix/core/0.3.0/base/reset/reset");var d=a("mix/core/0.3.0/base/class/class"),e=/\s+/,f=/^\@([^:]+)/,g=0,h=d.create({initialize:function(a,b,c){var d=this;d.__msgObj={name:a||"anonymous",id:b||g++,cache:{},defaultContext:c||d}},on:function(a,b,c){var g,h,d=this,f=d.__msgObj.cache;if(!b)return d;for(a=a.split(e);g=a.shift();)h=f[g]||(f[g]=[]),h.push(b,c);return d},off:function(a,b,c){var g,h,i,d=this,f=d.__msgObj.cache;if(!(a||b||c))return delete d.__msgObj.events,d;for(a=a?a.split(e):Object.keys(f);g=a.shift();)if(h=f[g])if(b||c)for(i=h.length-2;i>=0;i-=2)b&&h[i]!==b||c&&h[i+1]!==c||h.splice(i,2);else delete f[g];return d},__getCaches:function(a){var d,e,b=this,c=b.__msgObj.cache;return f.test(a)?d=c[a]:(d=[],e=RegExp("^@[^\\:]+\\:"+a+"$"),Object.each(c,function(b,c){(a===c||e.test(c))&&(d=d.concat(b))})),d},has:function(a,b,c){var g,d=this,f=(d.__msgObj.cache,d.__getCaches(a));if(!f)return!1;if(!b&&!c)return!0;for(g=f.length-2;g>=0;g-=2)if(!(b&&f[g]!==b||c&&f[g+1]!==c))return!0;return!1},once:function(a,b,c){function e(){b.apply(this,arguments),d.off(a,e,c)}var d=this;d.on(a,e,c)},trigger:function(a){var f,g,h,i,j,l,b=this,c=b.__msgObj.cache,d=b.__msgObj.defaultContext,k=[];for(a=a.split(e),i=1,j=arguments.length;j>i;i++)k[i-1]=arguments[i];for(;f=a.shift();){if(b.log(f+":("+k.join(",")+")"),(g=c.all)&&(g=g.slice()),(h=b.__getCaches(f))&&(h=h.slice()),h)for(i=0,j=h.length;j>i;i+=2)h[i].apply(h[i+1]||d,k);if(g)for(l=[f].concat(k),i=0,j=g.length;j>i;i+=2)g[i].apply(g[i+1]||d,l)}return b},log:function(a){var b=this;console.log("[("+b.__msgObj.id+")"+b.__msgObj.name+"]"+a)}});h.mixTo=function(a){a=a.prototype||a;var b=Events.prototype;Object.extend(a,b)},h.spliterReg=e,h.atReg=f,h.singleton=new h("global"),c.exports=h});