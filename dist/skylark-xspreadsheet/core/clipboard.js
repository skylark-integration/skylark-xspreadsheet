/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";return class{constructor(){this.range=null,this.state="clear"}copy(t){return this.range=t,this.state="copy",this}cut(t){return this.range=t,this.state="cut",this}isCopy(){return"copy"===this.state}isCut(){return"cut"===this.state}isClear(){return"clear"===this.state}clear(){this.range=null,this.state="clear"}}});
//# sourceMappingURL=../sourcemaps/core/clipboard.js.map
