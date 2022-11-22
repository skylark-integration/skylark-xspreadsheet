/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./cell_range"],function(e){"use strict";return class{constructor(){this.range=new e.CellRange(0,0,0,0),this.ri=0,this.ci=0}multiple(){return this.range.multiple()}setIndexes(e,i){this.ri=e,this.ci=i}size(){return this.range.size()}}});
//# sourceMappingURL=../sourcemaps/core/selector.js.map
