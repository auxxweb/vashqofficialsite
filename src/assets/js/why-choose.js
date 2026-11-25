
/* =========================================
   VASHQ SCROLL REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(

        /* Why Choose Us */
        ".vashq-why-intro, " +
        ".vashq-why-item, " +
        ".vashq-stat-item, " +

        /* Our Team */
        ".vashq-our-team > h2, " +
        ".vashq-team-card"

    );

    const reveal = (element) => {
        element.classList.add("show");
    };

    const isInView = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    document.documentElement.classList.add("js-animate");

    revealElements.forEach(element => {
        if (isInView(element)) {
            reveal(element);
        }
    });

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(reveal);
        return;
    }

    let observer;

    try {
        observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    reveal(entry.target);

                    observer.unobserve(entry.target);

                }

            });

        }, {

            threshold: 0

        });
    } catch (error) {
        revealElements.forEach(reveal);
        return;
    }

    revealElements.forEach(element => {

        if (!element.classList.contains("show")) {
            observer.observe(element);
        }

    });

});


/* =========================================
   VASHQ STAT NUMBER COUNT ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll(
        ".vashq-stat-number"
    );

    const counterObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const counter = entry.target;

                const target = Number(counter.dataset.count);
                const suffix = counter.dataset.suffix || "";

                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {

                    const progress = Math.min(
                        (currentTime - startTime) / duration,
                        1
                    );

                    const easedProgress = 1 - Math.pow(1 - progress, 4);

                    const currentValue = Math.floor(
                        target * easedProgress
                    );

                    counter.textContent =
                        currentValue.toLocaleString("en-IN") + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent =
                            target.toLocaleString("en-IN") + suffix;
                    }

                }

                requestAnimationFrame(updateCounter);

                counterObserver.unobserve(counter);

            }

        });

    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

});

