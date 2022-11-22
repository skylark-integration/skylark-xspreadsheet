/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config"],function(t,i){"use strict";return class{constructor(s,e){this.vchange=(()=>{}),this.el=t.h("div",`${i.cssPrefix}-form-input`),this.input=t.h("input","").css("width",s).on("input",t=>this.vchange(t)).attr("placeholder",e),this.el.child(this.input)}focus(){setTimeout(()=>{this.input.el.focus()},10)}hint(t){this.input.attr("placeholder",t)}val(t){return this.input.val(t)}}});
//# sourceMappingURL=../sourcemaps/component/form_input.js.map
