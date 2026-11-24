
/* =====================================================
   VASHQ FEATURE SECTION SCROLL ANIMATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const featureRows = document.querySelectorAll(
        ".vashq-feature-row"
    );

    // Check browser support
    if ("IntersectionObserver" in window) {

        const featureObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        // Activate feature animation
                        entry.target.classList.add("is-visible");

                        // Stop observing after animation
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        // Observe all feature sections
        featureRows.forEach((row) => {
            featureObserver.observe(row);
        });

    } else {

        // Fallback for unsupported browsers
        featureRows.forEach((row) => {
            row.classList.add("is-visible");
        });

    }

});



/* =====================================================
   VASHQ INTERACTIVE MOUSE FOLLOWING GRID EFFECT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(
        ".vashq-feature-details"
    );

    if (!section) return;

    // Enable only on mouse-based devices
    if (window.matchMedia("(hover: none)").matches) {
        return;
    }

    let animationFrame = null;

    let mouseX = 0;
    let mouseY = 0;
    let isMouseInside = false;

    /* ================================================
       UPDATE GRID POSITION
    ================================================ */

    const updateGridPosition = () => {

        const rect = section.getBoundingClientRect();

        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        section.style.setProperty(
            "--vfd-mouse-x",
            `${x}px`
        );

        section.style.setProperty(
            "--vfd-mouse-y",
            `${y}px`
        );

        animationFrame = null;
    };


    const requestGridUpdate = () => {

        if (!animationFrame) {
            animationFrame = requestAnimationFrame(
                updateGridPosition
            );
        }

    };


    /* ================================================
       MOUSE MOVE
    ================================================ */

    section.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        isMouseInside = true;

        section.classList.add(
            "vfd-mouse-active"
        );

        requestGridUpdate();

    });


    /* ================================================
       WINDOW SCROLL
    ================================================ */

    window.addEventListener("scroll", () => {

        if (isMouseInside) {
            requestGridUpdate();
        }

    }, { passive: true });


    /* ================================================
       MOUSE LEAVE
    ================================================ */

    section.addEventListener("mouseleave", () => {

        isMouseInside = false;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        section.classList.remove(
            "vfd-mouse-active"
        );

    });

});

