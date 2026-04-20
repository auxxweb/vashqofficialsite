


import "./glight.js"



// Smooth Scroll (only for hash links)
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // adjust for sticky navbar height
        behavior: "smooth"
      });
    }
  });
});

// Active link on scroll (only when using hash navigation)
const hashNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
const sections = document.querySelectorAll("section[id]");

if (hashNavLinks.length && sections.length) {
  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 100; // offset

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        hashNavLinks.forEach(link => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
          if (link.getAttribute("href") === `#${sec.id}`) {
            link.classList.add("active");
            link.setAttribute("aria-current", "location");
          }
        });
      }
    });
  });
}

// Active link for multi-page navigation
(() => {
  const links = Array.from(document.querySelectorAll('.navbar .nav-link'));
  if (!links.length) return;

  const rawPath = window.location.pathname || "";
  const current = rawPath.split("/").pop() || "index.html";
  const currentNormalized = current === "" ? "index.html" : current;

  links.forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    const hrefFile = href.split("/").pop();
    const isIndex = (currentNormalized === "index.html" || currentNormalized === "/");
    const matches = (hrefFile === currentNormalized) || (isIndex && hrefFile === "index.html");

    if (matches) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else if (!href.startsWith("#")) {
      a.classList.remove("active");
      if (a.getAttribute("aria-current") === "page") a.removeAttribute("aria-current");
    }
  });
})();
