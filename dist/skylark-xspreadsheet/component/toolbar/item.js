/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../config","../tooltip","../element","../../locale/locale"],function(t,e,s,i){"use strict";return class{constructor(t,e,s){this.tip=i.t(`toolbar.${t.replace(/-[a-z]/g,t=>t[1].toUpperCase())}`),e&&(this.tip+=` (${e})`),this.tag=t,this.shortcut=e,this.value=s,this.el=this.element(),this.change=(()=>{})}element(){const{tip:i}=this;return s.h("div",`${t.cssPrefix}-toolbar-btn`).on("mouseenter",t=>{e(i,t.target)}).attr("data-tooltip",i)}setState(){}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/item.js.map
