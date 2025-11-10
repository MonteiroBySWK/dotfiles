import gsap from "gsap";

const menu = document.querySelector("#menu");

let animationIn;
let animationOut;

animationIn = gsap.to(menu, {
    scale: 1.2,
    duration: 1
})

animationOut = gasp.to(menu, {
    scale: 1,
    duration: 1,
})
