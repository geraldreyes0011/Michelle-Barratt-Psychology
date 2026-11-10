var e = Object.create,
    t = Object.defineProperty,
    n = Object.getOwnPropertyDescriptor,
    r = Object.getOwnPropertyNames,
    i = Object.getPrototypeOf,
    a = Object.prototype.hasOwnProperty,
    o = (e, t) => () => (t || (e((t = {
        exports: {}
    }).exports, t), e = null), t.exports),
    s = (e, n) => {
        let r = {};
        for (var i in e) t(r, i, {
            get: e[i],
            enumerable: !0
        });
        return n || t(r, Symbol.toStringTag, {
            value: `Module`
        }), r
    },
    c = (e, i, o, s) => {
        if (i && typeof i == `object` || typeof i == `function`)
            for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
                get: (e => i[e]).bind(null, d),
                enumerable: !(s = n(i, d)) || s.enumerable
            });
        return e
    },
    l = (n, r, o) => (o = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule || !a.call(n, `default`) ? t(o, `default`, {
        value: n,
        enumerable: !0
    }) : o, n)),
    u = o((e => {
        var t = Symbol.for(`react.transitional.element`),
            n = Symbol.for(`react.portal`),
            r = Symbol.for(`react.fragment`),
            i = Symbol.for(`react.strict_mode`),
            a = Symbol.for(`react.profiler`),
            o = Symbol.for(`react.consumer`),
            s = Symbol.for(`react.context`),
            c = Symbol.for(`react.forward_ref`),
            l = Symbol.for(`react.suspense`),
            u = Symbol.for(`react.memo`),
            d = Symbol.for(`react.lazy`),
            f = Symbol.for(`react.activity`),
            p = Symbol.iterator;

        function m(e) {
            return typeof e != `object` || !e ? null : (e = p && e[p] || e[`@@iterator`], typeof e == `function` ? e : null)
        }
        var h = {
                isMounted: function() {
                    return !1
                },
                enqueueForceUpdate: function() {},
                enqueueReplaceState: function() {},
                enqueueSetState: function() {}
            },
            g = Object.assign,
            _ = {};

        function v(e, t, n) {
            this.props = e, this.context = t, this.refs = _, this.updater = n || h
        }
        v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
            if (typeof e != `object` && typeof e != `function` && e != null) throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);
            this.updater.enqueueSetState(this, e, t, `setState`)
        }, v.prototype.forceUpdate = function(e) {
            this.updater.enqueueForceUpdate(this, e, `forceUpdate`)
        };

        function y() {}
        y.prototype = v.prototype;

        function b(e, t, n) {
            this.props = e, this.context = t, this.refs = _, this.updater = n || h
        }
        var x = b.prototype = new y;
        x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
        var S = Array.isArray;

        function C() {}
        var w = {
                H: null,
                A: null,
                T: null,
                S: null
            },
            T = Object.prototype.hasOwnProperty;

        function E(e, n, r) {
            var i = r.ref;
            return {
                $$typeof: t,
                type: e,
                key: n,
                ref: i === void 0 ? null : i,
                props: r
            }
        }

        function D(e, t) {
            return E(e.type, t, e.props)
        }

        function O(e) {
            return typeof e == `object` && !!e && e.$$typeof === t
        }

        function k(e) {
            var t = {
                "=": `=0`,
                ":": `=2`
            };
            return `$` + e.replace(/[=:]/g, function(e) {
                return t[e]
            })
        }
        var A = /\/+/g;

        function j(e, t) {
            return typeof e == `object` && e && e.key != null ? k(`` + e.key) : t.toString(36)
        }

        function M(e) {
            switch (e.status) {
                case `fulfilled`:
                    return e.value;
                case `rejected`:
                    throw e.reason;
                default:
                    switch (typeof e.status == `string` ? e.then(C, C) : (e.status = `pending`, e.then(function(t) {
                            e.status === `pending` && (e.status = `fulfilled`, e.value = t)
                        }, function(t) {
                            e.status === `pending` && (e.status = `rejected`, e.reason = t)
                        })), e.status) {
                        case `fulfilled`:
                            return e.value;
                        case `rejected`:
                            throw e.reason
                    }
            }
            throw e
        }

        function N(e, r, i, a, o) {
            var s = typeof e;
            (s === `undefined` || s === `boolean`) && (e = null);
            var c = !1;
            if (e === null) c = !0;
            else switch (s) {
                case `bigint`:
                case `string`:
                case `number`:
                    c = !0;
                    break;
                case `object`:
                    switch (e.$$typeof) {
                        case t:
                        case n:
                            c = !0;
                            break;
                        case d:
                            return c = e._init, N(c(e._payload), r, i, a, o)
                    }
            }
            if (c) return o = o(e), c = a === `` ? `.` + j(e, 0) : a, S(o) ? (i = ``, c != null && (i = c.replace(A, `$&/`) + `/`), N(o, r, i, ``, function(e) {
                return e
            })) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? `` : (`` + o.key).replace(A, `$&/`) + `/`) + c)), r.push(o)), 1;
            c = 0;
            var l = a === `` ? `.` : a + `:`;
            if (S(e))
                for (var u = 0; u < e.length; u++) a = e[u], s = l + j(a, u), c += N(a, r, i, s, o);
            else if (u = m(e), typeof u == `function`)
                for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + j(a, u++), c += N(a, r, i, s, o);
            else if (s === `object`) {
                if (typeof e.then == `function`) return N(M(e), r, i, a, o);
                throw r = String(e), Error(`Objects are not valid as a React child (found: ` + (r === `[object Object]` ? `object with keys {` + Object.keys(e).join(`, `) + `}` : r) + `). If you meant to render a collection of children, use an array instead.`)
            }
            return c
        }

        function P(e, t, n) {
            if (e == null) return e;
            var r = [],
                i = 0;
            return N(e, r, ``, ``, function(e) {
                return t.call(n, e, i++)
            }), r
        }

        function F(e) {
            if (e._status === -1) {
                var t = e._result;
                t = t(), t.then(function(t) {
                    (e._status === 0 || e._status === -1) && (e._status = 1, e._result = t)
                }, function(t) {
                    (e._status === 0 || e._status === -1) && (e._status = 2, e._result = t)
                }), e._status === -1 && (e._status = 0, e._result = t)
            }
            if (e._status === 1) return e._result.default;
            throw e._result
        }
        var I = typeof reportError == `function` ? reportError : function(e) {
                if (typeof window == `object` && typeof window.ErrorEvent == `function`) {
                    var t = new window.ErrorEvent(`error`, {
                        bubbles: !0,
                        cancelable: !0,
                        message: typeof e == `object` && e && typeof e.message == `string` ? String(e.message) : String(e),
                        error: e
                    });
                    if (!window.dispatchEvent(t)) return
                } else if (typeof process == `object` && typeof process.emit == `function`) {
                    process.emit(`uncaughtException`, e);
                    return
                }
                console.error(e)
            },
            L = {
                map: P,
                forEach: function(e, t, n) {
                    P(e, function() {
                        t.apply(this, arguments)
                    }, n)
                },
                count: function(e) {
                    var t = 0;
                    return P(e, function() {
                        t++
                    }), t
                },
                toArray: function(e) {
                    return P(e, function(e) {
                        return e
                    }) || []
                },
                only: function(e) {
                    if (!O(e)) throw Error(`React.Children.only expected to receive a single React element child.`);
                    return e
                }
            };
        e.Activity = f, e.Children = L, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
            __proto__: null,
            c: function(e) {
                return w.H.useMemoCache(e)
            }
        }, e.cache = function(e) {
            return function() {
                return e.apply(null, arguments)
            }
        }, e.cacheSignal = function() {
            return null
        }, e.cloneElement = function(e, t, n) {
            if (e == null) throw Error(`The argument must be a React element, but you passed ` + e + `.`);
            var r = g({}, e.props),
                i = e.key;
            if (t != null)
                for (a in t.key !== void 0 && (i = `` + t.key), t) !T.call(t, a) || a === `key` || a === `__self` || a === `__source` || a === `ref` && t.ref === void 0 || (r[a] = t[a]);
            var a = arguments.length - 2;
            if (a === 1) r.children = n;
            else if (1 < a) {
                for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
                r.children = o
            }
            return E(e.type, i, r)
        }, e.createContext = function(e) {
            return e = {
                $$typeof: s,
                _currentValue: e,
                _currentValue2: e,
                _threadCount: 0,
                Provider: null,
                Consumer: null
            }, e.Provider = e, e.Consumer = {
                $$typeof: o,
                _context: e
            }, e
        }, e.createElement = function(e, t, n) {
            var r, i = {},
                a = null;
            if (t != null)
                for (r in t.key !== void 0 && (a = `` + t.key), t) T.call(t, r) && r !== `key` && r !== `__self` && r !== `__source` && (i[r] = t[r]);
            var o = arguments.length - 2;
            if (o === 1) i.children = n;
            else if (1 < o) {
                for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
                i.children = s
            }
            if (e && e.defaultProps)
                for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
            return E(e, a, i)
        }, e.createRef = function() {
            return {
                current: null
            }
        }, e.forwardRef = function(e) {
            return {
                $$typeof: c,
                render: e
            }
        }, e.isValidElement = O, e.lazy = function(e) {
            return {
                $$typeof: d,
                _payload: {
                    _status: -1,
                    _result: e
                },
                _init: F
            }
        }, e.memo = function(e, t) {
            return {
                $$typeof: u,
                type: e,
                compare: t === void 0 ? null : t
            }
        }, e.startTransition = function(e) {
            var t = w.T,
                n = {};
            w.T = n;
            try {
                var r = e(),
                    i = w.S;
                i !== null && i(n, r), typeof r == `object` && r && typeof r.then == `function` && r.then(C, I)
            } catch (e) {
                I(e)
            } finally {
                t !== null && n.types !== null && (t.types = n.types), w.T = t
            }
        }, e.unstable_useCacheRefresh = function() {
            return w.H.useCacheRefresh()
        }, e.use = function(e) {
            return w.H.use(e)
        }, e.useActionState = function(e, t, n) {
            return w.H.useActionState(e, t, n)
        }, e.useCallback = function(e, t) {
            return w.H.useCallback(e, t)
        }, e.useContext = function(e) {
            return w.H.useContext(e)
        }, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
            return w.H.useDeferredValue(e, t)
        }, e.useEffect = function(e, t) {
            return w.H.useEffect(e, t)
        }, e.useEffectEvent = function(e) {
            return w.H.useEffectEvent(e)
        }, e.useId = function() {
            return w.H.useId()
        }, e.useImperativeHandle = function(e, t, n) {
            return w.H.useImperativeHandle(e, t, n)
        }, e.useInsertionEffect = function(e, t) {
            return w.H.useInsertionEffect(e, t)
        }, e.useLayoutEffect = function(e, t) {
            return w.H.useLayoutEffect(e, t)
        }, e.useMemo = function(e, t) {
            return w.H.useMemo(e, t)
        }, e.useOptimistic = function(e, t) {
            return w.H.useOptimistic(e, t)
        }, e.useReducer = function(e, t, n) {
            return w.H.useReducer(e, t, n)
        }, e.useRef = function(e) {
            return w.H.useRef(e)
        }, e.useState = function(e) {
            return w.H.useState(e)
        }, e.useSyncExternalStore = function(e, t, n) {
            return w.H.useSyncExternalStore(e, t, n)
        }, e.useTransition = function() {
            return w.H.useTransition()
        }, e.version = `19.2.8`
    })),
    d = o(((e, t) => {
        t.exports = u()
    }));

function f(e) {
    return e[e.length - 1]
}

function p(e, t) {
    return typeof e == `function` ? e(t) : e
}
var m = Object.prototype.hasOwnProperty;

function h(e) {
    for (let t in e)
        if (m.call(e, t)) return !0;
    return !1
}
var g = () => Object.create(null),
    _ = (e, t) => v(e, t, !0);

function v(e, t, n, r = 0) {
    if (e === t) return e;
    if (r++ > 500) return t;
    let i = Array.isArray(e) && Array.isArray(t);
    if (!i && !(y(e) && y(t))) return t;
    let a = Object.keys(e),
        o = a.length,
        s = Object.keys(t),
        c = s.length;
    if (i ? o !== e.length || c !== t.length || o && f(a) !== `${o-1}` || c && f(s) !== `${c-1}` : o !== Object.getOwnPropertyNames(e).length || c !== Object.getOwnPropertyNames(t).length || Object.getOwnPropertySymbols(t).length) return t;
    let l = 0,
        u, d, p;
    if (i) {
        for (; l < c && (p = l, d = e[p], u = t[p], u = d === u ? d : typeof d == `object` ? v(d, u, n, r) : u, u === d); l++);
        if (l === c && o === c) return e
    } else {
        let i = o === c,
            f = !0;
        for (; l < c; l++) {
            p = s[l], d = e[p];
            let o = t[p];
            u = d === o ? d : typeof d == `object` ? v(d, o, n, r) : o, i &&= u === d && (a[l] === p || m.call(e, p)), f &&= Object.is(u, o), a[l] = u
        }
        if (i) return Object.getOwnPropertySymbols(e).length ? t : e;
        if (f) return t
    }
    let h = i ? s.fill(0) : n ? g() : {};
    for (let o = 0; o < c; o++) p = i ? o : s[o], i ? (d = e[p], o > l && (u = t[p], u = d === u ? d : typeof d == `object` ? v(d, u, n, r) : u), h[p] = o < l ? d : u) : h[p] = a[o];
    return h
}

function y(e) {
    return !e || typeof e != `object` ? !1 : (Object.getPrototypeOf(e)?.constructor ?? Object) === Object
}

function b(e, t, n, r) {
    if (e === t) return !0;
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        for (let i = 0, a = e.length; i < a; i++) {
            let a = e[i],
                o = t[i];
            if (a !== o && !b(a, o, n, r)) return !1
        }
        return !0
    }
    if (y(e) && y(t)) {
        if (n) {
            for (let i in t)
                if ((r || t[i] !== void 0) && !b(e[i], t[i], n, r)) return !1;
            return !0
        }
        let i = 0;
        if (r) i = Object.keys(e).length;
        else
            for (let t in e) e[t] !== void 0 && i++;
        for (let a in t)
            if ((r || t[a] !== void 0) && (i-- === 0 || !b(e[a], t[a], n, r))) return !1;
        return i === 0
    }
    return !1
}

function x(e) {
    return typeof e?.message == `string` ? e.message.startsWith(`Failed to fetch dynamically imported module`) || e.message.startsWith(`error loading dynamically imported module`) || e.message.startsWith(`Importing a module script failed`) : !1
}
var S = /[\x00-\x1f\x7f"<>`{}]/g;

function C(e) {
    return e.replace(S, e => `%` + e.charCodeAt(0).toString(16).toUpperCase().padStart(2, `0`))
}

function w(e) {
    let t;
    try {
        t = decodeURI(e)
    } catch {
        t = e.replaceAll(/%[0-9A-F]{2}/gi, e => {
            try {
                return decodeURI(e)
            } catch {
                return e
            }
        })
    }
    return C(t)
}
var T = [`http:`, `https:`, `mailto:`, `tel:`];

function E(e) {
    if (e[0] !== `/` && e.includes(`:`)) return /^[\x00-\x20]*([a-z][a-z\d+.\t\n\r-]*:)/i.exec(e)?.[1]?.replace(/[\t\n\r]/g, ``).toLowerCase()
}
var D = /^[\x00-\x20]*[\\/][\t\n\r]*[\\/]/;

function O(e, t) {
    if (!e) return !1;
    if (D.test(e)) return !0;
    let n = E(e);
    return n ? !t.has(n) : !1
}
var k = {
        "&": `\\u0026`,
        ">": `\\u003e`,
        "<": `\\u003c`,
        "\u2028": `\\u2028`,
        "\u2029": `\\u2029`
    },
    A = /[&><\u2028\u2029]/g;

function j(e) {
    return e.replace(A, e => k[e])
}

function M(e) {
    if (!e) return e;
    let t = e;
    if (/[%\\\x00-\x1f\x7f]/.test(e)) {
        let n = /%25|%5C/gi,
            r = 0,
            i;
        for (t = ``;
            (i = n.exec(e)) !== null;) t += w(e.slice(r, i.index)) + i[0], r = n.lastIndex;
        t += w(r ? e.slice(r) : e)
    }
    return t
}

function N(e) {
    return /[\s\u0080-\uFFFF]/.test(e) ? e.replace(/\s|[^\u0000-\u007F]/gu, encodeURIComponent) : e
}

function P(e, t) {
    if (e === t) return !0;
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
        if (e[n] !== t[n]) return !1;
    return !0
}

function F(e) {
    return e.replace(/\/{2,}/g, `/`)
}

function I(e) {
    return e === `/` ? e : e.replace(/^\/+/, ``)
}

function L(e) {
    let t = e.length;
    return t > 1 && e[t - 1] === `/` ? e.replace(/\/+$/, ``) : e
}

function R(e) {
    return L(I(e))
}

function z(e, t) {
    return e?.endsWith(`/`) && e !== `/` && e !== `${t}/` ? e.slice(0, -1) : e
}

function B(e, t, n = `never`, r) {
    if (t.includes(`//`) && (t = F(t)), t.startsWith(`/`)) return t.length === 1 || n === `preserve` ? t : n === `always` ? t.endsWith(`/`) ? t : `${t}/` : t.endsWith(`/`) ? t.slice(0, -1) : t;
    let i = t === `.`,
        a;
    if (r) {
        a = i ? e : e + `\0` + t;
        let n = r.get(a);
        if (n) return n
    }
    let o;
    if (i) o = e.split(`/`);
    else {
        for (e.includes(`//`) && (e = F(e)), o = e.split(`/`); o.length > 1 && f(o) === ``;) o.pop();
        let n = t.split(`/`);
        for (let e = 0, t = n.length; e < t; e++) {
            let r = n[e];
            r === `` ? e ? e === t - 1 && o.push(r) : o = [r] : r === `..` ? o.length > 1 ? o.pop() : o = [``] : r === `.` || o.push(r)
        }
    }
    o.length > 1 && (f(o) === `` ? n === `never` && o.pop() : n === `always` && o.push(``));
    let s = o.join(`/`),
        c = (i ? F(s) : s) || `/`;
    return a && r && r.set(a, c), c
}

function V(e) {
    let t = new Map(e.map(e => [encodeURIComponent(e), e])),
        n = new RegExp([...t.keys()].join(`|`).replace(/[.*()]/g, `\\$&`), `g`);
    return e => e.replace(n, e => t.get(e) ?? e)
}

function ee(e) {
    return e == null || e === ``
}

function H(e, t, n) {
    if (typeof t != `string`) return `` + (t ?? void 0);
    let r = e === `_splat`;
    if (r && (!t || /^[a-zA-Z0-9\-._~!/]*$/.test(t))) return t;
    let i = encodeURIComponent(t);
    return r && (i = i.replaceAll(`%2F`, `/`)), n ? n(i) : i
}

function te(e, t, n, r, i) {
    let a = e.endsWith(`/`) ? `/` : ``,
        o = ``;
    for (let e of t) {
        if (typeof e == `string`) {
            o += e;
            continue
        }
        let [t, s, c, l] = e, u = t === 2, d = u && l !== void 0 ? l + a : l, f = n[s];
        if (t !== 3 || f != null) {
            if (i && (i[s] = f, u && (i[`*`] = f)), u && ee(f)) {
                if (c === `/` && !d) continue;
                f = ``
            }
            o += c + H(s, f, r) + (d || ``)
        }
    }
    return o + a || `/`
}
var ne = `Error preloading route! ☝️`,
    re = o((e => {
        var t = Symbol.for(`react.transitional.element`),
            n = Symbol.for(`react.fragment`);

        function r(e, n, r) {
            var i = null;
            if (r !== void 0 && (i = `` + r), n.key !== void 0 && (i = `` + n.key), `key` in n)
                for (var a in r = {}, n) a !== `key` && (r[a] = n[a]);
            else r = n;
            return n = r.ref, {
                $$typeof: t,
                type: e,
                key: i,
                ref: n === void 0 ? null : n,
                props: r
            }
        }
        e.Fragment = n, e.jsx = r, e.jsxs = r
    })),
    ie = o(((e, t) => {
        t.exports = re()
    })),
    U = l(d(), 1),
    ae = ie(),
    oe = () => !0,
    se = () => !1;

function ce({
    children: e,
    fallback: t = null
}) {
    return (0, ae.jsx)(U.Fragment, {
        children: W() ? e : t
    })
}

function W(e = !0) {
    return U.useSyncExternalStore(le, oe, e ? se : oe)
}

function le() {
    return () => {}
}
var G = U.createContext(null);

function K(e) {
    return U.useContext(G)
}
var ue = o((e => {
        var t = d();

        function n(e, t) {
            return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t
        }
        var r = typeof Object.is == `function` ? Object.is : n,
            i = t.useState,
            a = t.useEffect,
            o = t.useLayoutEffect,
            s = t.useDebugValue;

        function c(e, t) {
            var n = t(),
                r = i({
                    inst: {
                        value: n,
                        getSnapshot: t
                    }
                }),
                c = r[0].inst,
                u = r[1];
            return o(function() {
                c.value = n, c.getSnapshot = t, l(c) && u({
                    inst: c
                })
            }, [e, n, t]), a(function() {
                return l(c) && u({
                    inst: c
                }), e(function() {
                    l(c) && u({
                        inst: c
                    })
                })
            }, [e]), s(n), n
        }

        function l(e) {
            var t = e.getSnapshot;
            e = e.value;
            try {
                var n = t();
                return !r(e, n)
            } catch {
                return !0
            }
        }

        function u(e, t) {
            return t()
        }
        var f = typeof window > `u` || window.document === void 0 || window.document.createElement === void 0 ? u : c;
        e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore
    })),
    de = o(((e, t) => {
        t.exports = ue()
    })),
    fe = o((e => {
        var t = d(),
            n = de();

        function r(e, t) {
            return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t
        }
        var i = typeof Object.is == `function` ? Object.is : r,
            a = n.useSyncExternalStore,
            o = t.useRef,
            s = t.useEffect,
            c = t.useMemo,
            l = t.useDebugValue;
        e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
            var d = o(null);
            if (d.current === null) {
                var f = {
                    hasValue: !1,
                    value: null
                };
                d.current = f
            } else f = d.current;
            d = c(function() {
                function e(e) {
                    if (!a) {
                        if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
                            var t = f.value;
                            if (u(t, e)) return s = t
                        }
                        return s = e
                    }
                    if (t = s, i(o, e)) return t;
                    var n = r(e);
                    return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n)
                }
                var a = !1,
                    o, s, c = n === void 0 ? null : n;
                return [function() {
                    return e(t())
                }, c === null ? void 0 : function() {
                    return e(c())
                }]
            }, [t, n, r, u]);
            var p = a(e, d[0], d[1]);
            return s(function() {
                f.hasValue = !0, f.value = p
            }, [p]), l(p), p
        }
    })),
    pe = o(((e, t) => {
        t.exports = fe()
    }))();

function me(e, t) {
    return e === t
}

function he(e, t = e => e, n) {
    let r = n?.compare ?? me,
        i = (0, U.useCallback)(t => {
            let {
                unsubscribe: n
            } = e.subscribe(t);
            return n
        }, [e]),
        a = (0, U.useCallback)(() => e.get(), [e]);
    return (0, pe.useSyncExternalStoreWithSelector)(i, a, a, t, r)
}

function ge(...e) {
    let t = U.useRef(e),
        n = t.current;
    return e.forEach((e, t) => {
        b(n[t], e, !1, !0) || (n[t] = e)
    }), t.current
}

function q(e, t) {
    e.preloadRoute(t).catch(e => {
        console.warn(e), console.warn(ne)
    })
}
var _e = {
    compare: (e, t) => e[0] === t[0] && e[1] === t[1]
};

function ve(e, t) {
    let n = typeof e == `string` && E(e);
    if (n) return t.has(n) ? e : null
}

function ye(e, t, n, r, i) {
    let a = z(e.pathname, r),
        o = z(t.pathname, r);
    return (n?.exact ? a !== o : !(a.startsWith(o) && (a.length === o.length || a[o.length] === `/`))) || (n?.includeSearch ?? !0) && !b(e.search, t.search, !n?.exact, n?.explicitUndefined) ? !1 : !n?.includeHash || i && e.hash === t.hash
}

function be(e, t, n) {
    let r = K(),
        i = U.useRef(null),
        a = U.useCallback(e => {
            if (i.current = e, typeof t == `function`) return t(e);
            t && (t.current = e)
        }, [t]),
        {
            activeOptions: o,
            to: s,
            preload: c,
            preloadDelay: l,
            hashScrollIntoView: u,
            replace: d,
            startTransition: f,
            resetScroll: p,
            viewTransition: m,
            ignoreBlocker: h,
            disabled: g,
            target: _,
            onClick: v,
            onBlur: y,
            onFocus: b,
            onMouseEnter: x,
            onMouseLeave: S,
            onTouchStart: C
        } = e,
        w = W(!!o?.includeHash),
        [T, D, O] = ge(e.search, e.params, o),
        [k, A] = U.useMemo(() => [e, {
            ...e
        }], [r, e.from, e._fromLocation, e.hash, e.to, T, D, e.state, e.mask, e.unsafeRelative]),
        j = U.useMemo(() => {
            let e = ve(s, r.protocolAllowlist);
            if (e !== void 0) {
                let t = [e ?? void 0];
                return () => t
            }
            let t, n;
            return e => {
                k._fromLocation || (A._fromLocation = e);
                let i = r.buildLocation(A),
                    a = Ee(i, r, g);
                return (!t || t[0] !== a) && (t = [a, !(g || a && !E(a)) && void 0], n = [a, !0]), t[1] !== void 0 && ye(e, i, O, r.basepath, w) ? n : t
            }
        }, [O, g, w, k, A, r, s]),
        [M, N] = he(r.stores.location, j, _e),
        P = N === void 0 && M,
        F = g || M === void 0,
        I = U.useRef(!1),
        L = e.reloadDocument || P || F ? !1 : c ?? r.options.defaultPreload,
        R = l ?? r.options.defaultPreloadDelay ?? 0,
        z = U.useCallback(e => {
            let t = e?.isIntersecting;
            if (!(t ?? L === `intent`)) {
                t === !1 && Y(i);
                return
            }
            if (!R) {
                q(r, k);
                return
            }
            J.has(i) || J.set(i, setTimeout(() => {
                J.delete(i), q(r, k)
            }, R))
        }, [r, k, i, L, R]);
    U.useEffect(() => {
        if (!L) return;
        L === `render` && !I.current && (I.current = !0, q(r, k));
        let e = !0,
            t;
        return L === `viewport` && i.current && typeof IntersectionObserver == `function` && (t = new IntersectionObserver(t => {
            e && z(t.pop())
        }, {
            rootMargin: `100px`
        }), t.observe(i.current)), () => {
            e = !1, t?.disconnect(), Y(i)
        }
    }, [r, k, L, z, i]);
    let B = we(e, n);
    if (B.ref = t ? a : i, P) return B.href = P, B;
    let V = e => {
            let t = _ ?? e.currentTarget.getAttribute(`target`);
            !F && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (!t || t === `_self`) && e.button === 0 && (e.preventDefault(), r.navigate({
                ...k,
                replace: d,
                resetScroll: p,
                hashScrollIntoView: u,
                startTransition: f,
                viewTransition: m,
                ignoreBlocker: h
            }))
        },
        ee = () => {
            L === `intent` && q(r, k)
        },
        H = () => {
            L === `intent` && Y(i)
        };
    return B.onClick = X(v, V), B.onBlur = X(y, H), B.onFocus = X(b, z), B.onMouseEnter = X(x, z), B.onMouseLeave = X(S, H), B.onTouchStart = X(C, ee), Te(B, e, N, M, F, n)
}
var xe = {},
    Se = {
        className: `active`
    },
    Ce = new Set([`to`, `params`, `search`, `hash`, `state`, `mask`, `from`, `unsafeRelative`, `_fromLocation`, `reloadDocument`, `preload`, `preloadDelay`, `preloadIntentProximity`, `hashScrollIntoView`, `replace`, `startTransition`, `resetScroll`, `viewTransition`, `ignoreBlocker`, `activeProps`, `inactiveProps`, `activeOptions`, `_asChild`]);

function we(e, t) {
    let n = {};
    for (let r in e) Ce.has(r) || r === `type` && t !== void 0 || r === `disabled` && t === `a` || (n[r] = e[r]);
    return n
}

function Te(e, t, n, r, i, a) {
    let {
        activeProps: o,
        inactiveProps: s,
        className: c,
        style: l,
        target: u
    } = t, d = p(n ? o : s, {}) ?? (n ? Se : xe);
    Object.assign(e, d), e.href = r, a !== `a` && (e.disabled = i), e.target = u;
    let f = d.style;
    (l || f) && (e.style = l && f ? {
        ...l,
        ...f
    } : l || f);
    let m = d.className;
    return (c || m) && (e.className = c ? m ? `${c} ${m}` : c : m), i && (e.role = `link`, e[`aria-disabled`] = !0), n && (e[`data-status`] = `active`, e[`aria-current`] = `page`), e
}
var J = new WeakMap,
    Y = e => {
        clearTimeout(J.get(e)), J.delete(e)
    },
    X = (e, t) => e ? n => n.defaultPrevented || (e(n), n.defaultPrevented || t(n)) : t;

function Ee(e, t, n) {
    if (n) return;
    let r = e.maskedLocation ?? e,
        i = r.external ? r.publicHref : t.history.createHref(r.publicHref) || `/`;
    if (!((r.external || i !== r.publicHref) && O(i, t.protocolAllowlist))) return i
}
var De = U.memo(U.forwardRef((e, t) => {
    let n = e._asChild || `a`,
        r = be(e, t, n),
        i = typeof e.children == `function` ? e.children({
            isActive: r[`data-status`] === `active`
        }) : e.children;
    return U.createElement(n, r, i)
}), Oe);

function Oe(e, t) {
    let n = 0;
    for (let r in t)
        if (n++, e[r] !== t[r] && (!Ce.has(r) || !b(e[r], t[r], !1, !0))) return !1;
    for (let t in e) n--;
    return n === 0
}
var ke = e => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
    Z = (...e) => e.filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t).join(` `).trim(),
    Ae = {
        xmlns: `http://www.w3.org/2000/svg`,
        width: 24,
        height: 24,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: 2,
        strokeLinecap: `round`,
        strokeLinejoin: `round`
    },
    je = (0, U.forwardRef)(({
        color: e = `currentColor`,
        size: t = 24,
        strokeWidth: n = 2,
        absoluteStrokeWidth: r,
        className: i = ``,
        children: a,
        iconNode: o,
        ...s
    }, c) => (0, U.createElement)(`svg`, {
        ref: c,
        ...Ae,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? Number(n) * 24 / Number(t) : n,
        className: Z(`lucide`, i),
        ...s
    }, [...o.map(([e, t]) => (0, U.createElement)(e, t)), ...Array.isArray(a) ? a : [a]])),
    Q = (e, t) => {
        let n = (0, U.forwardRef)(({
            className: n,
            ...r
        }, i) => (0, U.createElement)(je, {
            ref: i,
            iconNode: t,
            className: Z(`lucide-${ke(e)}`, n),
            ...r
        }));
        return n.displayName = `${e}`, n
    },
    Me = Q(`ArrowRight`, [
        [`path`, {
            d: `M5 12h14`,
            key: `1ays0h`
        }],
        [`path`, {
            d: `m12 5 7 7-7 7`,
            key: `xquz4c`
        }]
    ]),
    $ = `https://michellebarrattpsychology.com.au/wp-content/uploads`,
    Ne = {
        "/contact": {
            src: `${$}/2026/05/bpd-therapy-nMKIafJb.webp`,
            alt: `A calm therapy room with warm natural light`
        },
        "/faq": {
            src: `${$}/2022/04/bussiness-people-working-team-office.jpg`,
            alt: `Our team working together in the practice`
        },
        "/topics": {
            src: `${$}/2026/09/when-mental-health-counselling-featured.webp`,
            alt: `Reading about mental health support`
        },
        "/blog": {
            src: `${$}/2023/02/pexels-helena-lopes-708392.jpg`,
            alt: `A quiet moment of reflection`
        },
        "/locations": {
            src: `${$}/2026/06/meaningful-brisbane-psychology-sunflowers-cra.jpg`,
            alt: `Sunflowers in warm afternoon light`
        },
        "/helpful-info": {
            src: `${$}/2026/06/Meaningful-Brisbane-Psychology-hero-sunflower-scaled.webp`,
            alt: `Sunflower field in warm light`
        },
        "/helpful-info/cancellation-policy": {
            src: `${$}/2023/02/pexels-kindel-media-8550841.jpg`,
            alt: `A calm consulting space`
        },
        "/helpful-info/terms-and-conditions": {
            src: `${$}/2023/02/pexels-liza-summer-6382642.jpg`,
            alt: `A quiet room in natural light`
        },
        "/helpful-info/ai-note-taking": {
            src: `${$}/2023/02/pexels-rodnae-productions-6517116.jpg`,
            alt: `A practitioner working at a desk`
        },
        "/helpful-info/privacy-and-confidentiality": {
            src: `${$}/2023/02/pexels-pixabay-415571-scaled-e1676492482426.jpg`,
            alt: `A calm interior with soft light`
        },
        "/helpful-info/sustainability": {
            src: `${$}/2026/06/meaningful-brisbane-psychology-sunflowers-cra.jpg`,
            alt: `Sunflowers in a field`
        },
        "/helpful-info/referrals": {
            src: `${$}/2022/04/bussiness-people-working-team-office.jpg`,
            alt: `A team working together`
        },
        "/helpful-info/crisis-support": {
            src: `${$}/2020/10/trauma.jpg`,
            alt: `A reassuring, supportive space`
        },
        "/helpful-info/assessment-report-writing": {
            src: `${$}/2022/04/bussiness-people-working-team-office.jpg`,
            alt: `Professionals working together`
        },
        "/helpful-info/what-is-mental-health": {
            src: `${$}/2021/03/mental-illness-1525896895.jpg`,
            alt: `Supportive mental health care`
        },
        "/helpful-info/caring-for-your-mental-health": {
            src: `${$}/2026/05/bpd-therapy-nMKIafJb.webp`,
            alt: `A calm, welcoming therapy room`
        },
        "/helpful-info/resilience": {
            src: `${$}/2026/06/Meaningful-Brisbane-Psychology-hero-sunflower-scaled.webp`,
            alt: `Sunflowers standing tall in the sun`
        },
        "/helpful-info/health-and-wellbeing": {
            src: `${$}/2023/02/pexels-helena-lopes-708392.jpg`,
            alt: `Rest and reflection in natural light`
        }
    };

function Pe(e, t) {
    let n = Ne[e];
    if (n) return n;
    if (e.startsWith(`/blog/`)) {
        let e = /<img[^>]*src="([^"]+)"/.exec(t || ``);
        if (e) return {
            src: e[1],
            alt: ``
        }
    }
    return null
}
export {
    x as A, N as C, h as D, E, d as F, o as I, s as L, _ as M, D as N, m as O, v as P, l as R, b as S, p as T, L as _, he as a, g as b, ce as c, F as d, V as f, I as g, R as h, De as i, f as j, O as k, W as l, B as m, Me as n, K as o, te as p, Q as r, G as s, Pe as t, ie as u, T as v, j as w, M as x, P as y
};