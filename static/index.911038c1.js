import{_ as k}from"./nuxt-link.f582a1f7.js";import{o as n,c as o,a as e,q as h,r as i,v as y,y as L,x as r,z as d,A as B,F as m,B as f,b as c,w as p,d as _,t as x,s as C}from"./entry.d3dc9c1d.js";function b(l,s){return n(),o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true"},[e("path",{"fill-rule":"evenodd",d:"M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z","clip-rule":"evenodd"})])}function z(l,s){return n(),o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true"},[e("path",{"fill-rule":"evenodd",d:"M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z","clip-rule":"evenodd"})])}const H={class:"flex md:flex-row flex-col justify-end container mx-auto"},q={class:"md:hidden flex flex-col group relative"},M=h({__name:"HeaderMenu",setup(l){const s=[{name:"Home",path:"/"},{name:"Graphic",path:"/graphic"}];let t=i(!1),g=i();return i("[transform-origin:50%_0%] [transform:rotateX(90deg)] transition-all"),(A,u)=>{const v=k,w=y("RouterLink");return n(),o("nav",H,[e("div",q,[e("button",{class:"flex justify-end md:p-4 p-2",onClick:u[0]||(u[0]=a=>L(t)?t.value=!r(t):t=!r(t)),ref_key:"menuRef",ref:g},[r(t)?(n(),d(r(z),{key:0,class:"h-8 w-8"})):(n(),d(r(b),{key:1,class:"h-8 w-8"}))],512),e("div",{class:B(r(t)?"flex flex-col [transform-origin:50%_0%] [transform:rotateX(0deg)] transition-all":" flex flex-col [transform-origin:50%_0%] [transform:rotateX(90deg)] h-0 transition-all")},[(n(),o(m,null,f(s,a=>c(v,{key:a.name,to:a.path,class:"p-2 text-center","active-class":"bg-gray-200"},{default:p(()=>[_(x(a.name),1)]),_:2},1032,["to"])),64))],2)]),(n(),o(m,null,f(s,a=>c(w,{key:a.name,to:a.path,class:"hidden md:block p-4 text-center","active-class":"bg-gray-200"},{default:p(()=>[_(x(a.name),1)]),_:2},1032,["to"])),64))])}}}),R=e("div",{class:"container mx-auto p-2"},[e("h1",{class:"text-3xl sm:text-4xl font-extrabold tracking-tight"},"Lorem."),e("p",{class:"max-w-xl"}," Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi quod cum sed nemo totam magnam sequi minima, ipsum, inventore reiciendis sapiente esse est quaerat, autem atque dolore. Dolores, earum consectetur. ")],-1),V=h({__name:"index",setup(l){return C(()=>{document.title="Home"}),(s,t)=>(n(),o("div",null,[e("header",null,[c(M)]),R]))}});export{V as default};