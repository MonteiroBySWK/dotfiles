import gsap from 'gsap';

document.addEventListener("DOMContentLoaded", (e: Event) => {
  gsap.fromTo(".tags", {opacity: 0}, {opacity: 1, duration: 1, ease: "power4.inOut"})
})