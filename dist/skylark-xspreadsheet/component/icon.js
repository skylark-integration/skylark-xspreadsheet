/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config"],function(i,e){"use strict";return class extends i.Element{constructor(s){super("div",`${e.cssPrefix}-icon`),this.iconNameEl=i.h("div",`${e.cssPrefix}-icon-img ${s}`),this.child(this.iconNameEl)}setName(i){this.iconNameEl.className(`${e.cssPrefix}-icon-img ${i}`)}}});
//# sourceMappingURL=../sourcemaps/component/icon.js.map
