/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-xspreadsheet/component/element',[],function () {
    'use strict';
    class Element {
        constructor(tag, className = '') {
            if (typeof tag === 'string') {
                this.el = document.createElement(tag);
                this.el.className = className;
            } else {
                this.el = tag;
            }
            this.data = {};
        }
        data(key, value) {
            if (value !== undefined) {
                this.data[key] = value;
                return this;
            }
            return this.data[key];
        }
        on(eventNames, handler) {
            const [fen, ...oen] = eventNames.split('.');
            let eventName = fen;
            if (eventName === 'mousewheel' && /Firefox/i.test(window.navigator.userAgent)) {
                eventName = 'DOMMouseScroll';
            }
            this.el.addEventListener(eventName, evt => {
                handler(evt);
                for (let i = 0; i < oen.length; i += 1) {
                    const k = oen[i];
                    if (k === 'left' && evt.button !== 0) {
                        return;
                    }
                    if (k === 'right' && evt.button !== 2) {
                        return;
                    }
                    if (k === 'stop') {
                        evt.stopPropagation();
                    }
                }
            });
            return this;
        }
        offset(value) {
            if (value !== undefined) {
                Object.keys(value).forEach(k => {
                    this.css(k, `${ value[k] }px`);
                });
                return this;
            }
            const {offsetTop, offsetLeft, offsetHeight, offsetWidth} = this.el;
            return {
                top: offsetTop,
                left: offsetLeft,
                height: offsetHeight,
                width: offsetWidth
            };
        }
        scroll(v) {
            const {el} = this;
            if (v !== undefined) {
                if (v.left !== undefined) {
                    el.scrollLeft = v.left;
                }
                if (v.top !== undefined) {
                    el.scrollTop = v.top;
                }
            }
            return {
                left: el.scrollLeft,
                top: el.scrollTop
            };
        }
        box() {
            return this.el.getBoundingClientRect();
        }
        parent() {
            return new Element(this.el.parentNode);
        }
        children(...eles) {
            if (arguments.length === 0) {
                return this.el.childNodes;
            }
            eles.forEach(ele => this.child(ele));
            return this;
        }
        removeChild(el) {
            this.el.removeChild(el);
        }
        child(arg) {
            let ele = arg;
            if (typeof arg === 'string') {
                ele = document.createTextNode(arg);
            } else if (arg instanceof Element) {
                ele = arg.el;
            }
            this.el.appendChild(ele);
            return this;
        }
        contains(ele) {
            return this.el.contains(ele);
        }
        className(v) {
            if (v !== undefined) {
                this.el.className = v;
                return this;
            }
            return this.el.className;
        }
        addClass(name) {
            this.el.classList.add(name);
            return this;
        }
        hasClass(name) {
            return this.el.classList.contains(name);
        }
        removeClass(name) {
            this.el.classList.remove(name);
            return this;
        }
        toggle(cls = 'active') {
            return this.toggleClass(cls);
        }
        toggleClass(name) {
            return this.el.classList.toggle(name);
        }
        active(flag = true, cls = 'active') {
            if (flag)
                this.addClass(cls);
            else
                this.removeClass(cls);
            return this;
        }
        checked(flag = true) {
            this.active(flag, 'checked');
            return this;
        }
        disabled(flag = true) {
            if (flag)
                this.addClass('disabled');
            else
                this.removeClass('disabled');
            return this;
        }
        attr(key, value) {
            if (value !== undefined) {
                this.el.setAttribute(key, value);
            } else {
                if (typeof key === 'string') {
                    return this.el.getAttribute(key);
                }
                Object.keys(key).forEach(k => {
                    this.el.setAttribute(k, key[k]);
                });
            }
            return this;
        }
        removeAttr(key) {
            this.el.removeAttribute(key);
            return this;
        }
        html(content) {
            if (content !== undefined) {
                this.el.innerHTML = content;
                return this;
            }
            return this.el.innerHTML;
        }
        val(v) {
            if (v !== undefined) {
                this.el.value = v;
                return this;
            }
            return this.el.value;
        }
        focus() {
            this.el.focus();
        }
        cssRemoveKeys(...keys) {
            keys.forEach(k => this.el.style.removeProperty(k));
            return this;
        }
        css(name, value) {
            if (value === undefined && typeof name !== 'string') {
                Object.keys(name).forEach(k => {
                    this.el.style[k] = name[k];
                });
                return this;
            }
            if (value !== undefined) {
                this.el.style[name] = value;
                return this;
            }
            return this.el.style[name];
        }
        computedStyle() {
            return window.getComputedStyle(this.el, null);
        }
        show() {
            this.css('display', 'block');
            return this;
        }
        hide() {
            this.css('display', 'none');
            return this;
        }
    }
    const h = (tag, className = '') => new Element(tag, className);
    return {
        Element,
        h
    };
});
define('skylark-xspreadsheet/core/alphabet',[],function () {
    'use strict';
    const alphabets = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
    ];

    /** index number 2 letters
     * @example stringAt(26) ==> 'AA'
     * @date 2019-10-10
     * @export
     * @param {number} index
     * @returns {string}
     */
    function stringAt(index) {
        let str = '';
        let cindex = index;
        while (cindex >= alphabets.length) {
            cindex /= alphabets.length;
            cindex -= 1;
            str += alphabets[parseInt(cindex, 10) % alphabets.length];
        }
        const last = index % alphabets.length;
        str += alphabets[last];
        return str;
    }

    /** translate letter in A1-tag to number
     * @date 2019-10-10
     * @export
     * @param {string} str "AA" in A1-tag "AA1"
     * @returns {number}
     */
    function indexAt(str) {
        let ret = 0;
        for (let i = 0; i < str.length - 1; i += 1) {
            const cindex = str.charCodeAt(i) - 65;
            const exponet = str.length - 1 - i;
            ret += alphabets.length ** exponet + alphabets.length * cindex;
        }
        ret += str.charCodeAt(str.length - 1) - 65;
        return ret;
    }


    // B10 => x,y
    /** translate A1-tag to XY-tag
     * @date 2019-10-10
     * @export
     * @param {tagA1} src
     * @returns {tagXY}
     */
    function expr2xy(src) {
        let x = '';
        let y = '';
        for (let i = 0; i < src.length; i += 1) {
            if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
                y += src.charAt(i);
            } else {
                x += src.charAt(i);
            }
        }
        return [
            indexAt(x),
            parseInt(y, 10) - 1
        ];
    }

/** translate XY-tag to A1-tag
 * @example x,y => B10
 * @date 2019-10-10
 * @export
 * @param {number} x
 * @param {number} y
 * @returns {tagA1}
 */
    function xy2expr(x, y) {
        return `${ stringAt(x) }${ y + 1 }`;
    }

/** translate A1-tag src by (xn, yn)
 * @date 2019-10-10
 * @export
 * @param {tagA1} src
 * @param {number} xn
 * @param {number} yn
 * @returns {tagA1}
 */
    function expr2expr(src, xn, yn, condition = () => true) {
        if (xn === 0 && yn === 0)
            return src;
        const [x, y] = expr2xy(src);
        if (!condition(x, y))
            return src;
        return xy2expr(x + xn, y + yn);
    }
    return {
        stringAt,
        indexAt,
        expr2xy,
        xy2expr,
        expr2expr
    };
});
define('skylark-xspreadsheet/core/cell_range',['./alphabet'], function (m_alphabet) {
    'use strict';
    class CellRange {
        constructor(sri, sci, eri, eci, w = 0, h = 0) {
            this.sri = sri;
            this.sci = sci;
            this.eri = eri;
            this.eci = eci;
            this.w = w;
            this.h = h;
        }
        set(sri, sci, eri, eci) {
            this.sri = sri;
            this.sci = sci;
            this.eri = eri;
            this.eci = eci;
        }
        multiple() {
            return this.eri - this.sri > 0 || this.eci - this.sci > 0;
        }
        includes(...args) {
            let [ri, ci] = [
                0,
                0
            ];
            if (args.length === 1) {
                [ci, ri] = m_alphabet.expr2xy(args[0]);
            } else if (args.length === 2) {
                [ri, ci] = args;
            }
            const {sri, sci, eri, eci} = this;
            return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
        }
        each(cb, rowFilter = () => true) {
            const {sri, sci, eri, eci} = this;
            for (let i = sri; i <= eri; i += 1) {
                if (rowFilter(i)) {
                    for (let j = sci; j <= eci; j += 1) {
                        cb(i, j);
                    }
                }
            }
        }
        contains(other) {
            return this.sri <= other.sri && this.sci <= other.sci && this.eri >= other.eri && this.eci >= other.eci;
        }
        within(other) {
            return this.sri >= other.sri && this.sci >= other.sci && this.eri <= other.eri && this.eci <= other.eci;
        }
        disjoint(other) {
            return this.sri > other.eri || this.sci > other.eci || other.sri > this.eri || other.sci > this.eci;
        }
        intersects(other) {
            return this.sri <= other.eri && this.sci <= other.eci && other.sri <= this.eri && other.sci <= this.eci;
        }
        union(other) {
            const {sri, sci, eri, eci} = this;
            return new CellRange(other.sri < sri ? other.sri : sri, other.sci < sci ? other.sci : sci, other.eri > eri ? other.eri : eri, other.eci > eci ? other.eci : eci);
        }
        difference(other) {
            const ret = [];
            const addRet = (sri, sci, eri, eci) => {
                ret.push(new CellRange(sri, sci, eri, eci));
            };
            const {sri, sci, eri, eci} = this;
            const dsr = other.sri - sri;
            const dsc = other.sci - sci;
            const der = eri - other.eri;
            const dec = eci - other.eci;
            if (dsr > 0) {
                addRet(sri, sci, other.sri - 1, eci);
                if (der > 0) {
                    addRet(other.eri + 1, sci, eri, eci);
                    if (dsc > 0) {
                        addRet(other.sri, sci, other.eri, other.sci - 1);
                    }
                    if (dec > 0) {
                        addRet(other.sri, other.eci + 1, other.eri, eci);
                    }
                } else {
                    if (dsc > 0) {
                        addRet(other.sri, sci, eri, other.sci - 1);
                    }
                    if (dec > 0) {
                        addRet(other.sri, other.eci + 1, eri, eci);
                    }
                }
            } else if (der > 0) {
                addRet(other.eri + 1, sci, eri, eci);
                if (dsc > 0) {
                    addRet(sri, sci, other.eri, other.sci - 1);
                }
                if (dec > 0) {
                    addRet(sri, other.eci + 1, other.eri, eci);
                }
            }
            if (dsc > 0) {
                addRet(sri, sci, eri, other.sci - 1);
                if (dec > 0) {
                    addRet(sri, other.eri + 1, eri, eci);
                    if (dsr > 0) {
                        addRet(sri, other.sci, other.sri - 1, other.eci);
                    }
                    if (der > 0) {
                        addRet(other.sri + 1, other.sci, eri, other.eci);
                    }
                } else {
                    if (dsr > 0) {
                        addRet(sri, other.sci, other.sri - 1, eci);
                    }
                    if (der > 0) {
                        addRet(other.sri + 1, other.sci, eri, eci);
                    }
                }
            } else if (dec > 0) {
                addRet(eri, other.eci + 1, eri, eci);
                if (dsr > 0) {
                    addRet(sri, sci, other.sri - 1, other.eci);
                }
                if (der > 0) {
                    addRet(other.eri + 1, sci, eri, other.eci);
                }
            }
            return ret;
        }
        size() {
            return [
                this.eri - this.sri + 1,
                this.eci - this.sci + 1
            ];
        }
        toString() {
            const {sri, sci, eri, eci} = this;
            let ref = m_alphabet.xy2expr(sci, sri);
            if (this.multiple()) {
                ref = `${ ref }:${ m_alphabet.xy2expr(eci, eri) }`;
            }
            return ref;
        }
        clone() {
            const {sri, sci, eri, eci, w, h} = this;
            return new CellRange(sri, sci, eri, eci, w, h);
        }
        equals(other) {
            return this.eri === other.eri && this.eci === other.eci && this.sri === other.sri && this.sci === other.sci;
        }
        static valueOf(ref) {
            const refs = ref.split(':');
            const [sci, sri] = m_alphabet.expr2xy(refs[0]);
            let [eri, eci] = [
                sri,
                sci
            ];
            if (refs.length > 1) {
                [eci, eri] = m_alphabet.expr2xy(refs[1]);
            }
            return new CellRange(sri, sci, eri, eci);
        }
    }

    return {
        CellRange
    };
});
define('skylark-xspreadsheet/core/selector',[
    './cell_range'
], function (m_cell_range) {
    'use strict';
    class Selector {
        constructor() {
            this.range = new m_cell_range.CellRange(0, 0, 0, 0);
            this.ri = 0;
            this.ci = 0;
        }
        multiple() {
            return this.range.multiple();
        }
        setIndexes(ri, ci) {
            this.ri = ri;
            this.ci = ci;
        }
        size() {
            return this.range.size();
        }
    }

    return Selector;
});
define('skylark-xspreadsheet/core/scroll',[],function () {
    'use strict';
     class Scroll {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.ri = 0;
            this.ci = 0;
        }
    }

    return Scroll;
});
define('skylark-xspreadsheet/core/history',[],function () {
    'use strict';
    return class History {
        constructor() {
            this.undoItems = [];
            this.redoItems = [];
        }
        add(data) {
            this.undoItems.push(JSON.stringify(data));
            this.redoItems = [];
        }
        canUndo() {
            return this.undoItems.length > 0;
        }
        canRedo() {
            return this.redoItems.length > 0;
        }
        undo(currentd, cb) {
            const {undoItems, redoItems} = this;
            if (this.canUndo()) {
                redoItems.push(JSON.stringify(currentd));
                cb(JSON.parse(undoItems.pop()));
            }
        }
        redo(currentd, cb) {
            const {undoItems, redoItems} = this;
            if (this.canRedo()) {
                undoItems.push(JSON.stringify(currentd));
                cb(JSON.parse(redoItems.pop()));
            }
        }
    };
});
define('skylark-xspreadsheet/core/clipboard',[],function () {
    'use strict';
    class Clipboard {
        constructor() {
            this.range = null;
            this.state = 'clear';
        }
        copy(cellRange) {
            this.range = cellRange;
            this.state = 'copy';
            return this;
        }
        cut(cellRange) {
            this.range = cellRange;
            this.state = 'cut';
            return this;
        }
        isCopy() {
            return this.state === 'copy';
        }
        isCut() {
            return this.state === 'cut';
        }
        isClear() {
            return this.state === 'clear';
        }
        clear() {
            this.range = null;
            this.state = 'clear';
        }
    }

    return Clipboard;
});
define('skylark-xspreadsheet/core/auto_filter',[
    './cell_range'
], function (m_cell_range) {
    'use strict';

// operator: all|eq|neq|gt|gte|lt|lte|in|be
// value:
//   in => []
//   be => [min, max]
    class Filter {
        constructor(ci, operator, value) {
            this.ci = ci;
            this.operator = operator;
            this.value = value;
        }
        set(operator, value) {
            this.operator = operator;
            this.value = value;
        }
        includes(v) {
            const {operator, value} = this;
            if (operator === 'all') {
                return true;
            }
            if (operator === 'in') {
                return value.includes(v);
            }
            return false;
        }
        vlength() {
            const {operator, value} = this;
            if (operator === 'in') {
                return value.length;
            }
            return 0;
        }
        getData() {
            const {ci, operator, value} = this;
            return {
                ci,
                operator,
                value
            };
        }
    }
    class Sort {
        constructor(ci, order) {
            this.ci = ci;
            this.order = order;
        }
        asc() {
            return this.order === 'asc';
        }
        desc() {
            return this.order === 'desc';
        }
    }
    class AutoFilter {
        constructor() {
            this.ref = null;
            this.filters = [];
            this.sort = null;
        }
        setData({ref, filters, sort}) {
            if (ref != null) {
                this.ref = ref;
                this.fitlers = filters.map(it => new Filter(it.ci, it.operator, it.value));
                if (sort) {
                    this.sort = new Sort(sort.ci, sort.order);
                }
            }
        }
        getData() {
            if (this.active()) {
                const {ref, filters, sort} = this;
                return {
                    ref,
                    filters: filters.map(it => it.getData()),
                    sort
                };
            }
            return {};
        }
        addFilter(ci, operator, value) {
            const filter = this.getFilter(ci);
            if (filter == null) {
                this.filters.push(new Filter(ci, operator, value));
            } else {
                filter.set(operator, value);
            }
        }
        setSort(ci, order) {
            this.sort = order ? new Sort(ci, order) : null;
        }
        includes(ri, ci) {
            if (this.active()) {
                return this.hrange().includes(ri, ci);
            }
            return false;
        }
        getSort(ci) {
            const {sort} = this;
            if (sort && sort.ci === ci) {
                return sort;
            }
            return null;
        }
        getFilter(ci) {
            const {filters} = this;
            for (let i = 0; i < filters.length; i += 1) {
                if (filters[i].ci === ci) {
                    return filters[i];
                }
            }
            return null;
        }
        filteredRows(getCell) {
            const rset = new Set();
            const fset = new Set();
            if (this.active()) {
                const {sri, eri} = this.range();
                const {filters} = this;
                for (let ri = sri + 1; ri <= eri; ri += 1) {
                    for (let i = 0; i < filters.length; i += 1) {
                        const filter = filters[i];
                        const cell = getCell(ri, filter.ci);
                        const ctext = cell ? cell.text : '';
                        if (!filter.includes(ctext)) {
                            rset.add(ri);
                            break;
                        } else {
                            fset.add(ri);
                        }
                    }
                }
            }
            return {
                rset,
                fset
            };
        }
        items(ci, getCell) {
            const m = {};
            if (this.active()) {
                const {sri, eri} = this.range();
                for (let ri = sri + 1; ri <= eri; ri += 1) {
                    const cell = getCell(ri, ci);
                    if (cell !== null && !/^\s*$/.test(cell.text)) {
                        const key = cell.text;
                        const cnt = (m[key] || 0) + 1;
                        m[key] = cnt;
                    } else {
                        m[''] = (m[''] || 0) + 1;
                    }
                }
            }
            return m;
        }
        range() {
            return m_cell_range.CellRange.valueOf(this.ref);
        }
        hrange() {
            const r = this.range();
            r.eri = r.sri;
            return r;
        }
        clear() {
            this.ref = null;
            this.filters = [];
            this.sort = null;
        }
        active() {
            return this.ref !== null;
        }
    };

    return AutoFilter;
});
define('skylark-xspreadsheet/core/merge',['./cell_range'], function (m_cell_range) {
    'use strict';
    class Merges {
        constructor(d = []) {
            this._ = d;
        }
        forEach(cb) {
            this._.forEach(cb);
        }
        deleteWithin(cr) {
            this._ = this._.filter(it => !it.within(cr));
        }
        getFirstIncludes(ri, ci) {
            for (let i = 0; i < this._.length; i += 1) {
                const it = this._[i];
                if (it.includes(ri, ci)) {
                    return it;
                }
            }
            return null;
        }
        filterIntersects(cellRange) {
            return new Merges(this._.filter(it => it.intersects(cellRange)));
        }
        intersects(cellRange) {
            for (let i = 0; i < this._.length; i += 1) {
                const it = this._[i];
                if (it.intersects(cellRange)) {
                    return true;
                }
            }
            return false;
        }
        union(cellRange) {
            let cr = cellRange;
            this._.forEach(it => {
                if (it.intersects(cr)) {
                    cr = it.union(cr);
                }
            });
            return cr;
        }
        add(cr) {
            this.deleteWithin(cr);
            this._.push(cr);
        }
        shift(type, index, n, cbWithin) {
            this._.forEach(cellRange => {
                const {sri, sci, eri, eci} = cellRange;
                const range = cellRange;
                if (type === 'row') {
                    if (sri >= index) {
                        range.sri += n;
                        range.eri += n;
                    } else if (sri < index && index <= eri) {
                        range.eri += n;
                        cbWithin(sri, sci, n, 0);
                    }
                } else if (type === 'column') {
                    if (sci >= index) {
                        range.sci += n;
                        range.eci += n;
                    } else if (sci < index && index <= eci) {
                        range.eci += n;
                        cbWithin(sri, sci, 0, n);
                    }
                }
            });
        }
        move(cellRange, rn, cn) {
            this._.forEach(it1 => {
                const it = it1;
                if (it.within(cellRange)) {
                    it.eri += rn;
                    it.sri += rn;
                    it.sci += cn;
                    it.eci += cn;
                }
            });
        }
        setData(merges) {
            this._ = merges.map(merge => m_cell_range.CellRange.valueOf(merge));
            return this;
        }
        getData() {
            return this._.map(merge => merge.toString());
        }
    }
    return {
        Merges
    };
});
define('skylark-xspreadsheet/core/helper',[],function () {
    'use strict';
    function cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    const mergeDeep = (object = {}, ...sources) => {
        sources.forEach(source => {
            Object.keys(source).forEach(key => {
                const v = source[key];
                if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                    object[key] = v;
                } else if (typeof v !== 'function' && !Array.isArray(v) && v instanceof Object) {
                    object[key] = object[key] || {};
                    mergeDeep(object[key], v);
                } else {
                    object[key] = v;
                }
            });
        });
        return object;
    };
    function equals(obj1, obj2) {
        const keys = Object.keys(obj1);
        if (keys.length !== Object.keys(obj2).length)
            return false;
        for (let i = 0; i < keys.length; i += 1) {
            const k = keys[i];
            const v1 = obj1[k];
            const v2 = obj2[k];
            if (v2 === undefined)
                return false;
            if (typeof v1 === 'string' || typeof v1 === 'number' || typeof v1 === 'boolean') {
                if (v1 !== v2)
                    return false;
            } else if (Array.isArray(v1)) {
                if (v1.length !== v2.length)
                    return false;
                for (let ai = 0; ai < v1.length; ai += 1) {
                    if (!equals(v1[ai], v2[ai]))
                        return false;
                }
            } else if (typeof v1 !== 'function' && !Array.isArray(v1) && v1 instanceof Object) {
                if (!equals(v1, v2))
                    return false;
            }
        }
        return true;
    }
    const sum = (objOrAry, cb = value => value) => {
        let total = 0;
        let size = 0;
        Object.keys(objOrAry).forEach(key => {
            total += cb(objOrAry[key], key);
            size += 1;
        });
        return [
            total,
            size
        ];
    };
    function deleteProperty(obj, property) {
        const oldv = obj[`${ property }`];
        delete obj[`${ property }`];
        return oldv;
    }
    function rangeReduceIf(min, max, inits, initv, ifv, getv) {
        let s = inits;
        let v = initv;
        let i = min;
        for (; i < max; i += 1) {
            if (s > ifv)
                break;
            v = getv(i);
            s += v;
        }
        return [
            i,
            s - v,
            v
        ];
    }
    function rangeSum(min, max, getv) {
        let s = 0;
        for (let i = min; i < max; i += 1) {
            s += getv(i);
        }
        return s;
    }
    function rangeEach(min, max, cb) {
        for (let i = min; i < max; i += 1) {
            cb(i);
        }
    }
    function arrayEquals(a1, a2) {
        if (a1.length === a2.length) {
            for (let i = 0; i < a1.length; i += 1) {
                if (a1[i] !== a2[i])
                    return false;
            }
        } else
            return false;
        return true;
    }
    function digits(a) {
        const v = `${ a }`;
        let ret = 0;
        let flag = false;
        for (let i = 0; i < v.length; i += 1) {
            if (flag === true)
                ret += 1;
            if (v.charAt(i) === '.')
                flag = true;
        }
        return ret;
    }
    function numberCalc(type, a1, a2) {
        if (Number.isNaN(a1) || Number.isNaN(a2)) {
            return a1 + type + a2;
        }
        const al1 = digits(a1);
        const al2 = digits(a2);
        const num1 = Number(a1);
        const num2 = Number(a2);
        let ret = 0;
        if (type === '-') {
            ret = num1 - num2;
        } else if (type === '+') {
            ret = num1 + num2;
        } else if (type === '*') {
            ret = num1 * num2;
        } else if (type === '/') {
            ret = num1 / num2;
            if (digits(ret) > 5)
                return ret.toFixed(2);
            return ret;
        }
        return ret.toFixed(Math.max(al1, al2));
    }
    return {
        cloneDeep,
        merge: (...sources) => mergeDeep({}, ...sources),
        equals,
        arrayEquals,
        sum,
        rangeEach,
        rangeSum,
        rangeReduceIf,
        deleteProperty,
        numberCalc
    };
});
define('skylark-xspreadsheet/core/row',[
    './helper',
    './alphabet'
], function (helper, m_alphabet) {
    'use strict';
    class Rows {
        constructor({len, height}) {
            this._ = {};
            this.len = len;
            this.height = height;
        }
        getHeight(ri) {
            if (this.isHide(ri))
                return 0;
            const row = this.get(ri);
            if (row && row.height) {
                return row.height;
            }
            return this.height;
        }
        setHeight(ri, v) {
            const row = this.getOrNew(ri);
            row.height = v;
        }
        unhide(idx) {
            let index = idx;
            while (index > 0) {
                index -= 1;
                if (this.isHide(index)) {
                    this.setHide(index, false);
                } else
                    break;
            }
        }
        isHide(ri) {
            const row = this.get(ri);
            return row && row.hide;
        }
        setHide(ri, v) {
            const row = this.getOrNew(ri);
            if (v === true)
                row.hide = true;
            else
                delete row.hide;
        }
        setStyle(ri, style) {
            const row = this.getOrNew(ri);
            row.style = style;
        }
        sumHeight(min, max, exceptSet) {
            return helper.rangeSum(min, max, i => {
                if (exceptSet && exceptSet.has(i))
                    return 0;
                return this.getHeight(i);
            });
        }
        totalHeight() {
            return this.sumHeight(0, this.len);
        }
        get(ri) {
            return this._[ri];
        }
        getOrNew(ri) {
            this._[ri] = this._[ri] || { cells: {} };
            return this._[ri];
        }
        getCell(ri, ci) {
            const row = this.get(ri);
            if (row !== undefined && row.cells !== undefined && row.cells[ci] !== undefined) {
                return row.cells[ci];
            }
            return null;
        }
        getCellMerge(ri, ci) {
            const cell = this.getCell(ri, ci);
            if (cell && cell.merge)
                return cell.merge;
            return [
                0,
                0
            ];
        }
        getCellOrNew(ri, ci) {
            const row = this.getOrNew(ri);
            row.cells[ci] = row.cells[ci] || {};
            return row.cells[ci];
        }
        setCell(ri, ci, cell, what = 'all') {
            const row = this.getOrNew(ri);
            if (what === 'all') {
                row.cells[ci] = cell;
            } else if (what === 'text') {
                row.cells[ci] = row.cells[ci] || {};
                row.cells[ci].text = cell.text;
            } else if (what === 'format') {
                row.cells[ci] = row.cells[ci] || {};
                row.cells[ci].style = cell.style;
                if (cell.merge)
                    row.cells[ci].merge = cell.merge;
            }
        }
        setCellText(ri, ci, text) {
            const cell = this.getCellOrNew(ri, ci);
            cell.text = text;
        }
        copyPaste(srcCellRange, dstCellRange, what, autofill = false, cb = () => {
        }) {
            const {sri, sci, eri, eci} = srcCellRange;
            const dsri = dstCellRange.sri;
            const dsci = dstCellRange.sci;
            const deri = dstCellRange.eri;
            const deci = dstCellRange.eci;
            const [rn, cn] = srcCellRange.size();
            const [drn, dcn] = dstCellRange.size();
            let isAdd = true;
            let dn = 0;
            if (deri < sri || deci < sci) {
                isAdd = false;
                if (deri < sri)
                    dn = drn;
                else
                    dn = dcn;
            }
            for (let i = sri; i <= eri; i += 1) {
                if (this._[i]) {
                    for (let j = sci; j <= eci; j += 1) {
                        if (this._[i].cells && this._[i].cells[j]) {
                            for (let ii = dsri; ii <= deri; ii += rn) {
                                for (let jj = dsci; jj <= deci; jj += cn) {
                                    const nri = ii + (i - sri);
                                    const nci = jj + (j - sci);
                                    const ncell = helper.cloneDeep(this._[i].cells[j]);
                                    if (autofill && ncell && ncell.text && ncell.text.length > 0) {
                                        const {text} = ncell;
                                        let n = jj - dsci + (ii - dsri) + 2;
                                        if (!isAdd) {
                                            n -= dn + 1;
                                        }
                                        if (text[0] === '=') {
                                            ncell.text = text.replace(/[a-zA-Z]{1,3}\d+/g, word => {
                                                let [xn, yn] = [
                                                    0,
                                                    0
                                                ];
                                                if (sri === dsri) {
                                                    xn = n - 1;
                                                } else {
                                                    yn = n - 1;
                                                }
                                                if (/^\d+$/.test(word))
                                                    return word;
                                                return m_alphabet.expr2expr(word, xn, yn);
                                            });
                                        } else if (rn <= 1 && cn > 1 && (dsri > eri || deri < sri) || cn <= 1 && rn > 1 && (dsci > eci || deci < sci) || rn <= 1 && cn <= 1) {
                                            const result = /[\\.\d]+$/.exec(text);
                                            if (result !== null) {
                                                const index = Number(result[0]) + n - 1;
                                                ncell.text = text.substring(0, result.index) + index;
                                            }
                                        }
                                    }
                                    this.setCell(nri, nci, ncell, what);
                                    cb(nri, nci, ncell);
                                }
                            }
                        }
                    }
                }
            }
        }
        cutPaste(srcCellRange, dstCellRange) {
            const ncellmm = {};
            this.each(ri => {
                this.eachCells(ri, ci => {
                    let nri = parseInt(ri, 10);
                    let nci = parseInt(ci, 10);
                    if (srcCellRange.includes(ri, ci)) {
                        nri = dstCellRange.sri + (nri - srcCellRange.sri);
                        nci = dstCellRange.sci + (nci - srcCellRange.sci);
                    }
                    ncellmm[nri] = ncellmm[nri] || { cells: {} };
                    ncellmm[nri].cells[nci] = this._[ri].cells[ci];
                });
            });
            this._ = ncellmm;
        }
        paste(src, dstCellRange) {
            if (src.length <= 0)
                return;
            const {sri, sci} = dstCellRange;
            src.forEach((row, i) => {
                const ri = sri + i;
                row.forEach((cell, j) => {
                    const ci = sci + j;
                    this.setCellText(ri, ci, cell);
                });
            });
        }
        insert(sri, n = 1) {
            const ndata = {};
            this.each((ri, row) => {
                let nri = parseInt(ri, 10);
                if (nri >= sri) {
                    nri += n;
                    this.eachCells(ri, (ci, cell) => {
                        if (cell.text && cell.text[0] === '=') {
                            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => m_alphabet.expr2expr(word, 0, n, (x, y) => y >= sri));
                        }
                    });
                }
                ndata[nri] = row;
            });
            this._ = ndata;
            this.len += n;
        }
        delete(sri, eri) {
            const n = eri - sri + 1;
            const ndata = {};
            this.each((ri, row) => {
                const nri = parseInt(ri, 10);
                if (nri < sri) {
                    ndata[nri] = row;
                } else if (ri > eri) {
                    ndata[nri - n] = row;
                    this.eachCells(ri, (ci, cell) => {
                        if (cell.text && cell.text[0] === '=') {
                            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => m_alphabet.expr2expr(word, 0, -n, (x, y) => y > eri));
                        }
                    });
                }
            });
            this._ = ndata;
            this.len -= n;
        }
        insertColumn(sci, n = 1) {
            this.each((ri, row) => {
                const rndata = {};
                this.eachCells(ri, (ci, cell) => {
                    let nci = parseInt(ci, 10);
                    if (nci >= sci) {
                        nci += n;
                        if (cell.text && cell.text[0] === '=') {
                            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => m_alphabet.expr2expr(word, n, 0, x => x >= sci));
                        }
                    }
                    rndata[nci] = cell;
                });
                row.cells = rndata;
            });
        }
        deleteColumn(sci, eci) {
            const n = eci - sci + 1;
            this.each((ri, row) => {
                const rndata = {};
                this.eachCells(ri, (ci, cell) => {
                    const nci = parseInt(ci, 10);
                    if (nci < sci) {
                        rndata[nci] = cell;
                    } else if (nci > eci) {
                        rndata[nci - n] = cell;
                        if (cell.text && cell.text[0] === '=') {
                            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => m_alphabet.expr2expr(word, -n, 0, x => x > eci));
                        }
                    }
                });
                row.cells = rndata;
            });
        }
        deleteCells(cellRange, what = 'all') {
            cellRange.each((i, j) => {
                this.deleteCell(i, j, what);
            });
        }
        deleteCell(ri, ci, what = 'all') {
            const row = this.get(ri);
            if (row !== null) {
                const cell = this.getCell(ri, ci);
                if (cell !== null) {
                    if (what === 'all') {
                        delete row.cells[ci];
                    } else if (what === 'text') {
                        if (cell.text)
                            delete cell.text;
                        if (cell.value)
                            delete cell.value;
                    } else if (what === 'format') {
                        if (cell.style !== undefined)
                            delete cell.style;
                        if (cell.merge)
                            delete cell.merge;
                    } else if (what === 'merge') {
                        if (cell.merge)
                            delete cell.merge;
                    }
                }
            }
        }
        maxCell() {
            const keys = Object.keys(this._);
            const ri = keys[keys.length - 1];
            const col = this._[ri];
            if (col) {
                const {cells} = col;
                const ks = Object.keys(cells);
                const ci = ks[ks.length - 1];
                return [
                    parseInt(ri, 10),
                    parseInt(ci, 10)
                ];
            }
            return [
                0,
                0
            ];
        }
        each(cb) {
            Object.entries(this._).forEach(([ri, row]) => {
                cb(ri, row);
            });
        }
        eachCells(ri, cb) {
            if (this._[ri] && this._[ri].cells) {
                Object.entries(this._[ri].cells).forEach(([ci, cell]) => {
                    cb(ci, cell);
                });
            }
        }
        setData(d) {
            if (d.len) {
                this.len = d.len;
                delete d.len;
            }
            this._ = d;
        }
        getData() {
            const {len} = this;
            return Object.assign({ len }, this._);
        }
    }
    return {
        Rows
    };
});
define('skylark-xspreadsheet/core/col',['./helper'], function (helper) {
    'use strict';
    class Cols {
        constructor({len, width, indexWidth, minWidth}) {
            this._ = {};
            this.len = len;
            this.width = width;
            this.indexWidth = indexWidth;
            this.minWidth = minWidth;
        }
        setData(d) {
            if (d.len) {
                this.len = d.len;
                delete d.len;
            }
            this._ = d;
        }
        getData() {
            const {len} = this;
            return Object.assign({ len }, this._);
        }
        getWidth(i) {
            if (this.isHide(i))
                return 0;
            const col = this._[i];
            if (col && col.width) {
                return col.width;
            }
            return this.width;
        }
        getOrNew(ci) {
            this._[ci] = this._[ci] || {};
            return this._[ci];
        }
        setWidth(ci, width) {
            const col = this.getOrNew(ci);
            col.width = width;
        }
        unhide(idx) {
            let index = idx;
            while (index > 0) {
                index -= 1;
                if (this.isHide(index)) {
                    this.setHide(index, false);
                } else
                    break;
            }
        }
        isHide(ci) {
            const col = this._[ci];
            return col && col.hide;
        }
        setHide(ci, v) {
            const col = this.getOrNew(ci);
            if (v === true)
                col.hide = true;
            else
                delete col.hide;
        }
        setStyle(ci, style) {
            const col = this.getOrNew(ci);
            col.style = style;
        }
        sumWidth(min, max) {
            return helper.rangeSum(min, max, i => this.getWidth(i));
        }
        totalWidth() {
            return this.sumWidth(0, this.len);
        }
    }
    return {
        Cols
    };
});
define('skylark-xspreadsheet/locale/en',[],function () {
    'use strict';
    return {
        toolbar: {
            undo: 'Undo',
            redo: 'Redo',
            print: 'Print',
            paintformat: 'Paint format',
            clearformat: 'Clear format',
            format: 'Format',
            fontName: 'Font',
            fontSize: 'Font size',
            fontBold: 'Font bold',
            fontItalic: 'Font italic',
            underline: 'Underline',
            strike: 'Strike',
            color: 'Text color',
            bgcolor: 'Fill color',
            border: 'Borders',
            merge: 'Merge cells',
            align: 'Horizontal align',
            valign: 'Vertical align',
            textwrap: 'Text wrapping',
            freeze: 'Freeze cell',
            autofilter: 'Filter',
            formula: 'Functions',
            more: 'More'
        },
        contextmenu: {
            copy: 'Copy',
            cut: 'Cut',
            paste: 'Paste',
            pasteValue: 'Paste values only',
            pasteFormat: 'Paste format only',
            hide: 'Hide',
            insertRow: 'Insert row',
            insertColumn: 'Insert column',
            deleteSheet: 'Delete',
            deleteRow: 'Delete row',
            deleteColumn: 'Delete column',
            deleteCell: 'Delete cell',
            deleteCellText: 'Delete cell text',
            validation: 'Data validations',
            cellprintable: 'Enable export',
            cellnonprintable: 'Disable export',
            celleditable: 'Enable editing',
            cellnoneditable: 'Disable editing'
        },
        print: {
            size: 'Paper size',
            orientation: 'Page orientation',
            orientations: [
                'Landscape',
                'Portrait'
            ]
        },
        format: {
            normal: 'Normal',
            text: 'Plain Text',
            number: 'Number',
            percent: 'Percent',
            rmb: 'RMB',
            usd: 'USD',
            eur: 'EUR',
            date: 'Date',
            time: 'Time',
            datetime: 'Date time',
            duration: 'Duration'
        },
        formula: {
            sum: 'Sum',
            average: 'Average',
            max: 'Max',
            min: 'Min',
            _if: 'IF',
            and: 'AND',
            or: 'OR',
            concat: 'Concat'
        },
        validation: {
            required: 'it must be required',
            notMatch: 'it not match its validation rule',
            between: 'it is between {} and {}',
            notBetween: 'it is not between {} and {}',
            notIn: 'it is not in list',
            equal: 'it equal to {}',
            notEqual: 'it not equal to {}',
            lessThan: 'it less than {}',
            lessThanEqual: 'it less than or equal to {}',
            greaterThan: 'it greater than {}',
            greaterThanEqual: 'it greater than or equal to {}'
        },
        error: { pasteForMergedCell: 'Unable to do this for merged cells' },
        calendar: {
            weeks: [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ],
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
        },
        button: {
            next: 'Next',
            cancel: 'Cancel',
            remove: 'Remove',
            save: 'Save',
            ok: 'OK'
        },
        sort: {
            desc: 'Sort Z -> A',
            asc: 'Sort A -> Z'
        },
        filter: { empty: 'empty' },
        dataValidation: {
            mode: 'Mode',
            range: 'Cell Range',
            criteria: 'Criteria',
            modeType: {
                cell: 'Cell',
                column: 'Colun',
                row: 'Row'
            },
            type: {
                list: 'List',
                number: 'Number',
                date: 'Date',
                phone: 'Phone',
                email: 'Email'
            },
            operator: {
                be: 'between',
                nbe: 'not betwwen',
                lt: 'less than',
                lte: 'less than or equal to',
                gt: 'greater than',
                gte: 'greater than or equal to',
                eq: 'equal to',
                neq: 'not equal to'
            }
        }
    };
});
define('skylark-xspreadsheet/locale/locale',['./en'], function (en) {
    'use strict';
    let $lang = 'en';
    const $messages = { en };
    function translate(key, messages) {
        if (messages && messages[$lang]) {
            let message = messages[$lang];
            const keys = key.split('.');
            for (let i = 0; i < keys.length; i += 1) {
                const property = keys[i];
                const value = message[property];
                if (i === keys.length - 1)
                    return value;
                if (!value)
                    return undefined;
                message = value;
            }
        }
        return undefined;
    }
    function t(key) {
        let v = translate(key, $messages);
        if (!v && window && window.x_spreadsheet && window.x_spreadsheet.$messages) {
            v = translate(key, window.x_spreadsheet.$messages);
        }
        return v || '';
    }
    function tf(key) {
        return () => t(key);
    }
    function locale(lang, message) {
        $lang = lang;
        if (message) {
            $messages[lang] = message;
        }
    }
    return {
        locale,
        t,
        tf
    };
});
define('skylark-xspreadsheet/core/validator',[
    '../locale/locale',
    './helper'
], function (m_locale, helper) {
    'use strict';
    const rules = {
        phone: /^[1-9]\d{10}$/,
        email: /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/
    };
    function returnMessage(flag, key, ...arg) {
        let message = '';
        if (!flag) {
            message = m_locale.t(`validation.${ key }`, ...arg);
        }
        return [
            flag,
            message
        ];
    }
    class Validator {
        constructor(type, required, value, operator) {
            this.required = required;
            this.value = value;
            this.type = type;
            this.operator = operator;
            this.message = '';
        }
        parseValue(v) {
            const {type} = this;
            if (type === 'date') {
                return new Date(v);
            }
            if (type === 'number') {
                return Number(v);
            }
            return v;
        }
        equals(other) {
            let flag = this.type === other.type && this.required === other.required && this.operator === other.operator;
            if (flag) {
                if (Array.isArray(this.value)) {
                    flag = helper.arrayEquals(this.value, other.value);
                } else {
                    flag = this.value === other.value;
                }
            }
            return flag;
        }
        values() {
            return this.value.split(',');
        }
        validate(v) {
            const {required, operator, value, type} = this;
            if (required && /^\s*$/.test(v)) {
                return returnMessage(false, 'required');
            }
            if (/^\s*$/.test(v))
                return [true];
            if (rules[type] && !rules[type].test(v)) {
                return returnMessage(false, 'notMatch');
            }
            if (type === 'list') {
                return returnMessage(this.values().includes(v), 'notIn');
            }
            if (operator) {
                const v1 = this.parseValue(v);
                if (operator === 'be') {
                    const [min, max] = value;
                    return returnMessage(v1 >= this.parseValue(min) && v1 <= this.parseValue(max), 'between', min, max);
                }
                if (operator === 'nbe') {
                    const [min, max] = value;
                    return returnMessage(v1 < this.parseValue(min) || v1 > this.parseValue(max), 'notBetween', min, max);
                }
                if (operator === 'eq') {
                    return returnMessage(v1 === this.parseValue(value), 'equal', value);
                }
                if (operator === 'neq') {
                    return returnMessage(v1 !== this.parseValue(value), 'notEqual', value);
                }
                if (operator === 'lt') {
                    return returnMessage(v1 < this.parseValue(value), 'lessThan', value);
                }
                if (operator === 'lte') {
                    return returnMessage(v1 <= this.parseValue(value), 'lessThanEqual', value);
                }
                if (operator === 'gt') {
                    return returnMessage(v1 > this.parseValue(value), 'greaterThan', value);
                }
                if (operator === 'gte') {
                    return returnMessage(v1 >= this.parseValue(value), 'greaterThanEqual', value);
                }
            }
            return [true];
        }
    };

    return Validator;
});
define('skylark-xspreadsheet/core/validation',[
    './validator',
    './cell_range'
], function (Validator, m_cell_range) {
    'use strict';
    class Validation {
        constructor(mode, refs, validator) {
            this.refs = refs;
            this.mode = mode;
            this.validator = validator;
        }
        includes(ri, ci) {
            const {refs} = this;
            for (let i = 0; i < refs.length; i += 1) {
                const cr = m_cell_range.CellRange.valueOf(refs[i]);
                if (cr.includes(ri, ci))
                    return true;
            }
            return false;
        }
        addRef(ref) {
            this.remove(m_cell_range.CellRange.valueOf(ref));
            this.refs.push(ref);
        }
        remove(cellRange) {
            const nrefs = [];
            this.refs.forEach(it => {
                const cr = m_cell_range.CellRange.valueOf(it);
                if (cr.intersects(cellRange)) {
                    const crs = cr.difference(cellRange);
                    crs.forEach(it1 => nrefs.push(it1.toString()));
                } else {
                    nrefs.push(it);
                }
            });
            this.refs = nrefs;
        }
        getData() {
            const {refs, mode, validator} = this;
            const {type, required, operator, value} = validator;
            return {
                refs,
                mode,
                type,
                required,
                operator,
                value
            };
        }
        static valueOf({refs, mode, type, required, operator, value}) {
            return new Validation(mode, refs, new Validator(type, required, value, operator));
        }
    }
    class Validations {
        constructor() {
            this._ = [];
            this.errors = new Map();
        }
        getError(ri, ci) {
            return this.errors.get(`${ ri }_${ ci }`);
        }
        validate(ri, ci, text) {
            const v = this.get(ri, ci);
            const key = `${ ri }_${ ci }`;
            const {errors} = this;
            if (v !== null) {
                const [flag, message] = v.validator.validate(text);
                if (!flag) {
                    errors.set(key, message);
                } else {
                    errors.delete(key);
                }
            } else {
                errors.delete(key);
            }
            return true;
        }
        add(mode, ref, {type, required, value, operator}) {
            const validator = new Validator(type, required, value, operator);
            const v = this.getByValidator(validator);
            if (v !== null) {
                v.addRef(ref);
            } else {
                this._.push(new Validation(mode, [ref], validator));
            }
        }
        getByValidator(validator) {
            for (let i = 0; i < this._.length; i += 1) {
                const v = this._[i];
                if (v.validator.equals(validator)) {
                    return v;
                }
            }
            return null;
        }
        get(ri, ci) {
            for (let i = 0; i < this._.length; i += 1) {
                const v = this._[i];
                if (v.includes(ri, ci))
                    return v;
            }
            return null;
        }
        remove(cellRange) {
            this.each(it => {
                it.remove(cellRange);
            });
        }
        each(cb) {
            this._.forEach(it => cb(it));
        }
        getData() {
            return this._.filter(it => it.refs.length > 0).map(it => it.getData());
        }
        setData(d) {
            this._ = d.map(it => Validation.valueOf(it));
        }
    }
    return {
        Validations
    };
});
define('skylark-xspreadsheet/core/data_proxy',[
    './selector',
    './scroll',
    './history',
    './clipboard',
    './auto_filter',
    './merge',
    './helper',
    './row',
    './col',
    './validation',
    './cell_range',
    './alphabet',
    '../locale/locale'
], function (
    Selector, 
    Scroll, 
    History, 
    Clipboard, 
    AutoFilter, 
    m_merge, 
    helper, 
    m_row, 
    m_col, 
    m_validation, 
    m_cell_range, 
    m_alphabet, 
    m_locale
) {
    'use strict';
    const defaultSettings = {
        mode: 'edit',
        view: {
            height: () => document.documentElement.clientHeight,
            width: () => document.documentElement.clientWidth
        },
        showGrid: true,
        showToolbar: true,
        showContextmenu: true,
        row: {
            len: 100,
            height: 25
        },
        col: {
            len: 26,
            width: 100,
            indexWidth: 60,
            minWidth: 60
        },
        style: {
            bgcolor: '#ffffff',
            align: 'left',
            valign: 'middle',
            textwrap: false,
            strike: false,
            underline: false,
            color: '#0a0a0a',
            font: {
                name: 'Arial',
                size: 10,
                bold: false,
                italic: false
            },
            format: 'normal'
        }
    };
    const toolbarHeight = 41;
    const bottombarHeight = 41;
    function canPaste(src, dst, error = () => {
    }) {
        const {merges} = this;
        const cellRange = dst.clone();
        const [srn, scn] = src.size();
        const [drn, dcn] = dst.size();
        if (srn > drn) {
            cellRange.eri = dst.sri + srn - 1;
        }
        if (scn > dcn) {
            cellRange.eci = dst.sci + scn - 1;
        }
        if (merges.intersects(cellRange)) {
            error(m_locale.t('error.pasteForMergedCell'));
            return false;
        }
        return true;
    }
    function copyPaste(srcCellRange, dstCellRange, what, autofill = false) {
        const {rows, merges} = this;
        if (what === 'all' || what === 'format') {
            rows.deleteCells(dstCellRange, what);
            merges.deleteWithin(dstCellRange);
        }
        rows.copyPaste(srcCellRange, dstCellRange, what, autofill, (ri, ci, cell) => {
            if (cell && cell.merge) {
                const [rn, cn] = cell.merge;
                if (rn <= 0 && cn <= 0)
                    return;
                merges.add(new m_cell_range.CellRange(ri, ci, ri + rn, ci + cn));
            }
        });
    }
    function cutPaste(srcCellRange, dstCellRange) {
        const {clipboard, rows, merges} = this;
        rows.cutPaste(srcCellRange, dstCellRange);
        merges.move(srcCellRange, dstCellRange.sri - srcCellRange.sri, dstCellRange.sci - srcCellRange.sci);
        clipboard.clear();
    }
    function setStyleBorder(ri, ci, bss) {
        const {styles, rows} = this;
        const cell = rows.getCellOrNew(ri, ci);
        let cstyle = {};
        if (cell.style !== undefined) {
            cstyle = helper.cloneDeep(styles[cell.style]);
        }
        cstyle = helper.merge(cstyle, { border: bss });
        cell.style = this.addStyle(cstyle);
    }
    function setStyleBorders({mode, style, color}) {
        const {styles, selector, rows} = this;
        const {sri, sci, eri, eci} = selector.range;
        const multiple = !this.isSignleSelected();
        if (!multiple) {
            if (mode === 'inside' || mode === 'horizontal' || mode === 'vertical') {
                return;
            }
        }
        if (mode === 'outside' && !multiple) {
            setStyleBorder.call(this, sri, sci, {
                top: [
                    style,
                    color
                ],
                bottom: [
                    style,
                    color
                ],
                left: [
                    style,
                    color
                ],
                right: [
                    style,
                    color
                ]
            });
        } else if (mode === 'none') {
            selector.range.each((ri, ci) => {
                const cell = rows.getCell(ri, ci);
                if (cell && cell.style !== undefined) {
                    const ns = helper.cloneDeep(styles[cell.style]);
                    delete ns.border;
                    cell.style = this.addStyle(ns);
                }
            });
        } else if (mode === 'all' || mode === 'inside' || mode === 'outside' || mode === 'horizontal' || mode === 'vertical') {
            const merges = [];
            for (let ri = sri; ri <= eri; ri += 1) {
                for (let ci = sci; ci <= eci; ci += 1) {
                    const mergeIndexes = [];
                    for (let ii = 0; ii < merges.length; ii += 1) {
                        const [mri, mci, rn, cn] = merges[ii];
                        if (ri === mri + rn + 1)
                            mergeIndexes.push(ii);
                        if (mri <= ri && ri <= mri + rn) {
                            if (ci === mci) {
                                ci += cn + 1;
                                break;
                            }
                        }
                    }
                    mergeIndexes.forEach(it => merges.splice(it, 1));
                    if (ci > eci)
                        break;
                    const cell = rows.getCell(ri, ci);
                    let [rn, cn] = [
                        0,
                        0
                    ];
                    if (cell && cell.merge) {
                        [rn, cn] = cell.merge;
                        merges.push([
                            ri,
                            ci,
                            rn,
                            cn
                        ]);
                    }
                    const mrl = rn > 0 && ri + rn === eri;
                    const mcl = cn > 0 && ci + cn === eci;
                    let bss = {};
                    if (mode === 'all') {
                        bss = {
                            bottom: [
                                style,
                                color
                            ],
                            top: [
                                style,
                                color
                            ],
                            left: [
                                style,
                                color
                            ],
                            right: [
                                style,
                                color
                            ]
                        };
                    } else if (mode === 'inside') {
                        if (!mcl && ci < eci)
                            bss.right = [
                                style,
                                color
                            ];
                        if (!mrl && ri < eri)
                            bss.bottom = [
                                style,
                                color
                            ];
                    } else if (mode === 'horizontal') {
                        if (!mrl && ri < eri)
                            bss.bottom = [
                                style,
                                color
                            ];
                    } else if (mode === 'vertical') {
                        if (!mcl && ci < eci)
                            bss.right = [
                                style,
                                color
                            ];
                    } else if (mode === 'outside' && multiple) {
                        if (sri === ri)
                            bss.top = [
                                style,
                                color
                            ];
                        if (mrl || eri === ri)
                            bss.bottom = [
                                style,
                                color
                            ];
                        if (sci === ci)
                            bss.left = [
                                style,
                                color
                            ];
                        if (mcl || eci === ci)
                            bss.right = [
                                style,
                                color
                            ];
                    }
                    if (Object.keys(bss).length > 0) {
                        setStyleBorder.call(this, ri, ci, bss);
                    }
                    ci += cn;
                }
            }
        } else if (mode === 'top' || mode === 'bottom') {
            for (let ci = sci; ci <= eci; ci += 1) {
                if (mode === 'top') {
                    setStyleBorder.call(this, sri, ci, {
                        top: [
                            style,
                            color
                        ]
                    });
                    ci += rows.getCellMerge(sri, ci)[1];
                }
                if (mode === 'bottom') {
                    setStyleBorder.call(this, eri, ci, {
                        bottom: [
                            style,
                            color
                        ]
                    });
                    ci += rows.getCellMerge(eri, ci)[1];
                }
            }
        } else if (mode === 'left' || mode === 'right') {
            for (let ri = sri; ri <= eri; ri += 1) {
                if (mode === 'left') {
                    setStyleBorder.call(this, ri, sci, {
                        left: [
                            style,
                            color
                        ]
                    });
                    ri += rows.getCellMerge(ri, sci)[0];
                }
                if (mode === 'right') {
                    setStyleBorder.call(this, ri, eci, {
                        right: [
                            style,
                            color
                        ]
                    });
                    ri += rows.getCellMerge(ri, eci)[0];
                }
            }
        }
    }
    function getCellRowByY(y, scrollOffsety) {
        const {rows} = this;
        const fsh = this.freezeTotalHeight();
        let inits = rows.height;
        if (fsh + rows.height < y)
            inits -= scrollOffsety;
        const frset = this.exceptRowSet;
        let ri = 0;
        let top = inits;
        let {height} = rows;
        for (; ri < rows.len; ri += 1) {
            if (top > y)
                break;
            if (!frset.has(ri)) {
                height = rows.getHeight(ri);
                top += height;
            }
        }
        top -= height;
        if (top <= 0) {
            return {
                ri: -1,
                top: 0,
                height
            };
        }
        return {
            ri: ri - 1,
            top,
            height
        };
    }
    function getCellColByX(x, scrollOffsetx) {
        const {cols} = this;
        const fsw = this.freezeTotalWidth();
        let inits = cols.indexWidth;
        if (fsw + cols.indexWidth < x)
            inits -= scrollOffsetx;
        const [ci, left, width] = helper.rangeReduceIf(0, cols.len, inits, cols.indexWidth, x, i => cols.getWidth(i));
        if (left <= 0) {
            return {
                ci: -1,
                left: 0,
                width: cols.indexWidth
            };
        }
        return {
            ci: ci - 1,
            left,
            width
        };
    }
    return class DataProxy {
        constructor(name, settings) {
            this.settings = helper.merge(defaultSettings, settings || {});
            this.name = name || 'sheet';
            this.freeze = [
                0,
                0
            ];
            this.styles = [];
            this.merges = new m_merge.Merges();
            this.rows = new m_row.Rows(this.settings.row);
            this.cols = new m_col.Cols(this.settings.col);
            this.validations = new m_validation.Validations();
            this.hyperlinks = {};
            this.comments = {};
            this.selector = new Selector();
            this.scroll = new Scroll();
            this.history = new History();
            this.clipboard = new Clipboard();
            this.autoFilter = new AutoFilter();
            this.change = () => {
            };
            this.exceptRowSet = new Set();
            this.sortedRowMap = new Map();
            this.unsortedRowMap = new Map();
        }
        addValidation(mode, ref, validator) {
            this.changeData(() => {
                this.validations.add(mode, ref, validator);
            });
        }
        removeValidation() {
            const {range} = this.selector;
            this.changeData(() => {
                this.validations.remove(range);
            });
        }
        getSelectedValidator() {
            const {ri, ci} = this.selector;
            const v = this.validations.get(ri, ci);
            return v ? v.validator : null;
        }
        getSelectedValidation() {
            const {ri, ci, range} = this.selector;
            const v = this.validations.get(ri, ci);
            const ret = { ref: range.toString() };
            if (v !== null) {
                ret.mode = v.mode;
                ret.validator = v.validator;
            }
            return ret;
        }
        canUndo() {
            return this.history.canUndo();
        }
        canRedo() {
            return this.history.canRedo();
        }
        undo() {
            this.history.undo(this.getData(), d => {
                this.setData(d);
            });
        }
        redo() {
            this.history.redo(this.getData(), d => {
                this.setData(d);
            });
        }
        copy() {
            this.clipboard.copy(this.selector.range);
        }
        cut() {
            this.clipboard.cut(this.selector.range);
        }
        paste(what = 'all', error = () => {
        }) {
            const {clipboard, selector} = this;
            if (clipboard.isClear())
                return false;
            if (!canPaste.call(this, clipboard.range, selector.range, error))
                return false;
            this.changeData(() => {
                if (clipboard.isCopy()) {
                    copyPaste.call(this, clipboard.range, selector.range, what);
                } else if (clipboard.isCut()) {
                    cutPaste.call(this, clipboard.range, selector.range);
                }
            });
            return true;
        }
        pasteFromText(txt) {
            const lines = txt.split('\r\n').map(it => it.replace(/"/g, '').split('\t'));
            if (lines.length > 0)
                lines.length -= 1;
            const {rows, selector} = this;
            this.changeData(() => {
                rows.paste(lines, selector.range);
            });
        }
        autofill(cellRange, what, error = () => {
        }) {
            const srcRange = this.selector.range;
            if (!canPaste.call(this, srcRange, cellRange, error))
                return false;
            this.changeData(() => {
                copyPaste.call(this, srcRange, cellRange, what, true);
            });
            return true;
        }
        clearClipboard() {
            this.clipboard.clear();
        }
        calSelectedRangeByEnd(ri, ci) {
            const {selector, rows, cols, merges} = this;
            let {sri, sci, eri, eci} = selector.range;
            const cri = selector.ri;
            const cci = selector.ci;
            let [nri, nci] = [
                ri,
                ci
            ];
            if (ri < 0)
                nri = rows.len - 1;
            if (ci < 0)
                nci = cols.len - 1;
            if (nri > cri)
                [sri, eri] = [
                    cri,
                    nri
                ];
            else
                [sri, eri] = [
                    nri,
                    cri
                ];
            if (nci > cci)
                [sci, eci] = [
                    cci,
                    nci
                ];
            else
                [sci, eci] = [
                    nci,
                    cci
                ];
            selector.range = merges.union(new m_cell_range.CellRange(sri, sci, eri, eci));
            selector.range = merges.union(selector.range);
            return selector.range;
        }
        calSelectedRangeByStart(ri, ci) {
            const {selector, rows, cols, merges} = this;
            let cellRange = merges.getFirstIncludes(ri, ci);
            if (cellRange === null) {
                cellRange = new m_cell_range.CellRange(ri, ci, ri, ci);
                if (ri === -1) {
                    cellRange.sri = 0;
                    cellRange.eri = rows.len - 1;
                }
                if (ci === -1) {
                    cellRange.sci = 0;
                    cellRange.eci = cols.len - 1;
                }
            }
            selector.range = cellRange;
            return cellRange;
        }
        setSelectedCellAttr(property, value) {
            this.changeData(() => {
                const {selector, styles, rows} = this;
                if (property === 'merge') {
                    if (value)
                        this.merge();
                    else
                        this.unmerge();
                } else if (property === 'border') {
                    setStyleBorders.call(this, value);
                } else if (property === 'formula') {
                    const {ri, ci, range} = selector;
                    if (selector.multiple()) {
                        const [rn, cn] = selector.size();
                        const {sri, sci, eri, eci} = range;
                        if (rn > 1) {
                            for (let i = sci; i <= eci; i += 1) {
                                const cell = rows.getCellOrNew(eri + 1, i);
                                cell.text = `=${ value }(${ m_alphabet.xy2expr(i, sri) }:${ m_alphabet.xy2expr(i, eri) })`;
                            }
                        } else if (cn > 1) {
                            const cell = rows.getCellOrNew(ri, eci + 1);
                            cell.text = `=${ value }(${ m_alphabet.xy2expr(sci, ri) }:${ m_alphabet.xy2expr(eci, ri) })`;
                        }
                    } else {
                        const cell = rows.getCellOrNew(ri, ci);
                        cell.text = `=${ value }()`;
                    }
                } else {
                    selector.range.each((ri, ci) => {
                        const cell = rows.getCellOrNew(ri, ci);
                        let cstyle = {};
                        if (cell.style !== undefined) {
                            cstyle = helper.cloneDeep(styles[cell.style]);
                        }
                        if (property === 'format') {
                            cstyle.format = value;
                            cell.style = this.addStyle(cstyle);
                        } else if (property === 'font-bold' || property === 'font-italic' || property === 'font-name' || property === 'font-size') {
                            const nfont = {};
                            nfont[property.split('-')[1]] = value;
                            cstyle.font = Object.assign(cstyle.font || {}, nfont);
                            cell.style = this.addStyle(cstyle);
                        } else if (property === 'strike' || property === 'textwrap' || property === 'underline' || property === 'align' || property === 'valign' || property === 'color' || property === 'bgcolor') {
                            cstyle[property] = value;
                            cell.style = this.addStyle(cstyle);
                        } else {
                            cell[property] = value;
                        }
                    });
                }
            });
        }
        setSelectedCellText(text, state = 'input') {
            const {autoFilter, selector, rows} = this;
            const {ri, ci} = selector;
            let nri = ri;
            if (this.unsortedRowMap.has(ri)) {
                nri = this.unsortedRowMap.get(ri);
            }
            const oldCell = rows.getCell(nri, ci);
            const oldText = oldCell ? oldCell.text : '';
            this.setCellText(nri, ci, text, state);
            if (autoFilter.active()) {
                const filter = autoFilter.getFilter(ci);
                if (filter) {
                    const vIndex = filter.value.findIndex(v => v === oldText);
                    if (vIndex >= 0) {
                        filter.value.splice(vIndex, 1, text);
                    }
                }
            }
        }
        getSelectedCell() {
            const {ri, ci} = this.selector;
            let nri = ri;
            if (this.unsortedRowMap.has(ri)) {
                nri = this.unsortedRowMap.get(ri);
            }
            return this.rows.getCell(nri, ci);
        }
        xyInSelectedRect(x, y) {
            const {left, top, width, height} = this.getSelectedRect();
            const x1 = x - this.cols.indexWidth;
            const y1 = y - this.rows.height;
            return x1 > left && x1 < left + width && y1 > top && y1 < top + height;
        }
        getSelectedRect() {
            return this.getRect(this.selector.range);
        }
        getClipboardRect() {
            const {clipboard} = this;
            if (!clipboard.isClear()) {
                return this.getRect(clipboard.range);
            }
            return {
                left: -100,
                top: -100
            };
        }
        getRect(cellRange) {
            const {scroll, rows, cols, exceptRowSet} = this;
            const {sri, sci, eri, eci} = cellRange;
            if (sri < 0 && sci < 0) {
                return {
                    left: 0,
                    l: 0,
                    top: 0,
                    t: 0,
                    scroll
                };
            }
            const left = cols.sumWidth(0, sci);
            const top = rows.sumHeight(0, sri, exceptRowSet);
            const height = rows.sumHeight(sri, eri + 1, exceptRowSet);
            const width = cols.sumWidth(sci, eci + 1);
            let left0 = left - scroll.x;
            let top0 = top - scroll.y;
            const fsh = this.freezeTotalHeight();
            const fsw = this.freezeTotalWidth();
            if (fsw > 0 && fsw > left) {
                left0 = left;
            }
            if (fsh > 0 && fsh > top) {
                top0 = top;
            }
            return {
                l: left,
                t: top,
                left: left0,
                top: top0,
                height,
                width,
                scroll
            };
        }
        getCellRectByXY(x, y) {
            const {scroll, merges, rows, cols} = this;
            let {ri, top, height} = getCellRowByY.call(this, y, scroll.y);
            let {ci, left, width} = getCellColByX.call(this, x, scroll.x);
            if (ci === -1) {
                width = cols.totalWidth();
            }
            if (ri === -1) {
                height = rows.totalHeight();
            }
            if (ri >= 0 || ci >= 0) {
                const merge = merges.getFirstIncludes(ri, ci);
                if (merge) {
                    ri = merge.sri;
                    ci = merge.sci;
                    ({left, top, width, height} = this.cellRect(ri, ci));
                }
            }
            return {
                ri,
                ci,
                left,
                top,
                width,
                height
            };
        }
        isSignleSelected() {
            const {sri, sci, eri, eci} = this.selector.range;
            const cell = this.getCell(sri, sci);
            if (cell && cell.merge) {
                const [rn, cn] = cell.merge;
                if (sri + rn === eri && sci + cn === eci)
                    return true;
            }
            return !this.selector.multiple();
        }
        canUnmerge() {
            const {sri, sci, eri, eci} = this.selector.range;
            const cell = this.getCell(sri, sci);
            if (cell && cell.merge) {
                const [rn, cn] = cell.merge;
                if (sri + rn === eri && sci + cn === eci)
                    return true;
            }
            return false;
        }
        merge() {
            const {selector, rows} = this;
            if (this.isSignleSelected())
                return;
            const [rn, cn] = selector.size();
            if (rn > 1 || cn > 1) {
                const {sri, sci} = selector.range;
                this.changeData(() => {
                    const cell = rows.getCellOrNew(sri, sci);
                    cell.merge = [
                        rn - 1,
                        cn - 1
                    ];
                    this.merges.add(selector.range);
                    this.rows.deleteCells(selector.range);
                    this.rows.setCell(sri, sci, cell);
                });
            }
        }
        unmerge() {
            const {selector} = this;
            if (!this.isSignleSelected())
                return;
            const {sri, sci} = selector.range;
            this.changeData(() => {
                this.rows.deleteCell(sri, sci, 'merge');
                this.merges.deleteWithin(selector.range);
            });
        }
        canAutofilter() {
            return !this.autoFilter.active();
        }
        autofilter() {
            const {autoFilter, selector} = this;
            this.changeData(() => {
                if (autoFilter.active()) {
                    autoFilter.clear();
                    this.exceptRowSet = new Set();
                    this.sortedRowMap = new Map();
                    this.unsortedRowMap = new Map();
                } else {
                    autoFilter.ref = selector.range.toString();
                }
            });
        }
        setAutoFilter(ci, order, operator, value) {
            const {autoFilter} = this;
            autoFilter.addFilter(ci, operator, value);
            autoFilter.setSort(ci, order);
            this.resetAutoFilter();
        }
        resetAutoFilter() {
            const {autoFilter, rows} = this;
            if (!autoFilter.active())
                return;
            const {sort} = autoFilter;
            const {rset, fset} = autoFilter.filteredRows((r, c) => rows.getCell(r, c));
            const fary = Array.from(fset);
            const oldAry = Array.from(fset);
            if (sort) {
                fary.sort((a, b) => {
                    if (sort.order === 'asc')
                        return a - b;
                    if (sort.order === 'desc')
                        return b - a;
                    return 0;
                });
            }
            this.exceptRowSet = rset;
            this.sortedRowMap = new Map();
            this.unsortedRowMap = new Map();
            fary.forEach((it, index) => {
                this.sortedRowMap.set(oldAry[index], it);
                this.unsortedRowMap.set(it, oldAry[index]);
            });
        }
        deleteCell(what = 'all') {
            const {selector} = this;
            this.changeData(() => {
                this.rows.deleteCells(selector.range, what);
                if (what === 'all' || what === 'format') {
                    this.merges.deleteWithin(selector.range);
                }
            });
        }
        insert(type, n = 1) {
            this.changeData(() => {
                const {sri, sci} = this.selector.range;
                const {rows, merges, cols} = this;
                let si = sri;
                if (type === 'row') {
                    rows.insert(sri, n);
                } else if (type === 'column') {
                    rows.insertColumn(sci, n);
                    si = sci;
                    cols.len += 1;
                }
                merges.shift(type, si, n, (ri, ci, rn, cn) => {
                    const cell = rows.getCell(ri, ci);
                    cell.merge[0] += rn;
                    cell.merge[1] += cn;
                });
            });
        }
        delete(type) {
            this.changeData(() => {
                const {rows, merges, selector, cols} = this;
                const {range} = selector;
                const {sri, sci, eri, eci} = selector.range;
                const [rsize, csize] = selector.range.size();
                let si = sri;
                let size = rsize;
                if (type === 'row') {
                    rows.delete(sri, eri);
                } else if (type === 'column') {
                    rows.deleteColumn(sci, eci);
                    si = range.sci;
                    size = csize;
                    cols.len -= 1;
                }
                merges.shift(type, si, -size, (ri, ci, rn, cn) => {
                    const cell = rows.getCell(ri, ci);
                    cell.merge[0] += rn;
                    cell.merge[1] += cn;
                    if (cell.merge[0] === 0 && cell.merge[1] === 0) {
                        delete cell.merge;
                    }
                });
            });
        }
        scrollx(x, cb) {
            const {scroll, freeze, cols} = this;
            const [, fci] = freeze;
            const [ci, left, width] = helper.rangeReduceIf(fci, cols.len, 0, 0, x, i => cols.getWidth(i));
            let x1 = left;
            if (x > 0)
                x1 += width;
            if (scroll.x !== x1) {
                scroll.ci = x > 0 ? ci : 0;
                scroll.x = x1;
                cb();
            }
        }
        scrolly(y, cb) {
            const {scroll, freeze, rows} = this;
            const [fri] = freeze;
            const [ri, top, height] = helper.rangeReduceIf(fri, rows.len, 0, 0, y, i => rows.getHeight(i));
            let y1 = top;
            if (y > 0)
                y1 += height;
            if (scroll.y !== y1) {
                scroll.ri = y > 0 ? ri : 0;
                scroll.y = y1;
                cb();
            }
        }
        cellRect(ri, ci) {
            const {rows, cols} = this;
            const left = cols.sumWidth(0, ci);
            const top = rows.sumHeight(0, ri);
            const cell = rows.getCell(ri, ci);
            let width = cols.getWidth(ci);
            let height = rows.getHeight(ri);
            if (cell !== null) {
                if (cell.merge) {
                    const [rn, cn] = cell.merge;
                    if (rn > 0) {
                        for (let i = 1; i <= rn; i += 1) {
                            height += rows.getHeight(ri + i);
                        }
                    }
                    if (cn > 0) {
                        for (let i = 1; i <= cn; i += 1) {
                            width += cols.getWidth(ci + i);
                        }
                    }
                }
            }
            return {
                left,
                top,
                width,
                height,
                cell
            };
        }
        getCell(ri, ci) {
            return this.rows.getCell(ri, ci);
        }
        getCellTextOrDefault(ri, ci) {
            const cell = this.getCell(ri, ci);
            return cell && cell.text ? cell.text : '';
        }
        getCellStyle(ri, ci) {
            const cell = this.getCell(ri, ci);
            if (cell && cell.style !== undefined) {
                return this.styles[cell.style];
            }
            return null;
        }
        getCellStyleOrDefault(ri, ci) {
            const {styles, rows} = this;
            const cell = rows.getCell(ri, ci);
            const cellStyle = cell && cell.style !== undefined ? styles[cell.style] : {};
            return helper.merge(this.defaultStyle(), cellStyle);
        }
        getSelectedCellStyle() {
            const {ri, ci} = this.selector;
            return this.getCellStyleOrDefault(ri, ci);
        }
        setCellText(ri, ci, text, state) {
            const {rows, history, validations} = this;
            if (state === 'finished') {
                rows.setCellText(ri, ci, '');
                history.add(this.getData());
                rows.setCellText(ri, ci, text);
            } else {
                rows.setCellText(ri, ci, text);
                this.change(this.getData());
            }
            validations.validate(ri, ci, text);
        }
        freezeIsActive() {
            const [ri, ci] = this.freeze;
            return ri > 0 || ci > 0;
        }
        setFreeze(ri, ci) {
            this.changeData(() => {
                this.freeze = [
                    ri,
                    ci
                ];
            });
        }
        freezeTotalWidth() {
            return this.cols.sumWidth(0, this.freeze[1]);
        }
        freezeTotalHeight() {
            return this.rows.sumHeight(0, this.freeze[0]);
        }
        setRowHeight(ri, height) {
            this.changeData(() => {
                this.rows.setHeight(ri, height);
            });
        }
        setColWidth(ci, width) {
            this.changeData(() => {
                this.cols.setWidth(ci, width);
            });
        }
        viewHeight() {
            const {view, showToolbar} = this.settings;
            let h = view.height();
            h -= bottombarHeight;
            if (showToolbar) {
                h -= toolbarHeight;
            }
            return h;
        }
        viewWidth() {
            return this.settings.view.width();
        }
        freezeViewRange() {
            const [ri, ci] = this.freeze;
            return new m_cell_range.CellRange(0, 0, ri - 1, ci - 1, this.freezeTotalWidth(), this.freezeTotalHeight());
        }
        contentRange() {
            const {rows, cols} = this;
            const [ri, ci] = rows.maxCell();
            const h = rows.sumHeight(0, ri + 1);
            const w = cols.sumWidth(0, ci + 1);
            return new m_cell_range.CellRange(0, 0, ri, ci, w, h);
        }
        exceptRowTotalHeight(sri, eri) {
            const {exceptRowSet, rows} = this;
            const exceptRows = Array.from(exceptRowSet);
            let exceptRowTH = 0;
            exceptRows.forEach(ri => {
                if (ri < sri || ri > eri) {
                    const height = rows.getHeight(ri);
                    exceptRowTH += height;
                }
            });
            return exceptRowTH;
        }
        viewRange() {
            const {scroll, rows, cols, freeze, exceptRowSet} = this;
            let {ri, ci} = scroll;
            if (ri <= 0)
                [ri] = freeze;
            if (ci <= 0)
                [, ci] = freeze;
            let [x, y] = [
                0,
                0
            ];
            let [eri, eci] = [
                rows.len,
                cols.len
            ];
            for (let i = ri; i < rows.len; i += 1) {
                if (!exceptRowSet.has(i)) {
                    y += rows.getHeight(i);
                    eri = i;
                }
                if (y > this.viewHeight())
                    break;
            }
            for (let j = ci; j < cols.len; j += 1) {
                x += cols.getWidth(j);
                eci = j;
                if (x > this.viewWidth())
                    break;
            }
            return new m_cell_range.CellRange(ri, ci, eri, eci, x, y);
        }
        eachMergesInView(viewRange, cb) {
            this.merges.filterIntersects(viewRange).forEach(it => cb(it));
        }
        hideRowsOrCols() {
            const {rows, cols, selector} = this;
            const [rlen, clen] = selector.size();
            const {sri, sci, eri, eci} = selector.range;
            if (rlen === rows.len) {
                for (let ci = sci; ci <= eci; ci += 1) {
                    cols.setHide(ci, true);
                }
            } else if (clen === cols.len) {
                for (let ri = sri; ri <= eri; ri += 1) {
                    rows.setHide(ri, true);
                }
            }
        }
        unhideRowsOrCols(type, index) {
            this[`${ type }s`].unhide(index);
        }
        rowEach(min, max, cb) {
            let y = 0;
            const {rows} = this;
            const frset = this.exceptRowSet;
            const frary = [...frset];
            let offset = 0;
            for (let i = 0; i < frary.length; i += 1) {
                if (frary[i] < min) {
                    offset += 1;
                }
            }
            for (let i = min + offset; i <= max + offset; i += 1) {
                if (frset.has(i)) {
                    offset += 1;
                } else {
                    const rowHeight = rows.getHeight(i);
                    if (rowHeight > 0) {
                        cb(i, y, rowHeight);
                        y += rowHeight;
                        if (y > this.viewHeight())
                            break;
                    }
                }
            }
        }
        colEach(min, max, cb) {
            let x = 0;
            const {cols} = this;
            for (let i = min; i <= max; i += 1) {
                const colWidth = cols.getWidth(i);
                if (colWidth > 0) {
                    cb(i, x, colWidth);
                    x += colWidth;
                    if (x > this.viewWidth())
                        break;
                }
            }
        }
        defaultStyle() {
            return this.settings.style;
        }
        addStyle(nstyle) {
            const {styles} = this;
            for (let i = 0; i < styles.length; i += 1) {
                const style = styles[i];
                if (helper.equals(style, nstyle))
                    return i;
            }
            styles.push(nstyle);
            return styles.length - 1;
        }
        changeData(cb) {
            this.history.add(this.getData());
            cb();
            this.change(this.getData());
        }
        setData(d) {
            Object.keys(d).forEach(property => {
                if (property === 'merges' || property === 'rows' || property === 'cols' || property === 'validations') {
                    this[property].setData(d[property]);
                } else if (property === 'freeze') {
                    const [x, y] = m_alphabet.expr2xy(d[property]);
                    this.freeze = [
                        y,
                        x
                    ];
                } else if (property === 'autofilter') {
                    this.autoFilter.setData(d[property]);
                } else if (d[property] !== undefined) {
                    this[property] = d[property];
                }
            });
            return this;
        }
        getData() {
            const {name, freeze, styles, merges, rows, cols, validations, autoFilter} = this;
            return {
                name,
                freeze: m_alphabet.xy2expr(freeze[1], freeze[0]),
                styles,
                merges: merges.getData(),
                rows: rows.getData(),
                cols: cols.getData(),
                validations: validations.getData(),
                autofilter: autoFilter.getData()
            };
        }
    };
});
define('skylark-xspreadsheet/component/event',[],function () {
    'use strict';
    function bind(target, name, fn) {
        target.addEventListener(name, fn);
    }
    function unbind(target, name, fn) {
        target.removeEventListener(name, fn);
    }
    function unbindClickoutside(el) {
        if (el.xclickoutside) {
            unbind(window.document.body, 'click', el.xclickoutside);
            delete el.xclickoutside;
        }
    }
    function bindClickoutside(el, cb) {
        el.xclickoutside = evt => {
            if (evt.detail === 2 || el.contains(evt.target))
                return;
            if (cb)
                cb(el);
            else {
                el.hide();
                unbindClickoutside(el);
            }
        };
        bind(window.document.body, 'click', el.xclickoutside);
    }
    function mouseMoveUp(target, movefunc, upfunc) {
        bind(target, 'mousemove', movefunc);
        const t = target;
        t.xEvtUp = evt => {
            unbind(target, 'mousemove', movefunc);
            unbind(target, 'mouseup', target.xEvtUp);
            upfunc(evt);
        };
        bind(target, 'mouseup', target.xEvtUp);
    }
    function calTouchDirection(spanx, spany, evt, cb) {
        let direction = '';
        if (Math.abs(spanx) > Math.abs(spany)) {
            direction = spanx > 0 ? 'right' : 'left';
            cb(direction, spanx, evt);
        } else {
            direction = spany > 0 ? 'down' : 'up';
            cb(direction, spany, evt);
        }
    }
    function bindTouch(target, {move, end}) {
        let startx = 0;
        let starty = 0;
        bind(target, 'touchstart', evt => {
            const {pageX, pageY} = evt.touches[0];
            startx = pageX;
            starty = pageY;
        });
        bind(target, 'touchmove', evt => {
            if (!move)
                return;
            const {pageX, pageY} = evt.changedTouches[0];
            const spanx = pageX - startx;
            const spany = pageY - starty;
            if (Math.abs(spanx) > 10 || Math.abs(spany) > 10) {
                calTouchDirection(spanx, spany, evt, move);
                startx = pageX;
                starty = pageY;
            }
            evt.preventDefault();
        });
        bind(target, 'touchend', evt => {
            if (!end)
                return;
            const {pageX, pageY} = evt.changedTouches[0];
            const spanx = pageX - startx;
            const spany = pageY - starty;
            calTouchDirection(spanx, spany, evt, end);
        });
    }
    return {
        bind: bind,
        unbind: unbind,
        unbindClickoutside: unbindClickoutside,
        bindClickoutside: bindClickoutside,
        mouseMoveUp: mouseMoveUp,
        bindTouch: bindTouch
    };
});
define('skylark-xspreadsheet/config',[],function () {
    'use strict';
    const cssPrefix = 'x-spreadsheet';
    const dpr = window.devicePixelRatio || 1;
    return {
        cssPrefix,
        dpr
    };
});
define('skylark-xspreadsheet/component/resizer',[
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    return class Resizer {
        constructor(vertical = false, minDistance) {
            this.moving = false;
            this.vertical = vertical;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-resizer ${ vertical ? 'vertical' : 'horizontal' }`).children(this.unhideHoverEl = m_element.h('div', `${ m_config.cssPrefix }-resizer-hover`).on('dblclick.stop', evt => this.mousedblclickHandler(evt)).css('position', 'absolute').hide(), this.hoverEl = m_element.h('div', `${ m_config.cssPrefix }-resizer-hover`).on('mousedown.stop', evt => this.mousedownHandler(evt)), this.lineEl = m_element.h('div', `${ m_config.cssPrefix }-resizer-line`).hide()).hide();
            this.cRect = null;
            this.finishedFn = null;
            this.minDistance = minDistance;
            this.unhideFn = () => {
            };
        }
        showUnhide(index) {
            this.unhideIndex = index;
            this.unhideHoverEl.show();
        }
        hideUnhide() {
            this.unhideHoverEl.hide();
        }
        show(rect, line) {
            const {moving, vertical, hoverEl, lineEl, el, unhideHoverEl} = this;
            if (moving)
                return;
            this.cRect = rect;
            const {left, top, width, height} = rect;
            el.offset({
                left: vertical ? left + width - 5 : left,
                top: vertical ? top : top + height - 5
            }).show();
            hoverEl.offset({
                width: vertical ? 5 : width,
                height: vertical ? height : 5
            });
            lineEl.offset({
                width: vertical ? 0 : line.width,
                height: vertical ? line.height : 0
            });
            unhideHoverEl.offset({
                left: vertical ? 5 - width : left,
                top: vertical ? top : 5 - height,
                width: vertical ? 5 : width,
                height: vertical ? height : 5
            });
        }
        hide() {
            this.el.offset({
                left: 0,
                top: 0
            }).hide();
            this.hideUnhide();
        }
        mousedblclickHandler() {
            if (this.unhideIndex)
                this.unhideFn(this.unhideIndex);
        }
        mousedownHandler(evt) {
            let startEvt = evt;
            const {el, lineEl, cRect, vertical, minDistance} = this;
            let distance = vertical ? cRect.width : cRect.height;
            lineEl.show();
            m_event.mouseMoveUp(window, e => {
                this.moving = true;
                if (startEvt !== null && e.buttons === 1) {
                    if (vertical) {
                        distance += e.movementX;
                        if (distance > minDistance) {
                            el.css('left', `${ cRect.left + distance }px`);
                        }
                    } else {
                        distance += e.movementY;
                        if (distance > minDistance) {
                            el.css('top', `${ cRect.top + distance }px`);
                        }
                    }
                    startEvt = e;
                }
            }, () => {
                startEvt = null;
                lineEl.hide();
                this.moving = false;
                this.hide();
                if (this.finishedFn) {
                    if (distance < minDistance)
                        distance = minDistance;
                    this.finishedFn(cRect, distance);
                }
            });
        }
    };
});
define('skylark-xspreadsheet/component/scrollbar',[
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    return class Scrollbar {
        constructor(vertical) {
            this.vertical = vertical;
            this.moveFn = null;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-scrollbar ${ vertical ? 'vertical' : 'horizontal' }`).child(this.contentEl = m_element.h('div', '')).on('mousemove.stop', () => {
            }).on('scroll.stop', evt => {
                const {scrollTop, scrollLeft} = evt.target;
                if (this.moveFn) {
                    this.moveFn(this.vertical ? scrollTop : scrollLeft, evt);
                }
            });
        }
        move(v) {
            this.el.scroll(v);
            return this;
        }
        scroll() {
            return this.el.scroll();
        }
        set(distance, contentDistance) {
            const d = distance - 1;
            if (contentDistance > d) {
                const cssKey = this.vertical ? 'height' : 'width';
                this.el.css(cssKey, `${ d - 15 }px`).show();
                this.contentEl.css(this.vertical ? 'width' : 'height', '1px').css(cssKey, `${ contentDistance }px`);
            } else {
                this.el.hide();
            }
            return this;
        }
    };
});
define('skylark-xspreadsheet/component/selector',[
    './element',
    '../config',
    '../core/cell_range'
], function (m_element, m_config, m_cell_range) {
    'use strict';
    const selectorHeightBorderWidth = 2 * 2 - 1;
    let startZIndex = 10;
    class SelectorElement {
        constructor(useHideInput = false) {
            this.useHideInput = useHideInput;
            this.inputChange = () => {
            };
            this.cornerEl = m_element.h('div', `${ m_config.cssPrefix }-selector-corner`);
            this.areaEl = m_element.h('div', `${ m_config.cssPrefix }-selector-area`).child(this.cornerEl).hide();
            this.clipboardEl = m_element.h('div', `${ m_config.cssPrefix }-selector-clipboard`).hide();
            this.autofillEl = m_element.h('div', `${ m_config.cssPrefix }-selector-autofill`).hide();
            this.el = m_element.h('div', `${ m_config.cssPrefix }-selector`).css('z-index', `${ startZIndex }`).children(this.areaEl, this.clipboardEl, this.autofillEl).hide();
            if (useHideInput) {
                this.hideInput = m_element.h('input', '').on('compositionend', evt => {
                    this.inputChange(evt.target.value);
                });
                this.el.child(this.hideInputDiv = m_element.h('div', 'hide-input').child(this.hideInput));
                this.el.child(this.hideInputDiv = m_element.h('div', 'hide-input').child(this.hideInput));
            }
            startZIndex += 1;
        }
        setOffset(v) {
            this.el.offset(v).show();
            return this;
        }
        hide() {
            this.el.hide();
            return this;
        }
        setAreaOffset(v) {
            const {left, top, width, height} = v;
            const of = {
                width: width - selectorHeightBorderWidth + 0.8,
                height: height - selectorHeightBorderWidth + 0.8,
                left: left - 0.8,
                top: top - 0.8
            };
            this.areaEl.offset(of).show();
            if (this.useHideInput) {
                this.hideInputDiv.offset(of);
                this.hideInput.val('').focus();
            }
        }
        setClipboardOffset(v) {
            const {left, top, width, height} = v;
            this.clipboardEl.offset({
                left,
                top,
                width: width - 5,
                height: height - 5
            });
        }
        showAutofill(v) {
            const {left, top, width, height} = v;
            this.autofillEl.offset({
                width: width - selectorHeightBorderWidth,
                height: height - selectorHeightBorderWidth,
                left,
                top
            }).show();
        }
        hideAutofill() {
            this.autofillEl.hide();
        }
        showClipboard() {
            this.clipboardEl.show();
        }
        hideClipboard() {
            this.clipboardEl.hide();
        }
    }
    function calBRAreaOffset(offset) {
        const {data} = this;
        const {left, top, width, height, scroll, l, t} = offset;
        const ftwidth = data.freezeTotalWidth();
        const ftheight = data.freezeTotalHeight();
        let left0 = left - ftwidth;
        if (ftwidth > l)
            left0 -= scroll.x;
        let top0 = top - ftheight;
        if (ftheight > t)
            top0 -= scroll.y;
        return {
            left: left0,
            top: top0,
            width,
            height
        };
    }
    function calTAreaOffset(offset) {
        const {data} = this;
        const {left, width, height, l, t, scroll} = offset;
        const ftwidth = data.freezeTotalWidth();
        let left0 = left - ftwidth;
        if (ftwidth > l)
            left0 -= scroll.x;
        return {
            left: left0,
            top: t,
            width,
            height
        };
    }
    function calLAreaOffset(offset) {
        const {data} = this;
        const {top, width, height, l, t, scroll} = offset;
        const ftheight = data.freezeTotalHeight();
        let top0 = top - ftheight;
        if (ftheight > t)
            top0 -= scroll.y;
        return {
            left: l,
            top: top0,
            width,
            height
        };
    }
    function setBRAreaOffset(offset) {
        const {br} = this;
        br.setAreaOffset(calBRAreaOffset.call(this, offset));
    }
    function setTLAreaOffset(offset) {
        const {tl} = this;
        tl.setAreaOffset(offset);
    }
    function setTAreaOffset(offset) {
        const {t} = this;
        t.setAreaOffset(calTAreaOffset.call(this, offset));
    }
    function setLAreaOffset(offset) {
        const {l} = this;
        l.setAreaOffset(calLAreaOffset.call(this, offset));
    }
    function setLClipboardOffset(offset) {
        const {l} = this;
        l.setClipboardOffset(calLAreaOffset.call(this, offset));
    }
    function setBRClipboardOffset(offset) {
        const {br} = this;
        br.setClipboardOffset(calBRAreaOffset.call(this, offset));
    }
    function setTLClipboardOffset(offset) {
        const {tl} = this;
        tl.setClipboardOffset(offset);
    }
    function setTClipboardOffset(offset) {
        const {t} = this;
        t.setClipboardOffset(calTAreaOffset.call(this, offset));
    }
    function setAllAreaOffset(offset) {
        setBRAreaOffset.call(this, offset);
        setTLAreaOffset.call(this, offset);
        setTAreaOffset.call(this, offset);
        setLAreaOffset.call(this, offset);
    }
    function setAllClipboardOffset(offset) {
        setBRClipboardOffset.call(this, offset);
        setTLClipboardOffset.call(this, offset);
        setTClipboardOffset.call(this, offset);
        setLClipboardOffset.call(this, offset);
    }
    return class Selector {
        constructor(data) {
            this.inputChange = () => {
            };
            this.data = data;
            this.br = new SelectorElement(true);
            this.t = new SelectorElement();
            this.l = new SelectorElement();
            this.tl = new SelectorElement();
            this.br.inputChange = v => {
                this.inputChange(v);
            };
            this.br.el.show();
            this.offset = null;
            this.areaOffset = null;
            this.indexes = null;
            this.range = null;
            this.arange = null;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-selectors`).children(this.tl.el, this.t.el, this.l.el, this.br.el).hide();
            this.lastri = -1;
            this.lastci = -1;
            startZIndex += 1;
        }
        resetData(data) {
            this.data = data;
            this.range = data.selector.range;
            this.resetAreaOffset();
        }
        hide() {
            this.el.hide();
        }
        resetOffset() {
            const {data, tl, t, l, br} = this;
            const freezeHeight = data.freezeTotalHeight();
            const freezeWidth = data.freezeTotalWidth();
            if (freezeHeight > 0 || freezeWidth > 0) {
                tl.setOffset({
                    width: freezeWidth,
                    height: freezeHeight
                });
                t.setOffset({
                    left: freezeWidth,
                    height: freezeHeight
                });
                l.setOffset({
                    top: freezeHeight,
                    width: freezeWidth
                });
                br.setOffset({
                    left: freezeWidth,
                    top: freezeHeight
                });
            } else {
                tl.hide();
                t.hide();
                l.hide();
                br.setOffset({
                    left: 0,
                    top: 0
                });
            }
        }
        resetAreaOffset() {
            const offset = this.data.getSelectedRect();
            const coffset = this.data.getClipboardRect();
            setAllAreaOffset.call(this, offset);
            setAllClipboardOffset.call(this, coffset);
            this.resetOffset();
        }
        resetBRTAreaOffset() {
            const offset = this.data.getSelectedRect();
            const coffset = this.data.getClipboardRect();
            setBRAreaOffset.call(this, offset);
            setTAreaOffset.call(this, offset);
            setBRClipboardOffset.call(this, coffset);
            setTClipboardOffset.call(this, coffset);
            this.resetOffset();
        }
        resetBRLAreaOffset() {
            const offset = this.data.getSelectedRect();
            const coffset = this.data.getClipboardRect();
            setBRAreaOffset.call(this, offset);
            setLAreaOffset.call(this, offset);
            setBRClipboardOffset.call(this, coffset);
            setLClipboardOffset.call(this, coffset);
            this.resetOffset();
        }
        set(ri, ci, indexesUpdated = true) {
            const {data} = this;
            const cellRange = data.calSelectedRangeByStart(ri, ci);
            const {sri, sci} = cellRange;
            if (indexesUpdated) {
                let [cri, cci] = [
                    ri,
                    ci
                ];
                if (ri < 0)
                    cri = 0;
                if (ci < 0)
                    cci = 0;
                data.selector.setIndexes(cri, cci);
                this.indexes = [
                    cri,
                    cci
                ];
            }
            this.moveIndexes = [
                sri,
                sci
            ];
            this.range = cellRange;
            this.resetAreaOffset();
            this.el.show();
        }
        setEnd(ri, ci, moving = true) {
            const {data, lastri, lastci} = this;
            if (moving) {
                if (ri === lastri && ci === lastci)
                    return;
                this.lastri = ri;
                this.lastci = ci;
            }
            this.range = data.calSelectedRangeByEnd(ri, ci);
            setAllAreaOffset.call(this, this.data.getSelectedRect());
        }
        reset() {
            const {eri, eci} = this.data.selector.range;
            this.setEnd(eri, eci);
        }
        showAutofill(ri, ci) {
            if (ri === -1 && ci === -1)
                return;
            const {sri, sci, eri, eci} = this.range;
            const [nri, nci] = [
                ri,
                ci
            ];
            const srn = sri - ri;
            const scn = sci - ci;
            const ern = eri - ri;
            const ecn = eci - ci;
            if (scn > 0) {
                this.arange = new m_cell_range.CellRange(sri, nci, eri, sci - 1);
            } else if (srn > 0) {
                this.arange = new m_cell_range.CellRange(nri, sci, sri - 1, eci);
            } else if (ecn < 0) {
                this.arange = new m_cell_range.CellRange(sri, eci + 1, eri, nci);
            } else if (ern < 0) {
                this.arange = new m_cell_range.CellRange(eri + 1, sci, nri, eci);
            } else {
                this.arange = null;
                return;
            }
            if (this.arange !== null) {
                const offset = this.data.getRect(this.arange);
                offset.width += 2;
                offset.height += 2;
                const {br, l, t, tl} = this;
                br.showAutofill(calBRAreaOffset.call(this, offset));
                l.showAutofill(calLAreaOffset.call(this, offset));
                t.showAutofill(calTAreaOffset.call(this, offset));
                tl.showAutofill(offset);
            }
        }
        hideAutofill() {
            [
                'br',
                'l',
                't',
                'tl'
            ].forEach(property => {
                this[property].hideAutofill();
            });
        }
        showClipboard() {
            const coffset = this.data.getClipboardRect();
            setAllClipboardOffset.call(this, coffset);
            [
                'br',
                'l',
                't',
                'tl'
            ].forEach(property => {
                this[property].showClipboard();
            });
        }
        hideClipboard() {
            [
                'br',
                'l',
                't',
                'tl'
            ].forEach(property => {
                this[property].hideClipboard();
            });
        }
    };
});
define('skylark-xspreadsheet/component/suggest',[
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    function inputMovePrev(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        if (this.itemIndex >= 0)
            filterItems[this.itemIndex].toggle();
        this.itemIndex -= 1;
        if (this.itemIndex < 0) {
            this.itemIndex = filterItems.length - 1;
        }
        filterItems[this.itemIndex].toggle();
    }
    function inputMoveNext(evt) {
        evt.stopPropagation();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        if (this.itemIndex >= 0)
            filterItems[this.itemIndex].toggle();
        this.itemIndex += 1;
        if (this.itemIndex > filterItems.length - 1) {
            this.itemIndex = 0;
        }
        filterItems[this.itemIndex].toggle();
    }
    function inputEnter(evt) {
        evt.preventDefault();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        evt.stopPropagation();
        if (this.itemIndex < 0)
            this.itemIndex = 0;
        filterItems[this.itemIndex].el.click();
        this.hide();
    }
    function inputKeydownHandler(evt) {
        const {keyCode} = evt;
        if (evt.ctrlKey) {
            evt.stopPropagation();
        }
        switch (keyCode) {
        case 37: // left
            evt.stopPropagation();
            break;
        case 38: // up
          inputMovePrev.call(this, evt);
          break;
        case 39: // right
          evt.stopPropagation();
          break;
        case 40: // down
          inputMoveNext.call(this, evt);
          break;
        case 13: // enter
          inputEnter.call(this, evt);
          break;
        case 9:
          inputEnter.call(this, evt);
            break;
        default:
            evt.stopPropagation();
            break;
        }
    }
    class Suggest {
        constructor(items, itemClick, width = '200px') {
            this.filterItems = [];
            this.items = items;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-suggest`).css('width', width).hide();
            this.itemClick = itemClick;
            this.itemIndex = -1;
        }
        setOffset(v) {
            this.el.cssRemoveKeys('top', 'bottom').offset(v);
        }
        hide() {
            const {el} = this;
            this.filterItems = [];
            this.itemIndex = -1;
            el.hide();
            m_event.unbindClickoutside(this.el.parent());
        }
        setItems(items) {
            this.items = items;
        }
        search(word) {
            let {items} = this;
            if (!/^\s*$/.test(word)) {
                items = items.filter(it => (it.key || it).startsWith(word.toUpperCase()));
            }
            items = items.map(it => {
                let {title} = it;
                if (title) {
                    if (typeof title === 'function') {
                        title = title();
                    }
                } else {
                    title = it;
                }
                const item = m_element.h('div', `${ m_config.cssPrefix }-item`).child(title).on('click.stop', () => {
                    this.itemClick(it);
                    this.hide();
                });
                if (it.label) {
                    item.child(m_element.h('div', 'label').html(it.label));
                }
                return item;
            });
            this.filterItems = items;
            if (items.length <= 0) {
                return;
            }
            const {el} = this;
            el.html('').children(...items).show();
            m_event.bindClickoutside(el.parent(), () => {
                this.hide();
            });
        }
        bindInputEvents(input) {
            input.on('keydown', evt => inputKeydownHandler.call(this, evt));
        }
    }

    return Suggest;
});
define('skylark-xspreadsheet/component/icon',[
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    return class Icon extends m_element.Element {
        constructor(name) {
            super('div', `${ m_config.cssPrefix }-icon`);
            this.iconNameEl = m_element.h('div', `${ m_config.cssPrefix }-icon-img ${ name }`);
            this.child(this.iconNameEl);
        }
        setName(name) {
            this.iconNameEl.className(`${ m_config.cssPrefix }-icon-img ${ name }`);
        }
    };
});
define('skylark-xspreadsheet/component/calendar',[
    './element',
    './icon',
    '../locale/locale'
], function (m_element, Icon, m_locale) {
    'use strict';
    function addMonth(date, step) {
        date.setMonth(date.getMonth() + step);
    }
    function weekday(date, index) {
        const d = new Date(date);
        d.setDate(index - date.getDay() + 1);
        return d;
    }
    function monthDays(year, month, cdate) {
        const startDate = new Date(year, month, 1, 23, 59, 59);
        const datess = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for (let i = 0; i < 6; i += 1) {
            for (let j = 0; j < 7; j += 1) {
                const index = i * 7 + j;
                const d = weekday(startDate, index);
                const disabled = d.getMonth() !== month;
                const active = d.getMonth() === cdate.getMonth() && d.getDate() === cdate.getDate();
                datess[i][j] = {
                    d,
                    disabled,
                    active
                };
            }
        }
        return datess;
    }
    

    class Calendar {
        constructor(value) {
            this.value = value;
            this.cvalue = new Date(value);
            this.headerLeftEl = m_element.h('div', 'calendar-header-left');
            this.bodyEl = m_element.h('tbody', '');
            this.buildAll();
            this.el = m_element.h('div', 'x-spreadsheet-calendar').children(m_element.h('div', 'calendar-header').children(this.headerLeftEl, m_element.h('div', 'calendar-header-right').children(m_element.h('m_element', 'calendar-prev').on('click.stop', () => this.prev()).child(new Icon('chevron-left')), m_element.h('m_element', 'calendar-next').on('click.stop', () => this.next()).child(new Icon('chevron-right')))), m_element.h('table', 'calendar-body').children(m_element.h('thead', '').child(m_element.h('tr', '').children(...m_locale.t('calendar.weeks').map(week => m_element.h('th', 'cell').child(week)))), this.bodyEl));
            this.selectChange = () => {
            };
        }
        setValue(value) {
            this.value = value;
            this.cvalue = new Date(value);
            this.buildAll();
        }
        prev() {
            const {value} = this;
            addMonth(value, -1);
            this.buildAll();
        }
        next() {
            const {value} = this;
            addMonth(value, 1);
            this.buildAll();
        }
        buildAll() {
            this.buildHeaderLeft();
            this.buildBody();
        }
        buildHeaderLeft() {
            const {value} = this;
            this.headerLeftEl.html(`${ m_locale.t('calendar.months')[value.getMonth()] } ${ value.getFullYear() }`);
        }
        buildBody() {
            const {value, cvalue, bodyEl} = this;
            const mDays = monthDays(value.getFullYear(), value.getMonth(), cvalue);
            const trs = mDays.map(it => {
                const tds = it.map(it1 => {
                    let cls = 'cell';
                    if (it1.disabled)
                        cls += ' disabled';
                    if (it1.active)
                        cls += ' active';
                    return m_element.h('td', '').child(m_element.h('div', cls).on('click.stop', () => {
                        this.selectChange(it1.d);
                    }).child(it1.d.getDate().toString()));
                });
                return m_element.h('tr', '').children(...tds);
            });
            bodyEl.html('').children(...trs);
        }
    }

    return Calendar;
});
define('skylark-xspreadsheet/component/datepicker',[
    './calendar',
    './element',
    '../config'
], function (Calendar, m_element, m_config) {
    'use strict';
    return class Datepicker {
        constructor() {
            this.calendar = new Calendar(new Date());
            this.el = m_element.h('div', `${ m_config.cssPrefix }-datepicker`).child(this.calendar.el).hide();
        }
        setValue(date) {
            const {calendar} = this;
            if (typeof date === 'string') {
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
                    calendar.setValue(new Date(date.replace(new RegExp('-', 'g'), '/')));
                }
            } else if (date instanceof Date) {
                calendar.setValue(date);
            }
            return this;
        }
        change(cb) {
            this.calendar.selectChange = d => {
                cb(d);
                this.hide();
            };
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
        }
    };
});
define('skylark-xspreadsheet/component/editor',[
    './element',
    './suggest',
    './datepicker',
    '../config'
], function (m_element, Suggest, Datepicker, m_config) {
    'use strict';
    function resetTextareaSize() {
        const {inputText} = this;
        if (!/^\s*$/.test(inputText)) {
            const {textlineEl, textEl, areaOffset} = this;
            const txts = inputText.split('\n');
            const maxTxtSize = Math.max(...txts.map(it => it.length));
            const tlOffset = textlineEl.offset();
            const fontWidth = tlOffset.width / inputText.length;
            const tlineWidth = (maxTxtSize + 1) * fontWidth + 5;
            const maxWidth = this.viewFn().width - areaOffset.left - fontWidth;
            let h1 = txts.length;
            if (tlineWidth > areaOffset.width) {
                let twidth = tlineWidth;
                if (tlineWidth > maxWidth) {
                    twidth = maxWidth;
                    h1 += parseInt(tlineWidth / maxWidth, 10);
                    h1 += tlineWidth % maxWidth > 0 ? 1 : 0;
                }
                textEl.css('width', `${ twidth }px`);
            }
            h1 *= this.rowHeight;
            if (h1 > areaOffset.height) {
                textEl.css('height', `${ h1 }px`);
            }
        }
    }
    function insertText({target}, itxt) {
        const {value, selectionEnd} = target;
        const ntxt = `${ value.slice(0, selectionEnd) }${ itxt }${ value.slice(selectionEnd) }`;
        target.value = ntxt;
        target.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
        this.inputText = ntxt;
        this.textlineEl.html(ntxt);
        resetTextareaSize.call(this);
    }
    function keydownEventHandler(evt) {
        const {keyCode, altKey} = evt;
        if (keyCode !== 13 && keyCode !== 9)
            evt.stopPropagation();
        if (keyCode === 13 && altKey) {
            insertText.call(this, evt, '\n');
            evt.stopPropagation();
        }
        if (keyCode === 13 && !altKey)
            evt.preventDefault();
    }
    function inputEventHandler(evt) {
        const v = evt.target.value;
        const {suggest, textlineEl, validator} = this;
        const {cell} = this;
        if (cell !== null) {
            if ('editable' in cell && cell.editable === true || cell.editable === undefined) {
                this.inputText = v;
                if (validator) {
                    if (validator.type === 'list') {
                        suggest.search(v);
                    } else {
                        suggest.hide();
                    }
                } else {
                    const start = v.lastIndexOf('=');
                    if (start !== -1) {
                        suggest.search(v.substring(start + 1));
                    } else {
                        suggest.hide();
                    }
                }
                textlineEl.html(v);
                resetTextareaSize.call(this);
                this.change('input', v);
            } else {
                evt.target.value = '';
            }
        } else {
            this.inputText = v;
            if (validator) {
                if (validator.type === 'list') {
                    suggest.search(v);
                } else {
                    suggest.hide();
                }
            } else {
                const start = v.lastIndexOf('=');
                if (start !== -1) {
                    suggest.search(v.substring(start + 1));
                } else {
                    suggest.hide();
                }
            }
            textlineEl.html(v);
            resetTextareaSize.call(this);
            this.change('input', v);
        }
    }
    function setTextareaRange(position) {
        const {el} = this.textEl;
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(position, position);
        }, 0);
    }
    function setText(text, position) {
        const {textEl, textlineEl} = this;
        textEl.el.blur();
        textEl.val(text);
        textlineEl.html(text);
        setTextareaRange.call(this, position);
    }
    function suggestItemClick(it) {
        const {inputText, validator} = this;
        let position = 0;
        if (validator && validator.type === 'list') {
            this.inputText = it;
            position = this.inputText.length;
        } else {
            const start = inputText.lastIndexOf('=');
            const sit = inputText.substring(0, start + 1);
            let eit = inputText.substring(start + 1);
            if (eit.indexOf(')') !== -1) {
                eit = eit.substring(eit.indexOf(')'));
            } else {
                eit = '';
            }
            this.inputText = `${ sit + it.key }(`;
            position = this.inputText.length;
            this.inputText += `)${ eit }`;
        }
        setText.call(this, this.inputText, position);
    }
    function resetSuggestItems() {
        this.suggest.setItems(this.formulas);
    }
    function dateFormat(d) {
        let month = d.getMonth() + 1;
        let date = d.getDate();
        if (month < 10)
            month = `0${ month }`;
        if (date < 10)
            date = `0${ date }`;
        return `${ d.getFullYear() }-${ month }-${ date }`;
    }
    return class Editor {
        constructor(formulas, viewFn, rowHeight) {
            this.viewFn = viewFn;
            this.rowHeight = rowHeight;
            this.formulas = formulas;
            this.suggest = new Suggest(formulas, it => {
                suggestItemClick.call(this, it);
            });
            this.datepicker = new Datepicker();
            this.datepicker.change(d => {
                this.setText(dateFormat(d));
                this.clear();
            });
            this.areaEl = m_element.h('div', `${ m_config.cssPrefix }-editor-area`).children(this.textEl = m_element.h('textarea', '').on('input', evt => inputEventHandler.call(this, evt)).on('paste.stop', () => {
            }).on('keydown', evt => keydownEventHandler.call(this, evt)), this.textlineEl = m_element.h('div', 'textline'), this.suggest.el, this.datepicker.el).on('mousemove.stop', () => {
            }).on('mousedown.stop', () => {
            });
            this.el = m_element.h('div', `${ m_config.cssPrefix }-editor`).child(this.areaEl).hide();
            this.suggest.bindInputEvents(this.textEl);
            this.areaOffset = null;
            this.freeze = {
                w: 0,
                h: 0
            };
            this.cell = null;
            this.inputText = '';
            this.change = () => {
            };
        }
        setFreezeLengths(width, height) {
            this.freeze.w = width;
            this.freeze.undefined = height;
        }
        clear() {
            if (this.inputText !== '') {
                this.change('finished', this.inputText);
            }
            this.cell = null;
            this.areaOffset = null;
            this.inputText = '';
            this.el.hide();
            this.textEl.val('');
            this.textlineEl.html('');
            resetSuggestItems.call(this);
            this.datepicker.hide();
        }
        setOffset(offset, suggestPosition = 'top') {
            const {textEl, areaEl, suggest, freeze, el} = this;
            if (offset) {
                this.areaOffset = offset;
                const {left, top, width, height, l, t} = offset;
                const elOffset = {
                    left: 0,
                    top: 0
                };
                if (freeze.w > l && freeze.undefined > t) {
                } else if (freeze.w < l && freeze.undefined < t) {
                    elOffset.left = freeze.w;
                    elOffset.top = freeze.undefined;
                } else if (freeze.w > l) {
                    elOffset.top = freeze.undefined;
                } else if (freeze.undefined > t) {
                    elOffset.left = freeze.w;
                }
                el.offset(elOffset);
                areaEl.offset({
                    left: left - elOffset.left - 0.8,
                    top: top - elOffset.top - 0.8
                });
                textEl.offset({
                    width: width - 9 + 0.8,
                    height: height - 3 + 0.8
                });
                const sOffset = { left: 0 };
                sOffset[suggestPosition] = height;
                suggest.setOffset(sOffset);
                suggest.hide();
            }
        }
        setCell(cell, validator) {
            const {el, datepicker, suggest} = this;
            el.show();
            this.cell = cell;
            const text = cell && cell.text || '';
            this.setText(text);
            this.validator = validator;
            if (validator) {
                const {type} = validator;
                if (type === 'date') {
                    datepicker.show();
                    if (!/^\s*$/.test(text)) {
                        datepicker.setValue(text);
                    }
                }
                if (type === 'list') {
                    suggest.setItems(validator.values());
                    suggest.search('');
                }
            }
        }
        setText(text) {
            this.inputText = text;
            setText.call(this, text, text.length);
            resetTextareaSize.call(this);
        }
    };
});
define('skylark-xspreadsheet/component/button',[
    './element',
    '../config',
    '../locale/locale'
], function (m_element, m_config, m_locale) {
    'use strict';
    return class Button extends m_element.Element {
        constructor(title, type = '') {
            super('div', `${ m_config.cssPrefix }-button ${ type }`);
            this.child(m_locale.t(`button.${ title }`));
        }
    };
});
define('skylark-xspreadsheet/canvas/draw',[],function () {
    'use strict';
    function dpr() {
        return window.devicePixelRatio || 1;
    }
    function thinLineWidth() {
        return dpr() - 0.5;
    }
    function npx(px) {
        return parseInt(px * dpr(), 10);
    }
    function npxLine(px) {
        const n = npx(px);
        return n > 0 ? n - 0.5 : 0.5;
    }
    class DrawBox {
        constructor(x, y, w, h, padding = 0) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.padding = padding;
            this.bgcolor = '#ffffff';
            this.borderTop = null;
            this.borderRight = null;
            this.borderBottom = null;
            this.borderLeft = null;
        }
        setBorders({top, bottom, left, right}) {
            if (top)
                this.borderTop = top;
            if (right)
                this.borderRight = right;
            if (bottom)
                this.borderBottom = bottom;
            if (left)
                this.borderLeft = left;
        }
        innerWidth() {
            return this.width - this.padding * 2 - 2;
        }
        innerHeight() {
            return this.height - this.padding * 2 - 2;
        }
        textx(align) {
            const {width, padding} = this;
            let {x} = this;
            if (align === 'left') {
                x += padding;
            } else if (align === 'center') {
                x += width / 2;
            } else if (align === 'right') {
                x += width - padding;
            }
            return x;
        }
        texty(align, h) {
            const {height, padding} = this;
            let {y} = this;
            if (align === 'top') {
                y += padding;
            } else if (align === 'middle') {
                y += height / 2 - h / 2;
            } else if (align === 'bottom') {
                y += height - padding - h;
            }
            return y;
        }
        topxys() {
            const {x, y, width} = this;
            return [
                [
                    x,
                    y
                ],
                [
                    x + width,
                    y
                ]
            ];
        }
        rightxys() {
            const {x, y, width, height} = this;
            return [
                [
                    x + width,
                    y
                ],
                [
                    x + width,
                    y + height
                ]
            ];
        }
        bottomxys() {
            const {x, y, width, height} = this;
            return [
                [
                    x,
                    y + height
                ],
                [
                    x + width,
                    y + height
                ]
            ];
        }
        leftxys() {
            const {x, y, height} = this;
            return [
                [
                    x,
                    y
                ],
                [
                    x,
                    y + height
                ]
            ];
        }
    }
    function drawFontLine(type, tx, ty, align, valign, blheight, blwidth) {
        const floffset = {
            x: 0,
            y: 0
        };
        if (type === 'underline') {
            if (valign === 'bottom') {
                floffset.y = 0;
            } else if (valign === 'top') {
                floffset.y = -(blheight + 2);
            } else {
                floffset.y = -blheight / 2;
            }
        } else if (type === 'strike') {
            if (valign === 'bottom') {
                floffset.y = blheight / 2;
            } else if (valign === 'top') {
                floffset.y = -(blheight / 2 + 2);
            }
        }
        if (align === 'center') {
            floffset.x = blwidth / 2;
        } else if (align === 'right') {
            floffset.x = blwidth;
        }
        this.line([
            tx - floffset.x,
            ty - floffset.y
        ], [
            tx - floffset.x + blwidth,
            ty - floffset.y
        ]);
    }
    class Draw {
        constructor(el, width, height) {
            this.el = el;
            this.ctx = el.getContext('2d');
            this.resize(width, height);
            this.ctx.scale(dpr(), dpr());
        }
        resize(width, height) {
            this.el.style.width = `${ width }px`;
            this.el.style.height = `${ height }px`;
            this.el.width = npx(width);
            this.el.height = npx(height);
        }
        clear() {
            const {width, height} = this.el;
            this.ctx.clearRect(0, 0, width, height);
            return this;
        }
        attr(options) {
            Object.assign(this.ctx, options);
            return this;
        }
        save() {
            this.ctx.save();
            this.ctx.beginPath();
            return this;
        }
        restore() {
            this.ctx.restore();
            return this;
        }
        beginPath() {
            this.ctx.beginPath();
            return this;
        }
        translate(x, y) {
            this.ctx.translate(npx(x), npx(y));
            return this;
        }
        scale(x, y) {
            this.ctx.scale(x, y);
            return this;
        }
        clearRect(x, y, w, h) {
            this.ctx.clearRect(x, y, w, h);
            return this;
        }
        fillRect(x, y, w, h) {
            this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
            return this;
        }
        fillText(text, x, y) {
            this.ctx.fillText(text, npx(x), npx(y));
            return this;
        }
        text(mtxt, box, attr = {}, textWrap = true) {
            const {ctx} = this;
            const {align, valign, font, color, strike, underline} = attr;
            const tx = box.textx(align);
            ctx.save();
            ctx.beginPath();
            this.attr({
                textAlign: align,
                textBaseline: valign,
                font: `${ font.italic ? 'italic' : '' } ${ font.bold ? 'bold' : '' } ${ npx(font.size) }px ${ font.name }`,
                fillStyle: color,
                strokeStyle: color
            });
            const txts = `${ mtxt }`.split('\n');
            const biw = box.innerWidth();
            const ntxts = [];
            txts.forEach(it => {
                const txtWidth = ctx.measureText(it).width;
                if (textWrap && txtWidth > npx(biw)) {
                    let textLine = {
                        w: 0,
                        len: 0,
                        start: 0
                    };
                    for (let i = 0; i < it.length; i += 1) {
                        if (textLine.w >= npx(biw)) {
                            ntxts.push(it.substr(textLine.start, textLine.len));
                            textLine = {
                                w: 0,
                                len: 0,
                                start: i
                            };
                        }
                        textLine.len += 1;
                        textLine.w += ctx.measureText(it[i]).width + 1;
                    }
                    if (textLine.len > 0) {
                        ntxts.push(it.substr(textLine.start, textLine.len));
                    }
                } else {
                    ntxts.push(it);
                }
            });
            const txtHeight = (ntxts.length - 1) * (font.size + 2);
            let ty = box.texty(valign, txtHeight);
            ntxts.forEach(txt => {
                const txtWidth = ctx.measureText(txt).width;
                this.fillText(txt, tx, ty);
                if (strike) {
                    drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, txtWidth);
                }
                if (underline) {
                    drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, txtWidth);
                }
                ty += font.size + 2;
            });
            ctx.restore();
            return this;
        }
        border(style, color) {
            const {ctx} = this;
            ctx.lineWidth = thinLineWidth;
            ctx.strokeStyle = color;
            if (style === 'medium') {
                ctx.lineWidth = npx(2) - 0.5;
            } else if (style === 'thick') {
                ctx.lineWidth = npx(3);
            } else if (style === 'dashed') {
                ctx.setLineDash([
                    npx(3),
                    npx(2)
                ]);
            } else if (style === 'dotted') {
                ctx.setLineDash([
                    npx(1),
                    npx(1)
                ]);
            } else if (style === 'double') {
                ctx.setLineDash([
                    npx(2),
                    0
                ]);
            }
            return this;
        }
        line(...xys) {
            const {ctx} = this;
            if (xys.length > 1) {
                ctx.beginPath();
                const [x, y] = xys[0];
                ctx.moveTo(npxLine(x), npxLine(y));
                for (let i = 1; i < xys.length; i += 1) {
                    const [x1, y1] = xys[i];
                    ctx.lineTo(npxLine(x1), npxLine(y1));
                }
                ctx.stroke();
            }
            return this;
        }
        strokeBorders(box) {
            const {ctx} = this;
            ctx.save();
            const {borderTop, borderRight, borderBottom, borderLeft} = box;
            if (borderTop) {
                this.border(...borderTop);
                this.line(...box.topxys());
            }
            if (borderRight) {
                this.border(...borderRight);
                this.line(...box.rightxys());
            }
            if (borderBottom) {
                this.border(...borderBottom);
                this.line(...box.bottomxys());
            }
            if (borderLeft) {
                this.border(...borderLeft);
                this.line(...box.leftxys());
            }
            ctx.restore();
        }
        dropdown(box) {
            const {ctx} = this;
            const {x, y, width, height} = box;
            const sx = x + width - 15;
            const sy = y + height - 15;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(npx(sx), npx(sy));
            ctx.lineTo(npx(sx + 8), npx(sy));
            ctx.lineTo(npx(sx + 4), npx(sy + 6));
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 0, 0, .45)';
            ctx.fill();
            ctx.restore();
        }
        error(box) {
            const {ctx} = this;
            const {x, y, width} = box;
            const sx = x + width - 1;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(npx(sx - 8), npx(y - 1));
            ctx.lineTo(npx(sx), npx(y - 1));
            ctx.lineTo(npx(sx), npx(y + 8));
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 0, 0, .65)';
            ctx.fill();
            ctx.restore();
        }
        frozen(box) {
            const {ctx} = this;
            const {x, y, width} = box;
            const sx = x + width - 1;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(npx(sx - 8), npx(y - 1));
            ctx.lineTo(npx(sx), npx(y - 1));
            ctx.lineTo(npx(sx), npx(y + 8));
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 255, 0, .85)';
            ctx.fill();
            ctx.restore();
        }
        rect(box, dtextcb) {
            const {ctx} = this;
            const {x, y, width, height, bgcolor} = box;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = bgcolor || '#fff';
            ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
            ctx.clip();
            ctx.fill();
            dtextcb();
            ctx.restore();
        }
    }

    return {
        Draw,
        DrawBox,
        thinLineWidth,
        npx
    };
});
define('skylark-xspreadsheet/core/font',[],function () {
    'use strict';
    const baseFonts = [
        {
            key: 'Arial',
            title: 'Arial'
        },
        {
            key: 'Helvetica',
            title: 'Helvetica'
        },
        {
            key: 'Source Sans Pro',
            title: 'Source Sans Pro'
        },
        {
            key: 'Comic Sans MS',
            title: 'Comic Sans MS'
        },
        {
            key: 'Courier New',
            title: 'Courier New'
        },
        {
            key: 'Verdana',
            title: 'Verdana'
        },
        {
            key: 'Lato',
            title: 'Lato'
        }
    ];
    const fontSizes = [
        {
            pt: 7.5,
            px: 10
        },
        {
            pt: 8,
            px: 11
        },
        {
            pt: 9,
            px: 12
        },
        {
            pt: 10,
            px: 13
        },
        {
            pt: 10.5,
            px: 14
        },
        {
            pt: 11,
            px: 15
        },
        {
            pt: 12,
            px: 16
        },
        {
            pt: 14,
            px: 18.7
        },
        {
            pt: 15,
            px: 20
        },
        {
            pt: 16,
            px: 21.3
        },
        {
            pt: 18,
            px: 24
        },
        {
            pt: 22,
            px: 29.3
        },
        {
            pt: 24,
            px: 32
        },
        {
            pt: 26,
            px: 34.7
        },
        {
            pt: 36,
            px: 48
        },
        {
            pt: 42,
            px: 56
        }
    ];
    function getFontSizePxByPt(pt) {
        for (let i = 0; i < fontSizes.length; i += 1) {
            const fontSize = fontSizes[i];
            if (fontSize.pt === pt) {
                return fontSize.px;
            }
        }
        return pt;
    }
    function fonts(ary = []) {
        const map = {};
        baseFonts.concat(ary).forEach(f => {
            map[f.key] = f;
        });
        return map;
    }

    return {
        fontSizes,
        fonts,
        baseFonts,
        getFontSizePxByPt
    };
});
define('skylark-xspreadsheet/core/cell',[
    './alphabet',
    './helper'
], function (m_alphabet, m_helper) {
    'use strict';

// Converting infix expression to a suffix expression
// src: AVERAGE(SUM(A1,A2), B1) + 50 + B20
// return: [A1, A2], SUM[, B1],AVERAGE,50,+,B20,+

    const infixExprToSuffixExpr = src => {
        const operatorStack = [];
        const stack = [];
        let subStrs = [];
        let fnArgType = 0;
        let fnArgOperator = '';
        let fnArgsLen = 1;
        let oldc = '';
        for (let i = 0; i < src.length; i += 1) {
            const c = src.charAt(i);
            if (c !== ' ') {
                if (c >= 'a' && c <= 'z') {
                    subStrs.push(c.toUpperCase());
                } else if (c >= '0' && c <= '9' || c >= 'A' && c <= 'Z' || c === '.') {
                    subStrs.push(c);
                } else if (c === '"') {
                    i += 1;
                    while (src.charAt(i) !== '"') {
                        subStrs.push(src.charAt(i));
                        i += 1;
                    }
                    stack.push(`"${ subStrs.join('') }`);
                    subStrs = [];
                } else if (c === '-' && /[+\-*/,(]/.test(oldc)) {
                    subStrs.push(c);
                } else {
                    if (c !== '(' && subStrs.length > 0) {
                        stack.push(subStrs.join(''));
                    }
                    if (c === ')') {
                        let c1 = operatorStack.pop();
                        if (fnArgType === 2) {
                            try {
                                const [ex, ey] = m_alphabet.expr2xy(stack.pop());
                                const [sx, sy] = m_alphabet.expr2xy(stack.pop());
                                let rangelen = 0;
                                for (let x = sx; x <= ex; x += 1) {
                                    for (let y = sy; y <= ey; y += 1) {
                                        stack.push(m_alphabet.xy2expr(x, y));
                                        rangelen += 1;
                                    }
                                }
                                stack.push([
                                    c1,
                                    rangelen
                                ]);
                            } catch (e) {
                            }
                        } else if (fnArgType === 1 || fnArgType === 3) {
                            if (fnArgType === 3)
                                stack.push(fnArgOperator);
                            stack.push([
                                c1,
                                fnArgsLen
                            ]);
                            fnArgsLen = 1;
                        } else {
                            while (c1 !== '(') {
                                stack.push(c1);
                                if (operatorStack.length <= 0)
                                    break;
                                c1 = operatorStack.pop();
                            }
                        }
                        fnArgType = 0;
                    } else if (c === '=' || c === '>' || c === '<') {
                        const nc = src.charAt(i + 1);
                        fnArgOperator = c;
                        if (nc === '=' || nc === '-') {
                            fnArgOperator += nc;
                            i += 1;
                        }
                        fnArgType = 3;
                    } else if (c === ':') {
                        fnArgType = 2;
                    } else if (c === ',') {
                        if (fnArgType === 3) {
                            stack.push(fnArgOperator);
                        }
                        fnArgType = 1;
                        fnArgsLen += 1;
                    } else if (c === '(' && subStrs.length > 0) {
                        operatorStack.push(subStrs.join(''));
                    } else {
                        if (operatorStack.length > 0 && (c === '+' || c === '-')) {
                            let top = operatorStack[operatorStack.length - 1];
                            if (top !== '(')
                                stack.push(operatorStack.pop());
                            if (top === '*' || top === '/') {
                                while (operatorStack.length > 0) {
                                    top = operatorStack[operatorStack.length - 1];
                                    if (top !== '(')
                                        stack.push(operatorStack.pop());
                                    else
                                        break;
                                }
                            }
                        } else if (operatorStack.length > 0) {
                            const top = operatorStack[operatorStack.length - 1];
                            if (top === '*' || top === '/')
                                stack.push(operatorStack.pop());
                        }
                        operatorStack.push(c);
                    }
                    subStrs = [];
                }
                oldc = c;
            }
        }
        if (subStrs.length > 0) {
            stack.push(subStrs.join(''));
        }
        while (operatorStack.length > 0) {
            stack.push(operatorStack.pop());
        }
        return stack;
    };
    const evalSubExpr = (subExpr, cellRender) => {
        const [fl] = subExpr;
        let expr = subExpr;
        if (fl === '"') {
            return subExpr.substring(1);
        }
        let ret = 1;
        if (fl === '-') {
            expr = subExpr.substring(1);
            ret = -1;
        }
        if (expr[0] >= '0' && expr[0] <= '9') {
            return ret * Number(expr);
        }
        const [x, y] = m_alphabet.expr2xy(expr);
        return ret * cellRender(x, y);
    };

// evaluate the suffix expression
// srcStack: <= infixExprToSufixExpr
// formulaMap: {'SUM': {}, ...}
// cellRender: (x, y) => {}
    const evalSuffixExpr = (srcStack, formulaMap, cellRender, cellList) => {
        const stack = [];
        for (let i = 0; i < srcStack.length; i += 1) {
            const expr = srcStack[i];
            const fc = expr[0];
            if (expr === '+') {
                const top = stack.pop();
                stack.push(m_helper.numberCalc('+', stack.pop(), top));
            } else if (expr === '-') {
                if (stack.length === 1) {
                    const top = stack.pop();
                    stack.push(m_helper.numberCalc('*', top, -1));
                } else {
                    const top = stack.pop();
                    stack.push(m_helper.numberCalc('-', stack.pop(), top));
                }
            } else if (expr === '*') {
                stack.push(m_helper.numberCalc('*', stack.pop(), stack.pop()));
            } else if (expr === '/') {
                const top = stack.pop();
                stack.push(m_helper.numberCalc('/', stack.pop(), top));
            } else if (fc === '=' || fc === '>' || fc === '<') {
                let top = stack.pop();
                if (!Number.isNaN(top))
                    top = Number(top);
                let left = stack.pop();
                if (!Number.isNaN(left))
                    left = Number(left);
                let ret = false;
                if (fc === '=') {
                    ret = left === top;
                } else if (expr === '>') {
                    ret = left > top;
                } else if (expr === '>=') {
                    ret = left >= top;
                } else if (expr === '<') {
                    ret = left < top;
                } else if (expr === '<=') {
                    ret = left <= top;
                }
                stack.push(ret);
            } else if (Array.isArray(expr)) {
                const [formula, len] = expr;
                const params = [];
                for (let j = 0; j < len; j += 1) {
                    params.push(stack.pop());
                }
                stack.push(formulaMap[formula].render(params.reverse()));
            } else {
                if (cellList.includes(expr)) {
                    return 0;
                }
                if (fc >= 'a' && fc <= 'z' || fc >= 'A' && fc <= 'Z') {
                    cellList.push(expr);
                }
                stack.push(evalSubExpr(expr, cellRender));
                cellList.pop();
            }
        }
        return stack[0];
    };
    const cellRender = (src, formulaMap, getCellText, cellList = []) => {
        if (src[0] === '=') {
            const stack = infixExprToSuffixExpr(src.substring(1));
            if (stack.length <= 0)
                return src;
            return evalSuffixExpr(stack, formulaMap, (x, y) => cellRender(getCellText(x, y), formulaMap, getCellText, cellList), cellList);
        }
        return src;
    };

    return {
        render: cellRender ,
        infixExprToSuffixExpr
    };
});
define('skylark-xspreadsheet/core/formula',[
    '../locale/locale',
    './helper'
], function (m_locale, m_helper) {
    'use strict';
    const baseFormulas = [
        {
            key: 'SUM',
            title: m_locale.tf('formula.sum'),
            render: ary => ary.reduce((a, b) => m_helper.numberCalc('+', a, b), 0)
        },
        {
            key: 'AVERAGE',
            title: m_locale.tf('formula.average'),
            render: ary => ary.reduce((a, b) => Number(a) + Number(b), 0) / ary.length
        },
        {
            key: 'MAX',
            title: m_locale.tf('formula.max'),
            render: ary => Math.max(...ary.map(v => Number(v)))
        },
        {
            key: 'MIN',
            title: m_locale.tf('formula.min'),
            render: ary => Math.min(...ary.map(v => Number(v)))
        },
        {
            key: 'IF',
            title: m_locale.tf('formula._if'),
            render: ([b, t, f]) => b ? t : f
        },
        {
            key: 'AND',
            title: m_locale.tf('formula.and'),
            render: ary => ary.every(it => it)
        },
        {
            key: 'OR',
            title: m_locale.tf('formula.or'),
            render: ary => ary.some(it => it)
        },
        {
            key: 'CONCAT',
            title: m_locale.tf('formula.concat'),
            render: ary => ary.join('')
        }
    ];
    const formulas = baseFormulas;
    const formulam = {};
    baseFormulas.forEach(f => {
        formulam[f.key] = f;
    });
    
    return  {
        formulam,
        formulas,
        baseFormulas
    };
});
define('skylark-xspreadsheet/core/format',['../locale/locale'], function (m_locale) {
    'use strict';
    const formatStringRender = v => v;
    const formatNumberRender = v => {
        if (/^(-?\d*.?\d*)$/.test(v)) {
            const v1 = Number(v).toFixed(2).toString();
            const [first, ...parts] = v1.split('\\.');
            return [
                first.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                ...parts
            ];
        }
        return v;
    };
    const baseFormats = [
        {
            key: 'normal',
            title: m_locale.tf('format.normal'),
            type: 'string',
            render: formatStringRender
        },
        {
            key: 'text',
            title: m_locale.tf('format.text'),
            type: 'string',
            render: formatStringRender
        },
        {
            key: 'number',
            title: m_locale.tf('format.number'),
            type: 'number',
            label: '1,000.12',
            render: formatNumberRender
        },
        {
            key: 'percent',
            title: m_locale.tf('format.percent'),
            type: 'number',
            label: '10.12%',
            render: v => `${ v }%`
        },
        {
            key: 'rmb',
            title: m_locale.tf('format.rmb'),
            type: 'number',
            label: '\uFFE510.00',
            render: v => `￥${ formatNumberRender(v) }`
        },
        {
            key: 'usd',
            title: m_locale.tf('format.usd'),
            type: 'number',
            label: '$10.00',
            render: v => `$${ formatNumberRender(v) }`
        },
        {
            key: 'eur',
            title: m_locale.tf('format.eur'),
            type: 'number',
            label: '\u20AC10.00',
            render: v => `€${ formatNumberRender(v) }`
        },
        {
            key: 'date',
            title: m_locale.tf('format.date'),
            type: 'date',
            label: '26/09/2008',
            render: formatStringRender
        },
        {
            key: 'time',
            title: m_locale.tf('format.time'),
            type: 'date',
            label: '15:59:00',
            render: formatStringRender
        },
        {
            key: 'datetime',
            title: m_locale.tf('format.datetime'),
            type: 'date',
            label: '26/09/2008 15:59:00',
            render: formatStringRender
        },
        {
            key: 'duration',
            title: m_locale.tf('format.duration'),
            type: 'date',
            label: '24:01:00',
            render: formatStringRender
        }
    ];
    const formatm = {};
    baseFormats.forEach(f => {
        formatm[f.key] = f;
    });

    return {
        formatm,
        baseFormats
    };
});
define('skylark-xspreadsheet/component/table',[
    '../core/alphabet',
    '../core/font',
    '../core/cell',
    '../core/formula',
    '../core/format',
    '../canvas/draw'
], function (m_alphabet, m_font, m_cell, m_formula, m_format, m_draw) {
    'use strict';
    const cellPaddingWidth = 5;
    const tableFixedHeaderCleanStyle = { fillStyle: '#f4f5f8' };
    const tableGridStyle = {
        fillStyle: '#fff',
        lineWidth: m_draw.thinLineWidth,
        strokeStyle: '#e6e6e6'
    };
    function tableFixedHeaderStyle() {
        return {
            textAlign: 'center',
            textBaseline: 'middle',
            font: `500 ${ m_draw.npx(12) }px Source Sans Pro`,
            fillStyle: '#585757',
            lineWidth: m_draw.thinLineWidth(),
            strokeStyle: '#e6e6e6'
        };
    }
    function getDrawBox(data, rindex, cindex, yoffset = 0) {
        const {left, top, width, height} = data.cellRect(rindex, cindex);
        return new m_draw.DrawBox(left, top + yoffset, width, height, cellPaddingWidth);
    }
    
    function renderCell(draw, data, rindex, cindex, yoffset = 0) {
        const {sortedRowMap, rows, cols} = data;
        if (rows.isHide(rindex) || cols.isHide(cindex))
            return;
        let nrindex = rindex;
        if (sortedRowMap.has(rindex)) {
            nrindex = sortedRowMap.get(rindex);
        }
        const cell = data.getCell(nrindex, cindex);
        if (cell === null)
            return;
        let frozen = false;
        if ('editable' in cell && cell.editable === false) {
            frozen = true;
        }
        const style = data.getCellStyleOrDefault(nrindex, cindex);
        const dbox = getDrawBox(data, rindex, cindex, yoffset);
        dbox.bgcolor = style.bgcolor;
        if (style.border !== undefined) {
            dbox.setBorders(style.border);
            draw.strokeBorders(dbox);
        }
        draw.rect(dbox, () => {
            let cellText = m_cell.render(cell.text || '', m_formula.formulam, (y, x) => data.getCellTextOrDefault(x, y));
            if (style.format) {
                cellText = m_format.formatm[style.format].render(cellText);
            }
            const font = Object.assign({}, style.font);
            font.size = m_font.getFontSizePxByPt(font.size);
            draw.text(cellText, dbox, {
                align: style.align,
                valign: style.valign,
                font,
                color: style.color,
                strike: style.strike,
                underline: style.underline
            }, style.textwrap);
            const error = data.validations.getError(rindex, cindex);
            if (error) {
                draw.error(dbox);
            }
            if (frozen) {
                draw.frozen(dbox);
            }
        });
    }
    function renderAutofilter(viewRange) {
        const {data, draw} = this;
        if (viewRange) {
            const {autoFilter} = data;
            if (!autoFilter.active())
                return;
            const afRange = autoFilter.hrange();
            if (viewRange.intersects(afRange)) {
                afRange.each((ri, ci) => {
                    const dbox = getDrawBox(data, ri, ci);
                    draw.dropdown(dbox);
                });
            }
        }
    }
    function renderContent(viewRange, fw, fh, tx, ty) {
        const {draw, data} = this;
        draw.save();
        draw.translate(fw, fh).translate(tx, ty);
        const {exceptRowSet} = data;
        const filteredTranslateFunc = ri => {
            const ret = exceptRowSet.has(ri);
            if (ret) {
                const height = data.rows.getHeight(ri);
                draw.translate(0, -height);
            }
            return !ret;
        };
        const exceptRowTotalHeight = data.exceptRowTotalHeight(viewRange.sri, viewRange.eri);
        draw.save();
        draw.translate(0, -exceptRowTotalHeight);
        viewRange.each((ri, ci) => {
            renderCell(draw, data, ri, ci);
        }, ri => filteredTranslateFunc(ri));
        draw.restore();
        const rset = new Set();
        draw.save();
        draw.translate(0, -exceptRowTotalHeight);
        data.eachMergesInView(viewRange, ({sri, sci, eri}) => {
            if (!exceptRowSet.has(sri)) {
                renderCell(draw, data, sri, sci);
            } else if (!rset.has(sri)) {
                rset.add(sri);
                const height = data.rows.sumHeight(sri, eri + 1);
                draw.translate(0, -height);
            }
        });
        draw.restore();
        renderAutofilter.call(this, viewRange);
        draw.restore();
    }
    function renderSelectedHeaderCell(x, y, w, h) {
        const {draw} = this;
        draw.save();
        draw.attr({ fillStyle: 'rgba(75, 137, 255, 0.08)' }).fillRect(x, y, w, h);
        draw.restore();
    }
    function renderFixedHeaders(type, viewRange, w, h, tx, ty) {
        const {draw, data} = this;
        const sumHeight = viewRange.h;
        const sumWidth = viewRange.w;
        const nty = ty + h;
        const ntx = tx + w;
        draw.save();
        draw.attr(tableFixedHeaderCleanStyle);
        if (type === 'all' || type === 'left')
            draw.fillRect(0, nty, w, sumHeight);
        if (type === 'all' || type === 'top')
            draw.fillRect(ntx, 0, sumWidth, h);
        const {sri, sci, eri, eci} = data.selector.range;
        draw.attr(tableFixedHeaderStyle());
        if (type === 'all' || type === 'left') {
            data.rowEach(viewRange.sri, viewRange.eri, (i, y1, rowHeight) => {
                const y = nty + y1;
                const ii = i;
                draw.line([
                    0,
                    y
                ], [
                    w,
                    y
                ]);
                if (sri <= ii && ii < eri + 1) {
                    renderSelectedHeaderCell.call(this, 0, y, w, rowHeight);
                }
                draw.fillText(ii + 1, w / 2, y + rowHeight / 2);
                if (i > 0 && data.rows.isHide(i - 1)) {
                    draw.save();
                    draw.attr({ strokeStyle: '#c6c6c6' });
                    draw.line([
                        5,
                        y + 5
                    ], [
                        w - 5,
                        y + 5
                    ]);
                    draw.restore();
                }
            });
            draw.line([
                0,
                sumHeight + nty
            ], [
                w,
                sumHeight + nty
            ]);
            draw.line([
                w,
                nty
            ], [
                w,
                sumHeight + nty
            ]);
        }
        if (type === 'all' || type === 'top') {
            data.colEach(viewRange.sci, viewRange.eci, (i, x1, colWidth) => {
                const x = ntx + x1;
                const ii = i;
                draw.line([
                    x,
                    0
                ], [
                    x,
                    h
                ]);
                if (sci <= ii && ii < eci + 1) {
                    renderSelectedHeaderCell.call(this, x, 0, colWidth, h);
                }
                draw.fillText(m_alphabet.stringAt(ii), x + colWidth / 2, h / 2);
                if (i > 0 && data.cols.isHide(i - 1)) {
                    draw.save();
                    draw.attr({ strokeStyle: '#c6c6c6' });
                    draw.line([
                        x + 5,
                        5
                    ], [
                        x + 5,
                        h - 5
                    ]);
                    draw.restore();
                }
            });
            draw.line([
                sumWidth + ntx,
                0
            ], [
                sumWidth + ntx,
                h
            ]);
            draw.line([
                0,
                h
            ], [
                sumWidth + ntx,
                h
            ]);
        }
        draw.restore();
    }
    function renderFixedLeftTopCell(fw, fh) {
        const {draw} = this;
        draw.save();
        draw.attr({ fillStyle: '#f4f5f8' }).fillRect(0, 0, fw, fh);
        draw.restore();
    }
    function renderContentGrid({sri, sci, eri, eci, w, h}, fw, fh, tx, ty) {
        const {draw, data} = this;
        const {settings} = data;
        draw.save();
        draw.attr(tableGridStyle).translate(fw + tx, fh + ty);
        draw.clearRect(0, 0, w, h);
        if (!settings.showGrid) {
            draw.restore();
            return;
        }
        data.rowEach(sri, eri, (i, y, ch) => {
            if (i !== sri)
                draw.line([
                    0,
                    y
                ], [
                    w,
                    y
                ]);
            if (i === eri)
                draw.line([
                    0,
                    y + ch
                ], [
                    w,
                    y + ch
                ]);
        });
        data.colEach(sci, eci, (i, x, cw) => {
            if (i !== sci)
                draw.line([
                    x,
                    0
                ], [
                    x,
                    h
                ]);
            if (i === eci)
                draw.line([
                    x + cw,
                    0
                ], [
                    x + cw,
                    h
                ]);
        });
        draw.restore();
    }
    function renderFreezeHighlightLine(fw, fh, ftw, fth) {
        const {draw, data} = this;
        const twidth = data.viewWidth() - fw;
        const theight = data.viewHeight() - fh;
        draw.save().translate(fw, fh).attr({ strokeStyle: 'rgba(75, 137, 255, .6)' });
        draw.line([
            0,
            fth
        ], [
            twidth,
            fth
        ]);
        draw.line([
            ftw,
            0
        ], [
            ftw,
            theight
        ]);
        draw.restore();
    }
    class Table {
        constructor(el, data) {
            this.el = el;
            this.draw = new m_draw.Draw(el, data.viewWidth(), data.viewHeight());
            this.data = data;
        }
        resetData(data) {
            this.data = data;
            this.render();
        }
        render() {
            const {data} = this;
            const {rows, cols} = data;
            const fw = cols.indexWidth;
            const fh = rows.height;
            this.draw.resize(data.viewWidth(), data.viewHeight());
            this.clear();
            const viewRange = data.viewRange();
            const tx = data.freezeTotalWidth();
            const ty = data.freezeTotalHeight();
            const {x, y} = data.scroll;
            renderContentGrid.call(this, viewRange, fw, fh, tx, ty);
            renderContent.call(this, viewRange, fw, fh, -x, -y);
            renderFixedHeaders.call(this, 'all', viewRange, fw, fh, tx, ty);
            renderFixedLeftTopCell.call(this, fw, fh);
            const [fri, fci] = data.freeze;
            if (fri > 0 || fci > 0) {
                if (fri > 0) {
                    const vr = viewRange.clone();
                    vr.sri = 0;
                    vr.eri = fri - 1;
                    vr.h = ty;
                    renderContentGrid.call(this, vr, fw, fh, tx, 0);
                    renderContent.call(this, vr, fw, fh, -x, 0);
                    renderFixedHeaders.call(this, 'top', vr, fw, fh, tx, 0);
                }
                if (fci > 0) {
                    const vr = viewRange.clone();
                    vr.sci = 0;
                    vr.eci = fci - 1;
                    vr.w = tx;
                    renderContentGrid.call(this, vr, fw, fh, 0, ty);
                    renderFixedHeaders.call(this, 'left', vr, fw, fh, 0, ty);
                    renderContent.call(this, vr, fw, fh, 0, -y);
                }
                const freezeViewRange = data.freezeViewRange();
                renderContentGrid.call(this, freezeViewRange, fw, fh, 0, 0);
                renderFixedHeaders.call(this, 'all', freezeViewRange, fw, fh, 0, 0);
                renderContent.call(this, freezeViewRange, fw, fh, 0, 0);
                renderFreezeHighlightLine.call(this, fw, fh, tx, ty);
            }
        }
        clear() {
            this.draw.clear();
        }
    }
    return {
        renderCell,
        Table
    };
});
define('skylark-xspreadsheet/component/print',[
    './element',
    '../config',
    './button',
    '../canvas/draw',
    './table',
    '../locale/locale'
], function (m_element, m_config, Button, m_draw, m_table, m_locale) {
    'use strict';
    const PAGER_SIZES = [
        [
            'A3',
            11.69,
            16.54
        ],
        [
            'A4',
            8.27,
            11.69
        ],
        [
            'A5',
            5.83,
            8.27
        ],
        [
            'B4',
            9.84,
            13.9
        ],
        [
            'B5',
            6.93,
            9.84
        ]
    ];
    const PAGER_ORIENTATIONS = [
        'landscape',
        'portrait'
    ];
    function inches2px(inc) {
        return parseInt(96 * inc, 10);
    }
    function btnClick(type) {
        if (type === 'cancel') {
            this.el.hide();
        } else {
            this.toPrint();
        }
    }
    function pagerSizeChange(evt) {
        const {paper} = this;
        const {value} = evt.target;
        const ps = PAGER_SIZES[value];
        paper.w = inches2px(ps[1]);
        paper.undefined = inches2px(ps[2]);
        this.preview();
    }
    function pagerOrientationChange(evt) {
        const {paper} = this;
        const {value} = evt.target;
        const v = PAGER_ORIENTATIONS[value];
        paper.orientation = v;
        this.preview();
    }
    return class Print {
        constructor(data) {
            this.paper = {
                w: inches2px(PAGER_SIZES[0][1]),
                h: inches2px(PAGER_SIZES[0][2]),
                padding: 50,
                orientation: PAGER_ORIENTATIONS[0],
                get width() {
                    return this.orientation === 'landscape' ? this.undefined : this.w;
                },
                get height() {
                    return this.orientation === 'landscape' ? this.w : this.undefined;
                }
            };
            this.data = data;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-print`).children(m_element.h('div', `${ m_config.cssPrefix }-print-bar`).children(m_element.h('div', '-title').child('Print settings'), m_element.h('div', '-right').children(m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', btnClick.bind(this, 'cancel')), new Button('next', 'primary').on('click', btnClick.bind(this, 'next'))))), m_element.h('div', `${ m_config.cssPrefix }-print-content`).children(this.contentEl = m_element.h('div', '-content'), m_element.h('div', '-sider').child(m_element.h('form', '').children(m_element.h('fieldset', '').children(m_element.h('label', '').child(`${ m_locale.t('print.size') }`), m_element.h('select', '').children(...PAGER_SIZES.map((it, index) => m_element.h('option', '').attr('value', index).child(`${ it[0] } ( ${ it[1] }''x${ it[2] }'' )`))).on('change', pagerSizeChange.bind(this))), m_element.h('fieldset', '').children(m_element.h('label', '').child(`${ m_locale.t('print.orientation') }`), m_element.h('select', '').children(...PAGER_ORIENTATIONS.map((it, index) => m_element.h('option', '').attr('value', index).child(`${ m_locale.t('print.orientations')[index] }`))).on('change', pagerOrientationChange.bind(this))))))).hide();
        }
        resetData(data) {
            this.data = data;
        }
        preview() {
            const {data, paper} = this;
            const {width, height, padding} = paper;
            const iwidth = width - padding * 2;
            const iheight = height - padding * 2;
            const cr = data.contentRange();
            const pages = parseInt(cr.undefined / iheight, 10) + 1;
            const scale = iwidth / cr.w;
            let left = padding;
            const top = padding;
            if (scale > 1) {
                left += (iwidth - cr.w) / 2;
            }
            let ri = 0;
            let yoffset = 0;
            this.contentEl.html('');
            this.canvases = [];
            const mViewRange = {
                sri: 0,
                sci: 0,
                eri: 0,
                eci: 0
            };
            for (let i = 0; i < pages; i += 1) {
                let th = 0;
                let yo = 0;
                const wrap = m_element.h('div', `${ m_config.cssPrefix }-canvas-card`);
                const canvas = m_element.h('canvas', `${ m_config.cssPrefix }-canvas`);
                this.canvases.push(canvas.el);
                const draw = new m_draw.Draw(canvas.el, width, height);
                draw.save();
                draw.translate(left, top);
                if (scale < 1)
                    draw.scale(scale, scale);
                for (; ri <= cr.eri; ri += 1) {
                    const rh = data.rows.getHeight(ri);
                    th += rh;
                    if (th < iheight) {
                        for (let ci = 0; ci <= cr.eci; ci += 1) {
                            m_table.renderCell(draw, data, ri, ci, yoffset);
                            mViewRange.eci = ci;
                        }
                    } else {
                        yo = -(th - rh);
                        break;
                    }
                }
                mViewRange.eri = ri;
                draw.restore();
                draw.save();
                draw.translate(left, top);
                if (scale < 1)
                    draw.scale(scale, scale);
                const yof = yoffset;
                data.eachMergesInView(mViewRange, ({sri, sci}) => {
                    m_table.renderCell(draw, data, sri, sci, yof);
                });
                draw.restore();
                mViewRange.sri = mViewRange.eri;
                mViewRange.sci = mViewRange.eci;
                yoffset += yo;
                this.contentEl.child(m_element.h('div', `${ m_config.cssPrefix }-canvas-card-wraper`).child(wrap.child(canvas)));
            }
            this.el.show();
        }
        toPrint() {
            this.el.hide();
            const {paper} = this;
            const iframe = m_element.h('iframe', '').hide();
            const {el} = iframe;
            window.document.body.appendChild(el);
            const {contentWindow} = el;
            const idoc = contentWindow.document;
            const style = document.createElement('style');
            style.innerHTML = `
      @page { size: ${ paper.width }px ${ paper.height }px; };
      canvas {
        page-break-before: auto;        
        page-break-after: always;
        image-rendering: pixelated;
      };
    `;
            idoc.head.appendChild(style);
            this.canvases.forEach(it => {
                const cn = it.cloneNode(false);
                const ctx = cn.getContext('2d');
                ctx.drawImage(it, 0, 0);
                idoc.body.appendChild(cn);
            });
            contentWindow.print();
        }
    };
});
define('skylark-xspreadsheet/component/contextmenu',[
    './element',
    './event',
    '../config',
    '../locale/locale'
], function (m_element, m_event, m_config, m_locale) {
    'use strict';
    const menuItems = [
        {
            key: 'copy',
            title: m_locale.tf('contextmenu.copy'),
            label: 'Ctrl+C'
        },
        {
            key: 'cut',
            title: m_locale.tf('contextmenu.cut'),
            label: 'Ctrl+X'
        },
        {
            key: 'paste',
            title: m_locale.tf('contextmenu.paste'),
            label: 'Ctrl+V'
        },
        {
            key: 'paste-value',
            title: m_locale.tf('contextmenu.pasteValue'),
            label: 'Ctrl+Shift+V'
        },
        {
            key: 'paste-format',
            title: m_locale.tf('contextmenu.pasteFormat'),
            label: 'Ctrl+Alt+V'
        },
        { key: 'divider' },
        {
            key: 'insert-row',
            title: m_locale.tf('contextmenu.insertRow')
        },
        {
            key: 'insert-column',
            title: m_locale.tf('contextmenu.insertColumn')
        },
        { key: 'divider' },
        {
            key: 'delete-row',
            title: m_locale.tf('contextmenu.deleteRow')
        },
        {
            key: 'delete-column',
            title: m_locale.tf('contextmenu.deleteColumn')
        },
        {
            key: 'delete-cell-text',
            title: m_locale.tf('contextmenu.deleteCellText')
        },
        {
            key: 'hide',
            title: m_locale.tf('contextmenu.hide')
        },
        { key: 'divider' },
        {
            key: 'validation',
            title: m_locale.tf('contextmenu.validation')
        },
        { key: 'divider' },
        {
            key: 'cell-printable',
            title: m_locale.tf('contextmenu.cellprintable')
        },
        {
            key: 'cell-non-printable',
            title: m_locale.tf('contextmenu.cellnonprintable')
        },
        { key: 'divider' },
        {
            key: 'cell-editable',
            title: m_locale.tf('contextmenu.celleditable')
        },
        {
            key: 'cell-non-editable',
            title: m_locale.tf('contextmenu.cellnoneditable')
        }
    ];
    function buildMenuItem(item) {
        if (item.key === 'divider') {
            return m_element.h('div', `${ m_config.cssPrefix }-item divider`);
        }
        return m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
            this.itemClick(item.key);
            this.hide();
        }).children(item.title(), m_element.h('div', 'label').child(item.label || ''));
    }
    function buildMenu() {
        return menuItems.map(it => buildMenuItem.call(this, it));
    }

    class ContextMenu {
        constructor(viewFn, isHide = false) {
            this.menuItems = buildMenu.call(this);
            this.el = m_element.h('div', `${ m_config.cssPrefix }-contextmenu`).children(...this.menuItems).hide();
            this.viewFn = viewFn;
            this.itemClick = () => {
            };
            this.isHide = isHide;
            this.setMode('range');
        }
        setMode(mode) {
            const hideEl = this.menuItems[12];
            if (mode === 'row-col') {
                hideEl.show();
            } else {
                hideEl.hide();
            }
        }
        hide() {
            const {el} = this;
            el.hide();
            m_event.unbindClickoutside(el);
        }
        setPosition(x, y) {
            if (this.isHide)
                return;
            const {el} = this;
            const {width} = el.show().offset();
            const view = this.viewFn();
            const vhf = view.height / 2;
            let left = x;
            if (view.width - x <= width) {
                left -= width;
            }
            el.css('left', `${ left }px`);
            if (y > vhf) {
                el.css('bottom', `${ view.height - y }px`).css('max-height', `${ y }px`).css('top', 'auto');
            } else {
                el.css('top', `${ y }px`).css('max-height', `${ view.height - y }px`).css('bottom', 'auto');
            }
            m_event.bindClickoutside(el);
        }
    }

    return ContextMenu;
});
define('skylark-xspreadsheet/component/tooltip',[
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    function tooltip(html, target) {
        if (target.classList.contains('active')) {
            return;
        }
        const {left, top, width, height} = target.getBoundingClientRect();
        const el = m_element.h('div', `${ m_config.cssPrefix }-tooltip`).html(html).show();
        document.body.appendChild(el.el);
        const elBox = el.box();
        el.css('left', `${ left + width / 2 - elBox.width / 2 }px`).css('top', `${ top + height + 2 }px`);
        m_event.bind(target, 'mouseleave', () => {
            if (document.body.contains(el.el)) {
                document.body.removeChild(el.el);
            }
        });
        m_event.bind(target, 'click', () => {
            if (document.body.contains(el.el)) {
                document.body.removeChild(el.el);
            }
        });
    }

    return tooltip;
});
define('skylark-xspreadsheet/component/toolbar/item',[
    '../../config',
    '../tooltip',
    '../element',
    '../../locale/locale'
], function (a, tooltip, b, c) {
    'use strict';
    return class Item {
        constructor(tag, shortcut, value) {
            this.tip = c.t(`toolbar.${ tag.replace(/-[a-z]/g, c => c[1].toUpperCase()) }`);
            if (shortcut)
                this.tip += ` (${ shortcut })`;
            this.tag = tag;
            this.shortcut = shortcut;
            this.value = value;
            this.el = this.element();
            this.change = () => {
            };
        }
        element() {
            const {tip} = this;
            return b.h('div', `${ a.cssPrefix }-toolbar-btn`).on('mouseenter', evt => {
                tooltip(tip, evt.target);
            }).attr('data-tooltip', tip);
        }
        setState() {
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/dropdown_item',['./item'], function (Item) {
    'use strict';
    return class DropdownItem extends Item {
        dropdown() {
        }
        getValue(v) {
            return v;
        }
        element() {
            const {tag} = this;
            this.dd = this.dropdown();
            this.dd.change = it => this.change(tag, this.getValue(it));
            return super.element().child(this.dd);
        }
        setState(v) {
            if (v) {
                this.value = v;
                this.dd.setTitle(v);
            }
        }
    };
});
define('skylark-xspreadsheet/component/dropdown',[
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    return class Dropdown extends m_element.Element {
        constructor(title, width, showArrow, placement, ...children) {
            super('div', `${ m_config.cssPrefix }-dropdown ${ placement }`);
            this.title = title;
            this.change = () => {
            };
            this.headerClick = () => {
            };
            if (typeof title === 'string') {
                this.title = m_element.h('div', `${ m_config.cssPrefix }-dropdown-title`).child(title);
            } else if (showArrow) {
                this.title.addClass('arrow-left');
            }
            this.contentEl = m_element.h('div', `${ m_config.cssPrefix }-dropdown-content`).css('width', width).hide();
            this.setContentChildren(...children);
            this.headerEl = m_element.h('div', `${ m_config.cssPrefix }-dropdown-header`);
            this.headerEl.on('click', () => {
                if (this.contentEl.css('display') !== 'block') {
                    this.show();
                } else {
                    this.hide();
                }
            }).children(this.title, showArrow ? m_element.h('div', `${ m_config.cssPrefix }-icon arrow-right`).child(m_element.h('div', `${ m_config.cssPrefix }-icon-img arrow-down`)) : '');
            this.children(this.headerEl, this.contentEl);
        }
        setContentChildren(...children) {
            this.contentEl.html('');
            if (children.length > 0) {
                this.contentEl.children(...children);
            }
        }
        setTitle(title) {
            this.title.html(title);
            this.hide();
        }
        show() {
            const {contentEl} = this;
            contentEl.show();
            this.parent().active();
            m_event.bindClickoutside(this.parent(), () => {
                this.hide();
            });
        }
        hide() {
            this.parent().active(false);
            this.contentEl.hide();
            m_event.unbindClickoutside(this.parent());
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_align',[
    './dropdown',
    './element',
    './icon',
    '../config'
], function (Dropdown, m_element, Icon, m_config) {
    'use strict';
    function buildItemWithIcon(iconName) {
        return m_element.h('div', `${ m_config.cssPrefix }-item`).child(new Icon(iconName));
    }
    return class DropdownAlign extends Dropdown {
        constructor(aligns, align) {
            const icon = new Icon(`align-${ align }`);
            const naligns = aligns.map(it => buildItemWithIcon(`align-${ it }`).on('click', () => {
                this.setTitle(it);
                this.change(it);
            }));
            super(icon, 'auto', true, 'bottom-left', ...naligns);
        }
        setTitle(align) {
            this.title.setName(`align-${ align }`);
            this.hide();
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/align',[
    './dropdown_item',
    '../dropdown_align'
], function (DropdownItem, DropdownAlign) {
    'use strict';
    
    class Align extends DropdownItem {
        constructor(value) {
            super('align', '', value);
        }
        dropdown() {
            const {value} = this;
            return new DropdownAlign([
                'left',
                'center',
                'right'
            ], value);
        }
    };

    return Align;
});
define('skylark-xspreadsheet/component/toolbar/valign',[
    './dropdown_item',
    '../dropdown_align'
], function (DropdownItem, DropdownAlign) {
    'use strict';
    return class Valign extends DropdownItem {
        constructor(value) {
            super('valign', '', value);
        }
        dropdown() {
            const {value} = this;
            return new DropdownAlign([
                'top',
                'middle',
                'bottom'
            ], value);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/toggle_item',[
    './item',
    '../icon'
], function (Item, Icon) {
    'use strict';
    return class ToggleItem extends Item {
        element() {
            const {tag} = this;
            return super.element().child(new Icon(tag)).on('click', () => this.click());
        }
        click() {
            this.change(this.tag, this.toggle());
        }
        setState(active) {
            this.el.active(active);
        }
        toggle() {
            return this.el.toggle();
        }
        active() {
            return this.el.hasClass('active');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/autofilter',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Autofilter extends ToggleItem {
        constructor() {
            super('autofilter');
        }
        setState() {
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/bold',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Bold extends ToggleItem {
        constructor() {
            super('font-bold', 'Ctrl+B');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/italic',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Italic extends ToggleItem {
        constructor() {
            super('font-italic', 'Ctrl+I');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/strike',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Strike extends ToggleItem {
        constructor() {
            super('strike', 'Ctrl+U');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/underline',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Underline extends ToggleItem {
        constructor() {
            super('underline', 'Ctrl+U');
        }
    };
});
define('skylark-xspreadsheet/component/color_palette',[
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    const themeColorPlaceHolders = [
        '#ffffff',
        '#000100',
        '#e7e5e6',
        '#445569',
        '#5b9cd6',
        '#ed7d31',
        '#a5a5a5',
        '#ffc001',
        '#4371c6',
        '#71ae47'
    ];
    const themeColors = [
        [
            '#f2f2f2',
            '#7f7f7f',
            '#d0cecf',
            '#d5dce4',
            '#deeaf6',
            '#fce5d5',
            '#ededed',
            '#fff2cd',
            '#d9e2f3',
            '#e3efd9'
        ],
        [
            '#d8d8d8',
            '#595959',
            '#afabac',
            '#adb8ca',
            '#bdd7ee',
            '#f7ccac',
            '#dbdbdb',
            '#ffe59a',
            '#b3c6e7',
            '#c5e0b3'
        ],
        [
            '#bfbfbf',
            '#3f3f3f',
            '#756f6f',
            '#8596b0',
            '#9cc2e6',
            '#f4b184',
            '#c9c9c9',
            '#fed964',
            '#8eaada',
            '#a7d08c'
        ],
        [
            '#a5a5a5',
            '#262626',
            '#3a3839',
            '#333f4f',
            '#2e75b5',
            '#c45a10',
            '#7b7b7b',
            '#bf8e01',
            '#2f5596',
            '#538136'
        ],
        [
            '#7f7f7f',
            '#0c0c0c',
            '#171516',
            '#222a35',
            '#1f4e7a',
            '#843c0a',
            '#525252',
            '#7e6000',
            '#203864',
            '#365624'
        ]
    ];
    const standardColors = [
        '#c00000',
        '#fe0000',
        '#fdc101',
        '#ffff01',
        '#93d051',
        '#00b04e',
        '#01b0f1',
        '#0170c1',
        '#012060',
        '#7030a0'
    ];
    function buildTd(bgcolor) {
        return m_element.h('td', '').child(m_element.h('div', `${ m_config.cssPrefix }-color-palette-cell`).on('click.stop', () => this.change(bgcolor)).css('background-color', bgcolor));
    }
    
    class ColorPalette {
        constructor() {
            this.el = m_element.h('div', `${ m_config.cssPrefix }-color-palette`);
            this.change = () => {
            };
            const table = m_element.h('table', '').children(m_element.h('tbody', '').children(m_element.h('tr', `${ m_config.cssPrefix }-theme-color-placeholders`).children(...themeColorPlaceHolders.map(color => buildTd.call(this, color))), ...themeColors.map(it => m_element.h('tr', `${ m_config.cssPrefix }-theme-colors`).children(...it.map(color => buildTd.call(this, color)))), m_element.h('tr', `${ m_config.cssPrefix }-standard-colors`).children(...standardColors.map(color => buildTd.call(this, color)))));
            this.el.child(table);
        }
    }

    return ColorPalette;
});
define('skylark-xspreadsheet/component/dropdown_color',[
    './dropdown',
    './icon',
    './color_palette'
], function (Dropdown, Icon, ColorPalette) {
    'use strict';
    return class DropdownColor extends Dropdown {
        constructor(iconName, color) {
            const icon = new Icon(iconName).css('height', '16px').css('border-bottom', `3px solid ${ color }`);
            const colorPalette = new ColorPalette();
            colorPalette.change = v => {
                this.setTitle(v);
                this.change(v);
            };
            super(icon, 'auto', false, 'bottom-left', colorPalette.el);
        }
        setTitle(color) {
            this.title.css('border-color', color);
            this.hide();
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_linetype',[
    './dropdown',
    './element',
    './icon',
    '../config'
], function (Dropdown, m_element, Icon, m_config) {
    'use strict';
    const lineTypes = [
        [
            'thin',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'medium',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="2" style="user-select: none;"><line x1="0" y1="1.0" x2="50" y2="1.0" stroke-width="2" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'thick',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="3" style="user-select: none;"><line x1="0" y1="1.5" x2="50" y2="1.5" stroke-width="3" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'dashed',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" stroke-dasharray="2" style="user-select: none;"></line></svg>'
        ],
        [
            'dotted',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" stroke-dasharray="1" style="user-select: none;"></line></svg>'
        ]
    ];
    return class DropdownLineType extends Dropdown {
        constructor(type) {
            const icon = new Icon('line-type');
            let beforei = 0;
            const lineTypeEls = lineTypes.map((it, iti) => m_element.h('div', `${ m_config.cssPrefix }-item state ${ type === it[0] ? 'checked' : '' }`).on('click', () => {
                lineTypeEls[beforei].toggle('checked');
                lineTypeEls[iti].toggle('checked');
                beforei = iti;
                this.hide();
                this.change(it);
            }).child(m_element.h('div', `${ m_config.cssPrefix }-line-type`).html(it[1])));
            super(icon, 'auto', false, 'bottom-left', ...lineTypeEls);
        }
    };
});
define('skylark-xspreadsheet/component/border_palette',[
    './element',
    './icon',
    './dropdown_color',
    './dropdown_linetype',
    '../config'
], function (m_element, Icon, DropdownColor, DropdownLineType, m_config) {
    'use strict';
    function buildTable(...trs) {
        return m_element.h('table', '').child(m_element.h('tbody', '').children(...trs));
    }
    function buildTd(iconName) {
        return m_element.h('td', '').child(m_element.h('div', `${ m_config.cssPrefix }-border-palette-cell`).child(new Icon(`border-${ iconName }`)).on('click', () => {
            this.mode = iconName;
            const {mode, style, color} = this;
            this.change({
                mode,
                style,
                color
            });
        }));
    }
    return class BorderPalette {
        constructor() {
            this.color = '#000';
            this.style = 'thin';
            this.mode = 'all';
            this.change = () => {
            };
            this.ddColor = new DropdownColor('line-color', this.color);
            this.ddColor.change = color => {
                this.color = color;
            };
            this.ddType = new DropdownLineType(this.style);
            this.ddType.change = ([s]) => {
                this.style = s;
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-border-palette`);
            const table = buildTable(m_element.h('tr', '').children(m_element.h('td', `${ m_config.cssPrefix }-border-palette-left`).child(buildTable(m_element.h('tr', '').children(...[
                'all',
                'inside',
                'horizontal',
                'vertical',
                'outside'
            ].map(it => buildTd.call(this, it))), m_element.h('tr', '').children(...[
                'left',
                'top',
                'right',
                'bottom',
                'none'
            ].map(it => buildTd.call(this, it))))), m_element.h('td', `${ m_config.cssPrefix }-border-palette-right`).children(m_element.h('div', `${ m_config.cssPrefix }-toolbar-btn`).child(this.ddColor.el), m_element.h('div', `${ m_config.cssPrefix }-toolbar-btn`).child(this.ddType.el))));
            this.el.child(table);
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_border',[
    './dropdown',
    './icon',
    './border_palette'
], function (Dropdown, Icon, BorderPalette) {
    'use strict';
    return class DropdownBorder extends Dropdown {
        constructor() {
            const icon = new Icon('border-all');
            const borderPalette = new BorderPalette();
            borderPalette.change = v => {
                this.change(v);
                this.hide();
            };
            super(icon, 'auto', false, 'bottom-left', borderPalette.el);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/border',[
    './dropdown_item',
    '../dropdown_border'
], function (DropdownItem, DropdownBorder) {
    'use strict';
    class Border extends DropdownItem {
        constructor() {
            super('border');
        }
        dropdown() {
            return new DropdownBorder();
        }
    }

    return Border;
});
define('skylark-xspreadsheet/component/toolbar/icon_item',[
    './item',
    '../icon'
], function (Item, Icon) {
    'use strict';
    return class IconItem extends Item {
        element() {
            return super.element().child(new Icon(this.tag)).on('click', () => this.change(this.tag));
        }
        setState(disabled) {
            this.el.disabled(disabled);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/clearformat',['./icon_item'], function (IconItem) {
    'use strict';
    return class Clearformat extends IconItem {
        constructor() {
            super('clearformat');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/paintformat',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Paintformat extends ToggleItem {
        constructor() {
            super('paintformat');
        }
        setState() {
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/text_color',[
    './dropdown_item',
    '../dropdown_color'
], function (DropdownItem, DropdownColor) {
    'use strict';
    return class TextColor extends DropdownItem {
        constructor(color) {
            super('color', undefined, color);
        }
        dropdown() {
            const {tag, value} = this;
            return new DropdownColor(tag, value);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/fill_color',[
    './dropdown_item',
    '../dropdown_color'
], function (DropdownItem, DropdownColor) {
    'use strict';
    return class FillColor extends DropdownItem {
        constructor(color) {
            super('bgcolor', undefined, color);
        }
        dropdown() {
            const {tag, value} = this;
            return new DropdownColor(tag, value);
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_fontsize',[
    './dropdown',
    './element',
    '../core/font',
    '../config'
], function (Dropdown, m_element, m_font, m_config) {
    'use strict';
    return class DropdownFontSize extends Dropdown {
        constructor() {
            const nfontSizes = m_font.fontSizes.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.setTitle(`${ it.pt }`);
                this.change(it);
            }).child(`${ it.pt }`));
            super('10', '60px', true, 'bottom-left', ...nfontSizes);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/font_size',[
    './dropdown_item',
    '../dropdown_fontsize'
], function (DropdownItem, DropdownFontsize) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('font-size');
        }
        getValue(it) {
            return it.pt;
        }
        dropdown() {
            return new DropdownFontsize();
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_font',[
    './dropdown',
    './element',
    '../core/font',
    '../config'
], function (Dropdown, m_element, m_font, m_config) {
    'use strict';
    return class DropdownFont extends Dropdown {
        constructor() {
            const nfonts = m_font.baseFonts.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.setTitle(it.title);
                this.change(it);
            }).child(it.title));
            super(m_font.baseFonts[0].title, '160px', true, 'bottom-left', ...nfonts);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/font',[
    './dropdown_item',
    '../dropdown_font'
], function (DropdownItem, DropdownFont) {
    'use strict';
    return class Font extends DropdownItem {
        constructor() {
            super('font-name');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFont();
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_format',[
    './dropdown',
    './element',
    '../core/format',
    '../config'
], function (Dropdown, m_element, m_format, m_config) {
    'use strict';
    return class DropdownFormat extends Dropdown {
        constructor() {
            let nformats = m_format.baseFormats.slice(0);
            nformats.splice(2, 0, { key: 'divider' });
            nformats.splice(8, 0, { key: 'divider' });
            nformats = nformats.map(it => {
                const item = m_element.h('div', `${ m_config.cssPrefix }-item`);
                if (it.key === 'divider') {
                    item.addClass('divider');
                } else {
                    item.child(it.title()).on('click', () => {
                        this.setTitle(it.title());
                        this.change(it);
                    });
                    if (it.label)
                        item.child(m_element.h('div', 'label').html(it.label));
                }
                return item;
            });
            super('Normal', '220px', true, 'bottom-left', ...nformats);
        }
        setTitle(key) {
            for (let i = 0; i < m_format.baseFormats.length; i += 1) {
                if (m_format.baseFormats[i].key === key) {
                    this.title.html(m_format.baseFormats[i].title());
                }
            }
            this.hide();
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/format',[
    './dropdown_item',
    '../dropdown_format'
], function (DropdownItem, DropdownFormat) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('format');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFormat();
        }
    };
});
define('skylark-xspreadsheet/component/dropdown_formula',[
    './dropdown',
    './icon',
    './element',
    '../core/formula',
    '../config'
], function (Dropdown, Icon, m_element, m_formula, m_config) {
    'use strict';
    return class DropdownFormula extends Dropdown {
        constructor() {
            const nformulas = m_formula.baseFormulas.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.hide();
                this.change(it);
            }).child(it.key));
            super(new Icon('formula'), '180px', true, 'bottom-left', ...nformulas);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/formula',[
    './dropdown_item',
    '../dropdown_formula'
], function (DropdownItem, DropdownFormula) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('formula');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFormula();
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/freeze',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Freeze extends ToggleItem {
        constructor() {
            super('freeze');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/merge',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Merge extends ToggleItem {
        constructor() {
            super('merge');
        }
        setState(active, disabled) {
            this.el.active(active).disabled(disabled);
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/redo',['./icon_item'], function (IconItem) {
    'use strict';
    return class Redo extends IconItem {
        constructor() {
            super('redo', 'Ctrl+Y');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/undo',['./icon_item'], function (IconItem) {
    'use strict';
    return class Undo extends IconItem {
        constructor() {
            super('undo', 'Ctrl+Z');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/print',['./icon_item'], function (IconItem) {
    'use strict';
    return class Print extends IconItem {
        constructor() {
            super('print', 'Ctrl+P');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/textwrap',['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Textwrap extends ToggleItem {
        constructor() {
            super('textwrap');
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/more',[
    '../dropdown',
    './dropdown_item',
    '../../config',
    '../element',
    '../icon'
], function (Dropdown, DropdownItem, a, b, Icon) {
    'use strict';
    class DropdownMore extends Dropdown {
        constructor() {
            const icon = new Icon('ellipsis');
            const moreBtns = b.h('div', `${ a.cssPrefix }-toolbar-more`);
            super(icon, 'auto', false, 'bottom-right', moreBtns);
            this.moreBtns = moreBtns;
            this.contentEl.css('max-width', '420px');
        }
    }
    return class More extends DropdownItem {
        constructor() {
            super('more');
            this.el.hide();
        }
        dropdown() {
            return new DropdownMore();
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
        }
    };
});
define('skylark-xspreadsheet/component/toolbar/index',[
    './align',
    './valign',
    './autofilter',
    './bold',
    './italic',
    './strike',
    './underline',
    './border',
    './clearformat',
    './paintformat',
    './text_color',
    './fill_color',
    './font_size',
    './font',
    './format',
    './formula',
    './freeze',
    './merge',
    './redo',
    './undo',
    './print',
    './textwrap',
    './more',
    '../element',
    '../../config',
    '../event'
], function (Align, Valign, Autofilter, Bold, Italic, Strike, Underline, Border, Clearformat, Paintformat, TextColor, FillColor, FontSize, Font, Format, Formula, Freeze, Merge, Redo, Undo, Print, Textwrap, More, a, b, c) {
    'use strict';
    function buildDivider() {
        return a.h('div', `${ b.cssPrefix }-toolbar-divider`);
    }
    function initBtns2() {
        this.btns2 = [];
        this.items.forEach(it => {
            if (Array.isArray(it)) {
                it.forEach(({el}) => {
                    const rect = el.box();
                    const {marginLeft, marginRight} = el.computedStyle();
                    this.btns2.push([
                        el,
                        rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)
                    ]);
                });
            } else {
                const rect = it.box();
                const {marginLeft, marginRight} = it.computedStyle();
                this.btns2.push([
                    it,
                    rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)
                ]);
            }
        });
    }
    function moreResize() {
        const {el, btns, moreEl, btns2} = this;
        const {moreBtns, contentEl} = moreEl.dd;
        el.css('width', `${ this.widthFn() - 60 }px`);
        const elBox = el.box();
        let sumWidth = 160;
        let sumWidth2 = 12;
        const list1 = [];
        const list2 = [];
        btns2.forEach(([it, w], index) => {
            sumWidth += w;
            if (index === btns2.length - 1 || sumWidth < elBox.width) {
                list1.push(it);
            } else {
                sumWidth2 += w;
                list2.push(it);
            }
        });
        btns.html('').children(...list1);
        moreBtns.html('').children(...list2);
        contentEl.css('width', `${ sumWidth2 }px`);
        if (list2.length > 0) {
            moreEl.show();
        } else {
            moreEl.hide();
        }
    }
    return class Toolbar {
        constructor(data, widthFn, isHide = false) {
            this.data = data;
            this.change = () => {
            };
            this.widthFn = widthFn;
            this.isHide = isHide;
            const style = data.defaultStyle();
            this.items = [
                [
                    this.undoEl = new Undo(),
                    this.redoEl = new Redo(),
                    new Print(),
                    this.paintformatEl = new Paintformat(),
                    this.clearformatEl = new Clearformat()
                ],
                buildDivider(),
                [this.formatEl = new Format()],
                buildDivider(),
                [
                    this.fontEl = new Font(),
                    this.fontSizeEl = new FontSize()
                ],
                buildDivider(),
                [
                    this.boldEl = new Bold(),
                    this.italicEl = new Italic(),
                    this.underlineEl = new Underline(),
                    this.strikeEl = new Strike(),
                    this.textColorEl = new TextColor(style.color)
                ],
                buildDivider(),
                [
                    this.fillColorEl = new FillColor(style.bgcolor),
                    this.borderEl = new Border(),
                    this.mergeEl = new Merge()
                ],
                buildDivider(),
                [
                    this.alignEl = new Align(style.align),
                    this.valignEl = new Valign(style.valign),
                    this.textwrapEl = new Textwrap()
                ],
                buildDivider(),
                [
                    this.freezeEl = new Freeze(),
                    this.autofilterEl = new Autofilter(),
                    this.formulaEl = new Formula(),
                    this.moreEl = new More()
                ]
            ];
            this.el = a.h('div', `${ b.cssPrefix }-toolbar`);
            this.btns = a.h('div', `${ b.cssPrefix }-toolbar-btns`);
            this.items.forEach(it => {
                if (Array.isArray(it)) {
                    it.forEach(i => {
                        this.btns.child(i.el);
                        i.change = (...args) => {
                            this.change(...args);
                        };
                    });
                } else {
                    this.btns.child(it.el);
                }
            });
            this.el.child(this.btns);
            if (isHide) {
                this.el.hide();
            } else {
                this.reset();
                setTimeout(() => {
                    initBtns2.call(this);
                    moreResize.call(this);
                }, 0);
                c.bind(window, 'resize', () => {
                    moreResize.call(this);
                });
            }
        }
        paintformatActive() {
            return this.paintformatEl.active();
        }
        paintformatToggle() {
            this.paintformatEl.toggle();
        }
        trigger(type) {
            this[`${ type }El`].click();
        }
        resetData(data) {
            this.data = data;
            this.reset();
        }
        reset() {
            if (this.isHide)
                return;
            const {data} = this;
            const style = data.getSelectedCellStyle();
            this.undoEl.setState(!data.canUndo());
            this.redoEl.setState(!data.canRedo());
            this.mergeEl.setState(data.canUnmerge(), !data.selector.multiple());
            this.autofilterEl.setState(!data.canAutofilter());
            const {font, format} = style;
            this.formatEl.setState(format);
            this.fontEl.setState(font.name);
            this.fontSizeEl.setState(font.size);
            this.boldEl.setState(font.bold);
            this.italicEl.setState(font.italic);
            this.underlineEl.setState(style.underline);
            this.strikeEl.setState(style.strike);
            this.textColorEl.setState(style.color);
            this.fillColorEl.setState(style.bgcolor);
            this.alignEl.setState(style.align);
            this.valignEl.setState(style.valign);
            this.textwrapEl.setState(style.textwrap);
            this.freezeEl.setState(data.freezeIsActive());
        }
    };
});
define('skylark-xspreadsheet/component/modal',[
    './element',
    './icon',
    '../config',
    './event'
], function (m_element, Icon, m_config, m_event) {
    'use strict';
    return class Modal {
        constructor(title, content, width = '600px') {
            this.title = title;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-modal`).css('width', width).children(m_element.h('div', `${ m_config.cssPrefix }-modal-header`).children(new Icon('close').on('click.stop', () => this.hide()), this.title), m_element.h('div', `${ m_config.cssPrefix }-modal-content`).children(...content)).hide();
        }
        show() {
            this.dimmer = m_element.h('div', `${ m_config.cssPrefix }-dimmer active`);
            document.body.appendChild(this.dimmer.el);
            const {width, height} = this.el.show().box();
            const {clientHeight, clientWidth} = document.documentElement;
            this.el.offset({
                left: (clientWidth - width) / 2,
                top: (clientHeight - height) / 3
            });
            window.xkeydownEsc = evt => {
                if (evt.keyCode === 27) {
                    this.hide();
                }
            };
            m_event.bind(window, 'keydown', window.xkeydownEsc);
        }
        hide() {
            this.el.hide();
            document.body.removeChild(this.dimmer.el);
            m_event.unbind(window, 'keydown', window.xkeydownEsc);
            delete window.xkeydownEsc;
        }
    };
});
define('skylark-xspreadsheet/component/form_input',[
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    return class FormInput {
        constructor(width, hint) {
            this.vchange = () => {
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-input`);
            this.input = m_element.h('input', '').css('width', width).on('input', evt => this.vchange(evt)).attr('placeholder', hint);
            this.el.child(this.input);
        }
        focus() {
            setTimeout(() => {
                this.input.el.focus();
            }, 10);
        }
        hint(v) {
            this.input.attr('placeholder', v);
        }
        val(v) {
            return this.input.val(v);
        }
    };
});
define('skylark-xspreadsheet/component/form_select',[
    './element',
    './suggest',
    '../config'
], function (m_element, Suggest, m_config) {
    'use strict';
    return class FormSelect {
        constructor(key, items, width, getTitle = it => it, change = () => {
        }) {
            this.key = key;
            this.getTitle = getTitle;
            this.vchange = () => {
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-select`);
            this.suggest = new Suggest(items.map(it => ({
                key: it,
                title: this.getTitle(it)
            })), it => {
                this.itemClick(it.key);
                change(it.key);
                this.vchange(it.key);
            }, width, this.el);
            this.el.children(this.itemEl = m_element.h('div', 'input-text').html(this.getTitle(key)), this.suggest.el).on('click', () => this.show());
        }
        show() {
            this.suggest.search('');
        }
        itemClick(it) {
            this.key = it;
            this.itemEl.html(this.getTitle(it));
        }
        val(v) {
            if (v !== undefined) {
                this.key = v;
                this.itemEl.html(this.getTitle(v));
                return this;
            }
            return this.key;
        }
    };
});
define('skylark-xspreadsheet/component/form_field',[
    './element',
    '../config',
    '../locale/locale'
], function (m_element, m_config, m_locale) {
    'use strict';
    const patterns = {
        number: /(^\d+$)|(^\d+(\.\d{0,4})?$)/,
        date: /^\d{4}-\d{1,2}-\d{1,2}$/
    };
    return class FormField {
        constructor(input, rule, label, labelWidth) {
            this.label = '';
            this.rule = rule;
            if (label) {
                this.label = m_element.h('label', 'label').css('width', `${ labelWidth }px`).html(label);
            }
            this.tip = m_element.h('div', 'tip').child('tip').hide();
            this.input = input;
            this.input.vchange = () => this.validate();
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-field`).children(this.label, input.el, this.tip);
        }
        isShow() {
            return this.el.css('display') !== 'none';
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
            return this;
        }
        val(v) {
            return this.input.val(v);
        }
        hint(hint) {
            this.input.hint(hint);
        }
        validate() {
            const {input, rule, tip, el} = this;
            const v = input.val();
            if (rule.required) {
                if (/^\s*$/.test(v)) {
                    tip.html(m_locale.t('validation.required'));
                    el.addClass('error');
                    return false;
                }
            }
            if (rule.type || rule.pattern) {
                const pattern = rule.pattern || patterns[rule.type];
                if (!pattern.test(v)) {
                    tip.html(m_locale.t('validation.notMatch'));
                    el.addClass('error');
                    return false;
                }
            }
            el.removeClass('error');
            return true;
        }
    };
});
define('skylark-xspreadsheet/component/modal_validation',[
    './modal',
    './form_input',
    './form_select',
    './form_field',
    './button',
    '../locale/locale',
    './element',
    '../config'
], function (Modal, FormInput, FormSelect, FormField, Button, m_locale, m_element, m_config) {
    'use strict';
    const fieldLabelWidth = 100;
    return class ModalValidation extends Modal {
        constructor() {
            const mf = new FormField(new FormSelect('cell', ['cell'], '100%', it => m_locale.t(`dataValidation.modeType.${ it }`)), { required: true }, `${ m_locale.t('dataValidation.range') }:`, fieldLabelWidth);
            const rf = new FormField(new FormInput('120px', 'E3 or E3:F12'), {
                required: true,
                pattern: /^([A-Z]{1,2}[1-9]\d*)(:[A-Z]{1,2}[1-9]\d*)?$/
            });
            const cf = new FormField(new FormSelect('list', [
                'list',
                'number',
                'date',
                'phone',
                'email'
            ], '100%', it => m_locale.t(`dataValidation.type.${ it }`), it => this.criteriaSelected(it)), { required: true }, `${ m_locale.t('dataValidation.criteria') }:`, fieldLabelWidth);
            const of = new FormField(new FormSelect('be', [
                'be',
                'nbe',
                'eq',
                'neq',
                'lt',
                'lte',
                'gt',
                'gte'
            ], '160px', it => m_locale.t(`dataValidation.operator.${ it }`), it => this.criteriaOperatorSelected(it)), { required: true }).hide();
            const minvf = new FormField(new FormInput('70px', '10'), { required: true }).hide();
            const maxvf = new FormField(new FormInput('70px', '100'), {
                required: true,
                type: 'number'
            }).hide();
            const svf = new FormField(new FormInput('120px', 'a,b,m_config'), { required: true });
            const vf = new FormField(new FormInput('70px', '10'), {
                required: true,
                type: 'number'
            }).hide();
            super(m_locale.t('contextmenu.validation'), [
                m_element.h('div', `${ m_config.cssPrefix }-form-fields`).children(mf.el, rf.el),
                m_element.h('div', `${ m_config.cssPrefix }-form-fields`).children(cf.el, of.el, minvf.el, maxvf.el, vf.el, svf.el),
                m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', () => this.btnClick('cancel')), new Button('remove').on('click', () => this.btnClick('remove')), new Button('save', 'primary').on('click', () => this.btnClick('save')))
            ]);
            this.mf = mf;
            this.rf = rf;
            this.cf = cf;
            this.of = of;
            this.minvf = minvf;
            this.maxvf = maxvf;
            this.vf = vf;
            this.svf = svf;
            this.change = () => {
            };
        }
        showVf(it) {
            const hint = it === 'date' ? '2018-11-12' : '10';
            const {vf} = this;
            vf.input.hint(hint);
            vf.show();
        }
        criteriaSelected(it) {
            const {of, minvf, maxvf, vf, svf} = this;
            if (it === 'date' || it === 'number') {
                of.show();
                minvf.rule.type = it;
                maxvf.rule.type = it;
                if (it === 'date') {
                    minvf.hint('2018-11-12');
                    maxvf.hint('2019-11-12');
                } else {
                    minvf.hint('10');
                    maxvf.hint('100');
                }
                minvf.show();
                maxvf.show();
                vf.hide();
                svf.hide();
            } else {
                if (it === 'list') {
                    svf.show();
                } else {
                    svf.hide();
                }
                vf.hide();
                of.hide();
                minvf.hide();
                maxvf.hide();
            }
        }
        criteriaOperatorSelected(it) {
            if (!it)
                return;
            const {minvf, maxvf, vf} = this;
            if (it === 'be' || it === 'nbe') {
                minvf.show();
                maxvf.show();
                vf.hide();
            } else {
                const type = this.cf.val();
                vf.rule.type = type;
                if (type === 'date') {
                    vf.hint('2018-11-12');
                } else {
                    vf.hint('10');
                }
                vf.show();
                minvf.hide();
                maxvf.hide();
            }
        }
        btnClick(action) {
            if (action === 'cancel') {
                this.hide();
            } else if (action === 'remove') {
                this.change('remove');
                this.hide();
            } else if (action === 'save') {
                const attrs = [
                    'mf',
                    'rf',
                    'cf',
                    'of',
                    'svf',
                    'vf',
                    'minvf',
                    'maxvf'
                ];
                for (let i = 0; i < attrs.length; i += 1) {
                    const field = this[attrs[i]];
                    if (field.isShow()) {
                        if (!field.validate())
                            return;
                    }
                }
                const mode = this.mf.val();
                const ref = this.rf.val();
                const type = this.cf.val();
                const operator = this.of.val();
                let value = this.svf.val();
                if (type === 'number' || type === 'date') {
                    if (operator === 'be' || operator === 'nbe') {
                        value = [
                            this.minvf.val(),
                            this.maxvf.val()
                        ];
                    } else {
                        value = this.vf.val();
                    }
                }
                this.change('save', mode, ref, {
                    type,
                    operator,
                    required: false,
                    value
                });
                this.hide();
            }
        }
        setValue(v) {
            if (v) {
                const {mf, rf, cf, of, svf, vf, minvf, maxvf} = this;
                const {mode, ref, validator} = v;
                const {type, operator, value} = validator || { type: 'list' };
                mf.val(mode || 'cell');
                rf.val(ref);
                cf.val(type);
                of.val(operator);
                if (Array.isArray(value)) {
                    minvf.val(value[0]);
                    maxvf.val(value[1]);
                } else {
                    svf.val(value || '');
                    vf.val(value || '');
                }
                this.criteriaSelected(type);
                this.criteriaOperatorSelected(operator);
            }
            this.show();
        }
    };
});
define('skylark-xspreadsheet/component/sort_filter',[
    './element',
    './button',
    './event',
    '../config',
    '../locale/locale'
], function (m_element, Button, m_event, m_config, m_locale) {
    'use strict';
    function buildMenu(clsName) {
        return m_element.h('div', `${ m_config.cssPrefix }-item ${ clsName }`);
    }
    function buildSortItem(it) {
        return buildMenu('state').child(m_locale.t(`sort.${ it }`)).on('click.stop', () => this.itemClick(it));
    }
    function buildFilterBody(items) {
        const {filterbEl, filterValues} = this;
        filterbEl.html('');
        const itemKeys = Object.keys(items);
        itemKeys.forEach((it, index) => {
            const cnt = items[it];
            const active = filterValues.includes(it) ? 'checked' : '';
            filterbEl.child(m_element.h('div', `${ m_config.cssPrefix }-item state ${ active }`).on('click.stop', () => this.filterClick(index, it)).children(it === '' ? m_locale.t('filter.empty') : it, m_element.h('div', 'label').html(`(${ cnt })`)));
        });
    }
    function resetFilterHeader() {
        const {filterhEl, filterValues, values} = this;
        filterhEl.html(`${ filterValues.length } / ${ values.length }`);
        filterhEl.checked(filterValues.length === values.length);
    }
    return class SortFilter {
        constructor() {
            this.filterbEl = m_element.h('div', `${ m_config.cssPrefix }-body`);
            this.filterhEl = m_element.h('div', `${ m_config.cssPrefix }-header state`).on('click.stop', () => this.filterClick(0, 'all'));
            this.el = m_element.h('div', `${ m_config.cssPrefix }-sort-filter`).children(this.sortAscEl = buildSortItem.call(this, 'asc'), this.sortDescEl = buildSortItem.call(this, 'desc'), buildMenu('divider'), m_element.h('div', `${ m_config.cssPrefix }-filter`).children(this.filterhEl, this.filterbEl), m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', () => this.btnClick('cancel')), new Button('ok', 'primary').on('click', () => this.btnClick('ok')))).hide();
            this.ci = null;
            this.sortDesc = null;
            this.values = null;
            this.filterValues = [];
        }
        btnClick(it) {
            if (it === 'ok') {
                const {ci, sort, filterValues} = this;
                if (this.ok) {
                    this.ok(ci, sort, 'in', filterValues);
                }
            }
            this.hide();
        }
        itemClick(it) {
            this.sort = it;
            const {sortAscEl, sortDescEl} = this;
            sortAscEl.checked(it === 'asc');
            sortDescEl.checked(it === 'desc');
        }
        filterClick(index, it) {
            const {filterbEl, filterValues, values} = this;
            const children = filterbEl.children();
            if (it === 'all') {
                if (children.length === filterValues.length) {
                    this.filterValues = [];
                    children.forEach(i => m_element.h(i).checked(false));
                } else {
                    this.filterValues = Array.from(values);
                    children.forEach(i => m_element.h(i).checked(true));
                }
            } else {
                const checked = m_element.h(children[index]).toggle('checked');
                if (checked) {
                    filterValues.push(it);
                } else {
                    filterValues.splice(filterValues.findIndex(i => i === it), 1);
                }
            }
            resetFilterHeader.call(this);
        }
        set(ci, items, filter, sort) {
            this.ci = ci;
            const {sortAscEl, sortDescEl} = this;
            if (sort !== null) {
                this.sort = sort.order;
                sortAscEl.checked(sort.asc());
                sortDescEl.checked(sort.desc());
            } else {
                this.sortDesc = null;
                sortAscEl.checked(false);
                sortDescEl.checked(false);
            }
            this.values = Object.keys(items);
            this.filterValues = filter ? Array.from(filter.value) : Object.keys(items);
            buildFilterBody.call(this, items, filter);
            resetFilterHeader.call(this);
        }
        setOffset(v) {
            this.el.offset(v).show();
            let tindex = 1;
            m_event.bindClickoutside(this.el, () => {
                if (tindex <= 0) {
                    this.hide();
                }
                tindex -= 1;
            });
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
            m_event.unbindClickoutside(this.el);
        }
    };
});
define('skylark-xspreadsheet/component/message',[
    './element',
    './icon',
    '../config'
], function (m_element, Icon, m_config) {
    'use strict';
    function xtoast(title, content) {
        const el = m_element.h('div', `${ m_config.cssPrefix }-toast`);
        const dimmer = m_element.h('div', `${ m_config.cssPrefix }-dimmer active`);
        const remove = () => {
            document.body.removeChild(el.el);
            document.body.removeChild(dimmer.el);
        };
        el.children(m_element.h('div', `${ m_config.cssPrefix }-toast-header`).children(new Icon('close').on('click.stop', () => remove()), title), m_element.h('div', `${ m_config.cssPrefix }-toast-content`).html(content));
        document.body.appendChild(el.el);
        document.body.appendChild(dimmer.el);
        const {width, height} = el.box();
        const {clientHeight, clientWidth} = document.documentElement;
        el.offset({
            left: (clientWidth - width) / 2,
            top: (clientHeight - height) / 3
        });
    }
    return {
        xtoast
    };
});
define('skylark-xspreadsheet/component/sheet',[
    './element',
    './event',
    './resizer',
    './scrollbar',
    './selector',
    './editor',
    './print',
    './contextmenu',
    './table',
    './toolbar/index',
    './modal_validation',
    './sort_filter',
    './message',
    '../config',
    '../core/formula'
], function (m_element, m_event, Resizer, Scrollbar, Selector, Editor, Print, ContextMenu, m_table, Toolbar, ModalValidation, SortFilter, m_message, m_config, m_formula) {
    'use strict';

/**
 * @desc throttle fn
 * @param func function
 * @param wait Delay in milliseconds
 */
    function throttle(func, wait) {
        let timeout;
        return (...arg) => {
            const that = this;
            const args = arg;
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(that, args);
                }, wait);
            }
        };
    }
    function scrollbarMove() {
        const {data, verticalScrollbar, horizontalScrollbar} = this;
        const {l, t, left, top, width, height} = data.getSelectedRect();
        const tableOffset = this.getTableOffset();
        if (Math.abs(left) + width > tableOffset.width) {
            horizontalScrollbar.move({ left: l + width - tableOffset.width });
        } else {
            const fsw = data.freezeTotalWidth();
            if (left < fsw) {
                horizontalScrollbar.move({ left: l - 1 - fsw });
            }
        }
        if (Math.abs(top) + height > tableOffset.height) {
            verticalScrollbar.move({ top: t + height - tableOffset.height - 1 });
        } else {
            const fsh = data.freezeTotalHeight();
            if (top < fsh) {
                verticalScrollbar.move({ top: t - 1 - fsh });
            }
        }
    }
    function selectorSet(multiple, ri, ci, indexesUpdated = true, moving = false) {
        if (ri === -1 && ci === -1)
            return;
        const {table, selector, toolbar, data, contextMenu} = this;
        contextMenu.setMode(ri === -1 || ci === -1 ? 'row-col' : 'range');
        const cell = data.getCell(ri, ci);
        if (multiple) {
            selector.setEnd(ri, ci, moving);
            this.trigger('cells-selected', cell, selector.range);
        } else {
            selector.set(ri, ci, indexesUpdated);
            this.trigger('cell-selected', cell, ri, ci);
        }
        toolbar.reset();
        table.render();
    }

// multiple: boolean
// direction: left | right | up | down | row-first | row-last | col-first | col-last
    function selectorMove(multiple, direction) {
        const {selector, data} = this;
        const {rows, cols} = data;
        let [ri, ci] = selector.indexes;
        const {eri, eci} = selector.range;
        if (multiple) {
            [ri, ci] = selector.moveIndexes;
        }
        if (direction === 'left') {
            if (ci > 0)
                ci -= 1;
        } else if (direction === 'right') {
            if (eci !== ci)
                ci = eci;
            if (ci < cols.len - 1)
                ci += 1;
        } else if (direction === 'up') {
            if (ri > 0)
                ri -= 1;
        } else if (direction === 'down') {
            if (eri !== ri)
                ri = eri;
            if (ri < rows.len - 1)
                ri += 1;
        } else if (direction === 'row-first') {
            ci = 0;
        } else if (direction === 'row-last') {
            ci = cols.len - 1;
        } else if (direction === 'col-first') {
            ri = 0;
        } else if (direction === 'col-last') {
            ri = rows.len - 1;
        }
        if (multiple) {
            selector.moveIndexes = [
                ri,
                ci
            ];
        }
        selectorSet.call(this, multiple, ri, ci);
        scrollbarMove.call(this);
    }

// private methods
    function overlayerMousemove(evt) {
        if (evt.buttons !== 0)
            return;
        if (evt.target.className === `${ m_config.cssPrefix }-resizer-hover`)
            return;
        const {offsetX, offsetY} = evt;
        const {rowResizer, colResizer, tableEl, data} = this;
        const {rows, cols} = data;
        if (offsetX > cols.indexWidth && offsetY > rows.height) {
            rowResizer.hide();
            colResizer.hide();
            return;
        }
        const tRect = tableEl.box();
        const cRect = data.getCellRectByXY(evt.offsetX, evt.offsetY);
        if (cRect.ri >= 0 && cRect.ci === -1) {
            cRect.width = cols.indexWidth;
            rowResizer.show(cRect, { width: tRect.width });
            if (rows.isHide(cRect.ri - 1)) {
                rowResizer.showUnhide(cRect.ri);
            } else {
                rowResizer.hideUnhide();
            }
        } else {
            rowResizer.hide();
        }
        if (cRect.ri === -1 && cRect.ci >= 0) {
            cRect.height = rows.height;
            colResizer.show(cRect, { height: tRect.height });
            if (cols.isHide(cRect.ci - 1)) {
                colResizer.showUnhide(cRect.ci);
            } else {
                colResizer.hideUnhide();
            }
        } else {
            colResizer.hide();
        }
    }
    function overlayerMousescroll(evt) {
        const {verticalScrollbar, horizontalScrollbar, data} = this;
        const {top} = verticalScrollbar.scroll();
        const {left} = horizontalScrollbar.scroll();
        const {rows, cols} = data;
        const {deltaY, deltaX} = evt;
        const loopValue = (ii, vFunc) => {
            let i = ii;
            let v = 0;
            do {
                v = vFunc(i);
                i += 1;
            } while (v <= 0);
            return v;
        };
        const moveY = vertical => {
            if (vertical > 0) {
                const ri = data.scroll.ri + 1;
                if (ri < rows.len) {
                    const rh = loopValue(ri, i => rows.getHeight(i));
                    verticalScrollbar.move({ top: top + rh - 1 });
                }
            } else {
                const ri = data.scroll.ri - 1;
                if (ri >= 0) {
                    const rh = loopValue(ri, i => rows.getHeight(i));
                    verticalScrollbar.move({ top: ri === 0 ? 0 : top - rh });
                }
            }
        };
        const moveX = horizontal => {
            if (horizontal > 0) {
                const ci = data.scroll.ci + 1;
                if (ci < cols.len) {
                    const cw = loopValue(ci, i => cols.getWidth(i));
                    horizontalScrollbar.move({ left: left + cw - 1 });
                }
            } else {
                const ci = data.scroll.ci - 1;
                if (ci >= 0) {
                    const cw = loopValue(ci, i => cols.getWidth(i));
                    horizontalScrollbar.move({ left: ci === 0 ? 0 : left - cw });
                }
            }
        };
        const tempY = Math.abs(deltaY);
        const tempX = Math.abs(deltaX);
        const temp = Math.max(tempY, tempX);
        if (/Firefox/i.test(window.navigator.userAgent))
            throttle(moveY(evt.detail), 50);
        if (temp === tempX)
            throttle(moveX(deltaX), 50);
        if (temp === tempY)
            throttle(moveY(deltaY), 50);
    }
    function overlayerTouch(direction, distance) {
        const {verticalScrollbar, horizontalScrollbar} = this;
        const {top} = verticalScrollbar.scroll();
        const {left} = horizontalScrollbar.scroll();
        if (direction === 'left' || direction === 'right') {
            horizontalScrollbar.move({ left: left - distance });
        } else if (direction === 'up' || direction === 'down') {
            verticalScrollbar.move({ top: top - distance });
        }
    }
    function verticalScrollbarSet() {
        const {data, verticalScrollbar} = this;
        const {height} = this.getTableOffset();
        const erth = data.exceptRowTotalHeight(0, -1);
        verticalScrollbar.set(height, data.rows.totalHeight() - erth);
    }
    function horizontalScrollbarSet() {
        const {data, horizontalScrollbar} = this;
        const {width} = this.getTableOffset();
        if (data) {
            horizontalScrollbar.set(width, data.cols.totalWidth());
        }
    }
    function sheetFreeze() {
        const {selector, data, editor} = this;
        const [ri, ci] = data.freeze;
        if (ri > 0 || ci > 0) {
            const fwidth = data.freezeTotalWidth();
            const fheight = data.freezeTotalHeight();
            editor.setFreezeLengths(fwidth, fheight);
        }
        selector.resetAreaOffset();
    }
    function sheetReset() {
        const {tableEl, overlayerEl, overlayerCEl, table, toolbar, selector, el} = this;
        const tOffset = this.getTableOffset();
        const vRect = this.getRect();
        tableEl.attr(vRect);
        overlayerEl.offset(vRect);
        overlayerCEl.offset(tOffset);
        el.css('width', `${ vRect.width }px`);
        verticalScrollbarSet.call(this);
        horizontalScrollbarSet.call(this);
        sheetFreeze.call(this);
        table.render();
        toolbar.reset();
        selector.reset();
    }
    function clearClipboard() {
        const {data, selector} = this;
        data.clearClipboard();
        selector.hideClipboard();
    }
    function copy() {
        const {data, selector} = this;
        data.copy();
        selector.showClipboard();
    }
    function cut() {
        const {data, selector} = this;
        data.cut();
        selector.showClipboard();
    }
    function paste(what, evt) {
        const {data} = this;
        if (data.settings.mode === 'read')
            return;
        if (data.paste(what, msg => m_message.xtoast('Tip', msg))) {
            sheetReset.call(this);
        } else if (evt) {
            const cdata = evt.clipboardData.getData('text/plain');
            this.data.pasteFromText(cdata);
            sheetReset.call(this);
        }
    }
    function hideRowsOrCols() {
        this.data.hideRowsOrCols();
        sheetReset.call(this);
    }
    function unhideRowsOrCols(type, index) {
        this.data.unhideRowsOrCols(type, index);
        sheetReset.call(this);
    }
    function autofilter() {
        const {data} = this;
        data.autofilter();
        sheetReset.call(this);
    }
    function toolbarChangePaintformatPaste() {
        const {toolbar} = this;
        if (toolbar.paintformatActive()) {
            paste.call(this, 'format');
            clearClipboard.call(this);
            toolbar.paintformatToggle();
        }
    }
    function overlayerMousedown(evt) {
        const {selector, data, table, sortFilter} = this;
        const {offsetX, offsetY} = evt;
        const isAutofillEl = evt.target.className === `${ m_config.cssPrefix }-selector-corner`;
        const cellRect = data.getCellRectByXY(offsetX, offsetY);
        const {left, top, width, height} = cellRect;
        let {ri, ci} = cellRect;
        const {autoFilter} = data;
        if (autoFilter.includes(ri, ci)) {
            if (left + width - 20 < offsetX && top + height - 20 < offsetY) {
                const items = autoFilter.items(ci, (r, c) => data.rows.getCell(r, c));
                sortFilter.hide();
                sortFilter.set(ci, items, autoFilter.getFilter(ci), autoFilter.getSort(ci));
                sortFilter.setOffset({
                    left,
                    top: top + height + 2
                });
                return;
            }
        }
        if (!evt.shiftKey) {
            if (isAutofillEl) {
                selector.showAutofill(ri, ci);
            } else {
                selectorSet.call(this, false, ri, ci);
            }
            m_event.mouseMoveUp(window, e => {
                ({ri, ci} = data.getCellRectByXY(e.offsetX, e.offsetY));
                if (isAutofillEl) {
                    selector.showAutofill(ri, ci);
                } else if (e.buttons === 1 && !e.shiftKey) {
                    selectorSet.call(this, true, ri, ci, true, true);
                }
            }, () => {
                if (isAutofillEl && selector.arange && data.settings.mode !== 'read') {
                    if (data.autofill(selector.arange, 'all', msg => m_message.xtoast('Tip', msg))) {
                        table.render();
                    }
                }
                selector.hideAutofill();
                toolbarChangePaintformatPaste.call(this);
            });
        }
        if (!isAutofillEl && evt.buttons === 1) {
            if (evt.shiftKey) {
                selectorSet.call(this, true, ri, ci);
            }
        }
    }
    function editorSetOffset() {
        const {editor, data} = this;
        const sOffset = data.getSelectedRect();
        const tOffset = this.getTableOffset();
        let sPosition = 'top';
        if (sOffset.top > tOffset.height / 2) {
            sPosition = 'bottom';
        }
        editor.setOffset(sOffset, sPosition);
    }
    function editorSet() {
        const {editor, data} = this;
        if (data.settings.mode === 'read')
            return;
        editorSetOffset.call(this);
        editor.setCell(data.getSelectedCell(), data.getSelectedValidator());
        clearClipboard.call(this);
    }
    function verticalScrollbarMove(distance) {
        const {data, table, selector} = this;
        data.scrolly(distance, () => {
            selector.resetBRLAreaOffset();
            editorSetOffset.call(this);
            table.render();
        });
    }
    function horizontalScrollbarMove(distance) {
        const {data, table, selector} = this;
        data.scrollx(distance, () => {
            selector.resetBRTAreaOffset();
            editorSetOffset.call(this);
            table.render();
        });
    }
    function rowResizerFinished(cRect, distance) {
        const {ri} = cRect;
        const {table, selector, data} = this;
        data.rows.setHeight(ri, distance);
        table.render();
        selector.resetAreaOffset();
        verticalScrollbarSet.call(this);
        editorSetOffset.call(this);
    }
    function colResizerFinished(cRect, distance) {
        const {ci} = cRect;
        const {table, selector, data} = this;
        data.cols.setWidth(ci, distance);
        table.render();
        selector.resetAreaOffset();
        horizontalScrollbarSet.call(this);
        editorSetOffset.call(this);
    }
    function dataSetCellText(text, state = 'finished') {
        const {data, table} = this;
        if (data.settings.mode === 'read')
            return;
        data.setSelectedCellText(text, state);
        const {ri, ci} = data.selector;
        if (state === 'finished') {
            table.render();
        } else {
            this.trigger('cell-edited', text, ri, ci);
        }
    }
    function insertDeleteRowColumn(type) {
        const {data} = this;
        if (data.settings.mode === 'read')
            return;
        if (type === 'insert-row') {
            data.insert('row');
        } else if (type === 'delete-row') {
            data.delete('row');
        } else if (type === 'insert-column') {
            data.insert('column');
        } else if (type === 'delete-column') {
            data.delete('column');
        } else if (type === 'delete-cell') {
            data.deleteCell();
        } else if (type === 'delete-cell-format') {
            data.deleteCell('format');
        } else if (type === 'delete-cell-text') {
            data.deleteCell('text');
        } else if (type === 'cell-printable') {
            data.setSelectedCellAttr('printable', true);
        } else if (type === 'cell-non-printable') {
            data.setSelectedCellAttr('printable', false);
        } else if (type === 'cell-editable') {
            data.setSelectedCellAttr('editable', true);
        } else if (type === 'cell-non-editable') {
            data.setSelectedCellAttr('editable', false);
        }
        clearClipboard.call(this);
        sheetReset.call(this);
    }
    function toolbarChange(type, value) {
        const {data} = this;
        if (type === 'undo') {
            this.undo();
        } else if (type === 'redo') {
            this.redo();
        } else if (type === 'print') {
            this.print.preview();
        } else if (type === 'paintformat') {
            if (value === true)
                copy.call(this);
            else
                clearClipboard.call(this);
        } else if (type === 'clearformat') {
            insertDeleteRowColumn.call(this, 'delete-cell-format');
        } else if (type === 'link') {
        } else if (type === 'chart') {
        } else if (type === 'autofilter') {
            autofilter.call(this);
        } else if (type === 'freeze') {
            if (value) {
                const {ri, ci} = data.selector;
                this.freeze(ri, ci);
            } else {
                this.freeze(0, 0);
            }
        } else {
            data.setSelectedCellAttr(type, value);
            if (type === 'formula' && !data.selector.multiple()) {
                editorSet.call(this);
            }
            sheetReset.call(this);
        }
    }
    function sortFilterChange(ci, order, operator, value) {
        this.data.setAutoFilter(ci, order, operator, value);
        sheetReset.call(this);
    }
    function sheetInitEvents() {
        const {selector, overlayerEl, rowResizer, colResizer, verticalScrollbar, horizontalScrollbar, editor, contextMenu, toolbar, modalValidation, sortFilter} = this;
        overlayerEl.on('mousemove', evt => {
            overlayerMousemove.call(this, evt);
        }).on('mousedown', evt => {
            editor.clear();
            contextMenu.hide();
            if (evt.buttons === 2) {
                if (this.data.xyInSelectedRect(evt.offsetX, evt.offsetY)) {
                    contextMenu.setPosition(evt.offsetX, evt.offsetY);
                } else {
                    overlayerMousedown.call(this, evt);
                    contextMenu.setPosition(evt.offsetX, evt.offsetY);
                }
                evt.stopPropagation();
            } else if (evt.detail === 2) {
                editorSet.call(this);
            } else {
                overlayerMousedown.call(this, evt);
            }
        }).on('mousewheel.stop', evt => {
            overlayerMousescroll.call(this, evt);
        }).on('mouseout', evt => {
            const {offsetX, offsetY} = evt;
            if (offsetY <= 0)
                colResizer.hide();
            if (offsetX <= 0)
                rowResizer.hide();
        });
        selector.inputChange = v => {
            dataSetCellText.call(this, v, 'input');
            editorSet.call(this);
        };
        m_event.bindTouch(overlayerEl.el, {
            move: (direction, d) => {
                overlayerTouch.call(this, direction, d);
            }
        });
        toolbar.change = (type, value) => toolbarChange.call(this, type, value);
        sortFilter.ok = (ci, order, o, v) => sortFilterChange.call(this, ci, order, o, v);
        rowResizer.finishedFn = (cRect, distance) => {
            rowResizerFinished.call(this, cRect, distance);
        };
        colResizer.finishedFn = (cRect, distance) => {
            colResizerFinished.call(this, cRect, distance);
        };
        rowResizer.unhideFn = index => {
            unhideRowsOrCols.call(this, 'row', index);
        };
        colResizer.unhideFn = index => {
            unhideRowsOrCols.call(this, 'col', index);
        };
        verticalScrollbar.moveFn = (distance, evt) => {
            verticalScrollbarMove.call(this, distance, evt);
        };
        horizontalScrollbar.moveFn = (distance, evt) => {
            horizontalScrollbarMove.call(this, distance, evt);
        };
        editor.change = (state, itext) => {
            dataSetCellText.call(this, itext, state);
        };
        modalValidation.change = (action, ...args) => {
            if (action === 'save') {
                this.data.addValidation(...args);
            } else {
                this.data.removeValidation();
            }
        };
        contextMenu.itemClick = type => {
            if (type === 'validation') {
                modalValidation.setValue(this.data.getSelectedValidation());
            } else if (type === 'copy') {
                copy.call(this);
            } else if (type === 'cut') {
                cut.call(this);
            } else if (type === 'paste') {
                paste.call(this, 'all');
            } else if (type === 'paste-value') {
                paste.call(this, 'text');
            } else if (type === 'paste-format') {
                paste.call(this, 'format');
            } else if (type === 'hide') {
                hideRowsOrCols.call(this);
            } else {
                insertDeleteRowColumn.call(this, type);
            }
        };
        m_event.bind(window, 'resize', () => {
            this.reload();
        });
        m_event.bind(window, 'click', evt => {
            this.focusing = overlayerEl.contains(evt.target);
        });
        m_event.bind(window, 'paste', evt => {
            paste.call(this, 'all', evt);
            evt.preventDefault();
        });
        m_event.bind(window, 'keydown', evt => {
            if (!this.focusing)
                return;
            const keyCode = evt.keyCode || evt.which;
            const {key, ctrlKey, shiftKey, metaKey} = evt;
            if (ctrlKey || metaKey) {
                switch (keyCode) {
                case 90:
                    this.undo();
                    evt.preventDefault();
                    break;
                case 89:
                    this.redo();
                    evt.preventDefault();
                    break;
                case 67:
                    copy.call(this);
                    evt.preventDefault();
                    break;
                case 88:
                    cut.call(this);
                    evt.preventDefault();
                    break;
                case 85:
                    toolbar.trigger('underline');
                    evt.preventDefault();
                    break;
                case 86:
                    break;
                case 37:
                    selectorMove.call(this, shiftKey, 'row-first');
                    evt.preventDefault();
                    break;
                case 38:
                    selectorMove.call(this, shiftKey, 'col-first');
                    evt.preventDefault();
                    break;
                case 39:
                    selectorMove.call(this, shiftKey, 'row-last');
                    evt.preventDefault();
                    break;
                case 40:
                    selectorMove.call(this, shiftKey, 'col-last');
                    evt.preventDefault();
                    break;
                case 32:
                    selectorSet.call(this, false, -1, this.data.selector.ci, false);
                    evt.preventDefault();
                    break;
                case 66:
                    toolbar.trigger('bold');
                    break;
                case 73:
                    toolbar.trigger('italic');
                    break;
                default:
                    break;
                }
            } else {
                switch (keyCode) {
                case 32:
                    if (shiftKey) {
                        selectorSet.call(this, false, this.data.selector.ri, -1, false);
                    }
                    break;
                case 27:
                    contextMenu.hide();
                    clearClipboard.call(this);
                    break;
                case 37:
                    selectorMove.call(this, shiftKey, 'left');
                    evt.preventDefault();
                    break;
                case 38:
                    selectorMove.call(this, shiftKey, 'up');
                    evt.preventDefault();
                    break;
                case 39:
                    selectorMove.call(this, shiftKey, 'right');
                    evt.preventDefault();
                    break;
                case 40:
                    selectorMove.call(this, shiftKey, 'down');
                    evt.preventDefault();
                    break;
                case 9:
                    editor.clear();
                    selectorMove.call(this, false, shiftKey ? 'left' : 'right');
                    evt.preventDefault();
                    break;
                case 13:
                    editor.clear();
                    selectorMove.call(this, false, shiftKey ? 'up' : 'down');
                    evt.preventDefault();
                    break;
                case 8:
                    insertDeleteRowColumn.call(this, 'delete-cell-text');
                    evt.preventDefault();
                    break;
                default:
                    break;
                }
                if (key === 'Delete') {
                    insertDeleteRowColumn.call(this, 'delete-cell-text');
                    evt.preventDefault();
                } else if (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105 || evt.key === '=') {
                    dataSetCellText.call(this, evt.key, 'input');
                    editorSet.call(this);
                } else if (keyCode === 113) {
                    editorSet.call(this);
                }
            }
        });
    }
    
    class Sheet {
        constructor(targetEl, data) {
            this.eventMap = new Map();
            const {view, showToolbar, showContextmenu} = data.settings;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-sheet`);
            this.toolbar = new Toolbar(data, view.width, !showToolbar);
            this.print = new Print(data);
            targetEl.children(this.toolbar.el, this.el, this.print.el);
            this.data = data;
            this.tableEl = m_element.h('canvas', `${ m_config.cssPrefix }-table`);
            this.rowResizer = new Resizer(false, data.rows.height);
            this.colResizer = new Resizer(true, data.cols.minWidth);
            this.verticalScrollbar = new Scrollbar(true);
            this.horizontalScrollbar = new Scrollbar(false);
            this.editor = new Editor(m_formula.formulas, () => this.getTableOffset(), data.rows.height);
            this.modalValidation = new ModalValidation();
            this.contextMenu = new ContextMenu(() => this.getRect(), !showContextmenu);
            this.selector = new Selector(data);
            this.overlayerCEl = m_element.h('div', `${ m_config.cssPrefix }-overlayer-content`).children(this.editor.el, this.selector.el);
            this.overlayerEl = m_element.h('div', `${ m_config.cssPrefix }-overlayer`).child(this.overlayerCEl);
            this.sortFilter = new SortFilter();
            this.el.children(this.tableEl, this.overlayerEl.el, this.rowResizer.el, this.colResizer.el, this.verticalScrollbar.el, this.horizontalScrollbar.el, this.contextMenu.el, this.modalValidation.el, this.sortFilter.el);
            this.table = new m_table.Table(this.tableEl.el, data);
            sheetInitEvents.call(this);
            sheetReset.call(this);
            selectorSet.call(this, false, 0, 0);
        }
        on(eventName, func) {
            this.eventMap.set(eventName, func);
            return this;
        }
        trigger(eventName, ...args) {
            const {eventMap} = this;
            if (eventMap.has(eventName)) {
                eventMap.get(eventName).call(this, ...args);
            }
        }
        resetData(data) {
            this.editor.clear();
            this.data = data;
            verticalScrollbarSet.call(this);
            horizontalScrollbarSet.call(this);
            this.toolbar.resetData(data);
            this.print.resetData(data);
            this.selector.resetData(data);
            this.table.resetData(data);
        }
        loadData(data) {
            this.data.setData(data);
            sheetReset.call(this);
            return this;
        }
        freeze(ri, ci) {
            const {data} = this;
            data.setFreeze(ri, ci);
            sheetReset.call(this);
            return this;
        }
        undo() {
            this.data.undo();
            sheetReset.call(this);
        }
        redo() {
            this.data.redo();
            sheetReset.call(this);
        }
        reload() {
            sheetReset.call(this);
            return this;
        }
        getRect() {
            const {data} = this;
            return {
                width: data.viewWidth(),
                height: data.viewHeight()
            };
        }
        getTableOffset() {
            const {rows, cols} = this.data;
            const {width, height} = this.getRect();
            return {
                width: width - cols.indexWidth,
                height: height - rows.height,
                left: cols.indexWidth,
                top: rows.height
            };
        }
    }

    return Sheet;
});
define('skylark-xspreadsheet/component/bottombar',[
    './element',
    './event',
    '../config',
    './icon',
    './form_input',
    './dropdown',
    './message',
    '../locale/locale'
], function (m_element, m_event, m_config, Icon, FormInput, Dropdown, m_message, m_locale) {
    'use strict';
    class DropdownMore extends Dropdown {
        constructor(click) {
            const icon = new Icon('ellipsis');
            super(icon, 'auto', false, 'top-left');
            this.contentClick = click;
        }
        reset(items) {
            const eles = items.map((it, i) => m_element.h('div', `${ m_config.cssPrefix }-item`).css('width', '150px').css('font-weight', 'normal').on('click', () => {
                this.contentClick(i);
                this.hide();
            }).child(it));
            this.setContentChildren(...eles);
        }
        setTitle() {
        }
    }
    const menuItems = [{
            key: 'delete',
            title: m_locale.tf('contextmenu.deleteSheet')
        }];
    function buildMenuItem(item) {
        return m_element.h('div', `${ m_config.cssPrefix }-item`).child(item.title()).on('click', () => {
            this.itemClick(item.key);
            this.hide();
        });
    }
    function buildMenu() {
        return menuItems.map(it => buildMenuItem.call(this, it));
    }
    class ContextMenu {
        constructor() {
            this.el = m_element.h('div', `${ m_config.cssPrefix }-contextmenu`).css('width', '160px').children(...buildMenu.call(this)).hide();
            this.itemClick = () => {
            };
        }
        hide() {
            const {el} = this;
            el.hide();
            m_event.unbindClickoutside(el);
        }
        setOffset(offset) {
            const {el} = this;
            el.offset(offset);
            el.show();
            m_event.bindClickoutside(el);
        }
    }
    return class Bottombar {
        constructor(addFunc = () => {
        }, swapFunc = () => {
        }, deleteFunc = () => {
        }, updateFunc = () => {
        }) {
            this.swapFunc = swapFunc;
            this.updateFunc = updateFunc;
            this.dataNames = [];
            this.activeEl = null;
            this.deleteEl = null;
            this.items = [];
            this.moreEl = new DropdownMore(i => {
                this.clickSwap2(this.items[i]);
            });
            this.contextMenu = new ContextMenu();
            this.contextMenu.itemClick = deleteFunc;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-bottombar`).children(this.contextMenu.el, this.menuEl = m_element.h('ul', `${ m_config.cssPrefix }-menu`).child(m_element.h('li', '').children(new Icon('add').on('click', () => {
                if (this.dataNames.length < 10) {
                    addFunc();
                } else {
                    m_message.xtoast('tip', 'it less than or equal to 10');
                }
            }), m_element.h('span', '').child(this.moreEl))));
        }
        addItem(name, active) {
            this.dataNames.push(name);
            const item = m_element.h('li', active ? 'active' : '').child(name);
            item.on('click', () => {
                this.clickSwap2(item);
            }).on('contextmenu', evt => {
                const {offsetLeft, offsetHeight} = evt.target;
                this.contextMenu.setOffset({
                    left: offsetLeft,
                    bottom: offsetHeight + 1
                });
                this.deleteEl = item;
            }).on('dblclick', () => {
                const v = item.html();
                const input = new FormInput('auto', '');
                input.val(v);
                input.input.on('blur', ({target}) => {
                    const {value} = target;
                    const nindex = this.dataNames.findIndex(it => it === v);
                    this.renameItem(nindex, value);
                });
                item.html('').child(input.el);
                input.focus();
            });
            if (active) {
                this.clickSwap(item);
            }
            this.items.push(item);
            this.menuEl.child(item);
            this.moreEl.reset(this.dataNames);
        }
        renameItem(index, value) {
            this.dataNames.splice(index, 1, value);
            this.moreEl.reset(this.dataNames);
            this.items[index].html('').child(value);
            this.updateFunc(index, value);
        }
        clear() {
            this.items.forEach(it => {
                this.menuEl.removeChild(it.el);
            });
            this.items = [];
            this.dataNames = [];
            this.moreEl.reset(this.dataNames);
        }
        deleteItem() {
            const {activeEl, deleteEl} = this;
            if (this.items.length > 1) {
                const index = this.items.findIndex(it => it === deleteEl);
                this.items.splice(index, 1);
                this.dataNames.splice(index, 1);
                this.menuEl.removeChild(deleteEl.el);
                this.moreEl.reset(this.dataNames);
                if (activeEl === deleteEl) {
                    const [f] = this.items;
                    this.activeEl = f;
                    this.activeEl.toggle();
                    return [
                        index,
                        0
                    ];
                }
                return [
                    index,
                    -1
                ];
            }
            return [-1];
        }
        clickSwap2(item) {
            const index = this.items.findIndex(it => it === item);
            this.clickSwap(item);
            this.activeEl.toggle();
            this.swapFunc(index);
        }
        clickSwap(item) {
            if (this.activeEl !== null) {
                this.activeEl.toggle();
            }
            this.activeEl = item;
        }
    };
});
define('skylark-xspreadsheet/spreadsheet',[
    './component/element',
    './core/data_proxy',
    './component/sheet',
    './component/bottombar',
    './config',
    './locale/locale'
//    './index.less'
], function (m_element, DataProxy, Sheet, Bottombar, m_config, m_locale) {
    'use strict';
    class Spreadsheet {
        constructor(selectors, options = {}) {
            let targetEl = selectors;
            this.options = options;
            this.sheetIndex = 1;
            this.datas = [];
            if (typeof selectors === 'string') {
                targetEl = document.querySelector(selectors);
            }
            this.bottombar = new Bottombar(() => {
                const d = this.addSheet();
                this.sheet.resetData(d);
            }, index => {
                const d = this.datas[index];
                this.sheet.resetData(d);
            }, () => {
                this.deleteSheet();
            }, (index, value) => {
                this.datas[index].name = value;
            });
            this.data = this.addSheet();
            const rootEl = m_element.h('div', `${ m_config.cssPrefix }`).on('contextmenu', evt => evt.preventDefault());
            targetEl.appendChild(rootEl.el);
            this.sheet = new Sheet(rootEl, this.data);
            rootEl.child(this.bottombar.el);
        }
        addSheet(name, active = true) {
            const n = name || `sheet${ this.sheetIndex }`;
            const d = new DataProxy(n, this.options);
            d.change = (...args) => {
                this.sheet.trigger('change', ...args);
            };
            this.datas.push(d);
            this.bottombar.addItem(n, active);
            this.sheetIndex += 1;
            return d;
        }
        deleteSheet() {
            const [oldIndex, nindex] = this.bottombar.deleteItem();
            if (oldIndex >= 0) {
                this.datas.splice(oldIndex, 1);
                if (nindex >= 0)
                    this.sheet.resetData(this.datas[nindex]);
            }
        }
        loadData(data) {
            const ds = Array.isArray(data) ? data : [data];
            this.bottombar.clear();
            this.datas = [];
            if (ds.length > 0) {
                for (let i = 0; i < ds.length; i += 1) {
                    const it = ds[i];
                    const nd = this.addSheet(it.name, i === 0);
                    nd.setData(it);
                    if (i === 0) {
                        this.sheet.resetData(nd);
                    }
                }
            }
            return this;
        }
        getData() {
            return this.datas.map(it => it.getData());
        }
        cellText(ri, ci, text, sheetIndex = 0) {
            this.datas[sheetIndex].setCellText(ri, ci, text, 'finished');
            return this;
        }
        cell(ri, ci, sheetIndex = 0) {
            return this.datas[sheetIndex].getCell(ri, ci);
        }
        cellStyle(ri, ci, sheetIndex = 0) {
            return this.datas[sheetIndex].getCellStyle(ri, ci);
        }
        reRender() {
            this.sheet.table.render();
            return this;
        }
        on(eventName, func) {
            this.sheet.on(eventName, func);
            return this;
        }
        validate() {
            const {validations} = this.data;
            return validations.errors.size <= 0;
        }
        change(cb) {
            this.sheet.on('change', cb);
            return this;
        }
        static locale(lang, message) {
            m_locale.locale(lang, message);
        }
    }

    return Spreadsheet;

});
define('skylark-xspreadsheet/main',[
    "skylark-langx-ns",
    "./spreadsheet"
],function(skylark,Spreadsheet){
    const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

	return skylark.attach("intg.xspreadsheet",{
		Spreadsheet,
		create : spreadsheet
	});
});
define('skylark-xspreadsheet', ['skylark-xspreadsheet/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-xspreadsheet.js.map
