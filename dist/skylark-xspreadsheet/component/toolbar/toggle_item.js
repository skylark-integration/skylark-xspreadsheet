/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./item","../icon"],function(t,e){"use strict";return class extends t{element(){const{tag:t}=this;return super.element().child(new e(t)).on("click",()=>this.click())}click(){this.change(this.tag,this.toggle())}setState(t){this.el.active(t)}toggle(){return this.el.toggle()}active(){return this.el.hasClass("active")}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/toggle_item.js.map
