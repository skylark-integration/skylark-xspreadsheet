/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./element","../core/font","../config"],function(t,e,i,n){"use strict";return class extends t{constructor(){super("10","60px",!0,"bottom-left",...i.fontSizes.map(t=>e.h("div",`${n.cssPrefix}-item`).on("click",()=>{this.setTitle(`${t.pt}`),this.change(t)}).child(`${t.pt}`)))}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_fontsize.js.map
