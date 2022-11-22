/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./cell_range"],function(t){"use strict";class e{constructor(t=[]){this._=t}forEach(t){this._.forEach(t)}deleteWithin(t){this._=this._.filter(e=>!e.within(t))}getFirstIncludes(t,e){for(let i=0;i<this._.length;i+=1){const r=this._[i];if(r.includes(t,e))return r}return null}filterIntersects(t){return new e(this._.filter(e=>e.intersects(t)))}intersects(t){for(let e=0;e<this._.length;e+=1){if(this._[e].intersects(t))return!0}return!1}union(t){let e=t;return this._.forEach(t=>{t.intersects(e)&&(e=t.union(e))}),e}add(t){this.deleteWithin(t),this._.push(t)}shift(t,e,i,r){this._.forEach(s=>{const{sri:n,sci:h,eri:c,eci:l}=s,u=s;"row"===t?n>=e?(u.sri+=i,u.eri+=i):n<e&&e<=c&&(u.eri+=i,r(n,h,i,0)):"column"===t&&(h>=e?(u.sci+=i,u.eci+=i):h<e&&e<=l&&(u.eci+=i,r(n,h,0,i)))})}move(t,e,i){this._.forEach(r=>{const s=r;s.within(t)&&(s.eri+=e,s.sri+=e,s.sci+=i,s.eci+=i)})}setData(e){return this._=e.map(e=>t.CellRange.valueOf(e)),this}getData(){return this._.map(t=>t.toString())}}return{Merges:e}});
//# sourceMappingURL=../sourcemaps/core/merge.js.map
