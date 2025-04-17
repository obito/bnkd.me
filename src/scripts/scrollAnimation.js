// src/scripts/scrollAnimation.js
const observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: "0px",
  threshold: 0.1, // Trigger when 10% of the element is visible
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target); // Stop observing once visible
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".animate-on-scroll");
  targets.forEach((target) => observer.observe(target));
});
