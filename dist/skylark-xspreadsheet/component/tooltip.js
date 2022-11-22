/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./event","../config"],function(e,t,n){"use strict";return function(o,i){if(i.classList.contains("active"))return;const{left:c,top:d,width:s,height:l}=i.getBoundingClientRect(),u=e.h("div",`${n.cssPrefix}-tooltip`).html(o).show();document.body.appendChild(u.el);const h=u.box();u.css("left",`${c+s/2-h.width/2}px`).css("top",`${d+l+2}px`),t.bind(i,"mouseleave",()=>{document.body.contains(u.el)&&document.body.removeChild(u.el)}),t.bind(i,"click",()=>{document.body.contains(u.el)&&document.body.removeChild(u.el)})}});
//# sourceMappingURL=../sourcemaps/component/tooltip.js.map
