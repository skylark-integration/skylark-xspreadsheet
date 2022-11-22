/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./icon","../config","./event"],function(e,i,d,t){"use strict";return class{constructor(t,n,o="600px"){this.title=t,this.el=e.h("div",`${d.cssPrefix}-modal`).css("width",o).children(e.h("div",`${d.cssPrefix}-modal-header`).children(new i("close").on("click.stop",()=>this.hide()),this.title),e.h("div",`${d.cssPrefix}-modal-content`).children(...n)).hide()}show(){this.dimmer=e.h("div",`${d.cssPrefix}-dimmer active`),document.body.appendChild(this.dimmer.el);const{width:i,height:n}=this.el.show().box(),{clientHeight:o,clientWidth:s}=document.documentElement;this.el.offset({left:(s-i)/2,top:(o-n)/3}),window.xkeydownEsc=(e=>{27===e.keyCode&&this.hide()}),t.bind(window,"keydown",window.xkeydownEsc)}hide(){this.el.hide(),document.body.removeChild(this.dimmer.el),t.unbind(window,"keydown",window.xkeydownEsc),delete window.xkeydownEsc}}});
//# sourceMappingURL=../sourcemaps/component/modal.js.map
