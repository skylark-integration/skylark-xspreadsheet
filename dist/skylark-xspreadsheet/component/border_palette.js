/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./icon","./dropdown_color","./dropdown_linetype","../config"],function(t,e,i,l,o){"use strict";function h(...e){return t.h("table","").child(t.h("tbody","").children(...e))}function r(i){return t.h("td","").child(t.h("div",`${o.cssPrefix}-border-palette-cell`).child(new e(`border-${i}`)).on("click",()=>{this.mode=i;const{mode:t,style:e,color:l}=this;this.change({mode:t,style:e,color:l})}))}return class{constructor(){this.color="#000",this.style="thin",this.mode="all",this.change=(()=>{}),this.ddColor=new i("line-color",this.color),this.ddColor.change=(t=>{this.color=t}),this.ddType=new l(this.style),this.ddType.change=(([t])=>{this.style=t}),this.el=t.h("div",`${o.cssPrefix}-border-palette`);const e=h(t.h("tr","").children(t.h("td",`${o.cssPrefix}-border-palette-left`).child(h(t.h("tr","").children(...["all","inside","horizontal","vertical","outside"].map(t=>r.call(this,t))),t.h("tr","").children(...["left","top","right","bottom","none"].map(t=>r.call(this,t))))),t.h("td",`${o.cssPrefix}-border-palette-right`).children(t.h("div",`${o.cssPrefix}-toolbar-btn`).child(this.ddColor.el),t.h("div",`${o.cssPrefix}-toolbar-btn`).child(this.ddType.el))));this.el.child(e)}}});
//# sourceMappingURL=../sourcemaps/component/border_palette.js.map
