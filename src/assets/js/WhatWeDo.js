
/* =========================================
   VASHQ VIDEO FEATURES + IMPORTANT FEATURES

   1. CORNER REVEAL
   2. VIEW MORE / VIEW LESS
   3. YOUTUBE SHORTS POPUP
   4. IMPORTANT FEATURES SCROLL REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       COMMON YOUTUBE URL TO EMBED URL
    ===================================== */

    function getYoutubeEmbed(url) {

        if (!url) return "";

        let videoId = "";

        try {

            const parsedUrl = new URL(url);

            const hostname = parsedUrl.hostname.replace(
                /^www\./,
                ""
            );

            /* SHORT URL */

            if (hostname === "youtu.be") {

                videoId = parsedUrl.pathname.split("/")[1];

            }

            /* YOUTUBE SHORTS */

            else if (parsedUrl.pathname.includes("/shorts/")) {

                videoId = parsedUrl.pathname.split("/shorts/")[1];

            }

            /* EMBED URL */

            else if (parsedUrl.pathname.includes("/embed/")) {

                videoId = parsedUrl.pathname.split("/embed/")[1];

            }

            /* NORMAL YOUTUBE VIDEO */

            else if (
                hostname === "youtube.com" ||
                hostname === "m.youtube.com"
            ) {

                videoId = parsedUrl.searchParams.get("v");

            }

            /* RETURN EMBED LINK */

            if (videoId) {

                videoId = videoId.split(/[?&/]/)[0];

                return (
                    "https://www.youtube.com/embed/" +
                    encodeURIComponent(videoId) +
                    "?autoplay=1&rel=0"
                );

            }

        } catch (error) {

            console.error("Invalid YouTube URL:", error);

        }

        return "";

    }



    /* =========================================
       1. VASHQ VIDEO FEATURES
       15 BUTTONS
    ========================================= */

    const cards = document.querySelectorAll(".vvf-card");

    const moreBtn = document.getElementById("vvfMoreBtn");

    const modal = document.getElementById("vvfModal");

    const closeBtn = document.getElementById("vvfClose");

    const iframe = document.getElementById("vvfIframe");


    /* =====================================
       SHOW FIRST 6 BUTTONS
    ===================================== */

    const initialCount = 6;

    let expanded = false;

    cards.forEach((card, index) => {

        if (index >= initialCount) {

            card.classList.add("vvf-hidden");

        }

    });



    /* =====================================
       VIEW MORE / VIEW LESS
    ===================================== */

    if (moreBtn) {

        moreBtn.addEventListener("click", function () {

            expanded = !expanded;

            cards.forEach((card, index) => {

                if (index >= initialCount) {

                    card.classList.toggle(
                        "vvf-hidden",
                        !expanded
                    );

                }

            });


            const buttonText = moreBtn.querySelector(
                "span:first-child"
            );

            if (buttonText) {

                buttonText.textContent = expanded
                    ? "View Less"
                    : "View More";

            }

            moreBtn.classList.toggle("active", expanded);

        });

    }



    /* =====================================
       CORNER-TO-CORNER BLUE REVEAL
    ===================================== */

    cards.forEach(card => {

        card.addEventListener("pointerenter", function (e) {

            const rect = this.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;


            /* CALCULATE CORNER DISTANCES */

            const corners = {

                "top left": Math.hypot(x, y),

                "top right": Math.hypot(
                    rect.width - x,
                    y
                ),

                "bottom left": Math.hypot(
                    x,
                    rect.height - y
                ),

                "bottom right": Math.hypot(
                    rect.width - x,
                    rect.height - y
                )

            };


            /* FIND NEAREST CORNER */

            const nearestCorner = Object.keys(corners).reduce(
                (a, b) => corners[a] < corners[b] ? a : b
            );


            /* SET ANIMATION ORIGIN */

            this.style.setProperty(
                "--vvf-origin",
                nearestCorner
            );


            /* RESET PREVIOUS ANIMATION */

            this.classList.remove("vvf-wipe-active");

            void this.offsetWidth;


            /* START BLUE REVEAL */

            this.classList.add("vvf-wipe-active");

        });


        /* RESET WHEN POINTER LEAVES */

        card.addEventListener("pointerleave", function () {

            this.classList.remove("vvf-wipe-active");

        });

    });



    /* =====================================
       OPEN OLD VIDEO FEATURES POPUP
    ===================================== */

    function openOldVideo(videoUrl) {

        if (!modal || !iframe) return;

        const embedUrl = getYoutubeEmbed(videoUrl);

        if (!embedUrl) {

            console.warn("Please add a valid YouTube link.");

            return;

        }

        iframe.src = embedUrl;

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    cards.forEach(card => {

        card.addEventListener("click", function () {

            const videoUrl = this.getAttribute("data-video");

            openOldVideo(videoUrl);

        });

    });



    /* =====================================
       CLOSE OLD VIDEO POPUP
    ===================================== */

    function closeOldVideo() {

        if (!modal || !iframe) return;

        modal.classList.remove("active");

        iframe.src = "";

        document.body.style.overflow = "";

    }


    if (closeBtn) {

        closeBtn.addEventListener("click", closeOldVideo);

    }


    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeOldVideo();

            }

        });

    }



    /* =========================================
       2. IMPORTANT FEATURES SECTION
       SCROLL REVEAL
    ========================================= */

    const revealElements = document.querySelectorAll(
        "#importantFeatures .vif-reveal"
    );


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("vif-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            }

        );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        /* FALLBACK FOR OLDER BROWSERS */

        revealElements.forEach(element => {

            element.classList.add("vif-visible");

        });

    }



    /* =========================================
       3. IMPORTANT FEATURES YOUTUBE POPUP
    ========================================= */

    const importantVideoCards = document.querySelectorAll(
        "#importantFeatures .vif-image-card"
    );

    const importantModal = document.getElementById(
        "vifVideoModal"
    );

    const importantIframe = document.getElementById(
        "vifVideoIframe"
    );

    const importantCloseBtn = document.getElementById(
        "vifModalClose"
    );



    /* =====================================
       OPEN IMPORTANT FEATURE VIDEO
    ===================================== */

    function openImportantVideo(videoUrl) {

        if (!importantModal || !importantIframe) return;

        const embedUrl = getYoutubeEmbed(videoUrl);

        if (!embedUrl) {

            console.warn("Please add a valid YouTube link.");

            return;

        }

        importantIframe.src = embedUrl;

        importantModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    importantVideoCards.forEach(card => {

        card.addEventListener("click", function () {

            const videoUrl = this.getAttribute("data-video");

            openImportantVideo(videoUrl);

        });

    });



    /* =====================================
       CLOSE IMPORTANT FEATURE VIDEO
    ===================================== */

    function closeImportantVideo() {

        if (!importantModal || !importantIframe) return;

        importantModal.classList.remove("active");

        importantIframe.src = "";

        document.body.style.overflow = "";

    }


    if (importantCloseBtn) {

        importantCloseBtn.addEventListener(
            "click",
            closeImportantVideo
        );

    }


    if (importantModal) {

        importantModal.addEventListener("click", function (event) {

            if (event.target === importantModal) {

                closeImportantVideo();

            }

        });

    }



    /* =====================================
       ESCAPE KEY - CLOSE ACTIVE VIDEO
    ===================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (modal && modal.classList.contains("active")) {

                closeOldVideo();

            }

            if (
                importantModal &&
                importantModal.classList.contains("active")
            ) {

                closeImportantVideo();

            }

        }

    });


});
