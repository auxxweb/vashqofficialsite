


import "./glight.js"

// Lightweight scroll animations (Intersection Observer)
(() => {
  const animated = Array.from(document.querySelectorAll(".animate"));
  if (!animated.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  animated.forEach((el) => observer.observe(el));
})();

// Tutorials search (client-side)
(() => {
  const input = document.getElementById("tutorial-search");
  const grid = document.getElementById("tutorial-grid");
  if (!input || !grid) return;

  const empty = document.getElementById("tutorial-empty");
  const cards = Array.from(grid.querySelectorAll(".tutorial-card"));

  const normalize = (s) => (s || "").toString().toLowerCase().trim();

  const apply = () => {
    const q = normalize(input.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalize(`${card.dataset.title || ""} ${card.dataset.tags || ""} ${card.textContent || ""}`);
      const match = !q || haystack.includes(q);
      card.classList.toggle("d-none", !match);
      if (match) visibleCount += 1;
    });

    if (empty) empty.classList.toggle("d-none", visibleCount !== 0);
  };

  input.addEventListener("input", apply, { passive: true });
  apply();
})();

// Lazy YouTube embeds (thumbnail first; iframe on click)
(() => {
  const nodes = Array.from(document.querySelectorAll(".tutorial-video[data-youtube-id]"));
  if (!nodes.length) return;

  nodes.forEach((btn) => {
    const id = (btn.getAttribute("data-youtube-id") || "").trim();
    if (!id) return;

    btn.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;

    btn.addEventListener(
      "click",
      () => {
        if (btn.getAttribute("data-loaded") === "1") return;
        btn.setAttribute("data-loaded", "1");

        const iframe = document.createElement("iframe");
        iframe.loading = "lazy";
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
        iframe.title = btn.getAttribute("aria-label") || "Vashq tutorial video";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        btn.replaceWith(iframe);
      },
      { passive: true }
    );
  });
})();

// Pause auto-marquee when user interacts (manual scroll)
(() => {
  const marquees = Array.from(document.querySelectorAll(".problem-marquee"));
  if (!marquees.length) return;

  marquees.forEach((marquee) => {
    let t = 0;
    const pause = () => {
      marquee.classList.add("is-user-scrolling");
      window.clearTimeout(t);
      t = window.setTimeout(() => marquee.classList.remove("is-user-scrolling"), 900);
    };

    marquee.addEventListener("wheel", pause, { passive: true });
    marquee.addEventListener("touchstart", pause, { passive: true });
    marquee.addEventListener("pointerdown", pause, { passive: true });
    marquee.addEventListener("scroll", pause, { passive: true });
  });
})();



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

// Active hash nav (Intersection Observer; avoids scroll listeners)
(() => {
  const hashNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("section[id]"));
  if (!hashNavLinks.length || !sections.length) return;

  const linkById = new Map(
    hashNavLinks
      .map((a) => ({ a, id: (a.getAttribute("href") || "").slice(1) }))
      .filter(({ id }) => id)
      .map(({ a, id }) => [id, a])
  );

  const setActive = (id) => {
    hashNavLinks.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("aria-current") === "location") a.removeAttribute("aria-current");
    });
    const a = linkById.get(id);
    if (!a) return;
    a.classList.add("active");
    a.setAttribute("aria-current", "location");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      setActive(visible[0].target.id);
    },
    { threshold: [0.2, 0.35, 0.5], rootMargin: "-80px 0px -55% 0px" }
  );

  sections.forEach((sec) => {
    if (linkById.has(sec.id)) observer.observe(sec);
  });
})();

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
