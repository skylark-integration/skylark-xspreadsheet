/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";return class{constructor(){this.undoItems=[],this.redoItems=[]}add(s){this.undoItems.push(JSON.stringify(s)),this.redoItems=[]}canUndo(){return this.undoItems.length>0}canRedo(){return this.redoItems.length>0}undo(s,t){const{undoItems:e,redoItems:n}=this;this.canUndo()&&(n.push(JSON.stringify(s)),t(JSON.parse(e.pop())))}redo(s,t){const{undoItems:e,redoItems:n}=this;this.canRedo()&&(e.push(JSON.stringify(s)),t(JSON.parse(n.pop())))}}});
//# sourceMappingURL=../sourcemaps/core/history.js.map
