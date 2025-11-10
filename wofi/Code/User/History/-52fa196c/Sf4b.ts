import gsap from 'gsap';
import './style.css'

document.addEventListener("DOMContentLoaded", (e: Event) => {
  const myName = document.querySelector("#home>h1");






  gsap.fromTo(myName, {
    opacity: 0,
    x: -100,
  }, {
    x: 100,
    y: 100,
  })  
})