/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config"],function(t,s){"use strict";return class{constructor(e){this.vertical=e,this.moveFn=null,this.el=t.h("div",`${s.cssPrefix}-scrollbar ${e?"vertical":"horizontal"}`).child(this.contentEl=t.h("div","")).on("mousemove.stop",()=>{}).on("scroll.stop",t=>{const{scrollTop:s,scrollLeft:e}=t.target;this.moveFn&&this.moveFn(this.vertical?s:e,t)})}move(t){return this.el.scroll(t),this}scroll(){return this.el.scroll()}set(t,s){const e=t-1;if(s>e){const t=this.vertical?"height":"width";this.el.css(t,`${e-15}px`).show(),this.contentEl.css(this.vertical?"width":"height","1px").css(t,`${s}px`)}else this.el.hide();return this}}});
//# sourceMappingURL=../sourcemaps/component/scrollbar.js.map
