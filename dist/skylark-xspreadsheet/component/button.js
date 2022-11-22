/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config","../locale/locale"],function(e,t,n){"use strict";return class extends e.Element{constructor(e,c=""){super("div",`${t.cssPrefix}-button ${c}`),this.child(n.t(`button.${e}`))}}});
//# sourceMappingURL=../sourcemaps/component/button.js.map
