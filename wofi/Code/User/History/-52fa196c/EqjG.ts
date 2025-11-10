import gsap from 'gsap';
import './style.css'

const myName = document.querySelector("#home>h1");

document.addEventListener("DOMContentLoaded", (e: Event) => {
  gsap.to(myName, {
    opacity: 1,
    x: 100,
  })  
})