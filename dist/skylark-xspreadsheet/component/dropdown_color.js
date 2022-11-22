/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./icon","./color_palette"],function(t,e,s){"use strict";return class extends t{constructor(t,o){const c=new e(t).css("height","16px").css("border-bottom",`3px solid ${o}`),i=new s;i.change=(t=>{this.setTitle(t),this.change(t)}),super(c,"auto",!1,"bottom-left",i.el)}setTitle(t){this.title.css("border-color",t),this.hide()}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_color.js.map
