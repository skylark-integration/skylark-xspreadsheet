/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./item","../icon"],function(e,t){"use strict";return class extends e{element(){return super.element().child(new t(this.tag)).on("click",()=>this.change(this.tag))}setState(e){this.el.disabled(e)}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/icon_item.js.map
