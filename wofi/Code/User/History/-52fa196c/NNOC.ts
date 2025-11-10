import gsap from 'gsap';
import './style.css'

const myName = document.querySelector("#home>h1");

document.addEventListener("DOMContentLoaded", (e: Event) => {
  gsap.fromTo(myName, {
    opacity: 0,
    x: -100,
  }, {
    x: 100,
    y: 100,
  })  
})