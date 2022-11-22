/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./helper"],function(t){"use strict";return{Cols:class{constructor({len:t,width:i,indexWidth:e,minWidth:s}){this._={},this.len=t,this.width=i,this.indexWidth=e,this.minWidth=s}setData(t){t.len&&(this.len=t.len,delete t.len),this._=t}getData(){const{len:t}=this;return Object.assign({len:t},this._)}getWidth(t){if(this.isHide(t))return 0;const i=this._[t];return i&&i.width?i.width:this.width}getOrNew(t){return this._[t]=this._[t]||{},this._[t]}setWidth(t,i){this.getOrNew(t).width=i}unhide(t){let i=t;for(;i>0&&(i-=1,this.isHide(i));)this.setHide(i,!1)}isHide(t){const i=this._[t];return i&&i.hide}setHide(t,i){const e=this.getOrNew(t);!0===i?e.hide=!0:delete e.hide}setStyle(t,i){this.getOrNew(t).style=i}sumWidth(i,e){return t.rangeSum(i,e,t=>this.getWidth(t))}totalWidth(){return this.sumWidth(0,this.len)}}}});
//# sourceMappingURL=../sourcemaps/core/col.js.map
