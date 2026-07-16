// =======================================
// CREATE!!👌
// Main JavaScript
// Part 1
// =======================================

// Register GSAP Plugin

gsap.registerPlugin(ScrollTrigger);

// =======================================
// Loader Animation
// =======================================

window.addEventListener("load", () => {

gsap.to(".loader-progress",{

width:"100%",

duration:1.8,

ease:"power3.out"

});

gsap.to("#loader",{

opacity:0,

delay:2,

duration:1,

pointerEvents:"none"

});

});

// =======================================
// Hero Animation
// =======================================

const heroTimeline = gsap.timeline();

heroTimeline

.from(".hero-badge",{

opacity:0,

y:40,

duration:.8

})

.from(".hero h1",{

opacity:0,

y:60,

duration:1

},"-=0.4")

.from(".hero p",{

opacity:0,

y:40,

duration:.8

},"-=0.5")

.from(".hero-buttons",{

opacity:0,

y:30,

duration:.7

},"-=0.5")

.from(".hero-stats div",{

opacity:0,

y:30,

stagger:.2,

duration:.6

},"-=0.5")

.from(".floating-card",{

opacity:0,

x:80,

stagger:.25,

duration:.8

},"-=1");


// =======================================
// Scroll Animation
// =======================================

gsap.utils.toArray("section").forEach(section=>{

gsap.from(section,{

opacity:0,

y:80,

duration:1,

scrollTrigger:{

trigger:section,

start:"top 80%"

}

});

});


// =======================================
// Navbar Background
// =======================================

window.addEventListener("scroll",()=>{

const header=document.querySelector("header");

if(window.scrollY>60){

header.style.background="rgba(5,8,22,.85)";

header.style.backdropFilter="blur(25px)";

}else{

header.style.background="rgba(5,8,22,.45)";

}

});


// =======================================
// Counter Animation
// =======================================

const counters=document.querySelectorAll(".hero-stats h2");

counters.forEach(counter=>{

const update=()=>{

const target=parseInt(counter.innerText);

let current=0;

const increment=target/120;

const timer=setInterval(()=>{

current+=increment;

if(current>=target){

counter.innerText=target+

(counter.innerText.includes("%")?"%":"+");

clearInterval(timer);

}else{

counter.innerText=Math.floor(current);

}

},15);

};

update();

});


// =======================================
// Button Hover Effect
// =======================================

document.querySelectorAll("button,.btn-primary,.btn-secondary")

.forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

gsap.to(btn,{

scale:1.05,

duration:.3

});

});

btn.addEventListener("mouseleave",()=>{

gsap.to(btn,{

scale:1,

duration:.3

});

});

});
// =======================================
// THREE.JS
// =======================================

const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(

75,

window.innerWidth/window.innerHeight,

0.1,

1000

);

const renderer=new THREE.WebGLRenderer({

canvas:document.querySelector("#bg"),

alpha:true,

antialias:true

});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.z=30;


// Lighting

const light=new THREE.PointLight(0x4e89ff,2);

light.position.set(15,15,20);

scene.add(light);

const ambient=new THREE.AmbientLight(0xffffff,.6);

scene.add(ambient);


// Geometry

const geometry=new THREE.IcosahedronGeometry(8,1);

const material=new THREE.MeshStandardMaterial({

color:0x4e89ff,

wireframe:true

});

const object=new THREE.Mesh(

geometry,

material

);

scene.add(object);


// Animation Loop

function animate(){

requestAnimationFrame(animate);

object.rotation.x+=0.002;

object.rotation.y+=0.004;

renderer.render(scene,camera);

}

animate();


// Resize

window.addEventListener("resize",()=>{

camera.aspect=

window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(

window.innerWidth,

window.innerHeight

);

});
document.addEventListener("mousemove",(e)=>{

const x=(e.clientX/window.innerWidth-.5)*2;

const y=(e.clientY/window.innerHeight-.5)*2;

gsap.to(object.rotation,{

x:y,

y:x,

duration:2

});

});
document.querySelectorAll(".floating-card")

.forEach((card,index)=>{

gsap.to(card,{

y:20,

duration:2+index,

repeat:-1,

yoyo:true,

ease:"sine.inOut"

});

});
const cursor=document.createElement("div");

cursor.style.position="fixed";

cursor.style.width="18px";

cursor.style.height="18px";

cursor.style.borderRadius="50%";

cursor.style.background="#4e89ff";

cursor.style.pointerEvents="none";

cursor.style.boxShadow="0 0 35px #4e89ff";

cursor.style.zIndex="999999";

document.body.appendChild(cursor);

window.addEventListener("mousemove",(e)=>{

gsap.to(cursor,{

x:e.clientX-9,

y:e.clientY-9,

duration:.15

});

});
// =======================================
// PARTICLES
// =======================================

tsParticles.load("particles-js", {

background: {
color: "transparent"
},

fpsLimit: 120,

particles: {

number: {
value: 180,
density: {
enable: true,
area: 900
}
},

color: {
value: [
"#4e89ff",
"#00d4ff",
"#7b61ff",
"#ffffff"
]
},

shape: {
type: "circle"
},

opacity: {
value: 0.35
},

size: {
value: {
min:1,
max:4
}
},

links: {

enable:true,

distance:140,

color:"#4e89ff",

opacity:.18,

width:1

},

move:{

enable:true,

speed:1.4,

direction:"none",

random:false,

straight:false,

outModes:{
default:"out"
}

}

},

interactivity:{

events:{

onHover:{

enable:true,

mode:"grab"

},

onClick:{

enable:true,

mode:"push"

}

},

modes:{

grab:{

distance:180,

links:{
opacity:.7
}

},

push:{
quantity:5
}

}

},

detectRetina:true

});
// =======================================
// 3D CARD EFFECT
// =======================================

document.querySelectorAll(

".service-card,.floating-card,.price-card"

).forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=((x/rect.width)-0.5)*18;

const rotateX=((y/rect.height)-0.5)*-18;

gsap.to(card,{

rotationX:rotateX,

rotationY:rotateY,

transformPerspective:1000,

transformOrigin:"center",

duration:.45

});

});

card.addEventListener("mouseleave",()=>{

gsap.to(card,{

rotationX:0,

rotationY:0,

duration:.5

});

});

});
// =======================================
// MAGNETIC BUTTONS
// =======================================

document.querySelectorAll(

".btn-primary,.btn-secondary"

).forEach(button=>{

button.addEventListener("mousemove",(e)=>{

const rect=button.getBoundingClientRect();

const x=e.clientX-rect.left-rect.width/2;

const y=e.clientY-rect.top-rect.height/2;

gsap.to(button,{

x:x*.18,

y:y*.18,

duration:.25

});

});

button.addEventListener("mouseleave",()=>{

gsap.to(button,{

x:0,

y:0,

duration:.45

});

});

});
// =======================================
// SHOOTING STARS
// =======================================

function shootingStar(){

const star=document.createElement("div");

star.className="shooting-star";

star.style.left=Math.random()*window.innerWidth+"px";

star.style.top=Math.random()*300+"px";

document.body.appendChild(star);

setTimeout(()=>{

star.remove();

},2500);

}

setInterval(shootingStar,1800);
// =======================================
// SMOOTH ANCHORS
// =======================================

document.querySelectorAll(

'a[href^="#"]'

).forEach(anchor=>{

anchor.addEventListener("click",(e)=>{

e.preventDefault();

document.querySelector(

anchor.getAttribute("href")

).scrollIntoView({

behavior:"smooth"

});

});

});
// =======================================
// HERO PARALLAX
// =======================================

window.addEventListener("mousemove",(e)=>{

const x=e.clientX/window.innerWidth;

const y=e.clientY/window.innerHeight;

gsap.to(".hero-left",{

x:(x-.5)*25,

y:(y-.5)*20,

duration:1

});

gsap.to(".hero-right",{

x:(x-.5)*45,

y:(y-.5)*35,

duration:1

});

});
// =======================================
// GLOW EFFECT
// =======================================

setInterval(()=>{

document.querySelectorAll(

".floating-card,.service-card"

).forEach(card=>{

gsap.fromTo(

card,

{

boxShadow:"0 0 20px rgba(78,137,255,.15)"

},

{

boxShadow:"0 0 50px rgba(78,137,255,.45)",

repeat:1,

yoyo:true,

duration:1.6

});

});

},5000);

// =======================================
// SCROLL BAR
// =======================================

const progress=document.createElement("div");

progress.style.position="fixed";

progress.style.left=0;

progress.style.top=0;

progress.style.height="4px";

progress.style.width="0%";

progress.style.zIndex="999999";

progress.style.background=

"linear-gradient(90deg,#4e89ff,#00d4ff)";

document.body.appendChild(progress);

window.addEventListener("scroll",()=>{

const total=document.documentElement.scrollHeight-window.innerHeight;

const percent=(window.scrollY/total)*100;

progress.style.width=percent+"%";

});
/* Shooting Star */

.shooting-star{

position:fixed;

width:3px;

height:3px;

background:white;

box-shadow:0 0 20px white;

animation:shoot 2s linear forwards;

z-index:-1;

}

@keyframes shoot{

0%{

transform:translate(0,0);

opacity:1;

}

100%{

transform:translate(-700px,700px);

opacity:0;

}

}
// =======================================
// ADVANCED THREE.JS SCENE
// =======================================

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x050816,0.015);

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,0,25);

const renderer = new THREE.WebGLRenderer({

canvas:document.querySelector("#bg"),

alpha:true,

antialias:true

});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.outputColorSpace = THREE.SRGBColorSpace;

// Lights

const ambient = new THREE.AmbientLight(0xffffff,.7);

scene.add(ambient);

const pointLight = new THREE.PointLight(0x4e89ff,5);

pointLight.position.set(15,10,20);

scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x00d4ff,3);

pointLight2.position.set(-15,-10,-10);

scene.add(pointLight2);

const objects=[];

for(let i=0;i<40;i++){

const geometry=new THREE.IcosahedronGeometry(

Math.random()*0.7+0.3,

0

);

const material=new THREE.MeshStandardMaterial({

color:[
0x4e89ff,
0x7b61ff,
0x00d4ff
][Math.floor(Math.random()*3)],

wireframe:Math.random()>.6,

metalness:.8,

roughness:.2

});

const mesh=new THREE.Mesh(

geometry,

material

);

mesh.position.x=(Math.random()-.5)*50;

mesh.position.y=(Math.random()-.5)*35;

mesh.position.z=(Math.random()-.5)*40;

scene.add(mesh);

objects.push(mesh);

}
function animate(){

requestAnimationFrame(animate);

objects.forEach((mesh,index)=>{

mesh.rotation.x+=0.002+(index*.00005);

mesh.rotation.y+=0.003;

mesh.position.y+=Math.sin(Date.now()*.001+index)*0.002;

});

renderer.render(scene,camera);

}

animate();
document.addEventListener("mousemove",(e)=>{

const mouseX=(e.clientX/window.innerWidth-.5)*8;

const mouseY=(e.clientY/window.innerHeight-.5)*5;

gsap.to(camera.position,{

x:mouseX,

y:-mouseY,

duration:2,

ease:"power2.out"

});

});
// =======================================
// STAGGER REVEAL
// =======================================

gsap.utils.toArray(".service-card, .member, .price-card").forEach((card)=>{

gsap.from(card,{

opacity:0,

y:80,

scale:.9,

duration:.8,

ease:"power3.out",

scrollTrigger:{

trigger:card,

start:"top 85%"

}

});

});
// =======================================
// TEXT REVEAL
// =======================================

gsap.utils.toArray("h1,h2,h3").forEach(title=>{

gsap.from(title,{

opacity:0,

y:40,

duration:1,

scrollTrigger:{

trigger:title,

start:"top 90%"

}

});

});

window.addEventListener("scroll",()=>{

const nav=document.querySelector(".navbar");

if(window.scrollY>80){

nav.style.borderRadius="18px";

nav.style.width="92%";

nav.style.marginTop="10px";

}else{

nav.style.borderRadius="0";

nav.style.width="100%";

nav.style.marginTop="0";

}

});
const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

topBtn.style.display=

window.scrollY>400

?

"block"

:

"none";

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};
