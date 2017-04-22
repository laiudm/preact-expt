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
