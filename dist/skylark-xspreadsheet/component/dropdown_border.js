/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./dropdown","./icon","./border_palette"],function(e,t,n){"use strict";return class extends e{constructor(){const e=new t("border-all"),o=new n;o.change=(e=>{this.change(e),this.hide()}),super(e,"auto",!1,"bottom-left",o.el)}}});
//# sourceMappingURL=../sourcemaps/component/dropdown_border.js.map
