import gsap from 'gsap';

document.addEventListener("DOMContentLoaded", (e: Event) => {
  gsap.fromTo("#home > #menu", {x: 0, y: 0}, {x: 100, y: -100})
  gsap.fromTo(".tags", {opacity: 0}, {opacity: 1, duration: 1, ease: "power4.inOut1"})
})