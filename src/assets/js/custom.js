


import "./glight.js"
import { Modal } from "bootstrap";
import { getIndiaLocationOptions } from "./india-locations.js";

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

    const localThumb = (btn.getAttribute("data-thumb") || "").trim();
    btn.style.backgroundImage = localThumb
      ? `url(${localThumb})`
      : `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;

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
  const current = rawPath.split("/").pop() || "";
  const isHomePath = current === "" || current === "index.html";
  const currentNormalized = isHomePath ? "index.html" : current;

  links.forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    const hrefFile = href === "/" ? "index.html" : href.split("/").pop();
    const matches = hrefFile === currentNormalized || (isHomePath && (href === "/" || hrefFile === "index.html"));

    if (matches) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else if (!href.startsWith("#")) {
      a.classList.remove("active");
      if (a.getAttribute("aria-current") === "page") a.removeAttribute("aria-current");
    }
  });
})();

// Book Demo modal form validation + India location combobox
(() => {
  const form = document.getElementById("bookDemoForm");
  if (!form) return;

  const BOOK_DEMO_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwFTQthKFlFc2QMod_j6I8BgKIyAL3kYuFnFE1EqZ4m2sOIsdVPH8eTNal-b8ZUbWoT/exec";

  const mobile = document.getElementById("demoMobile");
  const errorEl = document.getElementById("bookDemoError");
  const modalEl = document.getElementById("bookDemoModal");
  const formView = document.getElementById("bookDemoFormView");
  const successView = document.getElementById("bookDemoSuccessView");
  const locationHidden = document.getElementById("demoLocation");
  const locationSearch = document.getElementById("demoLocationSearch");
  const locationList = document.getElementById("demoLocationList");
  const locationWrap = document.getElementById("demoLocationCombobox");
  const submitBtn = form.querySelector('button[type="submit"]');

  const allLocations = getIndiaLocationOptions();
  let filtered = allLocations.slice(0, 80);
  let activeIndex = -1;
  let isSubmitting = false;

  if (mobile) {
    mobile.addEventListener("input", () => {
      mobile.value = mobile.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  const closeList = () => {
    if (!locationList || !locationSearch) return;
    locationList.hidden = true;
    locationSearch.setAttribute("aria-expanded", "false");
    activeIndex = -1;
  };

  const openList = () => {
    if (!locationList || !locationSearch) return;
    locationList.hidden = false;
    locationSearch.setAttribute("aria-expanded", "true");
  };

  const renderList = (items) => {
    if (!locationList) return;
    locationList.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "location-combobox__empty";
      empty.textContent = "No matching state or city";
      locationList.appendChild(empty);
      openList();
      return;
    }
    items.forEach((label, index) => {
      const li = document.createElement("li");
      li.className = "location-combobox__option";
      li.setAttribute("role", "option");
      li.dataset.value = label;
      li.dataset.index = String(index);
      li.textContent = label;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selectLocation(label);
      });
      locationList.appendChild(li);
    });
    openList();
  };

  const selectLocation = (label) => {
    if (!locationHidden || !locationSearch) return;
    locationHidden.value = label;
    locationSearch.value = label;
    locationSearch.setCustomValidity("");
    locationHidden.setCustomValidity("");
    closeList();
  };

  const syncValidity = () => {
    if (!locationHidden || !locationSearch) return;
    const ok = Boolean(locationHidden.value) && locationHidden.value === locationSearch.value.trim();
    const message = ok ? "" : "Please search and select a state or city from the list.";
    locationSearch.setCustomValidity(message);
    locationHidden.setCustomValidity(message);
  };

  if (locationSearch && locationList && locationHidden) {
    locationSearch.addEventListener("focus", () => {
      const q = locationSearch.value.trim().toLowerCase();
      filtered = q
        ? allLocations.filter((item) => item.toLowerCase().includes(q)).slice(0, 100)
        : allLocations.slice(0, 80);
      renderList(filtered);
    });

    locationSearch.addEventListener("input", () => {
      locationHidden.value = "";
      const q = locationSearch.value.trim().toLowerCase();
      filtered = q
        ? allLocations.filter((item) => item.toLowerCase().includes(q)).slice(0, 100)
        : allLocations.slice(0, 80);
      activeIndex = -1;
      renderList(filtered);
      syncValidity();
    });

    locationSearch.addEventListener("keydown", (e) => {
      const options = Array.from(locationList.querySelectorAll(".location-combobox__option"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (locationList.hidden) renderList(filtered);
        activeIndex = Math.min(activeIndex + 1, options.length - 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
      } else if (e.key === "Enter") {
        if (!locationList.hidden && activeIndex >= 0 && options[activeIndex]) {
          e.preventDefault();
          selectLocation(options[activeIndex].dataset.value);
        }
      } else if (e.key === "Escape") {
        closeList();
      }

      options.forEach((opt, i) => {
        opt.classList.toggle("is-active", i === activeIndex);
        if (i === activeIndex) opt.scrollIntoView({ block: "nearest" });
      });
    });

    locationSearch.addEventListener("blur", () => {
      window.setTimeout(() => {
        syncValidity();
        closeList();
      }, 150);
    });

    document.addEventListener("click", (e) => {
      if (locationWrap && !locationWrap.contains(e.target)) closeList();
    });
  }

  const showError = (message) => {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("d-none");
  };

  const hideError = () => {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("d-none");
  };

  const showSuccess = () => {
    if (formView) formView.classList.add("d-none");
    if (successView) {
      successView.hidden = false;
      successView.classList.remove("d-none");
      // Restart tick animation
      const svg = successView.querySelector(".book-demo-success__svg");
      if (svg) {
        const clone = svg.cloneNode(true);
        svg.replaceWith(clone);
      }
    }
  };

  const resetModalViews = () => {
    form.reset();
    if (locationHidden) locationHidden.value = "";
    form.classList.remove("was-validated");
    hideError();
    closeList();
    if (formView) formView.classList.remove("d-none");
    if (successView) {
      successView.classList.add("d-none");
      successView.hidden = true;
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
    isSubmitting = false;
  };

  // Google Apps Script: text/plain JSON + no-cors avoids iframe echo 403
  const postToGoogleSheet = async (payload) => {
    await fetch(BOOK_DEMO_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting) return;

    hideError();
    syncValidity();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");

    const payload = {
      fullName: String(form.fullName?.value || "").trim(),
      businessName: String(form.businessName?.value || "").trim(),
      mobile: String(form.mobile?.value || "").trim(),
      location: String(form.location?.value || "").trim(),
      pageUrl: window.location.href,
    };

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    try {
      await postToGoogleSheet(payload);
      showSuccess();
    } catch (err) {
      showError("Something went wrong. Please try again or WhatsApp us.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
      isSubmitting = false;
    }
  });

  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", resetModalViews);
  }
})();

// Open Book Demo modal from /?bookDemo=1 deep link
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("bookDemo") !== "1") return;
  const modalEl = document.getElementById("bookDemoModal");
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl);
  modal.show();
  params.delete("bookDemo");
  const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", next);
})();

// Floating WhatsApp + Call Sales buttons (site-wide)
(() => {
  if (document.querySelector(".floating-actions")) return;

  const root = document.createElement("div");
  root.className = "floating-actions";
  root.setAttribute("aria-label", "Quick contact");
  root.innerHTML = `
    <a class="floating-actions__btn floating-actions__btn--whatsapp"
       href="https://wa.me/917994466421?text=${encodeURIComponent("Hi Vashq, I’d like to know more about your car wash management software.")}"
       target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
      </svg>
    </a>
    <a class="floating-actions__btn floating-actions__btn--call"
       href="tel:+917994466421" aria-label="Call sales">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
      </svg>
    </a>
  `;

  document.body.appendChild(root);
})();

