
import "./glight.js";
import { Modal } from "bootstrap";
import { getIndiaLocationOptions } from "./india-locations.js";


/* =====================================================
   1. SCROLL ANIMATIONS
===================================================== */

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


/* =====================================================
   2. TUTORIAL SEARCH
===================================================== */

(() => {
  const input = document.getElementById("tutorial-search");
  const grid = document.getElementById("tutorial-grid");

  if (!input || !grid) return;

  const empty = document.getElementById("tutorial-empty");
  const cards = Array.from(grid.querySelectorAll(".tutorial-card"));

  const normalize = (s) =>
    (s || "").toString().toLowerCase().trim();

  const apply = () => {
    const q = normalize(input.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalize(
        `${card.dataset.title || ""} ${card.dataset.tags || ""} ${card.textContent || ""}`
      );

      const match = !q || haystack.includes(q);

      card.classList.toggle("d-none", !match);

      if (match) visibleCount++;
    });

    if (empty) {
      empty.classList.toggle("d-none", visibleCount !== 0);
    }
  };

  input.addEventListener("input", apply, { passive: true });
  apply();
})();


/* =====================================================
   3. LAZY YOUTUBE EMBEDS
===================================================== */

(() => {
  const nodes = Array.from(
    document.querySelectorAll(".tutorial-video[data-youtube-id]")
  );

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
        iframe.title =
          btn.getAttribute("aria-label") || "Vashq tutorial video";

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


/* =====================================================
   4. PAUSE AUTO-MARQUEE ON USER INTERACTION
===================================================== */

(() => {
  const marquees = Array.from(
    document.querySelectorAll(".problem-marquee")
  );

  if (!marquees.length) return;

  marquees.forEach((marquee) => {
    let t = 0;

    const pause = () => {
      marquee.classList.add("is-user-scrolling");

      window.clearTimeout(t);

      t = window.setTimeout(() => {
        marquee.classList.remove("is-user-scrolling");
      }, 900);
    };

    marquee.addEventListener("wheel", pause, { passive: true });
    marquee.addEventListener("touchstart", pause, { passive: true });
    marquee.addEventListener("pointerdown", pause, { passive: true });
    marquee.addEventListener("scroll", pause, { passive: true });
  });
})();


/* =====================================================
   5. SMOOTH SCROLL
===================================================== */

document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (!href || href === "#") return;

    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  });
});


/* =====================================================
   6. ACTIVE HASH NAVIGATION
===================================================== */

(() => {
  const hashNavLinks = Array.from(
    document.querySelectorAll('.nav-link[href^="#"]')
  );

  const sections = Array.from(
    document.querySelectorAll("section[id]")
  );

  if (!hashNavLinks.length || !sections.length) return;

  const linkById = new Map(
    hashNavLinks
      .map((a) => ({
        a,
        id: (a.getAttribute("href") || "").slice(1),
      }))
      .filter(({ id }) => id)
      .map(({ a, id }) => [id, a])
  );

  const setActive = (id) => {
    hashNavLinks.forEach((a) => {
      a.classList.remove("active");

      if (a.getAttribute("aria-current") === "location") {
        a.removeAttribute("aria-current");
      }
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

      visible.sort(
        (a, b) => b.intersectionRatio - a.intersectionRatio
      );

      setActive(visible[0].target.id);
    },
    {
      threshold: [0.2, 0.35, 0.5],
      rootMargin: "-80px 0px -55% 0px",
    }
  );

  sections.forEach((sec) => {
    if (linkById.has(sec.id)) {
      observer.observe(sec);
    }
  });
})();


/* =====================================================
   7. ACTIVE LINK FOR MULTI-PAGE NAVIGATION
===================================================== */

(() => {
  const links = Array.from(
    document.querySelectorAll(".navbar .nav-link")
  );

  if (!links.length) return;

  const rawPath = window.location.pathname || "";
  const current = rawPath.split("/").pop() || "";

  const isHomePath =
    current === "" || current === "index.html";

  const currentNormalized = isHomePath
    ? "index.html"
    : current;

  const isBlogSection = /(?:^|\/)blog(?:\.html|\/)/i.test(rawPath);

  links.forEach((a) => {
    const href = (a.getAttribute("href") || "").trim();

    if (!href || href.startsWith("#") || href.startsWith("http")) {
      return;
    }

    const hrefFile =
      href === "/" ? "index.html" : href.split("/").pop();

    const isBlogLink = hrefFile === "blog.html";

    const matches =
      hrefFile === currentNormalized ||
      (isHomePath && (href === "/" || hrefFile === "index.html")) ||
      (isBlogSection && isBlogLink);

    if (matches) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");

      if (a.getAttribute("aria-current") === "page") {
        a.removeAttribute("aria-current");
      }
    }
  });
})();


/* =====================================================
   8. GOOGLE SHEETS + EMAIL CONFIGURATION
===================================================== */

const LEAD_FORM_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXlrN38kZ6Q2cq5bMw5P-9bnJ52clLswdJ2v1kLvq3xaVuLW4VB3HOjOMxjC2nxUw4Gw/exec";


/* =====================================================
   9. SEND LEAD DATA TO GOOGLE APPS SCRIPT
===================================================== */

const postLeadFormToGoogleSheet = async (payload) => {

  const response = await fetch(LEAD_FORM_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // no-cors produces an opaque response.
  // It cannot confirm whether Apps Script saved the data.

  return response;
};


/* =====================================================
   10. LEAD FORM INITIALIZATION
   Used for Book Demo and Contact forms
===================================================== */

function initLeadForm({
  formId,
  formType,
  errorId,
  formViewId,
  successViewId,
  mobileId,
  carCareTypeId,
  locationHiddenId,
  locationSearchId,
  locationListId,
  locationWrapId,
  modalId,
  successResetBtnId,
}) {

  const form = document.getElementById(formId);

  if (!form) return;

  const mobile = document.getElementById(mobileId);

  const carCareType = carCareTypeId
    ? document.getElementById(carCareTypeId)
    : null;

  const errorEl = document.getElementById(errorId);

  const modalEl = modalId
    ? document.getElementById(modalId)
    : null;

  const formView = formViewId
    ? document.getElementById(formViewId)
    : null;

  const successView = successViewId
    ? document.getElementById(successViewId)
    : null;

  const successResetBtn = successResetBtnId
    ? document.getElementById(successResetBtnId)
    : null;

  const locationHidden = document.getElementById(locationHiddenId);
  const locationSearch = document.getElementById(locationSearchId);
  const locationList = document.getElementById(locationListId);
  const locationWrap = document.getElementById(locationWrapId);

  const submitBtn = form.querySelector('button[type="submit"]');

  const originalSubmitHTML = submitBtn
    ? submitBtn.innerHTML
    : "";

  const allLocations = getIndiaLocationOptions();

  let filtered = allLocations.slice(0, 80);
  let activeIndex = -1;
  let isSubmitting = false;
  let listPortalActive = false;


  /* ---------------------------------------------
     MOBILE NUMBER INPUT
  --------------------------------------------- */

  if (mobile) {
    mobile.addEventListener("input", () => {
      mobile.value = mobile.value
        .replace(/\D/g, "")
        .slice(0, 10);
    });
  }


  /* ---------------------------------------------
     LOCATION LIST POSITION
  --------------------------------------------- */

  const positionPortaledList = () => {

    if (!locationList || !locationSearch || locationList.hidden) {
      return;
    }

    const rect = locationSearch.getBoundingClientRect();

    const gutter = 8;

    const spaceBelow =
      window.innerHeight - rect.bottom - gutter;

    const spaceAbove = rect.top - gutter;

    const openDown =
      spaceBelow >= 140 || spaceBelow >= spaceAbove;

    const maxHeight = Math.max(
      120,
      Math.min(240, openDown ? spaceBelow : spaceAbove)
    );

    locationList.style.left =
      `${Math.max(gutter, rect.left)}px`;

    locationList.style.width =
      `${Math.min(rect.width, window.innerWidth - gutter * 2)}px`;

    locationList.style.maxHeight = `${maxHeight}px`;

    if (openDown) {
      locationList.style.top = `${rect.bottom + 4}px`;
      locationList.style.bottom = "auto";
    } else {
      locationList.style.top = "auto";

      locationList.style.bottom =
        `${window.innerHeight - rect.top + 4}px`;
    }
  };


  /* ---------------------------------------------
     PORTAL LOCATION LIST TO BODY
  --------------------------------------------- */

  const portalListToBody = () => {

    if (!locationList || listPortalActive) return;

    document.body.appendChild(locationList);

    locationList.classList.add(
      "location-combobox__list--portal"
    );

    listPortalActive = true;
  };


  /* ---------------------------------------------
     CLOSE LOCATION LIST
  --------------------------------------------- */

  const closeList = () => {

    if (!locationList || !locationSearch) return;

    locationList.hidden = true;

    locationSearch.setAttribute("aria-expanded", "false");

    activeIndex = -1;
  };


  /* ---------------------------------------------
     OPEN LOCATION LIST
  --------------------------------------------- */

  const openList = () => {

    if (!locationList || !locationSearch) return;

    portalListToBody();

    locationList.hidden = false;

    locationSearch.setAttribute("aria-expanded", "true");

    positionPortaledList();
  };


  /* ---------------------------------------------
     RENDER LOCATION OPTIONS
  --------------------------------------------- */

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

      li.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        selectLocation(label);
      });

      locationList.appendChild(li);

    });

    openList();
  };


  /* ---------------------------------------------
     SELECT LOCATION
  --------------------------------------------- */

  const selectLocation = (label) => {

    if (!locationHidden || !locationSearch) return;

    locationHidden.value = label;

    locationSearch.value = label;

    locationSearch.setCustomValidity("");

    locationHidden.setCustomValidity("");

    closeList();
  };


  /* ---------------------------------------------
     LOCATION VALIDATION
  --------------------------------------------- */

  const syncValidity = () => {

    if (!locationHidden || !locationSearch) return;

    const ok =
      Boolean(locationHidden.value) &&
      locationHidden.value === locationSearch.value.trim();

    const message = ok
      ? ""
      : "Please search and select a state or city from the list.";

    locationSearch.setCustomValidity(message);

    locationHidden.setCustomValidity(message);
  };


  /* ---------------------------------------------
     LOCATION SEARCH EVENTS
  --------------------------------------------- */

  if (locationSearch && locationList && locationHidden) {

    locationSearch.addEventListener("focus", () => {

      const q = locationSearch.value.trim().toLowerCase();

      filtered = q
        ? allLocations
            .filter((item) => item.toLowerCase().includes(q))
            .slice(0, 100)
        : allLocations.slice(0, 80);

      renderList(filtered);
    });


    locationSearch.addEventListener("input", () => {

      locationHidden.value = "";

      const q = locationSearch.value.trim().toLowerCase();

      filtered = q
        ? allLocations
            .filter((item) => item.toLowerCase().includes(q))
            .slice(0, 100)
        : allLocations.slice(0, 80);

      activeIndex = -1;

      renderList(filtered);

      syncValidity();
    });


    locationSearch.addEventListener("keydown", (e) => {

      const options = Array.from(
        locationList.querySelectorAll(".location-combobox__option")
      );

      if (e.key === "ArrowDown") {

        e.preventDefault();

        if (locationList.hidden) {
          renderList(filtered);
        }

        activeIndex = Math.min(
          activeIndex + 1,
          options.length - 1
        );

      } else if (e.key === "ArrowUp") {

        e.preventDefault();

        activeIndex = Math.max(activeIndex - 1, 0);

      } else if (e.key === "Enter") {

        if (
          !locationList.hidden &&
          activeIndex >= 0 &&
          options[activeIndex]
        ) {

          e.preventDefault();

          selectLocation(options[activeIndex].dataset.value);
        }

      } else if (e.key === "Escape") {

        closeList();
      }

      options.forEach((opt, i) => {

        opt.classList.toggle(
          "is-active",
          i === activeIndex
        );

        if (i === activeIndex) {
          opt.scrollIntoView({ block: "nearest" });
        }

      });

    });


    locationSearch.addEventListener("blur", () => {

      window.setTimeout(() => {

        syncValidity();

        closeList();

      }, 150);

    });


    const repositionIfOpen = () => {

      if (!locationList.hidden) {
        positionPortaledList();
      }

    };

    window.addEventListener("resize", repositionIfOpen);

    window.visualViewport?.addEventListener(
      "resize",
      repositionIfOpen
    );

    window.visualViewport?.addEventListener(
      "scroll",
      repositionIfOpen
    );

    if (modalEl) {
      modalEl.addEventListener(
        "scroll",
        repositionIfOpen,
        true
      );
    }


    document.addEventListener("click", (e) => {

      if (!locationWrap) return;

      const inWrap = locationWrap.contains(e.target);

      const inList =
        locationList && locationList.contains(e.target);

      if (!inWrap && !inList) {
        closeList();
      }

    });

  }


  /* ---------------------------------------------
     SHOW ERROR
  --------------------------------------------- */

  const showError = (message) => {

    if (!errorEl) return;

    errorEl.textContent = message;

    errorEl.classList.remove("d-none");
  };


  /* ---------------------------------------------
     HIDE ERROR
  --------------------------------------------- */

  const hideError = () => {

    if (!errorEl) return;

    errorEl.textContent = "";

    errorEl.classList.add("d-none");
  };


  /* ---------------------------------------------
     SHOW SUCCESS VIEW
  --------------------------------------------- */

  const showSuccess = () => {

    if (formView) {
      formView.classList.add("d-none");
    }

    if (successView) {

      successView.hidden = false;

      successView.classList.remove("d-none");

      const svg = successView.querySelector(
        ".vashq-success-icon svg"
      );

      if (svg) {
        const clone = svg.cloneNode(true);
        svg.replaceWith(clone);
      }

    }

  };


  /* ---------------------------------------------
     RESET FORM AND VIEWS
  --------------------------------------------- */

  const resetViews = () => {

    form.reset();

    if (locationHidden) {
      locationHidden.value = "";
      locationHidden.setCustomValidity("");
    }

    if (locationSearch) {
      locationSearch.value = "";
      locationSearch.setCustomValidity("");
    }

    form.classList.remove("was-validated");

    hideError();

    closeList();

    if (formView) {
      formView.classList.remove("d-none");
    }

    if (successView) {

      successView.classList.add("d-none");

      successView.hidden = true;
    }

    if (submitBtn) {

      submitBtn.disabled = false;

      submitBtn.innerHTML = originalSubmitHTML;

    }

    isSubmitting = false;
  };


  /* =================================================
     FORM SUBMISSION
  ================================================= */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    event.stopPropagation();

    if (isSubmitting) return;

    hideError();

    syncValidity();


    /* -----------------------------------------
       VALIDATE FORM
    ----------------------------------------- */

    if (!form.checkValidity()) {

      form.classList.add("was-validated");

      return;
    }

    form.classList.add("was-validated");


    /* -----------------------------------------
       COLLECT FORM DATA
    ----------------------------------------- */

    const payload = {

      formType: formType,

      fullName: String(
        form.elements.namedItem("fullName")?.value || ""
      ).trim(),

      businessName: String(
        form.elements.namedItem("businessName")?.value || ""
      ).trim(),

      carCareType: String(
        carCareType?.value || ""
      ).trim(),

      mobile: String(
        form.elements.namedItem("mobile")?.value || ""
      ).trim(),

      location: String(
        form.elements.namedItem("location")?.value || ""
      ).trim(),

      pageUrl: window.location.href,

    };


    /* -----------------------------------------
       SUBMIT BUTTON LOADING
    ----------------------------------------- */

    isSubmitting = true;

    if (submitBtn) {

      submitBtn.disabled = true;

      submitBtn.textContent = "Submitting...";

    }


    /* -----------------------------------------
       SEND DATA TO GOOGLE APPS SCRIPT
    ----------------------------------------- */

    try {

      await postLeadFormToGoogleSheet(payload);

      /*
        IMPORTANT:
        Because no-cors is enabled, the browser cannot
        read Google's response.

        This success view means the browser fetch
        completed without a network-level error.
        Verify actual saving through Google Sheets
        and your email.
      */

      showSuccess();

    } catch (err) {

      console.error(
        "VASHQ form submission error:",
        err
      );

      showError(
        "Unable to submit your request. Please try again or contact us through WhatsApp."
      );

      if (submitBtn) {

        submitBtn.disabled = false;

        submitBtn.innerHTML = originalSubmitHTML;

      }

      isSubmitting = false;

    }

  });


  /* ---------------------------------------------
     MODAL EVENTS
  --------------------------------------------- */

  if (modalEl) {

    modalEl.addEventListener("shown.bs.modal", () => {
      closeList();
    });

    modalEl.addEventListener("hidden.bs.modal", resetViews);

  }


  /* ---------------------------------------------
     SUCCESS RESET BUTTON
  --------------------------------------------- */

  if (successResetBtn) {

    successResetBtn.addEventListener(
      "click",
      resetViews
    );

  }

}


/* =====================================================
   11. BOOK DEMO FORM
===================================================== */

initLeadForm({

  formId: "bookDemoForm",
  formType: "Book Demo",

  errorId: "bookDemoError",

  formViewId: "bookDemoFormView",
  successViewId: "bookDemoSuccessView",

  mobileId: "demoMobile",
  carCareTypeId: "demoCarCare",

  locationHiddenId: "demoLocation",
  locationSearchId: "demoLocationSearch",
  locationListId: "demoLocationList",
  locationWrapId: "demoLocationCombobox",

  modalId: "bookDemoModal",

});


/* =====================================================
   12. CONTACT PAGE FORM
===================================================== */

initLeadForm({

  formId: "contactForm",
  formType: "Contact",

  errorId: "contactError",

  formViewId: "contactFormView",
  successViewId: "contactSuccessView",

  mobileId: "contactMobile",
  carCareTypeId: "contactCarCare",

  locationHiddenId: "contactLocation",
  locationSearchId: "contactLocationSearch",
  locationListId: "contactLocationList",
  locationWrapId: "contactLocationCombobox",

  successResetBtnId: "contactSuccessReset",

});


/* =====================================================
   13. OPEN BOOK DEMO FROM DEEP LINK
===================================================== */

(() => {

  const params = new URLSearchParams(window.location.search);

  if (params.get("bookDemo") !== "1") return;

  const modalEl = document.getElementById("bookDemoModal");

  if (!modalEl) return;

  const modal = Modal.getOrCreateInstance(modalEl);

  modal.show();

  params.delete("bookDemo");

  const next =
    `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;

  window.history.replaceState({}, "", next);

})();


/* =====================================================
   14. FLOATING WHATSAPP + CALL BUTTONS
===================================================== */

(() => {

  if (document.querySelector(".floating-actions")) return;

  const root = document.createElement("div");

  root.className = "floating-actions";

  root.setAttribute("aria-label", "Quick contact");

  root.innerHTML = `
    <a class="floating-actions__btn floating-actions__btn--whatsapp"
       href="https://wa.me/918891207778?text=${encodeURIComponent("Hi Vashq, I’d like to know more about your car wash management software.")}"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Chat on WhatsApp">

      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">

        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />

        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />

      </svg>

    </a>


    <a class="floating-actions__btn floating-actions__btn--call"
       href="tel:+918891207778"
       aria-label="Call sales">

      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">

        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />

      </svg>

    </a>
  `;

  document.body.appendChild(root);

})();
