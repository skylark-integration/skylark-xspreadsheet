/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./event","../config"],function(t,i,e){"use strict";return class extends t.Element{constructor(i,s,h,n,...d){super("div",`${e.cssPrefix}-dropdown ${n}`),this.title=i,this.change=(()=>{}),this.headerClick=(()=>{}),"string"==typeof i?this.title=t.h("div",`${e.cssPrefix}-dropdown-title`).child(i):h&&this.title.addClass("arrow-left"),this.contentEl=t.h("div",`${e.cssPrefix}-dropdown-content`).css("width",s).hide(),this.setContentChildren(...d),this.headerEl=t.h("div",`${e.cssPrefix}-dropdown-header`),this.headerEl.on("click",()=>{"block"!==this.contentEl.css("display")?this.show():this.hide()}).children(this.title,h?t.h("div",`${e.cssPrefix}-icon arrow-right`).child(t.h("div",`${e.cssPrefix}-icon-img arrow-down`)):""),this.children(this.headerEl,this.contentEl)}setContentChildren(...t){this.contentEl.html(""),t.length>0&&this.contentEl.children(...t)}setTitle(t){this.title.html(t),this.hide()}show(){const{contentEl:t}=this;t.show(),this.parent().active(),i.bindClickoutside(this.parent(),()=>{this.hide()})}hide(){this.parent().active(!1),this.contentEl.hide(),i.unbindClickoutside(this.parent())}}});
//# sourceMappingURL=../sourcemaps/component/dropdown.js.map
