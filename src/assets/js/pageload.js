
/* ==========================================
   VASHQ PAGE LOADER
========================================== */

(function () {

    const loader = document.getElementById("page-loader");

    if (!loader) return;

    function hideLoader() {

        loader.classList.add("is-hidden");

        // Remove loader after fade animation
        setTimeout(() => {
            loader.remove();
        }, 750);

    }

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, {
            once: true
        });
    }

})();
