/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";function e(e,t,n){e.addEventListener(t,n)}function t(e,t,n){e.removeEventListener(t,n)}function n(e){e.xclickoutside&&(t(window.document.body,"click",e.xclickoutside),delete e.xclickoutside)}function o(e,t,n,o){let i="";Math.abs(e)>Math.abs(t)?o(i=e>0?"right":"left",e,n):o(i=t>0?"down":"up",t,n)}return{bind:e,unbind:t,unbindClickoutside:n,bindClickoutside:function(t,o){t.xclickoutside=(e=>{2===e.detail||t.contains(e.target)||(o?o(t):(t.hide(),n(t)))}),e(window.document.body,"click",t.xclickoutside)},mouseMoveUp:function(n,o,i){e(n,"mousemove",o),n.xEvtUp=(e=>{t(n,"mousemove",o),t(n,"mouseup",n.xEvtUp),i(e)}),e(n,"mouseup",n.xEvtUp)},bindTouch:function(t,{move:n,end:i}){let c=0,u=0;e(t,"touchstart",e=>{const{pageX:t,pageY:n}=e.touches[0];c=t,u=n}),e(t,"touchmove",e=>{if(!n)return;const{pageX:t,pageY:i}=e.changedTouches[0],d=t-c,s=i-u;(Math.abs(d)>10||Math.abs(s)>10)&&(o(d,s,e,n),c=t,u=i),e.preventDefault()}),e(t,"touchend",e=>{if(!i)return;const{pageX:t,pageY:n}=e.changedTouches[0];o(t-c,n-u,e,i)})}}});
//# sourceMappingURL=../sourcemaps/component/event.js.map
