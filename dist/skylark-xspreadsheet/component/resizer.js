/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./event","../config"],function(e,i,t){"use strict";return class{constructor(i=!1,h){this.moving=!1,this.vertical=i,this.el=e.h("div",`${t.cssPrefix}-resizer ${i?"vertical":"horizontal"}`).children(this.unhideHoverEl=e.h("div",`${t.cssPrefix}-resizer-hover`).on("dblclick.stop",e=>this.mousedblclickHandler(e)).css("position","absolute").hide(),this.hoverEl=e.h("div",`${t.cssPrefix}-resizer-hover`).on("mousedown.stop",e=>this.mousedownHandler(e)),this.lineEl=e.h("div",`${t.cssPrefix}-resizer-line`).hide()).hide(),this.cRect=null,this.finishedFn=null,this.minDistance=h,this.unhideFn=(()=>{})}showUnhide(e){this.unhideIndex=e,this.unhideHoverEl.show()}hideUnhide(){this.unhideHoverEl.hide()}show(e,i){const{moving:t,vertical:h,hoverEl:s,lineEl:n,el:o,unhideHoverEl:l}=this;if(t)return;this.cRect=e;const{left:d,top:r,width:c,height:f}=e;o.offset({left:h?d+c-5:d,top:h?r:r+f-5}).show(),s.offset({width:h?5:c,height:h?f:5}),n.offset({width:h?0:i.width,height:h?i.height:0}),l.offset({left:h?5-c:d,top:h?r:5-f,width:h?5:c,height:h?f:5})}hide(){this.el.offset({left:0,top:0}).hide(),this.hideUnhide()}mousedblclickHandler(){this.unhideIndex&&this.unhideFn(this.unhideIndex)}mousedownHandler(e){let t=e;const{el:h,lineEl:s,cRect:n,vertical:o,minDistance:l}=this;let d=o?n.width:n.height;s.show(),i.mouseMoveUp(window,e=>{this.moving=!0,null!==t&&1===e.buttons&&(o?(d+=e.movementX)>l&&h.css("left",`${n.left+d}px`):(d+=e.movementY)>l&&h.css("top",`${n.top+d}px`),t=e)},()=>{t=null,s.hide(),this.moving=!1,this.hide(),this.finishedFn&&(d<l&&(d=l),this.finishedFn(n,d))})}}});
//# sourceMappingURL=../sourcemaps/component/resizer.js.map
