/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./item"],function(t){"use strict";return class extends t{dropdown(){}getValue(t){return t}element(){const{tag:t}=this;return this.dd=this.dropdown(),this.dd.change=(e=>this.change(t,this.getValue(e))),super.element().child(this.dd)}setState(t){t&&(this.value=t,this.dd.setTitle(t))}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/dropdown_item.js.map
