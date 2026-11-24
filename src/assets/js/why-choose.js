
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


    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                // Stop observing after animation
                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.15

    });


    revealElements.forEach(element => {

        observer.observe(element);

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

