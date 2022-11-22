/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./en"],function(e){"use strict";let n="en";const t={en:e};function s(e,t){if(t&&t[n]){let s=t[n];const i=e.split(".");for(let e=0;e<i.length;e+=1){const n=s[i[e]];if(e===i.length-1)return n;if(!n)return;s=n}}}function i(e){let n=s(e,t);return!n&&window&&window.x_spreadsheet&&window.x_spreadsheet.$messages&&(n=s(e,window.x_spreadsheet.$messages)),n||""}return{locale:function(e,s){n=e,s&&(t[e]=s)},t:i,tf:function(e){return()=>i(e)}}});
//# sourceMappingURL=../sourcemaps/locale/locale.js.map
