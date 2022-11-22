/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./alphabet"],function(i){"use strict";class s{constructor(i,s,e,r,t=0,c=0){this.sri=i,this.sci=s,this.eri=e,this.eci=r,this.w=t,this.h=c}set(i,s,e,r){this.sri=i,this.sci=s,this.eri=e,this.eci=r}multiple(){return this.eri-this.sri>0||this.eci-this.sci>0}includes(...s){let[e,r]=[0,0];1===s.length?[r,e]=i.expr2xy(s[0]):2===s.length&&([e,r]=s);const{sri:t,sci:c,eri:h,eci:n}=this;return t<=e&&e<=h&&c<=r&&r<=n}each(i,s=(()=>!0)){const{sri:e,sci:r,eri:t,eci:c}=this;for(let h=e;h<=t;h+=1)if(s(h))for(let s=r;s<=c;s+=1)i(h,s)}contains(i){return this.sri<=i.sri&&this.sci<=i.sci&&this.eri>=i.eri&&this.eci>=i.eci}within(i){return this.sri>=i.sri&&this.sci>=i.sci&&this.eri<=i.eri&&this.eci<=i.eci}disjoint(i){return this.sri>i.eri||this.sci>i.eci||i.sri>this.eri||i.sci>this.eci}intersects(i){return this.sri<=i.eri&&this.sci<=i.eci&&i.sri<=this.eri&&i.sci<=this.eci}union(i){const{sri:e,sci:r,eri:t,eci:c}=this;return new s(i.sri<e?i.sri:e,i.sci<r?i.sci:r,i.eri>t?i.eri:t,i.eci>c?i.eci:c)}difference(i){const e=[],r=(i,r,t,c)=>{e.push(new s(i,r,t,c))},{sri:t,sci:c,eri:h,eci:n}=this,u=i.sri-t,l=i.sci-c,o=h-i.eri,p=n-i.eci;return u>0?(r(t,c,i.sri-1,n),o>0?(r(i.eri+1,c,h,n),l>0&&r(i.sri,c,i.eri,i.sci-1),p>0&&r(i.sri,i.eci+1,i.eri,n)):(l>0&&r(i.sri,c,h,i.sci-1),p>0&&r(i.sri,i.eci+1,h,n))):o>0&&(r(i.eri+1,c,h,n),l>0&&r(t,c,i.eri,i.sci-1),p>0&&r(t,i.eci+1,i.eri,n)),l>0?(r(t,c,h,i.sci-1),p>0?(r(t,i.eri+1,h,n),u>0&&r(t,i.sci,i.sri-1,i.eci),o>0&&r(i.sri+1,i.sci,h,i.eci)):(u>0&&r(t,i.sci,i.sri-1,n),o>0&&r(i.sri+1,i.sci,h,n))):p>0&&(r(h,i.eci+1,h,n),u>0&&r(t,c,i.sri-1,i.eci),o>0&&r(i.eri+1,c,h,i.eci)),e}size(){return[this.eri-this.sri+1,this.eci-this.sci+1]}toString(){const{sri:s,sci:e,eri:r,eci:t}=this;let c=i.xy2expr(e,s);return this.multiple()&&(c=`${c}:${i.xy2expr(t,r)}`),c}clone(){const{sri:i,sci:e,eri:r,eci:t,w:c,h:h}=this;return new s(i,e,r,t,c,h)}equals(i){return this.eri===i.eri&&this.eci===i.eci&&this.sri===i.sri&&this.sci===i.sci}static valueOf(e){const r=e.split(":"),[t,c]=i.expr2xy(r[0]);let[h,n]=[c,t];return r.length>1&&([n,h]=i.expr2xy(r[1])),new s(c,t,h,n)}}return{CellRange:s}});
//# sourceMappingURL=../sourcemaps/core/cell_range.js.map
