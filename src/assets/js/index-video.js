/* ==========================================
   CAR WASH HERO
   INTRO VIDEO + CONTINUOUS LOOP VIDEO
   IMAGE FALLBACK SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const introVideo = document.querySelector(".carwash-intro-video");
    const loopVideo = document.querySelector(".carwash-loop-video");

    if (!introVideo || !loopVideo) return;

    let introReady = false;
    let loopReady = false;
    let introFinished = false;

    /* Activate a video */

    function activateVideo(video) {

        video.play().then(() => {

            video.classList.add("is-active");

        }).catch(() => {

            // Keep fallback image visible if playback fails

        });

    }


    /* Check loop video availability */

    loopVideo.addEventListener("canplay", function () {

        loopReady = true;

        // If intro has already finished, start loop
        if (introFinished) {
            activateVideo(loopVideo);
        }

    });


    /* Intro video ready */

    introVideo.addEventListener("canplay", function () {

        if (introReady) return;

        introReady = true;

        // Start intro when ready
        activateVideo(introVideo);

    });


    /* Intro video completed */

    introVideo.addEventListener("ended", function () {

        introFinished = true;

        // Hide intro
        introVideo.classList.remove("is-active");

        // Start loop if available
        if (loopReady) {

            activateVideo(loopVideo);

        }

    });


    /* Intro video loading failed */

    introVideo.addEventListener("error", function () {

        introFinished = true;

        // Use loop video as fallback if intro fails
        if (loopReady) {

            activateVideo(loopVideo);

        }

    });


    /* Loop video error */

    loopVideo.addEventListener("error", function () {

        // Existing background image remains visible
        loopVideo.classList.remove("is-active");

    });


    /* Start loading both videos */

    introVideo.load();
    loopVideo.load();

});