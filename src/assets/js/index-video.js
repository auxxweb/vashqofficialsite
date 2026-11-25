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
    let introFailed = false;

    function prepareVideo(video) {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
    }

    /* Show a video only after playback has started */

    function activateVideo(video) {

        const playPromise = video.play();

        if (!playPromise || typeof playPromise.then !== "function") {
            if (!video.paused) {
                video.classList.add("is-active");
            }
            return;
        }

        playPromise.then(function () {
            video.classList.add("is-active");
        }).catch(function () {
            video.classList.remove("is-active");
        });

    }

    function startLoop() {

        if (!loopReady || !introFinished) return;

        introVideo.classList.remove("is-active");
        activateVideo(loopVideo);

    }

    function onIntroReady() {

        if (introReady || introFailed || introFinished) return;

        introReady = true;
        activateVideo(introVideo);

    }

    function onLoopReady() {

        if (loopReady) return;

        loopReady = true;
        startLoop();

    }

    prepareVideo(introVideo);
    prepareVideo(loopVideo);

    introVideo.addEventListener("playing", function () {
        if (!introFinished) {
            introVideo.classList.add("is-active");
        }
    });

    loopVideo.addEventListener("playing", function () {
        if (introFinished) {
            loopVideo.classList.add("is-active");
        }
    });

    introVideo.addEventListener("ended", function () {

        introFinished = true;
        introVideo.classList.remove("is-active");
        startLoop();

    });

    introVideo.addEventListener("error", function () {

        introFailed = true;
        introFinished = true;
        introVideo.classList.remove("is-active");
        startLoop();

    });

    loopVideo.addEventListener("error", function () {

        loopReady = false;
        loopVideo.classList.remove("is-active");

    });

    function whenReady(video, callback) {

        if (video.readyState >= 2) {
            callback();
            return;
        }

        video.addEventListener("loadeddata", callback, { once: true });
        video.addEventListener("canplay", callback, { once: true });

    }

    whenReady(introVideo, onIntroReady);
    whenReady(loopVideo, onLoopReady);

});
