/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./element","./icon","../config"],function(e,t,i,n){"use strict";return class extends e{constructor(e,s){var c;super(new i(`align-${s}`),"auto",!0,"bottom-left",...e.map(e=>(c=`align-${e}`,t.h("div",`${n.cssPrefix}-item`).child(new i(c))).on("click",()=>{this.setTitle(e),this.change(e)})))}setTitle(e){this.title.setName(`align-${e}`),this.hide()}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_align.js.map
