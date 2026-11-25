
/* ==========================================
   VASHQ - WATCH THEIR STORY
   SCROLL REVEAL + YOUTUBE VIDEO POPUP
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const storyCards = document.querySelectorAll(
        ".vashq-story-card"
    );

    const storyCovers = document.querySelectorAll(
        ".vashq-story-cover"
    );

    const modal = document.getElementById(
        "storyVideoModal"
    );

    const closeBtn = document.getElementById(
        "storyModalClose"
    );

    const iframe = document.getElementById(
        "storyVideoIframe"
    );


    /* ======================================
       1. SCROLL REVEAL ANIMATION
    ====================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealCard = function (card) {
        card.classList.add("story-visible");
    };

    const isInView = function (card) {
        const rect = card.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    document.documentElement.classList.add("js-animate");

    if (reduceMotion) {

        storyCards.forEach(revealCard);

    }

    else {

        storyCards.forEach(function (card) {
            if (isInView(card)) {
                revealCard(card);
            }
        });

        if (!("IntersectionObserver" in window)) {

            storyCards.forEach(revealCard);

        }

        else {

            let storyObserver;

            try {

                storyObserver = new IntersectionObserver(

                    function (entries, observer) {

                        entries.forEach(function (entry) {

                            if (entry.isIntersecting) {

                                revealCard(entry.target);

                                observer.unobserve(entry.target);

                            }

                        });

                    },

                    {
                        threshold: 0
                    }

                );

            } catch (error) {

                storyCards.forEach(revealCard);
                storyObserver = null;

            }

            if (storyObserver) {

                storyCards.forEach(function (card) {

                    if (!card.classList.contains("story-visible")) {
                        storyObserver.observe(card);
                    }

                });

            }

        }

    }



    /* ======================================
       2. YOUTUBE URL TO EMBED URL
    ====================================== */

    function getYoutubeEmbed(url) {

        let videoId = "";

        try {

            const parsedUrl = new URL(url);

            const hostname = parsedUrl.hostname.replace(
                /^www\./,
                ""
            );


            if (hostname === "youtu.be") {

                videoId = parsedUrl.pathname.split("/")[1];

            }

            else if (parsedUrl.pathname.includes("/shorts/")) {

                videoId = parsedUrl.pathname.split("/shorts/")[1];

            }

            else if (parsedUrl.pathname.includes("/embed/")) {

                videoId = parsedUrl.pathname.split("/embed/")[1];

            }

            else if (
                hostname === "youtube.com" ||
                hostname === "m.youtube.com"
            ) {

                videoId = parsedUrl.searchParams.get("v");

            }


            if (!videoId) return "";

            videoId = videoId.split(/[?&/]/)[0];


            return (
                "https://www.youtube.com/embed/" +
                encodeURIComponent(videoId) +
                "?autoplay=1&rel=0"
            );

        }

        catch (error) {

            console.error(
                "Invalid YouTube URL:",
                error
            );

            return "";

        }

    }



    /* ======================================
       3. OPEN YOUTUBE VIDEO POPUP
    ====================================== */

    if (modal && iframe) {

        storyCovers.forEach(function (cover) {

            cover.addEventListener("click", function (event) {

                event.preventDefault();

                const videoUrl =
                    this.getAttribute("data-video") ||
                    this.getAttribute("href");


                if (!videoUrl || videoUrl === "#") {

                    console.warn(
                        "Please add a valid YouTube video URL."
                    );

                    return;

                }


                const embedUrl = getYoutubeEmbed(videoUrl);


                if (!embedUrl) {

                    console.warn(
                        "Invalid YouTube video URL."
                    );

                    return;

                }


                iframe.src = embedUrl;

                modal.classList.add("active");

                document.body.style.overflow = "hidden";

            });

        });



        /* ======================================
           4. CLOSE VIDEO POPUP
        ====================================== */

        function closeStoryVideo() {

            modal.classList.remove("active");

            iframe.src = "";

            document.body.style.overflow = "";

        }


        /* CLOSE BUTTON */

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                closeStoryVideo
            );

        }


        /* CLICK OUTSIDE POPUP */

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeStoryVideo();

            }

        });


        /* ESCAPE KEY */

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeStoryVideo();

            }

        });

    }

});
