/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";const t=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];function n(n){let e="",r=n;for(;r>=t.length;)r/=t.length,r-=1,e+=t[parseInt(r,10)%t.length];const c=n%t.length;return e+=t[c]}function e(n){let e=0;for(let r=0;r<n.length-1;r+=1){const c=n.charCodeAt(r)-65,h=n.length-1-r;e+=t.length**h+t.length*c}return e+=n.charCodeAt(n.length-1)-65}function r(t){let n="",r="";for(let e=0;e<t.length;e+=1)t.charAt(e)>="0"&&t.charAt(e)<="9"?r+=t.charAt(e):n+=t.charAt(e);return[e(n),parseInt(r,10)-1]}function c(t,e){return`${n(t)}${e+1}`}return{stringAt:n,indexAt:e,expr2xy:r,xy2expr:c,expr2expr:function(t,n,e,h=(()=>!0)){if(0===n&&0===e)return t;const[l,o]=r(t);return h(l,o)?c(l+n,o+e):t}}});
//# sourceMappingURL=../sourcemaps/core/alphabet.js.map
