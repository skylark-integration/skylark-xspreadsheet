/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";class t{constructor(t,e=""){"string"==typeof t?(this.el=document.createElement(t),this.el.className=e):this.el=t,this.data={}}data(t,e){return void 0!==e?(this.data[t]=e,this):this.data[t]}on(t,e){const[s,...i]=t.split(".");let r=s;return"mousewheel"===r&&/Firefox/i.test(window.navigator.userAgent)&&(r="DOMMouseScroll"),this.el.addEventListener(r,t=>{e(t);for(let e=0;e<i.length;e+=1){const s=i[e];if("left"===s&&0!==t.button)return;if("right"===s&&2!==t.button)return;"stop"===s&&t.stopPropagation()}}),this}offset(t){if(void 0!==t)return Object.keys(t).forEach(e=>{this.css(e,`${t[e]}px`)}),this;const{offsetTop:e,offsetLeft:s,offsetHeight:i,offsetWidth:r}=this.el;return{top:e,left:s,height:i,width:r}}scroll(t){const{el:e}=this;return void 0!==t&&(void 0!==t.left&&(e.scrollLeft=t.left),void 0!==t.top&&(e.scrollTop=t.top)),{left:e.scrollLeft,top:e.scrollTop}}box(){return this.el.getBoundingClientRect()}parent(){return new t(this.el.parentNode)}children(...t){return 0===arguments.length?this.el.childNodes:(t.forEach(t=>this.child(t)),this)}removeChild(t){this.el.removeChild(t)}child(e){let s=e;return"string"==typeof e?s=document.createTextNode(e):e instanceof t&&(s=e.el),this.el.appendChild(s),this}contains(t){return this.el.contains(t)}className(t){return void 0!==t?(this.el.className=t,this):this.el.className}addClass(t){return this.el.classList.add(t),this}hasClass(t){return this.el.classList.contains(t)}removeClass(t){return this.el.classList.remove(t),this}toggle(t="active"){return this.toggleClass(t)}toggleClass(t){return this.el.classList.toggle(t)}active(t=!0,e="active"){return t?this.addClass(e):this.removeClass(e),this}checked(t=!0){return this.active(t,"checked"),this}disabled(t=!0){return t?this.addClass("disabled"):this.removeClass("disabled"),this}attr(t,e){if(void 0!==e)this.el.setAttribute(t,e);else{if("string"==typeof t)return this.el.getAttribute(t);Object.keys(t).forEach(e=>{this.el.setAttribute(e,t[e])})}return this}removeAttr(t){return this.el.removeAttribute(t),this}html(t){return void 0!==t?(this.el.innerHTML=t,this):this.el.innerHTML}val(t){return void 0!==t?(this.el.value=t,this):this.el.value}focus(){this.el.focus()}cssRemoveKeys(...t){return t.forEach(t=>this.el.style.removeProperty(t)),this}css(t,e){return void 0===e&&"string"!=typeof t?(Object.keys(t).forEach(e=>{this.el.style[e]=t[e]}),this):void 0!==e?(this.el.style[t]=e,this):this.el.style[t]}computedStyle(){return window.getComputedStyle(this.el,null)}show(){return this.css("display","block"),this}hide(){return this.css("display","none"),this}}return{Element:t,h:(e,s="")=>new t(e,s)}});
//# sourceMappingURL=../sourcemaps/component/element.js.map
