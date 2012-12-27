/**
* @fileOverview get fnn with CommonJS!
* @author zhuxun
*/

/**@type {Function} norjs/define function in global scope*/
(function(win, doc, undef) {
	if (win['define']) return;


	var	NS_SEP = '/',
		ID_REG_PREFIX = /^#/,
		ID_REG_POSTFIX = /\-debug$/i
		mix = win['modules'] || (win['modules'] = {}),
		scope = mix,
		defining = mix.__defining,
		cjs = win,
		head = win.head || doc.head
		;

	function parseId(id) {
		return id.replace(ID_REG_PREFIX, '').replace(ID_REG_POSTFIX, '');
	}

	function defineNS(ns, name) {
		return ns[name] || (ns[name] = {});
	}

	function findNS(ns, name) {
		return ns[name];
	}

	function buildRequire(moduleId, dependencies) {
		var innerScope = {},
			moduleIdPath = moduleId.split(NS_SEP)
			;

		moduleIdPath.pop();

		dependencies.forEach(function(depsId) {
			var depsIdPath, resolvedPath, resolvedDepsId, path
				;

			depsId = parseId(depsId);

			if (depsId.indexOf('.') === 0) {
				depsIdPath = depsId.split(NS_SEP);
				resolvedPath = moduleIdPath.slice()

				while ((path = depsIdPath.shift())) {
					if (path === '..') {
						resolvedPath.pop();
					} else if (path !== '.'){
						resolvedPath.push(path);
					}
				}

				resolvedDepsId = resolvedPath.join(NS_SEP);
			}

			if (!(innerScope[depsId] = findNS(scope, resolvedDepsId || depsId))) {
				throw new Error('require a undefined module "' + (resolvedDepsId || depsId) + '" in "' + moduleId + '"');
			}
		});

		return function(id) {
			return require(id, innerScope);
		}
	}

	function define(moduleId, dependencies, factory) {
		var require, module, exports
			;

		moduleId = parseId(moduleId);
		module = defineNS(scope, moduleId);
		exports = module.exports;

		if (exports) {
			throw new Error(moduleId + ' has already defined');
		} else {
			module.id = moduleId;
			exports = module.exports = {};
		}

		require = buildRequire(moduleId, dependencies);

		if (typeof factory === 'function') {
			module.executed = false;
			module.factory = factory;
			module.exports = function() {
				var module = this,
					factory = module.factory
					;

				module.exports = factory(require, module.exports, module) || module.exports;
				module.executed = true;
				delete module.factory;
				return module.exports;
			};
		} else {
			module.executed = true;
			module.exports = factory;
		}
	} 

	function require(moduleId, innerScope) {
		moduleId = parseId(moduleId);

		var module = findNS(innerScope || scope, moduleId)
			;

		if (module && module.exports) {
			return (module.executed ? module.exports : module.exports());
		} else {
			throw new Error(moduleId + ' has not defined');
		}
	}

	function load(url, callback) {
		var script = doc.createElement('script')
			;
		
		script.type = 'text/javascript';
		script.async = true;
		script.onload = script.onreadystatechange  = function() {
			callback && callback();
		}
		script.src = url;
		head.appendChild(script);
	}	

	if (defining) {
		for (var id in defining) {
			var def = defining[id]
				;

			define(id, def.dependencies || [], def.factory);
		}
		delete mix.__defining;
	}

	cjs.define = define;
	cjs.require = require;
	cjs.load = load;
})(window, window.document);