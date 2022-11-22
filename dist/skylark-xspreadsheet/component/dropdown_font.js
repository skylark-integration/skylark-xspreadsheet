/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./element","../core/font","../config"],function(t,e,s,i){"use strict";return class extends t{constructor(){const t=s.baseFonts.map(t=>e.h("div",`${i.cssPrefix}-item`).on("click",()=>{this.setTitle(t.title),this.change(t)}).child(t.title));super(s.baseFonts[0].title,"160px",!0,"bottom-left",...t)}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_font.js.map
