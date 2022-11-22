/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../locale/locale","./helper"],function(e,t){"use strict";const r={phone:/^[1-9]\d{10}$/,email:/w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/};function s(t,r,...s){let a="";return t||(a=e.t(`validation.${r}`,...s)),[t,a]}return class{constructor(e,t,r,s){this.required=t,this.value=r,this.type=e,this.operator=s,this.message=""}parseValue(e){const{type:t}=this;return"date"===t?new Date(e):"number"===t?Number(e):e}equals(e){let r=this.type===e.type&&this.required===e.required&&this.operator===e.operator;return r&&(r=Array.isArray(this.value)?t.arrayEquals(this.value,e.value):this.value===e.value),r}values(){return this.value.split(",")}validate(e){const{required:t,operator:a,value:u,type:i}=this;if(t&&/^\s*$/.test(e))return s(!1,"required");if(/^\s*$/.test(e))return[!0];if(r[i]&&!r[i].test(e))return s(!1,"notMatch");if("list"===i)return s(this.values().includes(e),"notIn");if(a){const t=this.parseValue(e);if("be"===a){const[e,r]=u;return s(t>=this.parseValue(e)&&t<=this.parseValue(r),"between",e,r)}if("nbe"===a){const[e,r]=u;return s(t<this.parseValue(e)||t>this.parseValue(r),"notBetween",e,r)}if("eq"===a)return s(t===this.parseValue(u),"equal",u);if("neq"===a)return s(t!==this.parseValue(u),"notEqual",u);if("lt"===a)return s(t<this.parseValue(u),"lessThan",u);if("lte"===a)return s(t<=this.parseValue(u),"lessThanEqual",u);if("gt"===a)return s(t>this.parseValue(u),"greaterThan",u);if("gte"===a)return s(t>=this.parseValue(u),"greaterThanEqual",u)}return[!0]}}});
//# sourceMappingURL=../sourcemaps/core/validator.js.map
