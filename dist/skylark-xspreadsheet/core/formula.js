/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../locale/locale","./helper"],function(e,r){"use strict";const t=[{key:"SUM",title:e.tf("formula.sum"),render:e=>e.reduce((e,t)=>r.numberCalc("+",e,t),0)},{key:"AVERAGE",title:e.tf("formula.average"),render:e=>e.reduce((e,r)=>Number(e)+Number(r),0)/e.length},{key:"MAX",title:e.tf("formula.max"),render:e=>Math.max(...e.map(e=>Number(e)))},{key:"MIN",title:e.tf("formula.min"),render:e=>Math.min(...e.map(e=>Number(e)))},{key:"IF",title:e.tf("formula._if"),render:([e,r,t])=>e?r:t},{key:"AND",title:e.tf("formula.and"),render:e=>e.every(e=>e)},{key:"OR",title:e.tf("formula.or"),render:e=>e.some(e=>e)},{key:"CONCAT",title:e.tf("formula.concat"),render:e=>e.join("")}],a=t,l={};return t.forEach(e=>{l[e.key]=e}),{formulam:l,formulas:a,baseFormulas:t}});
//# sourceMappingURL=../sourcemaps/core/formula.js.map
