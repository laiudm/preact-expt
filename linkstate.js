/* 
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("preact")) : "function" == typeof define && define.amd ? define(["preact"], e) : t.linkState = e(t.preact)
}(this, function(t) {
    function e(t, e, n, o) {
        for (o = 0, e = e.split ? e.split(".") : e; t && o < e.length;) t = t[e[o++]];
        return void 0 === t ? n : t
    }

    function n(t, n, o) {
        var r = n.split(".");
        return function(n) {
            for (var i = n && n.target || this, f = {}, p = f, u = "string" == typeof o ? e(n, o) : i.nodeName ? i.type.match(/^che|rad/) ? i.checked : i.value : n, a = 0; a < r.length - 1; a++) p = p[r[a]] || (p[r[a]] = !a && t.state[r[a]] || {});
            p[r[a]] = u, t.setState(f)
        }
    }
    return t.Component.prototype.linkState = function(t, e) {
        return n(this, t, e)
    }, n
});
//// # sourceMappingURL=polyfill.umd.js.map
// https://github.com/developit/linkstate

*/



// https://github.com/developit/dlv/blob/master/index.js
// library routine to "Safely get a dot-notated path within a nested object, with ability to return a 
// default if the full key path does not exist or the value is undefined

function  delve(obj, key, def, p) {
	p = 0;
	key = key.split ? key.split('.') : key;
	while (obj && p<key.length) obj = obj[key[p++]];
	return obj===undefined ? def : obj;
}

// https://github.com/developit/linkstate/blob/master/src/index.js

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@returns {function} linkedStateHandler
 */
 
function linkState(component, key, eventPath) {
	let path = key.split('.');
	return function(e) {
		let t = e && e.target || this,
			state = {},
			obj = state,
			v = typeof eventPath==='string' ? delve(e, eventPath) : t.nodeName ? (t.type.match(/^che|rad/) ? t.checked : t.value) : e,
			i = 0;
		for ( ; i<path.length-1; i++) {
			obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
		}
		obj[path[i]] = v;
		component.setState(state);
	};
}

// polyfill: https://github.com/developit/linkstate/blob/master/src/polyfill.js
preact.Component.prototype.linkState = function(key, eventPath) {
	return linkState(this, key, eventPath);
};
