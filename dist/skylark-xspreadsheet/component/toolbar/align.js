/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown_item","../dropdown_align"],function(n,e){"use strict";return class extends n{constructor(n){super("align","",n)}dropdown(){const{value:n}=this;return new e(["left","center","right"],n)}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/align.js.map
