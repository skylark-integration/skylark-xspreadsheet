/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./suggest","../config"],function(t,e,i){"use strict";return class{constructor(s,h,l,c=(t=>t),g=(()=>{})){this.key=s,this.getTitle=c,this.vchange=(()=>{}),this.el=t.h("div",`${i.cssPrefix}-form-select`),this.suggest=new e(h.map(t=>({key:t,title:this.getTitle(t)})),t=>{this.itemClick(t.key),g(t.key),this.vchange(t.key)},l,this.el),this.el.children(this.itemEl=t.h("div","input-text").html(this.getTitle(s)),this.suggest.el).on("click",()=>this.show())}show(){this.suggest.search("")}itemClick(t){this.key=t,this.itemEl.html(this.getTitle(t))}val(t){return void 0!==t?(this.key=t,this.itemEl.html(this.getTitle(t)),this):this.key}}});
//# sourceMappingURL=../sourcemaps/component/form_select.js.map
