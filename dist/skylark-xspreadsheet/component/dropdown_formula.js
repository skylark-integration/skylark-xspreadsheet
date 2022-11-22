/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./icon","./element","../core/formula","../config"],function(e,o,t,c,n){"use strict";return class extends e{constructor(){const e=c.baseFormulas.map(e=>t.h("div",`${n.cssPrefix}-item`).on("click",()=>{this.hide(),this.change(e)}).child(e.key));super(new o("formula"),"180px",!0,"bottom-left",...e)}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_formula.js.map
