/*!
 Responsive 2.1.1
 2014-2016 SpryMedia Ltd - datatables.net/license
 */
(function (c) {
    "function" === typeof define && define.amd ? define(["jquery", "datatables.net"], function (l) {
        return c(l, window, document)
    }) : "object" === typeof exports ? module.exports = function (l, k) {
        l || (l = window);
        if (!k || !k.fn.dataTable) k = require("datatables.net")(l, k).$;
        return c(k, l, l.document)
    } : c(jQuery, window, document)
})(function (c, l, k, p) {
    var m = c.fn.dataTable, j = function (b, a) {
        if (!m.versionCheck || !m.versionCheck("1.10.3"))throw"DataTables Responsive requires DataTables 1.10.3 or newer";
        this.s = {
            dt: new m.Api(b), columns: [],
            current: []
        };
        this.s.dt.settings()[0].responsive || (a && "string" === typeof a.details ? a.details = {type: a.details} : a && !1 === a.details ? a.details = {type: !1} : a && !0 === a.details && (a.details = {type: "inline"}), this.c = c.extend(!0, {}, j.defaults, m.defaults.responsive, a), b.responsive = this, this._constructor())
    };
    c.extend(j.prototype, {
        _constructor: function () {
            var b = this, a = this.s.dt, d = a.settings()[0], e = c(l).width();
            a.settings()[0]._responsive = this;
            c(l).on("resize.dtr orientationchange.dtr", m.util.throttle(function () {
                var a =
                    c(l).width();
                a !== e && (b._resize(), e = a)
            }));
            d.oApi._fnCallbackReg(d, "aoRowCreatedCallback", function (e) {
                -1 !== c.inArray(!1, b.s.current) && c(">td, >th", e).each(function (e) {
                    e = a.column.index("toData", e);
                    !1 === b.s.current[e] && c(this).css("display", "none")
                })
            });
            a.on("destroy.dtr", function () {
                a.off(".dtr");
                c(a.table().body()).off(".dtr");
                c(l).off("resize.dtr orientationchange.dtr");
                c.each(b.s.current, function (a, e) {
                    !1 === e && b._setColumnVis(a, !0)
                })
            });
            this.c.breakpoints.sort(function (a, b) {
                return a.width < b.width ? 1 : a.width >
                b.width ? -1 : 0
            });
            this._classLogic();
            this._resizeAuto();
            d = this.c.details;
            !1 !== d.type && (b._detailsInit(), a.on("column-visibility.dtr", function () {
                b._classLogic();
                b._resizeAuto();
                b._resize()
            }), a.on("draw.dtr", function () {
                b._redrawChildren()
            }), c(a.table().node()).addClass("dtr-" + d.type));
            a.on("column-reorder.dtr", function () {
                b._classLogic();
                b._resizeAuto();
                b._resize()
            });
            a.on("column-sizing.dtr", function () {
                b._resizeAuto();
                b._resize()
            });
            a.on("preXhr.dtr", function () {
                var e = [];
                a.rows().every(function () {
                    this.child.isShown() &&
                    e.push(this.id(true))
                });
                a.one("draw.dtr", function () {
                    a.rows(e).every(function () {
                        b._detailsDisplay(this, false)
                    })
                })
            });
            a.on("init.dtr", function () {
                b._resizeAuto();
                b._resize();
                c.inArray(false, b.s.current) && a.columns.adjust()
            });
            this._resize()
        }, _columnsVisiblity: function (b) {
            var a = this.s.dt, d = this.s.columns, e, f, g = d.map(function (a, b) {
                return {columnIdx: b, priority: a.priority}
            }).sort(function (a, b) {
                return a.priority !== b.priority ? a.priority - b.priority : a.columnIdx - b.columnIdx
            }), h = c.map(d, function (a) {
                return a.auto &&
                null === a.minWidth ? !1 : !0 === a.auto ? "-" : -1 !== c.inArray(b, a.includeIn)
            }), n = 0;
            e = 0;
            for (f = h.length; e < f; e++)!0 === h[e] && (n += d[e].minWidth);
            e = a.settings()[0].oScroll;
            e = e.sY || e.sX ? e.iBarWidth : 0;
            a = a.table().container().offsetWidth - e - n;
            e = 0;
            for (f = h.length; e < f; e++)d[e].control && (a -= d[e].minWidth);
            n = !1;
            e = 0;
            for (f = g.length; e < f; e++) {
                var i = g[e].columnIdx;
                "-" === h[i] && (!d[i].control && d[i].minWidth) && (n || 0 > a - d[i].minWidth ? (n = !0, h[i] = !1) : h[i] = !0, a -= d[i].minWidth)
            }
            g = !1;
            e = 0;
            for (f = d.length; e < f; e++)if (!d[e].control && !d[e].never &&
                !h[e]) {
                g = !0;
                break
            }
            e = 0;
            for (f = d.length; e < f; e++)d[e].control && (h[e] = g);
            -1 === c.inArray(!0, h) && (h[0] = !0);
            return h
        }, _classLogic: function () {
            var b = this, a = this.c.breakpoints, d = this.s.dt, e = d.columns().eq(0).map(function (a) {
                var b = this.column(a), e = b.header().className, a = d.settings()[0].aoColumns[a].responsivePriority;
                a === p && (b = c(b.header()).data("priority"), a = b !== p ? 1 * b : 1E4);
                return {
                    className: e,
                    includeIn: [],
                    auto: !1,
                    control: !1,
                    never: e.match(/\bnever\b/) ? !0 : !1,
                    priority: a
                }
            }), f = function (a, b) {
                var d = e[a].includeIn;
                -1 ===
                c.inArray(b, d) && d.push(b)
            }, g = function (c, d, i, g) {
                if (i)if ("max-" === i) {
                    g = b._find(d).width;
                    d = 0;
                    for (i = a.length; d < i; d++)a[d].width <= g && f(c, a[d].name)
                } else if ("min-" === i) {
                    g = b._find(d).width;
                    d = 0;
                    for (i = a.length; d < i; d++)a[d].width >= g && f(c, a[d].name)
                } else {
                    if ("not-" === i) {
                        d = 0;
                        for (i = a.length; d < i; d++)-1 === a[d].name.indexOf(g) && f(c, a[d].name)
                    }
                } else e[c].includeIn.push(d)
            };
            e.each(function (b, e) {
                for (var d = b.className.split(" "), f = !1, j = 0, l = d.length; j < l; j++) {
                    var k = c.trim(d[j]);
                    if ("all" === k) {
                        f = !0;
                        b.includeIn = c.map(a, function (a) {
                            return a.name
                        });
                        return
                    }
                    if ("none" === k || b.never) {
                        f = !0;
                        return
                    }
                    if ("control" === k) {
                        f = !0;
                        b.control = !0;
                        return
                    }
                    c.each(a, function (a, b) {
                        var d = b.name.split("-"),
                            c = k.match(RegExp("(min\\-|max\\-|not\\-)?(" + d[0] + ")(\\-[_a-zA-Z0-9])?"));
                        c && (f = !0, c[2] === d[0] && c[3] === "-" + d[1] ? g(e, b.name, c[1], c[2] + c[3]) : c[2] === d[0] && !c[3] && g(e, b.name, c[1], c[2]))
                    })
                }
                f || (b.auto = !0)
            });
            this.s.columns = e
        }, _detailsDisplay: function (b, a) {
            var d = this, e = this.s.dt, f = this.c.details;
            if (f && !1 !== f.type) {
                var g = f.display(b, a, function () {
                    return f.renderer(e, b[0], d._detailsObj(b[0]))
                });
                (!0 === g || !1 === g) && c(e.table().node()).triggerHandler("responsive-display.dt", [e, b, g, a])
            }
        }, _detailsInit: function () {
            var b = this, a = this.s.dt, d = this.c.details;
            "inline" === d.type && (d.target = "td:first-child, th:first-child");
            a.on("draw.dtr", function () {
                b._tabIndexes()
            });
            b._tabIndexes();
            c(a.table().body()).on("keyup.dtr", "td, th", function (b) {
                b.keyCode === 13 && c(this).data("dtr-keyboard") && c(this).click()
            });
            var e = d.target;
            c(a.table().body()).on("click.dtr mousedown.dtr mouseup.dtr", "string" === typeof e ? e : "td, th",
                function (d) {
                    if (c(a.table().node()).hasClass("collapsed") && c.inArray(c(this).closest("tr").get(0), a.rows().nodes().toArray()) !== -1) {
                        if (typeof e === "number") {
                            var g = e < 0 ? a.columns().eq(0).length + e : e;
                            if (a.cell(this).index().column !== g)return
                        }
                        g = a.row(c(this).closest("tr"));
                        d.type === "click" ? b._detailsDisplay(g, false) : d.type === "mousedown" ? c(this).css("outline", "none") : d.type === "mouseup" && c(this).blur().css("outline", "")
                    }
                })
        }, _detailsObj: function (b) {
            var a = this, d = this.s.dt;
            return c.map(this.s.columns, function (e,
                                                   c) {
                if (!e.never && !e.control)return {
                    title: d.settings()[0].aoColumns[c].sTitle,
                    data: d.cell(b, c).render(a.c.orthogonal),
                    hidden: d.column(c).visible() && !a.s.current[c],
                    columnIndex: c,
                    rowIndex: b
                }
            })
        }, _find: function (b) {
            for (var a = this.c.breakpoints, d = 0, c = a.length; d < c; d++)if (a[d].name === b)return a[d]
        }, _redrawChildren: function () {
            var b = this, a = this.s.dt;
            a.rows({page: "current"}).iterator("row", function (c, e) {
                a.row(e);
                b._detailsDisplay(a.row(e), !0)
            })
        }, _resize: function () {
            var b = this, a = this.s.dt, d = c(l).width(), e = this.c.breakpoints,
                f = e[0].name, g = this.s.columns, h, j = this.s.current.slice();
            for (h = e.length - 1; 0 <= h; h--)if (d <= e[h].width) {
                f = e[h].name;
                break
            }
            var i = this._columnsVisiblity(f);
            this.s.current = i;
            e = !1;
            h = 0;
            for (d = g.length; h < d; h++)if (!1 === i[h] && !g[h].never && !g[h].control) {
                e = !0;
                break
            }
            c(a.table().node()).toggleClass("collapsed", e);
            var k = !1;
            a.columns().eq(0).each(function (a, c) {
                i[c] !== j[c] && (k = !0, b._setColumnVis(a, i[c]))
            });
            k && (this._redrawChildren(), c(a.table().node()).trigger("responsive-resize.dt", [a, this.s.current]))
        }, _resizeAuto: function () {
            var b =
                this.s.dt, a = this.s.columns;
            if (this.c.auto && -1 !== c.inArray(!0, c.map(a, function (b) {
                    return b.auto
                }))) {
                b.table().node();
                var d = b.table().node().cloneNode(!1), e = c(b.table().header().cloneNode(!1)).appendTo(d),
                    f = c(b.table().body()).clone(!1, !1).empty().appendTo(d),
                    g = b.columns().header().filter(function (a) {
                        return b.column(a).visible()
                    }).to$().clone(!1).css("display", "table-cell");
                c(f).append(c(b.rows({page: "current"}).nodes()).clone(!1)).find("th, td").css("display", "");
                if (f = b.table().footer()) {
                    var f = c(f.cloneNode(!1)).appendTo(d),
                        h = b.columns().footer().filter(function (a) {
                            return b.column(a).visible()
                        }).to$().clone(!1).css("display", "table-cell");
                    c("<tr/>").append(h).appendTo(f)
                }
                c("<tr/>").append(g).appendTo(e);
                "inline" === this.c.details.type && c(d).addClass("dtr-inline collapsed");
                c(d).find("[name]").removeAttr("name");
                d = c("<div/>").css({width: 1, height: 1, overflow: "hidden"}).append(d);
                d.insertBefore(b.table().node());
                g.each(function (c) {
                    c = b.column.index("fromVisible", c);
                    a[c].minWidth = this.offsetWidth || 0
                });
                d.remove()
            }
        }, _setColumnVis: function (b,
                                    a) {
            var d = this.s.dt, e = a ? "" : "none";
            c(d.column(b).header()).css("display", e);
            c(d.column(b).footer()).css("display", e);
            d.column(b).nodes().to$().css("display", e)
        }, _tabIndexes: function () {
            var b = this.s.dt, a = b.cells({page: "current"}).nodes().to$(), d = b.settings()[0],
                e = this.c.details.target;
            a.filter("[data-dtr-keyboard]").removeData("[data-dtr-keyboard]");
            a = "number" === typeof e ? ":eq(" + e + ")" : e;
            "td:first-child, th:first-child" === a && (a = ">td:first-child, >th:first-child");
            c(a, b.rows({page: "current"}).nodes()).attr("tabIndex",
                d.iTabIndex).data("dtr-keyboard", 1)
        }
    });
    j.breakpoints = [{name: "desktop", width: Infinity}, {name: "tablet-l", width: 1024}, {
        name: "tablet-p",
        width: 768
    }, {name: "mobile-l", width: 480}, {name: "mobile-p", width: 320}];
    j.display = {
        childRow: function (b, a, d) {
            if (a) {
                if (c(b.node()).hasClass("parent"))return b.child(d(), "child").show(), !0
            } else {
                if (b.child.isShown())return b.child(!1), c(b.node()).removeClass("parent"), !1;
                b.child(d(), "child").show();
                c(b.node()).addClass("parent");
                return !0
            }
        }, childRowImmediate: function (b, a, d) {
            if (!a &&
                b.child.isShown() || !b.responsive.hasHidden())return b.child(!1), c(b.node()).removeClass("parent"), !1;
            b.child(d(), "child").show();
            c(b.node()).addClass("parent");
            return !0
        }, modal: function (b) {
            return function (a, d, e) {
                if (d) c("div.dtr-modal-content").empty().append(e()); else {
                    var f = function () {
                            g.remove();
                            c(k).off("keypress.dtr")
                        },
                        g = c('<div class="dtr-modal"/>').append(c('<div class="dtr-modal-display"/>').append(c('<div class="dtr-modal-content"/>').append(e())).append(c('<div class="dtr-modal-close">&times;</div>').click(function () {
                            f()
                        }))).append(c('<div class="dtr-modal-background"/>').click(function () {
                            f()
                        })).appendTo("body");
                    c(k).on("keyup.dtr", function (a) {
                        27 === a.keyCode && (a.stopPropagation(), f())
                    })
                }
                b && b.header && c("div.dtr-modal-content").prepend("<h2>" + b.header(a) + "</h2>")
            }
        }
    };
    j.renderer = {
        listHidden: function () {
            return function (b, a, d) {
                return (b = c.map(d, function (a) {
                    return a.hidden ? '<li data-dtr-index="' + a.columnIndex + '" data-dt-row="' + a.rowIndex + '" data-dt-column="' + a.columnIndex + '"><span class="dtr-title">' + a.title + '</span> <span class="dtr-data">' + a.data + "</span></li>" : ""
                }).join("")) ? c('<ul data-dtr-index="' + a + '" class="dtr-details"/>').append(b) :
                    !1
            }
        }, tableAll: function (b) {
            b = c.extend({tableClass: ""}, b);
            return function (a, d, e) {
                a = c.map(e, function (a) {
                    return '<tr data-dt-row="' + a.rowIndex + '" data-dt-column="' + a.columnIndex + '"><td>' + a.title + ":</td> <td>" + a.data + "</td></tr>"
                }).join("");
                return c('<table class="' + b.tableClass + ' dtr-details" width="100%"/>').append(a)
            }
        }
    };
    j.defaults = {
        breakpoints: j.breakpoints,
        auto: !0,
        details: {display: j.display.childRow, renderer: j.renderer.listHidden(), target: 0, type: "inline"},
        orthogonal: "display"
    };
    var o = c.fn.dataTable.Api;
    o.register("responsive()", function () {
        return this
    });
    o.register("responsive.index()", function (b) {
        b = c(b);
        return {column: b.data("dtr-index"), row: b.parent().data("dtr-index")}
    });
    o.register("responsive.rebuild()", function () {
        return this.iterator("table", function (b) {
            b._responsive && b._responsive._classLogic()
        })
    });
    o.register("responsive.recalc()", function () {
        return this.iterator("table", function (b) {
            b._responsive && (b._responsive._resizeAuto(), b._responsive._resize())
        })
    });
    o.register("responsive.hasHidden()", function () {
        var b =
            this.context[0];
        return b._responsive ? -1 !== c.inArray(!1, b._responsive.s.current) : !1
    });
    j.version = "2.1.1";
    c.fn.dataTable.Responsive = j;
    c.fn.DataTable.Responsive = j;
    c(k).on("preInit.dt.dtr", function (b, a) {
        if ("dt" === b.namespace && (c(a.nTable).hasClass("responsive") || c(a.nTable).hasClass("dt-responsive") || a.oInit.responsive || m.defaults.responsive)) {
            var d = a.oInit.responsive;
            !1 !== d && new j(a, c.isPlainObject(d) ? d : {})
        }
    });
    return j
});