/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";const t=[{key:"Arial",title:"Arial"},{key:"Helvetica",title:"Helvetica"},{key:"Source Sans Pro",title:"Source Sans Pro"},{key:"Comic Sans MS",title:"Comic Sans MS"},{key:"Courier New",title:"Courier New"},{key:"Verdana",title:"Verdana"},{key:"Lato",title:"Lato"}],e=[{pt:7.5,px:10},{pt:8,px:11},{pt:9,px:12},{pt:10,px:13},{pt:10.5,px:14},{pt:11,px:15},{pt:12,px:16},{pt:14,px:18.7},{pt:15,px:20},{pt:16,px:21.3},{pt:18,px:24},{pt:22,px:29.3},{pt:24,px:32},{pt:26,px:34.7},{pt:36,px:48},{pt:42,px:56}];return{fontSizes:e,fonts:function(e=[]){const p={};return t.concat(e).forEach(t=>{p[t.key]=t}),p},baseFonts:t,getFontSizePxByPt:function(t){for(let p=0;p<e.length;p+=1){const n=e[p];if(n.pt===t)return n.px}return t}}});
//# sourceMappingURL=../sourcemaps/core/font.js.map
