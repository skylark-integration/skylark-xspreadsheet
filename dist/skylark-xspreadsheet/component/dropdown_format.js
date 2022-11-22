/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./element","../core/format","../config"],function(e,t,i,s){"use strict";return class extends e{constructor(){let e=i.baseFormats.slice(0);e.splice(2,0,{key:"divider"}),e.splice(8,0,{key:"divider"}),super("Normal","220px",!0,"bottom-left",...e=e.map(e=>{const i=t.h("div",`${s.cssPrefix}-item`);return"divider"===e.key?i.addClass("divider"):(i.child(e.title()).on("click",()=>{this.setTitle(e.title()),this.change(e)}),e.label&&i.child(t.h("div","label").html(e.label))),i}))}setTitle(e){for(let t=0;t<i.baseFormats.length;t+=1)i.baseFormats[t].key===e&&this.title.html(i.baseFormats[t].title());this.hide()}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_format.js.map
