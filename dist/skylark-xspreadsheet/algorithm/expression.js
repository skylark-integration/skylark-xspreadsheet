/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";return{infix2suffix:e=>{const t=[],f=[];for(let n=0;n<e.length;n+=1){const p=e.charAt(n);if(" "!==p)if(p>="0"&&p<="9")f.push(p);else if(")"===p){let e=t.pop();for(;"("!==e;)f.push(e),e=t.pop()}else{if(t.length>0&&("+"===p||"-"===p)){const e=t[t.length-1];if("*"===e||"/"===e)for(;t.length>0;)f.push(t.pop())}t.push(p)}}for(;t.length>0;)f.push(t.pop());return f}}});
//# sourceMappingURL=../sourcemaps/algorithm/expression.js.map
