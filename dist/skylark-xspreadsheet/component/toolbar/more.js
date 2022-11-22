/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../dropdown","./dropdown_item","../../config","../element","../icon"],function(e,t,s,o,n){"use strict";return class extends t{constructor(){super("more"),this.el.hide()}dropdown(){return new class extends e{constructor(){const e=new n("ellipsis"),t=o.h("div",`${s.cssPrefix}-toolbar-more`);super(e,"auto",!1,"bottom-right",t),this.moreBtns=t,this.contentEl.css("max-width","420px")}}}show(){this.el.show()}hide(){this.el.hide()}}});
//# sourceMappingURL=../../sourcemaps/component/toolbar/more.js.map
