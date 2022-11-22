/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./icon","../config"],function(e,t,i){"use strict";return{xtoast:function(o,d){const n=e.h("div",`${i.cssPrefix}-toast`),c=e.h("div",`${i.cssPrefix}-dimmer active`);n.children(e.h("div",`${i.cssPrefix}-toast-header`).children(new t("close").on("click.stop",()=>(document.body.removeChild(n.el),void document.body.removeChild(c.el))),o),e.h("div",`${i.cssPrefix}-toast-content`).html(d)),document.body.appendChild(n.el),document.body.appendChild(c.el);const{width:s,height:l}=n.box(),{clientHeight:h,clientWidth:m}=document.documentElement;n.offset({left:(m-s)/2,top:(h-l)/3})}}});
//# sourceMappingURL=../sourcemaps/component/message.js.map
